import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SearchDemandSignal } from '../../types';
import { getDemandSignals } from '../../lib/supabase';
import { synthesizeDemandInsights } from '../../lib/llmClient';
import { IconSpark } from '../common/Icons';

export const DemandInsightsView: React.FC = () => {
  const { currentCity } = useApp();
  const [signals, setSignals] = useState<SearchDemandSignal[]>([]);
  const [takeaways, setTakeaways] = useState<string[]>([]);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    getDemandSignals(currentCity.id).then(data => {
      if (isMounted) {
        setSignals(data);
        setTakeaways([]);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [currentCity.id]);

  const handleSynthesize = async () => {
    setIsSynthesizing(true);
    try {
      const res = await synthesizeDemandInsights(signals);
      if (res && res.length > 0) {
        setTakeaways(res);
      }
    } catch (err) {
      console.warn('Failed to synthesize demand insights:', err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const totalSearches = signals.reduce((acc, s) => acc + s.searches_count, 0);
  const avgBudget = signals.length > 0
    ? Math.round(signals.reduce((acc, s) => acc + s.avg_budget_indicated, 0) / signals.length)
    : 850;

  return (
    <div className="card-surface bg-white border border-[#E2E6EC] rounded-[4px] p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-block px-2.5 py-0.5 bg-[#F0F4F8] text-[#1B3A6B] text-[10px] uppercase font-bold tracking-wider rounded-[2px] mb-2">
            Anonymized Traveler Intent Radar — {currentCity.name}
          </div>
          <h3 className="font-serif font-bold text-xl text-[#111827]">
            Aggregated Regional Search & Filter Demands
          </h3>
          <p className="text-xs text-[#5B7A99] mt-0.5">
            Real-time query volume matching your regional hub, without exposing individual traveler personal data.
          </p>
        </div>

        <button
          onClick={handleSynthesize}
          disabled={isSynthesizing || signals.length === 0}
          className="flex items-center space-x-1.5 px-4 py-2 bg-[#1B3A6B] text-white text-xs font-semibold rounded-[2px] hover:bg-[#152e55] disabled:opacity-50 transition-colors self-start sm:self-auto whitespace-nowrap"
        >
          <IconSpark size={13} className="text-white" />
          <span>{isSynthesizing ? 'Synthesizing...' : 'Synthesize AI Takeaways'}</span>
        </button>
      </div>

      {/* Synthesized AI Takeaways Card */}
      {takeaways.length > 0 && (
        <div className="p-4 bg-[#F0F4F8] border border-[#CBD5E1] rounded-[4px] space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#1B3A6B]">
            <IconSpark size={13} className="text-[#1B3A6B]" />
            <span>AI Strategic Vendor Takeaways for {currentCity.name}</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[#1E293B] list-disc list-inside">
            {takeaways.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Aggregate Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[4px]">
          <div className="text-[11px] uppercase tracking-wider text-[#5B7A99] font-medium">
            Weekly Matched Searches
          </div>
          <div className="text-2xl font-serif font-bold text-[#111827] mt-1">
            {totalSearches} Queries
          </div>
          <div className="text-[11px] text-[#15803D] mt-1 font-medium">
            +28% growth over previous 7 days
          </div>
        </div>

        <div className="p-4 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[4px]">
          <div className="text-[11px] uppercase tracking-wider text-[#5B7A99] font-medium">
            Avg Indicated Budget Cap
          </div>
          <div className="text-2xl font-serif font-bold text-[#111827] mt-1">
            ₹{avgBudget} / person
          </div>
          <div className="text-[11px] text-[#5B7A99] mt-1">
            Highest volume: artisan & cultural workshops
          </div>
        </div>

        <div className="p-4 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[4px]">
          <div className="text-[11px] uppercase tracking-wider text-[#5B7A99] font-medium">
            Accessibility Inquiries
          </div>
          <div className="text-2xl font-serif font-bold text-[#111827] mt-1">
            44% of Searches
          </div>
          <div className="text-[11px] text-[#1B3A6B] mt-1">
            Prioritize step-free & slow pacing
          </div>
        </div>
      </div>

      {/* Demand Signals Feed */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase font-semibold text-[#111827] tracking-wider">
          Recent High-Frequency Traveler Filter Combinations in {currentCity.name}
        </h4>

        <div className="space-y-3">
          {signals.map(sig => (
            <div
              key={sig.id}
              className="p-4 border border-[#E2E6EC] rounded-[4px] bg-[#FFFFFF] hover:border-[#1B3A6B] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="card-tag px-2 py-0.5 bg-[#1B3A6B] text-white font-medium text-[10px]">
                    {sig.category}
                  </span>
                  {sig.query_tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="card-tag px-2 py-0.5 bg-[#F7F8FA] text-[#4B5563] border border-[#E2E6EC] text-[10px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="text-right sm:flex-shrink-0">
                  <span className="text-xs font-semibold text-[#111827]">
                    {sig.searches_count} searches
                  </span>
                  <span className="text-[11px] text-[#15803D] font-medium ml-2">
                    +{sig.trend_percentage}%
                  </span>
                </div>
              </div>

              <div className="mt-2.5 pt-2.5 border-t border-[#E2E6EC] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#5B7A99] gap-1">
                <div>
                  <strong className="text-[#111827]">Accessibility Requirement: </strong>
                  <span>{sig.accessibility_demand}</span>
                </div>
                <div>
                  <span className="text-[#4B5563]">District: {sig.neighborhood_focus} • Budget Indicated: ₹{sig.avg_budget_indicated}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-[#F7F8FA] border-l-2 border-[#1B3A6B] text-xs text-[#4B5563]">
        <strong className="text-[#111827]">Regional Merchant Recommendation: </strong>
        Travelers searching {currentCity.name} currently show unmet demand for morning step-free artisan sessions. Opening an early morning slot (09:30 - 11:30) with step-free access will capture high intent travelers.
      </div>
    </div>
  );
};
