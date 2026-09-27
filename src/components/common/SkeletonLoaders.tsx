import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="card-surface overflow-hidden border border-[#E2E6EC] bg-white">
    <div className="h-48 w-full skeleton-box" />
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 w-20 skeleton-box" />
        <div className="h-4 w-14 skeleton-box" />
      </div>
      <div className="h-5 w-3/4 skeleton-box" />
      <div className="h-3 w-full skeleton-box" />
      <div className="h-3 w-5/6 skeleton-box" />
      <div className="pt-2 flex items-center justify-between border-t border-[#E2E6EC]">
        <div className="h-3 w-28 skeleton-box" />
        <div className="h-6 w-16 skeleton-box" />
      </div>
    </div>
  </div>
);

export const TimelineStopSkeleton: React.FC = () => (
  <div className="relative pl-8 pb-6 border-l border-[#E2E6EC] space-y-2">
    <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full skeleton-box" />
    <div className="flex items-center space-x-2">
      <div className="h-4 w-16 skeleton-box" />
      <div className="h-4 w-24 skeleton-box" />
    </div>
    <div className="card-surface p-3 space-y-2 bg-white border border-[#E2E6EC]">
      <div className="h-5 w-2/3 skeleton-box" />
      <div className="h-3 w-1/2 skeleton-box" />
      <div className="flex justify-between pt-1">
        <div className="h-3 w-20 skeleton-box" />
        <div className="h-3 w-16 skeleton-box" />
      </div>
    </div>
    <div className="h-4 w-40 skeleton-box mt-3" />
  </div>
);

export const MapSkeleton: React.FC = () => (
  <div className="w-full h-full min-h-[380px] bg-[#EEF0F3] relative flex items-center justify-center border border-[#E2E6EC] rounded-[4px] overflow-hidden">
    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px]" />
    <div className="z-10 text-center space-y-2">
      <div className="inline-block px-3 py-1 bg-white border border-[#E2E6EC] text-xs text-[#5B7A99] font-medium tracking-wide uppercase">
        Rendering Cartographic Tiles
      </div>
      <div className="text-xs text-[#6B7280]">Plotting optimized stops and pedestrian legs</div>
    </div>
  </div>
);
