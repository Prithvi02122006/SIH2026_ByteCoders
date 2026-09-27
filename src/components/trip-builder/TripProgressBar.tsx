import React from 'react';
import { useApp } from '../../context/AppContext';
import { IconClock, IconBudget } from '../common/Icons';

export const TripProgressBar: React.FC = () => {
  const { activeItinerary, currentView, activeRole, markStopComplete } = useApp();

  if (!activeItinerary || activeRole !== 'traveler' || activeItinerary.stops.length === 0) {
    return null;
  }

  const totalStops = activeItinerary.stops.length;
  const completedCount = activeItinerary.stops.filter(s => s.completed).length;
  const progressPct = Math.round((completedCount / totalStops) * 100);

  // Calculate remaining budget
  const spentBudget = activeItinerary.stops
    .filter(s => s.completed)
    .reduce((acc, s) => acc + s.price_per_head + (s.transit_to_next?.cost || 0), 0);
  const remainingBudget = Math.max(0, activeItinerary.total_cost_per_head - spentBudget);

  const activeStop = activeItinerary.stops.find(s => !s.completed) || activeItinerary.stops[activeItinerary.stops.length - 1];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#FFFFFF] border-t border-[#E2E6EC] py-2.5 px-4 sm:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {/* Progress Stats */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#15803D]" />
            <span className="font-semibold text-[#111827]">
              Trip in Progress:
            </span>
            <span className="text-[#4B5563]">
              {completedCount} of {totalStops} stops completed ({progressPct}%)
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-1.5 text-[#5B7A99] border-l border-[#E2E6EC] pl-4">
            <IconClock size={12} />
            <span>Planned Duration: {Math.floor(activeItinerary.total_duration_minutes / 60)}h {activeItinerary.total_duration_minutes % 60}m</span>
          </div>

          <div className="hidden lg:flex items-center space-x-1.5 text-[#1B3A6B] font-medium border-l border-[#E2E6EC] pl-4">
            <IconBudget size={12} />
            <span>Remaining Budget: ₹{Math.round(remainingBudget)} of ₹{activeItinerary.total_cost_per_head}</span>
          </div>
        </div>

        {/* Progress bar visual and Next Stop Action */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="flex-1 sm:w-36 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#15803D] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {activeStop && !activeStop.completed && (
            <button
              onClick={() => markStopComplete(activeStop.id)}
              className="px-3 py-1 bg-[#15803D] text-white text-[11px] font-semibold rounded-[2px] hover:bg-[#166534] transition-colors whitespace-nowrap"
            >
              I am at Stop #{activeItinerary.stops.indexOf(activeStop) + 1} (Mark Done)
            </button>
          )}

          {completedCount === totalStops && (
            <span className="card-tag px-2 py-0.5 bg-[#DCFCE7] text-[#15803D] font-semibold text-[10px]">
              Itinerary Finished
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
