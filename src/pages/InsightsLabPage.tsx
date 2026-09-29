import React, { useState, useEffect } from 'react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { MetricCard } from '../components/common/MetricCard';
import { SourceTag } from '../components/common/SourceTag';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { api } from '../services/api';
import {
  FlaskConical,
  Download,
  Shield,
  Building2,
  ExternalLink,
  MapPin,
  TrendingDown,
  BarChart2
} from 'lucide-react';

export const InsightsLabPage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState('Bengaluru');

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getPublicInsights();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch public insights data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleDownloadCSV = () => {
    // Generate anonymized research CSV
    const rows = [
      ['City', 'Daily Solid Waste (TPD)', 'Food Waste %', 'Est Institutional Kitchens', 'Avg Overprep %', 'Active Recovery NGOs', 'Source'],
      ...Object.entries(data?.city_benchmarks || {}).map(([city, info]: [string, any]) => [
        city,
        info.daily_solid_waste_tpd,
        info.food_waste_pct,
        info.institutional_kitchens_estimated,
        info.avg_mess_overprep_pct,
        info.active_recovery_ngos,
        info.source,
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'foodloop_anonymized_research_benchmarks.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cities = ['Bengaluru', 'Delhi NCR', 'Mumbai', 'Hyderabad', 'Pune', 'Chennai'];
  const currentCityData = data?.city_benchmarks?.[selectedCity];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DECE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1F201C]">
              Public Food Intelligence & Insights Lab
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#EAE3CE] text-[#3D5528] border border-[#DDD4BE]">
              Open Research Portal
            </span>
          </div>
          <p className="text-xs text-[#64625A] mt-1">
            Anonymized, aggregated research data only. Built on k-anonymity privacy principles (k &ge; 5).
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadCSV}
          icon={<Download className="w-3.5 h-3.5 text-[#5F7A3E]" />}
        >
          Download Anonymized Research CSV
        </Button>
      </div>

      {error && <ErrorMessage message={error} variant="error" onDismiss={() => setError(null)} />}

      {/* Honest Empty State / k-Anonymity Notice */}
      {data && data.k_anonymity_status === 'insufficient_contributors' && (
        <div className="p-5 rounded-[12px] bg-[#FCF9F2] border-2 border-[#DDD4BE] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8C5511] uppercase tracking-wide">
            <Shield className="w-4 h-4 text-[#C87D1E]" />
            <span>Privacy Guard: k-Anonymity Threshold ({data.consenting_kitchens_count}/{data.k_threshold} Contributors)</span>
          </div>
          <p className="text-xs text-[#55524A] leading-relaxed">
            {data.message}
          </p>
          <div className="pt-1">
            <SourceTag type="public_data" sourceText={data.data_tag} />
          </div>
        </div>
      )}

      {/* City Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E5DECE] pb-3">
        <span className="text-xs font-semibold text-[#64625A] mr-2">City Focus:</span>
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-all ${
              selectedCity === city
                ? 'bg-[#2D431E] text-[#FBF3DC]'
                : 'bg-[#FCF9F2] text-[#55524A] border border-[#DDD4BE] hover:bg-[#F7F2E4]'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* City Benchmark Metrics */}
      {currentCityData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Daily Municipal Waste"
            value={`${currentCityData.daily_solid_waste_tpd}`}
            unit="Tonnes/Day"
            sourceType="public_data"
            sourceText={currentCityData.source}
            subtext={`State: ${currentCityData.state}`}
          />

          <MetricCard
            label="Wet Food Fraction"
            value={`${currentCityData.food_waste_pct}%`}
            sourceType="public_data"
            sourceText="City SWM Master Plan"
            subtext="Highest component of city landfill burden"
          />

          <MetricCard
            label="Institutional Dining Halls"
            value={`~${currentCityData.institutional_kitchens_estimated}`}
            sourceType="public_data"
            sourceText="Census & Trade Data"
            subtext="Messes, colleges, hotels & IT parks"
          />

          <MetricCard
            label="Average Mess Overprep"
            value={`${currentCityData.avg_mess_overprep_pct}%`}
            sourceType="public_data"
            sourceText="FAO South Asia Baseline"
            subtext="Food prepared beyond consumption headcount"
          />
        </div>
      )}

      {/* Waste by Food Category & Forecast vs Actual Accuracy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Waste Breakdown */}
        <div className="foodloop-card p-6 bg-[#FCF9F2] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3CE]">
            <h4 className="font-serif text-lg font-bold text-[#1F201C]">
              Institutional Waste by Category Breakdown
            </h4>
            <SourceTag type="public_data" sourceText="UNEP / FAO 2024" />
          </div>

          <div className="space-y-3">
            {(data?.waste_by_category_benchmark || []).map((cat: any, i: number) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#1F201C]">{cat.category}</span>
                  <span className="font-mono text-[#55524A]">{cat.percentage}% of waste</span>
                </div>
                <div className="w-full bg-[#EAE3CE] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#5F7A3E] h-full rounded-full"
                    style={{ width: `${cat.percentage * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#64625A] pt-2">
            Cooked rice, breads and lentils represent &gt;70% of discarded mass due to high batch cooking volumes.
          </p>
        </div>

        {/* AI Forecast vs Actual Behavior */}
        <div className="foodloop-card p-6 bg-[#FCF9F2] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3CE]">
            <h4 className="font-serif text-lg font-bold text-[#1F201C]">
              Machine Learning Model Behavior
            </h4>
            <SourceTag type="public_data" sourceText="GradientBoosting Regressor" />
          </div>

          <div className="space-y-3 text-xs text-[#55524A] leading-relaxed">
            <div className="p-3 bg-[#F7F2E4] rounded-[8px] space-y-1 border border-[#DDD4BE]">
              <span className="font-bold text-[#1F201C] block">Cold-Start Rule (Days 0–13):</span>
              <p>Transparent weekday-meal ratio baseline. Clearly marked as basic estimate until 14 continuous days are logged.</p>
            </div>

            <div className="p-3 bg-[#F7F2E4] rounded-[8px] space-y-1 border border-[#DDD4BE]">
              <span className="font-bold text-[#1F201C] block">AI Training (Days 14+):</span>
              <p>Per-kitchen scikit-learn GradientBoostingRegressor incorporating weather temperature, rainfall (Open-Meteo), gazetted Indian holidays, and campus event flags.</p>
            </div>

            <div className="p-3 bg-[#F7F2E4] rounded-[8px] space-y-1 border border-[#DDD4BE]">
              <span className="font-bold text-[#1F201C] block">Automated Fallback Guard:</span>
              <p>Computes Mean Absolute Error (MAE). If the trained machine learning model yields an error exceeding the simple heuristic baseline, the system automatically falls back to the transparent baseline and alerts the kitchen manager.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
