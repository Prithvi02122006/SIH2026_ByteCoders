import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Itinerary, ItineraryStop } from '../../types';
import { TimelineStopSkeleton } from '../common/SkeletonLoaders';
import { generateItineraryNarration } from '../../lib/llmClient';
import {
  IconWalk,
  IconTransit,
  IconTaxi,
  IconAutoRickshaw,
  IconMetro,
  IconClock,
  IconStepFree,
  IconMapPin,
  IconSpark
} from '../common/Icons';

interface TimelinePanelProps {
  itinerary: Itinerary | null;
  isLoading: boolean;
  onSwapStop: (stop: ItineraryStop) => void;
  onMarkClosed: (stopId: string) => void;
}

export const TimelinePanel: React.FC<TimelinePanelProps> = ({
  itinerary,
  isLoading,
  onSwapStop,
  onMarkClosed
}) => {
  const { markStopComplete } = useApp();
  const [narration, setNarration] = useState<string | null>(null);
  const [narrationConfidence, setNarrationConfidence] = useState<number | null>(null);
  const [isGeneratingNarration, setIsGeneratingNarration] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 card-surface bg-white border border-[#E2E6EC] rounded-[4px]">
        <div className="h-6 w-1/3 skeleton-box mb-4" />
        <TimelineStopSkeleton />
        <TimelineStopSkeleton />
        <TimelineStopSkeleton />
      </div>
    );
  }

  if (!itinerary || itinerary.stops.length === 0) {
    return (
      <div className="card-surface p-8 text-center bg-white border border-[#E2E6EC] rounded-[4px]">
        <h3 className="font-serif font-bold text-base text-[#111827]">
          No stops currently scheduled
        </h3>
        <p className="text-xs text-[#6B7280] mt-1">
          Use the Custom Trip Builder wizard to generate a dynamic itinerary or add stops from the Explore feed.
        </p>
      </div>
    );
  }

  const handleGenerateNarration = async () => {
    setIsGeneratingNarration(true);
    try {
      const res = await generateItineraryNarration(itinerary.stops);
      setNarration(res.narration);
      if (res.confidence_score !== undefined) {
        setNarrationConfidence(res.confidence_score);
      }
    } catch (err) {
      console.warn('Failed to generate narration:', err);
    } finally {
      setIsGeneratingNarration(false);
    }
  };

  const renderTransitIcon = (mode: string, indianMode?: string) => {
    if (indianMode === 'auto_taxi' || mode === 'auto') {
      return <IconAutoRickshaw size={14} className="text-[#1B3A6B]" />;
    }
    if (indianMode === 'metro') {
      return <IconMetro size={14} className="text-[#15803D]" />;
    }
    if (indianMode === 'train' || mode === 'transit') {
      return <IconTransit size={14} className="text-[#1B3A6B]" />;
    }
    if (mode === 'taxi') {
      return <IconTaxi size={14} className="text-[#111827]" />;
    }
    return <IconWalk size={14} className="text-[#5B7A99]" />;
  };

  return (
    <div className="card-surface bg-white border border-[#E2E6EC] rounded-[4px] p-5 space-y-6">
      {/* Header with Title and Running Metrics */}
      <div className="border-b border-[#E2E6EC] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="font-serif font-bold text-xl text-[#111827]">
            {itinerary.title}
          </h2>
          <div className="text-xs text-[#5B7A99] flex items-center space-x-3 mt-1">
            <span>Date: {itinerary.date}</span>
            <span>Starts: {itinerary.start_time}</span>
            <span>Ends: {itinerary.end_time}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-right">
          <div>
            <div className="text-[10px] uppercase font-semibold text-[#5B7A99] tracking-wider">
              Total Duration
            </div>
            <div className="font-semibold text-sm text-[#111827]">
              {Math.floor(itinerary.total_duration_minutes / 60)}h{' '}
              {itinerary.total_duration_minutes % 60}m
            </div>
          </div>
          <div className="border-l border-[#E2E6EC] pl-4">
            <div className="text-[10px] uppercase font-semibold text-[#5B7A99] tracking-wider">
              Running Budget
            </div>
            <div className="font-semibold text-sm text-[#1B3A6B]">
              ₹{itinerary.total_cost_per_head} / person
            </div>
          </div>
        </div>
      </div>

      {/* AI Itinerary Narration Banner */}
      <div className="p-3.5 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[4px] space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#1B3A6B]">
            <IconSpark size={13} className="text-[#1B3A6B]" />
            <span>AI Itinerary Narrative</span>
            {narrationConfidence !== null && (
              <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-[#EBF5FF] text-[#1B3A6B] rounded border border-[#BFDBFE]">
                Nugen Confidence: {narrationConfidence}%
              </span>
            )}
          </div>
          <button
            onClick={handleGenerateNarration}
            disabled={isGeneratingNarration}
            className="text-[11px] font-medium text-[#1B3A6B] hover:underline disabled:opacity-50"
          >
            {isGeneratingNarration ? 'Drafting story...' : narration ? 'Regenerate Narrative' : 'Generate Narrative'}
          </button>
        </div>
        {narration && (
          <p className="text-xs text-[#374151] leading-relaxed italic border-t border-[#E2E6EC] pt-2">
            "{narration}"
          </p>
        )}
      </div>

      {/* Starting Hub Indicator */}
      <div className="relative pl-7 pb-4 border-l border-[#E2E6EC]">
        <div className="absolute -left-2 top-0 w-4 h-4 bg-[#111827] text-white rounded-full flex items-center justify-center text-[10px] font-bold">
          H
        </div>
        <div className="text-xs font-semibold text-[#111827]">
          Depart {itinerary.start_location.name}
        </div>
        <div className="text-[11px] text-[#5B7A99] mt-0.5">
          {itinerary.start_time} departure
        </div>
      </div>

      {/* Sequenced Stops Timeline */}
      <div className="space-y-0">
        {itinerary.stops.map((stop, index) => (
          <div key={stop.id} className="relative pl-7 pb-6 border-l border-[#E2E6EC]">
            {/* Numbered Stop Pin */}
            <div
              className={`absolute -left-2.5 top-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold border-2 border-white shadow-sm transition-colors ${
                stop.completed ? 'bg-[#15803D] text-white' : 'bg-[#1B3A6B] text-white'
              }`}
            >
              {stop.completed ? '✓' : index + 1}
            </div>

            {/* Stop Card */}
            <div
              className={`card-surface bg-white border rounded-[4px] p-4 space-y-3 transition-colors ${
                stop.completed ? 'border-[#BBF7D0] bg-[#F0FDF4]/30' : 'border-[#E2E6EC]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="card-tag px-2 py-0.5 bg-[#F0F4F8] text-[#1B3A6B] text-[10px] font-semibold">
                      {stop.category}
                    </span>
                    {stop.specialty_tier === 'hidden-gem' && (
                      <span className="card-tag px-2 py-0.5 bg-[#1B3A6B] text-white text-[10px] font-medium">
                        Independent
                      </span>
                    )}
                    {stop.step_free && (
                      <span className="flex items-center space-x-1 text-[#15803D] text-[10px]">
                        <IconStepFree size={11} />
                        <span>Step-Free</span>
                      </span>
                    )}
                    {stop.completed && (
                      <span className="card-tag px-2 py-0.5 bg-[#DCFCE7] text-[#15803D] text-[10px] font-semibold">
                        Completed
                      </span>
                    )}
                  </div>
                  <h3
                    className={`font-serif font-bold text-base mt-1.5 ${
                      stop.completed ? 'text-[#4B5563] line-through' : 'text-[#111827]'
                    }`}
                  >
                    {stop.title}
                  </h3>
                  <div className="text-xs text-[#5B7A99] flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                    <span className="flex items-center space-x-1">
                      <IconMapPin size={11} />
                      <span>{stop.neighborhood}</span>
                    </span>
                    {stop.distance_from_start_km !== undefined && (
                      <span className="text-[#6B7280]">
                        • {stop.distance_from_start_km.toFixed(1)} km from start
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right sm:flex-shrink-0">
                  <div className="text-xs font-semibold text-[#111827]">
                    {stop.arrival_time} - {stop.departure_time}
                  </div>
                  <div className="text-[11px] text-[#5B7A99] mt-0.5">
                    Duration: {stop.duration_minutes} min
                  </div>
                </div>
              </div>

              {/* Running Total & Stop Financials */}
              <div className="pt-2 border-t border-[#E2E6EC] flex flex-wrap items-center justify-between text-xs text-[#4B5563] gap-2">
                <div>
                  Fee: <strong className="text-[#111827]">{stop.price_per_head === 0 ? 'Free' : `₹${stop.price_per_head}`}</strong>
                  <span className="text-[11px] text-[#5B7A99] ml-2">
                    (Running total: ₹{stop.running_budget_total})
                  </span>
                </div>

                {/* Stop Quick Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => markStopComplete(stop.id)}
                    className={`px-2 py-0.5 rounded-[2px] text-[11px] font-semibold transition-colors ${
                      stop.completed
                        ? 'bg-[#E5E7EB] text-[#4B5563] hover:bg-[#D1D5DB]'
                        : 'bg-[#15803D] text-white hover:bg-[#166534]'
                    }`}
                  >
                    {stop.completed ? 'Undo Completion' : 'Mark Done'}
                  </button>
                  <span className="text-[#E2E6EC]">|</span>
                  <button
                    onClick={() => onSwapStop(stop)}
                    className="text-[11px] text-[#1B3A6B] hover:underline font-medium"
                    title="Swap this stop with another matching recommendation"
                  >
                    Swap Stop
                  </button>
                  <span className="text-[#E2E6EC]">|</span>
                  <button
                    onClick={() => onMarkClosed(stop.id)}
                    className="text-[11px] text-[#B91C1C] hover:underline"
                    title="Mark this spot as closed and recalculate"
                  >
                    Closed Today?
                  </button>
                </div>
              </div>
            </div>

            {/* Transit Leg to Next Stop */}
            {stop.transit_to_next && (
              <div className="my-3 pl-3 py-2 bg-[#F7F8FA] border-l-2 border-[#CBD5E1] rounded-r-[2px] flex items-center justify-between text-xs text-[#4B5563]">
                <div className="flex items-center space-x-2">
                  {renderTransitIcon(stop.transit_to_next.mode, stop.transit_to_next.indian_mode)}
                  <span>{stop.transit_to_next.summary}</span>
                </div>
                <div className="text-[11px] text-[#5B7A99]">
                  {stop.transit_to_next.duration_minutes} min{' '}
                  {stop.transit_to_next.cost > 0 && `(+₹${stop.transit_to_next.cost})`}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
