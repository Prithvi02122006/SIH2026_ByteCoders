import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
  size = 'md',
}) => {
  const s = status.toLowerCase();
  let bg = 'bg-[#F2EDE1] text-[#55524A] border-[#DDD4BE]';
  let dot = 'bg-[#737373]';
  let label = status;

  if (s === 'approved' || s === 'verified' || s === 'safe' || s === 'delivered') {
    bg = 'bg-[#EBF3E4] text-[#2E541E] border-[#CFDFBF]';
    dot = 'bg-[#48782D]';
    label = s === 'delivered' ? 'Delivered & Confirmed' : s === 'approved' ? 'FSSAI Approved' : s === 'verified' ? 'Verified' : 'Safe';
  } else if (s === 'pending_inspection' || s === 'pending_review' || s === 'assigned' || s === 'use_soon') {
    bg = 'bg-[#FEF7E8] text-[#8F5912] border-[#F2DEB0]';
    dot = 'bg-[#C87D1E]';
    label = s === 'pending_inspection' ? 'Pending Safety Inspection' : s === 'pending_review' ? 'Pending Review' : s === 'assigned' ? 'Assigned' : 'Use Soon';
  } else if (s === 'in_transit' || s === 'en_route_pickup' || s === 'en_route_dropoff' || s === 'claimed') {
    bg = 'bg-[#EDF5F8] text-[#1E5266] border-[#BCDDE7]';
    dot = 'bg-[#2A7594]';
    label = s === 'in_transit' ? 'In Cold/Thermal Transit' : s === 'claimed' ? 'Claimed by NGO' : s === 'en_route_dropoff' ? 'En Route to Feeding Shelter' : 'En Route to Pickup';
  } else if (s === 'rejected' || s === 'expired' || s === 'critical_near_expiry' || s === 'escalated') {
    bg = 'bg-[#FBEAE9] text-[#8E2824] border-[#E8BFBD]';
    dot = 'bg-[#B5342F]';
    label = s === 'rejected' ? 'Safety Rejected' : s === 'expired' ? 'Expired (Unlisted)' : s === 'escalated' ? 'Escalated' : 'Critical Expiry';
  } else if (s === 'veg') {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold border border-[#3E8032] text-[#295C21] bg-[#F2F8F0]">
        <span className="w-2 h-2 rounded-full bg-[#3E8032]"></span>
        VEG
      </span>
    );
  } else if (s === 'non_veg') {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-semibold border border-[#A83232] text-[#802222] bg-[#FDF2F2]">
        <span className="w-2 h-2 rounded-full bg-[#A83232]"></span>
        NON-VEG
      </span>
    );
  }

  const px = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${bg} ${px} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`}></span>
      <span className="capitalize">{label}</span>
    </span>
  );
};
