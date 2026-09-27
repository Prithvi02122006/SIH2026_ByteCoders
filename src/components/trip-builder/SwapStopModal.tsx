import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ExperienceListing, ItineraryStop } from '../../types';
import { generateStopSwapReasoning } from '../../lib/llmClient';
import { IconClose, IconMapPin, IconStepFree, IconClock, IconSpark } from '../common/Icons';

interface SwapStopModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetStop?: ItineraryStop | null;
}

export const SwapStopModal: React.FC<SwapStopModalProps> = ({
  isOpen,
  onClose,
  presetStop
}) => {
  const { activeItinerary, experiences, executeStopSwap } = useApp();
  const [selectedStopId, setSelectedStopId] = useState<string>(
    presetStop?.id || activeItinerary?.stops[0]?.id || ''
  );
  const [reasonings, setReasonings] = useState<Record<string, string>>({});

  useEffect(() => {
    if (presetStop?.id) {
      setSelectedStopId(presetStop.id);
    }
  }, [presetStop]);

  const currentStop = activeItinerary?.stops.find(s => s.id === selectedStopId) || activeItinerary?.stops[0];
  const scheduledExpIds = new Set(activeItinerary?.stops.map(s => s.experience_id) || []);

  // Find candidate replacements not already in the schedule
  const candidateList: ExperienceListing[] = experiences.filter(
    e => !scheduledExpIds.has(e.id)
  );

  // Sort candidates prioritizing same category or proximity
  const sortedCandidates = [...candidateList].sort((a, b) => {
    const aMatch = a.category === currentStop?.category ? 1 : 0;
    const bMatch = b.category === currentStop?.category ? 1 : 0;
    return bMatch - aMatch;
  }).slice(0, 4);

  const candidateIds = sortedCandidates.map(c => c.id).join(',');

  // Fetch contextual reasoning for candidates
  useEffect(() => {
    if (!isOpen || !currentStop || sortedCandidates.length === 0) return;

    let isMounted = true;
    sortedCandidates.forEach(cand => {
      if (!reasonings[cand.id]) {
        generateStopSwapReasoning(
          currentStop.title,
          cand.experience_title,
          cand.category,
          cand.neighborhood
        ).then(reason => {
          if (isMounted && reason) {
            setReasonings(prev => ({ ...prev, [cand.id]: reason }));
          }
        }).catch(() => {});
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentStop?.id, candidateIds]);

  if (!isOpen || !activeItinerary) return null;

  const handleSelectAlternative = (candidate: ExperienceListing) => {
    if (!currentStop) return;
    executeStopSwap(currentStop.id, candidate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/40 backdrop-blur-[2px]">
      <div className="bg-[#FFFFFF] border border-[#E2E6EC] rounded-[4px] max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E6EC]">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#111827]">
              Swap Itinerary Stop
            </h2>
            <p className="text-xs text-[#5B7A99] mt-0.5">
              Replace an individual stop while preserving the rest of your travel timeline
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6B7280] hover:text-[#111827] rounded-[2px]"
          >
            <IconClose size={18} />
          </button>
        </div>

        {/* Stop Selector */}
        <div className="my-4">
          <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
            Select Stop to Replace
          </label>
          <select
            value={selectedStopId}
            onChange={e => setSelectedStopId(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
          >
            {activeItinerary.stops.map((stop, idx) => (
              <option key={stop.id} value={stop.id}>
                Stop #{idx + 1}: {stop.title} ({stop.arrival_time} - {stop.departure_time})
              </option>
            ))}
          </select>
        </div>

        {/* Current Stop Snapshot */}
        {currentStop && (
          <div className="p-3 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[4px] mb-5 text-xs">
            <div className="text-[10px] uppercase font-semibold text-[#5B7A99]">Currently Scheduled</div>
            <div className="font-serif font-bold text-sm text-[#111827] mt-0.5">{currentStop.title}</div>
            <div className="text-[#6B7280] mt-0.5">
              {currentStop.neighborhood} | {currentStop.duration_minutes} min | ₹{currentStop.price_per_head}
            </div>
          </div>
        )}

        {/* Recommended Alternatives */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase font-semibold text-[#111827] tracking-wider">
            Curated Local Replacements
          </h3>
          <div className="space-y-3">
            {sortedCandidates.map(cand => (
              <div
                key={cand.id}
                className="p-3.5 border border-[#E2E6EC] rounded-[4px] bg-white hover:border-[#1B3A6B] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="card-tag px-2 py-0.5 bg-[#F0F4F8] text-[#1B3A6B] text-[10px] font-semibold">
                        {cand.category}
                      </span>
                      {cand.specialty_tier === 'hidden-gem' && (
                        <span className="card-tag px-2 py-0.5 bg-[#1B3A6B] text-white text-[10px] font-medium">
                          Independent
                        </span>
                      )}
                      {cand.accessibility.step_free && (
                        <span className="flex items-center space-x-1 text-[#15803D] text-[10px]">
                          <IconStepFree size={11} />
                          <span>Step-Free</span>
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#111827] mt-1">
                      {cand.experience_title}
                    </h4>
                    <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-1">
                      {cand.one_line_teaser}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center flex-shrink-0 gap-2">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-[#111827]">
                        {cand.price_per_head === 0 ? 'Free' : `₹${cand.price_per_head}`}
                      </div>
                      <div className="text-[10px] text-[#5B7A99]">
                        {cand.duration_minutes} min
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectAlternative(cand)}
                      className="px-3 py-1.5 bg-[#1B3A6B] text-white rounded-[2px] text-xs font-medium hover:bg-[#152e55] transition-colors"
                    >
                      Swap In Place
                    </button>
                  </div>
                </div>

                {/* AI Swap Reasoning */}
                {reasonings[cand.id] && (
                  <div className="mt-2 text-[11px] text-[#1B3A6B] bg-[#F0F4F8] border border-[#E2E6EC] px-2.5 py-1.5 rounded-[2px] flex items-start space-x-1.5">
                    <IconSpark size={12} className="text-[#1B3A6B] flex-shrink-0 mt-0.5" />
                    <span>{reasonings[cand.id]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#E2E6EC] text-xs font-medium text-[#4B5563] hover:bg-[#F7F8FA] rounded-[2px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
