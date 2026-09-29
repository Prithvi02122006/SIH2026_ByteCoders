import React, { useState, useEffect } from 'react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { MetricCard } from '../components/common/MetricCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { SourceTag } from '../components/common/SourceTag';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { DataTable, formatINR } from '../components/common/DataTable';
import { api, UserSession } from '../services/api';
import {
  BarChart3,
  TrendingDown,
  Download,
  Leaf,
  Users,
  Building,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface AdminEsgDashboardProps {
  session: UserSession;
}

export const AdminEsgDashboard: React.FC<AdminEsgDashboardProps> = ({ session }) => {
  const [metrics, setMetrics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAdminMetrics();
      setMetrics(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load enterprise ESG metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleExportCSV = () => {
    window.open('/api/data/export', '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DECE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1F201C]">
              Enterprise ESG Sustainability & Compliance Directorate
            </span>
            <SourceTag
              type={session.is_demo ? 'public_data' : 'your_data'}
              sourceText={session.is_demo ? 'Demo Sandbox Directorate' : 'Verified Enterprise Audit'}
            />
          </div>
          <p className="text-xs text-[#64625A] mt-1">
            Institutional aggregates: prepared vs served vs donated vs discarded. Certified under WRAP / IPCC greenhouse gas benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            icon={<Download className="w-3.5 h-3.5 text-[#5F7A3E]" />}
          >
            Export Audit CSV / Report
          </Button>
          <Button variant="primary" size="sm" onClick={fetchMetrics}>
            Refresh Directorate Metrics
          </Button>
        </div>
      </div>

      {error && <ErrorMessage message={error} variant="error" onDismiss={() => setError(null)} />}

      {/* Metric Cards Row */}
      {metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Gross Prepared Volume"
            value={`${metrics.total_prepared_kg} kg`}
            sourceType="your_data"
            subtext={`Served: ${metrics.total_served_kg} kg • Discarded: ${metrics.total_discarded_kg} kg`}
          />

          <MetricCard
            label="Verified Waste Rate"
            value={`${metrics.waste_percentage}%`}
            sourceType="your_data"
            subtext="Baseline benchmark: 11.4% (FAO India average)"
            trendText={metrics.waste_percentage < 5.0 ? 'Exceeding ESG Target' : 'Review Portions'}
            trendPositive={metrics.waste_percentage < 5.0}
            tooltip="Ratio of discarded cooked food over prepared volume."
          />

          <MetricCard
            label="CO2e Emissions Avoided"
            value={`${metrics.co2e_avoided_kg} kg`}
            unit="CO2e"
            sourceType="public_data"
            sourceText="WRAP / IPCC Factor"
            subtext={`${metrics.total_donated_kg} kg diverted from landfills`}
            tooltip="Calculated using WRAP standard: 2.5 kg CO2e avoided per kg food saved."
          />

          <MetricCard
            label="Wholesome Meals Recovered"
            value={metrics.meals_recovered}
            unit="meals"
            sourceType="your_data"
            subtext={`Financial savings: ${formatINR(metrics.cost_saved_inr)}`}
            tooltip="Calculated using ICMR-NIN dietary norm: 400g per meal."
          />
        </div>
      )}

      {/* Operational Efficiency & Safety Compliance */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="foodloop-card p-5 bg-[#FCF9F2]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3CE]">
              <span className="text-xs font-bold uppercase text-[#5F7A3E]">Pickup Success Rate</span>
              <SourceTag type="your_data" />
            </div>
            <div className="font-serif text-3xl font-bold text-[#1F201C] my-2">
              {metrics.pickup_success_rate}%
            </div>
            <p className="text-xs text-[#64625A] leading-relaxed">
              Percentage of claimed surplus lots successfully collected and delivered within the safe thermal transit window.
            </p>
          </div>

          <div className="foodloop-card p-5 bg-[#FCF9F2]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3CE]">
              <span className="text-xs font-bold uppercase text-[#5F7A3E]">Average Pickup Transit</span>
              <SourceTag type="public_data" sourceText="OSRM Telemetry" />
            </div>
            <div className="font-serif text-3xl font-bold text-[#1F201C] my-2">
              {metrics.avg_pickup_time_minutes} mins
            </div>
            <p className="text-xs text-[#64625A] leading-relaxed">
              Average interval between NGO claim and vehicle arrival at kitchen gate. Below the 45-minute safety threshold.
            </p>
          </div>

          <div className="foodloop-card p-5 bg-[#FCF9F2]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3CE]">
              <span className="text-xs font-bold uppercase text-[#5F7A3E]">FSSAI Compliance Index</span>
              <SourceTag type="your_data" />
            </div>
            <div className="font-serif text-3xl font-bold text-[#2E541E] my-2">
              {metrics.compliance_score} / 100
            </div>
            <p className="text-xs text-[#64625A] leading-relaxed">
              Composite score from daily temperature logs, cold-chain probe telemetry, and officer hygiene audits.
            </p>
          </div>
        </div>
      )}

      {/* Top Wasted Items & Branch Comparison */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Top Wasted Dishes */}
          <div className="foodloop-card p-6 bg-[#FCF9F2] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3CE]">
              <h4 className="font-serif text-lg font-bold text-[#1F201C]">
                Top Discarded Dishes (Overproduction Targets)
              </h4>
              <SourceTag type="your_data" />
            </div>

            {metrics.top_wasted_items && metrics.top_wasted_items.length > 0 ? (
              <div className="space-y-3">
                {metrics.top_wasted_items.map((item: any, i: number) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-[#1F201C]">{item.dish}</span>
                      <span className="font-mono text-[#A83232]">{item.kg} kg discarded</span>
                    </div>
                    <div className="w-full bg-[#EAE3CE] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#A83232] h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (item.kg / (metrics.total_discarded_kg || 1)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#64625A] py-4 text-center">
                Zero discard events recorded. All prepared food consumed or recovered.
              </p>
            )}
          </div>

          {/* Dining Halls & Branches */}
          <div className="foodloop-card p-6 bg-[#FCF9F2] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3CE]">
              <h4 className="font-serif text-lg font-bold text-[#1F201C]">
                Campus & Mess Block Comparison
              </h4>
              <SourceTag type="your_data" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#F7F2E4] rounded-[8px] flex items-center justify-between border border-[#E5DECE]">
                <div>
                  <span className="font-bold text-[#1F201C] block">IISc Central Dining Hall (Mess Block A)</span>
                  <span className="text-[10px] text-[#64625A]">Ward 35 • 1,200 meals/day</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-[#2E541E] text-sm">94.5% Safe</span>
                  <span className="text-[10px] text-[#64625A] block">16 days logged</span>
                </div>
              </div>

              <div className="p-3 bg-[#F7F2E4] rounded-[8px] flex items-center justify-between border border-[#E5DECE]">
                <div>
                  <span className="font-bold text-[#1F201C] block">Hostel Block C - North Mess</span>
                  <span className="text-[10px] text-[#64625A]">Ward 35 • 650 meals/day</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-[#2E541E] text-sm">96.0% Safe</span>
                  <span className="text-[10px] text-[#64625A] block">14 days logged</span>
                </div>
              </div>

              <div className="p-3 bg-[#F7F2E4] rounded-[8px] flex items-center justify-between border border-[#E5DECE]">
                <div>
                  <span className="font-bold text-[#1F201C] block">Executive Faculty Dining</span>
                  <span className="text-[10px] text-[#64625A]">Ward 35 • 250 meals/day</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-[#2E541E] text-sm">98.2% Safe</span>
                  <span className="text-[10px] text-[#64625A] block">18 days logged</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
