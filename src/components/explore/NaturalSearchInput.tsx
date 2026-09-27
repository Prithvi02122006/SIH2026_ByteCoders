import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { parseNaturalLanguageSearch } from '../../lib/llmClient';
import { IconSpark } from '../common/Icons';

interface NaturalSearchInputProps {
  onFiltersApplied: () => void;
}

export const NaturalSearchInput: React.FC<NaturalSearchInputProps> = ({ onFiltersApplied }) => {
  const { filters, setFilters } = useApp();
  const [naturalQuery, setNaturalQuery] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleNaturalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalQuery.trim()) return;

    setIsParsing(true);
    try {
      const updates = await parseNaturalLanguageSearch(naturalQuery, filters);
      setFilters(prev => ({
        ...prev,
        ...updates
      }));
      onFiltersApplied();
    } catch (err) {
      console.warn('Failed to parse natural query:', err);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <form onSubmit={handleNaturalSubmit} className="relative w-full">
      <div className="flex items-center bg-[#FFFFFF] border border-[#CBD5E1] rounded-[4px] p-1.5 focus-within:border-[#1B3A6B] focus-within:ring-1 focus-within:ring-[#1B3A6B] transition-colors">
        <div className="pl-2 pr-1.5 text-[#1B3A6B]">
          <IconSpark size={15} />
        </div>
        <input
          type="text"
          value={naturalQuery}
          onChange={e => setNaturalQuery(e.target.value)}
          placeholder='Try: "step-free street food dinner under Rs 400" or "morning pottery workshop"'
          className="w-full text-xs text-[#111827] placeholder-[#9CA3AF] bg-transparent focus:outline-none px-2 py-1"
        />
        <button
          type="submit"
          disabled={isParsing || !naturalQuery.trim()}
          className="px-3 py-1 bg-[#1B3A6B] text-white text-xs font-semibold rounded-[2px] hover:bg-[#152e55] disabled:opacity-50 transition-colors flex-shrink-0"
        >
          {isParsing ? 'Parsing...' : 'Filter by Intent'}
        </button>
      </div>
    </form>
  );
};
