import React from 'react';
import { useApp } from '../../context/AppContext';
import { PAN_INDIA_CITIES } from '../../data/panIndiaCities';
import { IconMapPin } from '../common/Icons';

export const CitySelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { currentCity, setCurrentCity } = useApp();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="flex items-center text-xs text-[#5B7A99] font-medium space-x-1">
        <IconMapPin size={13} className="text-[#1B3A6B]" />
        <span>Destination:</span>
      </span>
      <select
        value={currentCity.id}
        onChange={e => {
          const matched = PAN_INDIA_CITIES.find(c => c.id === e.target.value);
          if (matched) setCurrentCity(matched);
        }}
        className="text-xs font-semibold text-[#111827] bg-[#FFFFFF] border border-[#E2E6EC] rounded-[2px] px-2.5 py-1 focus:outline-none focus:border-[#1B3A6B]"
      >
        {PAN_INDIA_CITIES.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}, {c.state}
          </option>
        ))}
      </select>
    </div>
  );
};
