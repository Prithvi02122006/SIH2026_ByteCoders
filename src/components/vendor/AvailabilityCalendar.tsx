import React, { useState } from 'react';
import { AvailabilitySlot } from '../../types';
import { IconClock } from '../common/Icons';

export const AvailabilityCalendar: React.FC = () => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([
    { id: 'sl-1', date: '2026-09-27', time: '10:00', capacity_remaining: 3, total_capacity: 8 },
    { id: 'sl-2', date: '2026-09-27', time: '13:30', capacity_remaining: 6, total_capacity: 8 },
    { id: 'sl-3', date: '2026-09-27', time: '16:00', capacity_remaining: 1, total_capacity: 8 },
    { id: 'sl-4', date: '2026-09-28', time: '10:30', capacity_remaining: 8, total_capacity: 8 },
    { id: 'sl-5', date: '2026-09-28', time: '14:00', capacity_remaining: 4, total_capacity: 8 }
  ]);

  const [newDate, setNewDate] = useState('2026-09-29');
  const [newTime, setNewTime] = useState('11:00');
  const [newCapacity, setNewCapacity] = useState(8);

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot: AvailabilitySlot = {
      id: `sl-${Date.now()}`,
      date: newDate,
      time: newTime,
      capacity_remaining: Number(newCapacity),
      total_capacity: Number(newCapacity)
    };
    setSlots([...slots, newSlot]);
  };

  const handleAdjustCapacity = (slotId: string, delta: number) => {
    setSlots(slots.map(s => {
      if (s.id === slotId) {
        const updated = Math.max(0, Math.min(s.total_capacity, s.capacity_remaining + delta));
        return { ...s, capacity_remaining: updated };
      }
      return s;
    }));
  };

  return (
    <div className="card-surface bg-white border border-[#E2E6EC] rounded-[4px] p-6 space-y-6">
      <div>
        <h3 className="font-serif font-bold text-lg text-[#111827]">
          Availability & Session Slots Management
        </h3>
        <p className="text-xs text-[#5B7A99] mt-0.5">
          Define when your atelier or tour is open for booking and observe real-time capacity buffers
        </p>
      </div>

      {/* Add Slot Quick Form */}
      <form onSubmit={handleAddSlot} className="p-4 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[4px] grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
        <div>
          <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
            Date
          </label>
          <input
            type="date"
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
            Start Time
          </label>
          <input
            type="time"
            value={newTime}
            onChange={e => setNewTime(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#111827] uppercase tracking-wider mb-1">
            Total Capacity
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={newCapacity}
            onChange={e => setNewCapacity(Number(e.target.value))}
            className="w-full text-xs px-3 py-2 bg-white border border-[#E2E6EC] rounded-[2px] focus:outline-none focus:border-[#1B3A6B]"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-2 bg-[#1B3A6B] text-white text-xs font-semibold rounded-[2px] hover:bg-[#152e55] transition-colors"
          >
            Add Session Slot
          </button>
        </div>
      </form>

      {/* Slots Roster */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase font-semibold text-[#111827] tracking-wider">
          Configured Time Slots
        </h4>

        <div className="divide-y divide-[#E2E6EC] border border-[#E2E6EC] rounded-[4px] bg-white">
          {slots.map(slot => {
            const booked = slot.total_capacity - slot.capacity_remaining;
            const occupancyRate = Math.round((booked / slot.total_capacity) * 100);

            return (
              <div key={slot.id} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-4">
                  <div className="w-12 text-center p-1 bg-[#F7F8FA] border border-[#E2E6EC] rounded-[2px]">
                    <div className="text-[10px] uppercase text-[#5B7A99]">Date</div>
                    <div className="text-xs font-semibold text-[#111827]">{slot.date.slice(5)}</div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#111827]">
                      <IconClock size={12} className="text-[#5B7A99]" />
                      <span>{slot.time} Session</span>
                    </div>
                    <div className="text-[11px] text-[#6B7280] mt-0.5">
                      {slot.capacity_remaining} of {slot.total_capacity} seats available ({occupancyRate}% reserved)
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleAdjustCapacity(slot.id, -1)}
                    disabled={slot.capacity_remaining <= 0}
                    className="px-2 py-1 border border-[#E2E6EC] text-xs font-semibold rounded-[2px] hover:bg-[#F7F8FA] disabled:opacity-40"
                    title="Mark one seat as booked"
                  >
                    -1 Seat
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAdjustCapacity(slot.id, 1)}
                    disabled={slot.capacity_remaining >= slot.total_capacity}
                    className="px-2 py-1 border border-[#E2E6EC] text-xs font-semibold rounded-[2px] hover:bg-[#F7F8FA] disabled:opacity-40"
                    title="Release one seat"
                  >
                    +1 Seat
                  </button>
                  <span
                    className={`card-tag px-2 py-1 text-[10px] font-semibold ${
                      slot.capacity_remaining === 0
                        ? 'bg-[#FEE2E2] text-[#B91C1C]'
                        : slot.capacity_remaining <= 2
                        ? 'bg-[#FEF3C7] text-[#B45309]'
                        : 'bg-[#DCFCE7] text-[#15803D]'
                    }`}
                  >
                    {slot.capacity_remaining === 0
                      ? 'Fully Booked'
                      : slot.capacity_remaining <= 2
                      ? 'Filling Rapidly'
                      : 'Open Slots'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
