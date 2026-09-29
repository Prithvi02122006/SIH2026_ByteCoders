import React, { useState, useEffect } from 'react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { MetricCard } from '../components/common/MetricCard';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { StatusBadge } from '../components/common/StatusBadge';
import { SourceTag } from '../components/common/SourceTag';
import { DataTable, formatINR, formatDateIN } from '../components/common/DataTable';
import { api, UserSession } from '../services/api';
import {
  UtensilsCrossed,
  PlusCircle,
  FileSpreadsheet,
  Thermometer,
  Boxes,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
  Download,
  Upload,
  CheckCircle2,
  RefreshCw,
  KeyRound
} from 'lucide-react';

interface KitchenDashboardProps {
  session: UserSession;
  onRefreshMe?: () => void;
}

export const KitchenDashboard: React.FC<KitchenDashboardProps> = ({ session }) => {
  const [dailyLogs, setDailyLogs] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [temperatureLogs, setTemperatureLogs] = useState<any[]>([]);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [showLogModal, setShowLogModal] = useState(false);
  const [showSurplusModal, setShowSurplusModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showTempModal, setShowTempModal] = useState(false);
  const [showSensorKeyModal, setShowSensorKeyModal] = useState(false);
  const [generatedSensorKey, setGeneratedSensorKey] = useState<any>(null);

  // Daily Log Form State (< 2 min form)
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logMeal, setLogMeal] = useState('lunch');
  const [expectedHc, setExpectedHc] = useState(session.is_demo ? '1100' : '450');
  const [actualHc, setActualHc] = useState(session.is_demo ? '1060' : '430');
  const [eventFlag, setEventFlag] = useState('regular');
  const [dishRows, setDishRows] = useState<any[]>([
    { dish_name: 'Steamed Rice', prepared_kg: 75, served_kg: 68, leftover_safe_kg: 5, discarded_kg: 2, discard_reason: 'Plate waste' },
    { dish_name: 'Dal Tadka', prepared_kg: 45, served_kg: 41, leftover_safe_kg: 3, discarded_kg: 1, discard_reason: 'Overproduction' },
  ]);

  // Surplus Form State
  const [surplusTitle, setSurplusTitle] = useState('');
  const [surplusCategory, setSurplusCategory] = useState('cooked_meal');
  const [surplusKg, setSurplusKg] = useState('20');
  const [surplusPortions, setSurplusPortions] = useState('50');
  const [surplusVeg, setSurplusVeg] = useState('veg');
  const [surplusTemp, setSurplusTemp] = useState('65.5');
  const [surplusStorage, setSurplusStorage] = useState('hot_holding');
  const [surplusPackaging, setSurplusPackaging] = useState('stainless_steel_camtainer');
  const [surplusAllergens, setSurplusAllergens] = useState<string[]>([]);
  const [surplusAddress, setSurplusAddress] = useState('Central Dining Hall, Gate 2');

  // Manual Temp Form State
  const [tempLocation, setTempLocation] = useState('hot_holding_well');
  const [tempValue, setTempValue] = useState('65.0');

  // Bulk import feedback
  const [importReport, setImportReport] = useState<any>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [logsData, invData, tempsData] = await Promise.all([
        api.getDailyLogs().catch(() => []),
        api.getInventory().catch(() => []),
        api.getTemperatureLogs().catch(() => []),
      ]);
      setDailyLogs(logsData || []);
      setInventory(invData || []);
      setTemperatureLogs(tempsData || []);

      // Fetch dynamic forecast
      try {
        const fc = await api.getForecast({
          target_date: new Date().toISOString().split('T')[0],
          target_meal: 'lunch',
          expected_headcount: parseInt(expectedHc) || 500,
          event_flag: eventFlag,
        });
        setForecast(fc);
      } catch {
        // forecast fallback — non-fatal
      }
    } catch (err: any) {
      setError(err.message || 'Error loading dashboard records');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally run once on mount; forecast uses current form values at that point

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const handleCreateDailyLog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createDailyLog({
        date: logDate,
        meal_type: logMeal,
        expected_headcount: parseInt(expectedHc),
        actual_headcount: parseInt(actualHc),
        event_flag: eventFlag,
        dishes: dishRows,
      });
      setShowLogModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateSurplus = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const prepTime = new Date();
      prepTime.setMinutes(prepTime.getMinutes() - 40);
      const packTime = new Date();
      packTime.setMinutes(packTime.getMinutes() - 15);

      await api.createSurplus({
        food_title: surplusTitle,
        food_category: surplusCategory,
        quantity_kg: parseFloat(surplusKg),
        estimated_portions: parseInt(surplusPortions),
        veg_status: surplusVeg,
        prep_time: prepTime.toISOString(),
        pack_time: packTime.toISOString(),
        holding_temp_c: parseFloat(surplusTemp),
        storage_condition: surplusStorage,
        allergens_list: surplusAllergens,
        packaging_type: surplusPackaging,
        pickup_address: surplusAddress,
      });
      setShowSurplusModal(false);
      setSurplusTitle('');
      fetchData();
      alert('Surplus lot successfully logged and queued for Food Safety Officer inspection!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleManualTempSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.logTemperature({
        probe_location: tempLocation,
        temperature_c: parseFloat(tempValue),
        source: 'manual',
      });
      setShowTempModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const report = await api.bulkImportDailyLogs(file);
      setImportReport(report);
      if (report.success) {
        fetchData();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleGenerateKey = async () => {
    try {
      const res = await api.generateSensorKey('Kitchen Steam Kettle Sensor Gateway');
      setGeneratedSensorKey(res);
      setShowSensorKeyModal(true);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Aggregated calculations
  const totalPrepared = dailyLogs.reduce((acc, l) => acc + (l.total_prepared_kg || 0), 0);
  const totalServed = dailyLogs.reduce((acc, l) => acc + (l.total_served_kg || 0), 0);
  const totalLeftover = dailyLogs.reduce((acc, l) => acc + (l.total_leftover_kg || 0), 0);
  const totalDiscarded = dailyLogs.reduce((acc, l) => acc + (l.total_discarded_kg || 0), 0);
  const wastePct = totalPrepared > 0 ? ((totalDiscarded / totalPrepared) * 100).toFixed(1) : '0.0';
  const costSaved = Math.round(totalLeftover * 95.0);

  // Near-expiry FEFO batches
  const nearExpiryBatches = inventory.filter((b) => b.days_until_expiry <= 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Header & Fast Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DECE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1F201C]">
              {session.organization_name || 'Kitchen Production & Surplus Intelligence'}
            </span>
            <SourceTag
              type={session.is_demo ? 'public_data' : 'your_data'}
              sourceText={session.is_demo ? 'Demo Sandbox' : 'Verified Kitchen Log'}
            />
          </div>
          <p className="text-xs text-[#64625A] mt-1">
            Data completeness: <strong>{dailyLogs.length} days logged</strong>. FSSAI Reg 4(1) safe holding & ML cold-start active.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBulkModal(true)}
            icon={<FileSpreadsheet className="w-3.5 h-3.5 text-[#5F7A3E]" />}
          >
            Bulk CSV Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTempModal(true)}
            icon={<Thermometer className="w-3.5 h-3.5 text-[#5F7A3E]" />}
          >
            Log Temp Probe
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLogModal(true)}
            icon={<PlusCircle className="w-3.5 h-3.5 text-[#5F7A3E]" />}
          >
            + Daily Log (&lt;2 min)
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowSurplusModal(true)}
            icon={<UtensilsCrossed className="w-3.5 h-3.5 text-[#FBF3DC]" />}
          >
            Create Surplus Donation
          </Button>
        </div>
      </div>

      {error && <ErrorMessage message={error} variant="error" onDismiss={() => setError(null)} />}

      {/* FEFO Near-Expiry Alerts (if any) */}
      {nearExpiryBatches.length > 0 && (
        <div className="p-4 rounded-[12px] bg-[#FEF7E8] border border-[#F2DEB0] flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#C87D1E] shrink-0 mt-0.5" />
          <div className="flex-1">
            <h5 className="text-xs font-bold text-[#8F5912] uppercase tracking-wide">
              FEFO Near-Expiry Stock Alert (FSSAI Kitchen Rule)
            </h5>
            <p className="text-xs text-[#704810] mt-0.5">
              {nearExpiryBatches.length} batch(es) nearing expiration in 72 hours. Prioritize in today's menu:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {nearExpiryBatches.map((b) => (
                <span
                  key={b.id}
                  className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FCE5B8] text-[#8F5912] border border-[#E8C88A]"
                >
                  {b.item_name} ({b.quantity_kg} kg) • Expires in {b.days_until_expiry} day(s)
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Today's Headcount Forecast"
          value={forecast ? `${forecast.predicted_kg} kg` : `${expectedHc} persons`}
          unit={forecast ? `(~${forecast.recommended_portions} meals)` : ''}
          sourceType={forecast?.ai_active ? 'your_data' : 'estimated'}
          sourceText={forecast?.tag || 'Estimated: Headcount Heuristic'}
          subtext={forecast?.message || 'Basic estimate until 14 days of logs'}
          tooltip="Calculated via scikit-learn GradientBoosting when >=14 days logged, else weekday baseline heuristic."
        />

        <MetricCard
          label="Waste Percentage"
          value={`${wastePct}%`}
          sourceType="your_data"
          subtext={`${totalDiscarded.toFixed(1)} kg discarded of ${totalPrepared.toFixed(1)} kg prepared`}
          trendText={parseFloat(wastePct) < 3.0 ? 'Below National Avg (11.4%)' : 'Above Target'}
          trendPositive={parseFloat(wastePct) < 3.0}
          tooltip="Percentage of cooked food discarded due to overproduction or plate return."
        />

        <MetricCard
          label="Surplus Safe Leftovers"
          value={`${totalLeftover.toFixed(1)} kg`}
          unit="(Redistribution Pool)"
          sourceType="your_data"
          subtext={`~${Math.round(totalLeftover / 0.4)} meals eligible for FSSAI recovery`}
        />

        <MetricCard
          label="Estimated Cost Saved"
          value={formatINR(costSaved)}
          sourceType="estimated"
          sourceText="Estimated: Rs 95/kg baseline"
          subtext="Financial recovery via planned portioning"
        />
      </div>

      {/* AI Forecasting Cold-Start & Live Weather Banner */}
      {forecast && (
        <div className="foodloop-card p-5 bg-[#FCF9F2] border border-[#DDD4BE]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-[#EAE3CE]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#EAE3CE] text-[#3D5528] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#5F7A3E]" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-[#1F201C]">
                  Demand Intelligence: {forecast.model_type}
                </h4>
                <p className="text-xs text-[#64625A]">{forecast.message}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[#64625A]">
                Weather: <strong>{forecast.external_features_used.weather_temp_c || 28}°C</strong>, Rain:{' '}
                <strong>{forecast.external_features_used.weather_rain_mm || 0} mm</strong>
              </span>
              <SourceTag
                type="public_data"
                sourceText={forecast.weather_context?.source || 'Open-Meteo API'}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
            <div className="p-3 bg-[#F7F2E4] rounded-[8px]">
              <span className="text-[10px] text-[#64625A] uppercase block">Recommended Cook Volume</span>
              <span className="font-mono text-xl font-bold text-[#1F201C]">
                {forecast.confidence_range.expected_kg} kg
              </span>
              <span className="text-[#64625A] block mt-0.5">
                Safe confidence interval: [{forecast.confidence_range.lower_kg} kg –{' '}
                {forecast.confidence_range.upper_kg} kg]
              </span>
            </div>

            <div className="p-3 bg-[#F7F2E4] rounded-[8px]">
              <span className="text-[10px] text-[#64625A] uppercase block">Model Accuracy & Residuals</span>
              <span className="font-mono text-xl font-bold text-[#1F201C]">
                {forecast.mae ? `MAE: ${forecast.mae} kg` : 'Cold-Start Baseline'}
              </span>
              <span className="text-[#64625A] block mt-0.5">
                {forecast.mape_pct ? `MAPE: ${forecast.mape_pct}% error` : '14 days required for MAE'}
              </span>
            </div>

            <div className="p-3 bg-[#F7F2E4] rounded-[8px] flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-[#64625A] uppercase block">IoT Probe Sensor Stream</span>
                <span className="font-medium text-[#1F201C] block">
                  {temperatureLogs.length > 0
                    ? `Latest: ${temperatureLogs[0].temperature_c}°C (${temperatureLogs[0].probe_location})`
                    : 'No telemetry received'}
                </span>
              </div>
              <button
                onClick={handleGenerateKey}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3D5528] hover:underline mt-2"
              >
                <KeyRound className="w-3 h-3" /> Connect IoT Hardware / REST API
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Tables Grid: Daily Production Logs & Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Daily Logs Table (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#1F201C]">
              Daily Production & Headcount Logs
            </h3>
            <span className="text-xs text-[#64625A]">Editable within 48h (FSSAI audit trail)</span>
          </div>

          {dailyLogs.length === 0 ? (
            <EmptyState
              title="No Daily Logs Recorded Yet"
              description="A new kitchen account starts with zero fake numbers. Enter your first lunch or dinner log through our 2-minute form or upload past registers via bulk CSV."
              actionText="+ Log First Service (< 2 mins)"
              onAction={() => setShowLogModal(true)}
              secondaryActionText="Upload Past CSV"
              onSecondaryAction={() => setShowBulkModal(true)}
              icon={<UtensilsCrossed className="w-6 h-6 text-[#5F7A3E]" />}
            />
          ) : (
            <DataTable
              columns={[
                {
                  header: 'Date & Meal',
                  cell: (row) => (
                    <div>
                      <div className="font-semibold text-[#1F201C]">{formatDateIN(row.date)}</div>
                      <div className="text-[10px] text-[#64625A] uppercase tracking-wide">
                        {row.meal_type}
                      </div>
                    </div>
                  ),
                },
                {
                  header: 'Headcount',
                  cell: (row) => (
                    <div>
                      <span className="font-mono text-xs">{row.actual_headcount}</span>
                      <span className="text-[10px] text-[#64625A]"> / {row.expected_headcount} exp</span>
                    </div>
                  ),
                },
                {
                  header: 'Prep vs Served',
                  cell: (row) => (
                    <div>
                      <span className="font-mono">{row.total_prepared_kg} kg</span>
                      <span className="text-[#64625A]"> &rarr; {row.total_served_kg} kg</span>
                    </div>
                  ),
                },
                {
                  header: 'Leftover Safe',
                  cell: (row) => (
                    <span className="font-mono font-bold text-[#2E541E]">
                      {row.total_leftover_kg} kg
                    </span>
                  ),
                },
                {
                  header: 'Discarded',
                  cell: (row) => (
                    <span className="font-mono text-[#A83232]">
                      {row.total_discarded_kg} kg
                    </span>
                  ),
                },
              ]}
              data={dailyLogs}
            />
          )}
        </div>

        {/* Inventory & Telemetry Aside (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Inventory FEFO */}
          <div className="foodloop-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3CE]">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-[#5F7A3E]" />
                <h4 className="font-serif font-bold text-base text-[#1F201C]">Stock Batches (FEFO)</h4>
              </div>
              <SourceTag type="your_data" />
            </div>

            {inventory.length === 0 ? (
              <p className="text-xs text-[#64625A] text-center py-4">
                No inventory batches registered. Add raw grains, dairy or produce to track expiry.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {inventory.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-[8px] bg-[#F7F2E4] border border-[#E5DECE] text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-[#1F201C]">{item.item_name}</div>
                      <div className="text-[10px] text-[#64625A]">
                        {item.quantity_kg} kg • Expires: {formatDateIN(item.expiry_date)}
                      </div>
                    </div>
                    <StatusBadge status={item.fefo_priority} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Temperature Log Stream */}
          <div className="foodloop-card p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3CE]">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-[#5F7A3E]" />
                <h4 className="font-serif font-bold text-base text-[#1F201C]">Cold & Hot Chain Telemetry</h4>
              </div>
              <button
                onClick={() => setShowTempModal(true)}
                className="text-xs font-semibold text-[#3D5528] hover:underline"
              >
                + Probe Entry
              </button>
            </div>

            {temperatureLogs.length === 0 ? (
              <p className="text-xs text-[#64625A] text-center py-4">
                No temperature telemetry recorded. Hot food must be held at &gt;=60°C and cold food at &lt;=5°C as per FSSAI regulations.
              </p>
            ) : (
              <div className="space-y-2 text-xs">
                {temperatureLogs.slice(0, 5).map((t) => (
                  <div
                    key={t.id}
                    className="p-2 rounded-[8px] bg-[#F7F2E4] flex items-center justify-between border border-[#EAE3CE]"
                  >
                    <div>
                      <span className="font-semibold text-[#1F201C] block capitalize">
                        {t.probe_location.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-[#64625A]">
                        {t.source === 'iot_sensor' ? 'IoT Sensor' : 'Manual Probe'}
                      </span>
                    </div>
                    <span
                      className={`font-mono font-bold text-sm ${
                        t.is_alert ? 'text-[#A83232]' : 'text-[#2E541E]'
                      }`}
                    >
                      {t.temperature_c}°C
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: Sub-2-Minute Daily Production Log */}
      <Modal
        isOpen={showLogModal}
        onClose={() => setShowLogModal(false)}
        title="Quick Daily Production Log (< 2 mins)"
        subtitle="Record meal headcount and dish quantities. Edits permitted for 48 hours."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateDailyLog} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Service Date"
              type="date"
              required
              value={logDate}
              onChange={(e) => setLogDate(e.target.value)}
            />
            <Select
              label="Meal Type"
              options={[
                { value: 'breakfast', label: 'Breakfast' },
                { value: 'lunch', label: 'Lunch' },
                { value: 'snacks', label: 'High Tea / Snacks' },
                { value: 'dinner', label: 'Dinner' },
              ]}
              value={logMeal}
              onChange={(e) => setLogMeal(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Expected Headcount"
              type="number"
              required
              value={expectedHc}
              onChange={(e) => setExpectedHc(e.target.value)}
            />
            <Input
              label="Actual Headcount Served"
              type="number"
              required
              value={actualHc}
              onChange={(e) => setActualHc(e.target.value)}
            />
          </div>

          <Select
            label="Day Context / Event Flag"
            options={[
              { value: 'regular', label: 'Regular Service Day' },
              { value: 'exam', label: 'College Exam / High Absenteeism' },
              { value: 'sports_day', label: 'Sports Event / Extended Dining' },
              { value: 'festival', label: 'Festive Menu / Special Service' },
              { value: 'holiday', label: 'Public Holiday' },
            ]}
            value={eventFlag}
            onChange={(e) => setEventFlag(e.target.value)}
          />

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-[#3B3A34] uppercase tracking-wide">
              Dishes Cooked (Quantity Validation: Served + Leftover + Discarded &le; Prepared)
            </label>
            {dishRows.map((dish, idx) => (
              <div key={idx} className="p-3 bg-[#F7F2E4] rounded-[8px] space-y-2 border border-[#DDD4BE]">
                <Input
                  label="Dish Name"
                  required
                  value={dish.dish_name}
                  onChange={(e) => {
                    const updated = [...dishRows];
                    updated[idx].dish_name = e.target.value;
                    setDishRows(updated);
                  }}
                />
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <Input
                    label="Prepared"
                    type="number"
                    unit="kg"
                    value={dish.prepared_kg}
                    onChange={(e) => {
                      const updated = [...dishRows];
                      updated[idx].prepared_kg = parseFloat(e.target.value) || 0;
                      setDishRows(updated);
                    }}
                  />
                  <Input
                    label="Served"
                    type="number"
                    unit="kg"
                    value={dish.served_kg}
                    onChange={(e) => {
                      const updated = [...dishRows];
                      updated[idx].served_kg = parseFloat(e.target.value) || 0;
                      setDishRows(updated);
                    }}
                  />
                  <Input
                    label="Safe Leftover"
                    type="number"
                    unit="kg"
                    value={dish.leftover_safe_kg}
                    onChange={(e) => {
                      const updated = [...dishRows];
                      updated[idx].leftover_safe_kg = parseFloat(e.target.value) || 0;
                      setDishRows(updated);
                    }}
                  />
                  <Input
                    label="Discarded"
                    type="number"
                    unit="kg"
                    value={dish.discarded_kg}
                    onChange={(e) => {
                      const updated = [...dishRows];
                      updated[idx].discarded_kg = parseFloat(e.target.value) || 0;
                      setDishRows(updated);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full mt-4">
            Save Daily Log Record
          </Button>
        </form>
      </Modal>

      {/* MODAL 2: Create Surplus Donation (FSSAI Validated) */}
      <Modal
        isOpen={showSurplusModal}
        onClose={() => setShowSurplusModal(false)}
        title="List Surplus Batch for FSSAI Redistribution"
        subtitle="Mandatory FSSAI 2019 checks: Holding temperature >= 60°C for hot cooked food."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSurplus} className="space-y-4">
          <Input
            label="Food Batch Title"
            required
            placeholder="e.g. Sambar, Steamed Rice & Dal Tadka"
            value={surplusTitle}
            onChange={(e) => setSurplusTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Net Quantity"
              type="number"
              unit="kg"
              required
              value={surplusKg}
              onChange={(e) => setSurplusKg(e.target.value)}
            />
            <Input
              label="Estimated Wholesome Portions"
              type="number"
              unit="meals"
              required
              value={surplusPortions}
              onChange={(e) => setSurplusPortions(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Dietary Classification"
              options={[
                { value: 'veg', label: 'Vegetarian (VEG)' },
                { value: 'non_veg', label: 'Non-Vegetarian (NON-VEG)' },
              ]}
              value={surplusVeg}
              onChange={(e) => setSurplusVeg(e.target.value)}
            />
            <Select
              label="Storage Condition"
              options={[
                { value: 'hot_holding', label: 'Hot Holding (>= 60°C)' },
                { value: 'refrigerated', label: 'Chilled (< 5°C)' },
                { value: 'sealed_ambient', label: 'Dry Bakery / Ambient' },
              ]}
              value={surplusStorage}
              onChange={(e) => setSurplusStorage(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Current Probe Temperature"
              type="number"
              step="0.1"
              unit="°C"
              required
              helperText="Must be >=60°C for hot holding or <=5°C for cold holding"
              value={surplusTemp}
              onChange={(e) => setSurplusTemp(e.target.value)}
            />
            <Select
              label="Food-Grade Packaging Vessel"
              options={[
                { value: 'stainless_steel_camtainer', label: 'Food-Grade Stainless Steel Camtainer' },
                { value: 'insulated_thermal_box', label: 'Insulated Thermal Transport Box' },
                { value: 'polypropylene_sealed', label: 'PP Heat-Sealed Containers' },
              ]}
              value={surplusPackaging}
              onChange={(e) => setSurplusPackaging(e.target.value)}
            />
          </div>

          <Input
            label="Pickup Address / Gate Location"
            required
            placeholder="e.g. Central Mess, Delivery Gate 2"
            value={surplusAddress}
            onChange={(e) => setSurplusAddress(e.target.value)}
          />

          <div className="p-3 bg-[#F7F2E4] rounded-[8px] text-xs text-[#55524A] space-y-1">
            <div className="font-bold text-[#1F201C]">FSSAI Compliance Verification Trigger:</div>
            <div className="editorial-line">Submitting places this lot into the Food Safety Officer inspection queue.</div>
            <div className="editorial-line">A Food Safety Confidence Score (0–100) will be calculated based on probe temperature and elapsed time.</div>
            <div className="editorial-line">Once approved, nearby verified NGOs will receive an automated claim broadcast.</div>
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full">
            Submit for Safety Inspection
          </Button>
        </form>
      </Modal>

      {/* MODAL 3: Bulk CSV Import with Row Error Validation */}
      <Modal
        isOpen={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        title="Bulk CSV / Register Import"
        subtitle="Import historical registers to calibrate your kitchen's AI forecasting model."
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div className="p-4 bg-[#F7F2E4] rounded-[10px] border border-[#DDD4BE] text-xs space-y-2">
            <span className="font-bold text-[#1F201C]">1. Download standard CSV template</span>
            <p className="text-[#64625A]">
              Contains mandatory columns: date, meal_type, expected_headcount, actual_headcount, dish_name, prepared_kg, served_kg, leftover_safe_kg, discarded_kg, discard_reason.
            </p>
            <a
              href="/api/kitchen/daily-logs/template.csv"
              download
              className="inline-flex items-center gap-1.5 font-semibold text-[#2D431E] hover:underline"
            >
              <Download className="w-3.5 h-3.5" /> Download CSV Template
            </a>
          </div>

          <div className="p-4 border-2 border-dashed border-[#DDD4BE] rounded-[10px] text-center bg-[#FCF9F2]">
            <Upload className="w-8 h-8 text-[#5F7A3E] mx-auto mb-2" />
            <span className="text-xs font-semibold text-[#1F201C] block mb-1">
              Select CSV File to Validate & Import
            </span>
            <input
              type="file"
              accept=".csv"
              onChange={handleBulkUpload}
              className="text-xs text-[#64625A]"
            />
          </div>

          {importReport && (
            <div
              className={`p-4 rounded-[10px] border text-xs ${
                importReport.success
                  ? 'bg-[#EBF3E4] border-[#CFDFBF] text-[#2E541E]'
                  : 'bg-[#FEF7E8] border-[#F2DEB0] text-[#8F5912]'
              }`}
            >
              <h5 className="font-bold mb-1">{importReport.message}</h5>
              {importReport.row_errors && importReport.row_errors.length > 0 && (
                <div className="mt-2 space-y-1">
                  <span className="font-semibold block">Row-by-row error report:</span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {importReport.row_errors.map((err: any, i: number) => (
                      <li key={i}>
                        Row {err.row}: {err.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>

      {/* MODAL 4: Manual Probe Temperature Logging */}
      <Modal
        isOpen={showTempModal}
        onClose={() => setShowTempModal(false)}
        title="Log Probe Temperature Reading"
        subtitle="Supports handheld digital food probe readings for cold chain and hot holding audit records."
        maxWidth="md"
      >
        <form onSubmit={handleManualTempSubmit} className="space-y-4">
          <Select
            label="Holding / Storage Location"
            options={[
              { value: 'hot_holding_well', label: 'Steam Table / Hot Holding Well (Min 60°C)' },
              { value: 'bain_marie', label: 'Bain-Marie Holding Kettle (Min 60°C)' },
              { value: 'walk_in_cooler', label: 'Walk-In Chiller / Refrigerator (Max 5°C)' },
              { value: 'transport_box', label: 'Insulated Dispatch Container' },
            ]}
            value={tempLocation}
            onChange={(e) => setTempLocation(e.target.value)}
          />

          <Input
            label="Probe Temperature Reading"
            type="number"
            step="0.1"
            unit="°C"
            required
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
          />

          <Button type="submit" variant="primary" size="md" className="w-full">
            Record Temperature Reading
          </Button>
        </form>
      </Modal>

      {/* MODAL 5: Sensor Key Generated */}
      <Modal
        isOpen={showSensorKeyModal}
        onClose={() => setShowSensorKeyModal(false)}
        title="IoT Sensor API Key Generated"
        subtitle="Use this secret key to connect real hardware sensors (ESP32, Raspberry Pi) to push temperature telemetry."
        maxWidth="md"
      >
        {generatedSensorKey && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-[#F7F2E4] rounded-[8px] border border-[#DDD4BE] font-mono break-all text-[#2D431E]">
              {generatedSensorKey.api_key}
            </div>
            <p className="text-[#A83232] font-semibold">
              Warning: This secret key is displayed only once. Store it safely in your IoT device firmware.
            </p>
            <div className="space-y-1 text-[#64625A]">
              <div>Endpoint: <code>POST /api/sensors/push</code></div>
              <div>Header: <code>X-Sensor-API-Key: &lt;YOUR_KEY&gt;</code></div>
              <div>Body: <code>{"{\"sensor_id\": \"PROBE-01\", \"probe_location\": \"hot_holding_well\", \"temperature_c\": 68.2}"}</code></div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowSensorKeyModal(false)}
            >
              Done & Dismiss
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};
