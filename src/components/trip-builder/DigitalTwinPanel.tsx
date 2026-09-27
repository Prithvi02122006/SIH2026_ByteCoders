import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WeatherSimulationParams } from '../../types';
import { IconSpark } from '../common/Icons';

export const DigitalTwinPanel: React.FC = () => {
  const {
    currentCity,
    activeItinerary,
    weatherData,
    isLoadingWeather,
    simulatedTwin,
    isSimulatingTwin,
    socialSignals,
    isLoadingSocialSignals,
    weatherSimulationParams,
    setWeatherSimulationParams,
    runDigitalTwinSimulation,
    applySimulationToActual,
    clearSimulation,
    fetchCityWeather
  } = useApp();

  const [selectedPreset, setSelectedPreset] = useState<string>(
    weatherSimulationParams.preset_name || 'Sudden Monsoon Shower'
  );

  const presets: { name: string; params: WeatherSimulationParams; description: string }[] = [
    {
      name: 'Sudden Monsoon Shower',
      description: 'Moderate afternoon showers with street water accumulation',
      params: {
        rainfall_intensity_mm: 22,
        storm_duration_hours: 2,
        temperature_c: 27,
        wind_speed_kmh: 24,
        waterlogging_severity: 'moderate',
        preset_name: 'Sudden Monsoon Shower'
      }
    },
    {
      name: 'Cloudburst & Road Flooding',
      description: 'Severe torrential rainfall with road traffic standstill',
      params: {
        rainfall_intensity_mm: 52,
        storm_duration_hours: 3.5,
        temperature_c: 24,
        wind_speed_kmh: 38,
        waterlogging_severity: 'severe',
        preset_name: 'Cloudburst & Road Flooding'
      }
    },
    {
      name: 'Intermittent Light Drizzle',
      description: 'Gentle showers, damp cobblestones, standard vehicular flow',
      params: {
        rainfall_intensity_mm: 6,
        storm_duration_hours: 1,
        temperature_c: 29,
        wind_speed_kmh: 14,
        waterlogging_severity: 'none',
        preset_name: 'Intermittent Light Drizzle'
      }
    },
    {
      name: 'Dry & Clear Pavement',
      description: 'Clear sunny sky, zero transit penalty across all sectors',
      params: {
        rainfall_intensity_mm: 0,
        storm_duration_hours: 0,
        temperature_c: 32,
        wind_speed_kmh: 12,
        waterlogging_severity: 'none',
        preset_name: 'Dry & Clear Pavement'
      }
    }
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setSelectedPreset(preset.name);
    setWeatherSimulationParams(preset.params);
  };

  const handleSyncLiveWeather = () => {
    if (!weatherData) return;
    const rain = weatherData.current.rain_mm || weatherData.current.precipitation_mm;
    const isHeavy = rain > 20 || weatherData.current.condition_category === 'heavy_rain';
    const isMod = rain > 5 || weatherData.current.condition_category === 'rain';

    const synced: WeatherSimulationParams = {
      rainfall_intensity_mm: Math.round(rain * 10) / 10,
      storm_duration_hours: 2,
      temperature_c: weatherData.current.temperature_c,
      wind_speed_kmh: weatherData.current.wind_speed_kmh,
      waterlogging_severity: isHeavy ? 'severe' : isMod ? 'moderate' : 'none',
      preset_name: `Live: ${weatherData.current.weather_description}`
    };
    setSelectedPreset(synced.preset_name!);
    setWeatherSimulationParams(synced);
  };

  const handleRunSimulation = () => {
    runDigitalTwinSimulation();
  };

  return (
    <div className="space-y-6">
      {/* 1. Live Weather Summary Banner */}
      <div className="card-surface bg-white border border-[#E2E6EC] rounded-[4px] p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E6EC] pb-3 mb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#15803D]" />
              <h3 className="font-serif font-bold text-base text-[#111827]">
                Live Real-Time Weather • {currentCity.name}
              </h3>
              <span className="card-tag px-2 py-0.5 bg-[#F0F4F8] text-[#1B3A6B] text-[10px] font-semibold">
                Open-Meteo Verified
              </span>
            </div>
            <p className="text-xs text-[#5B7A99] mt-0.5">
              Live atmospheric sensors measuring 24h precipitation probability and wind velocity
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => fetchCityWeather()}
              disabled={isLoadingWeather}
              className="text-[11px] font-medium text-[#1B3A6B] hover:underline disabled:opacity-50"
            >
              {isLoadingWeather ? 'Refreshing...' : 'Refresh Sensor'}
            </button>
            <button
              onClick={handleSyncLiveWeather}
              disabled={!weatherData}
              className="px-3 py-1 bg-[#1B3A6B] text-white text-[11px] font-semibold rounded-[2px] hover:bg-[#152e55] transition-colors"
            >
              Sync to What-If
            </button>
          </div>
        </div>

        {weatherData ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#F8FAFC] border border-[#E2E6EC] rounded-[3px]">
              <div className="text-[10px] uppercase font-semibold text-[#5B7A99] tracking-wider">
                Temperature
              </div>
              <div className="font-bold text-lg text-[#111827] mt-0.5">
                {weatherData.current.temperature_c}°C
              </div>
              <div className="text-[10px] text-[#6B7280]">
                RealFeel: {weatherData.current.apparent_temperature_c}°C
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] border border-[#E2E6EC] rounded-[3px]">
              <div className="text-[10px] uppercase font-semibold text-[#5B7A99] tracking-wider">
                Condition
              </div>
              <div className="font-bold text-sm text-[#111827] mt-0.5 truncate">
                {weatherData.current.weather_description}
              </div>
              <div className="text-[10px] text-[#6B7280]">
                Humidity: {weatherData.current.relative_humidity}%
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] border border-[#E2E6EC] rounded-[3px]">
              <div className="text-[10px] uppercase font-semibold text-[#5B7A99] tracking-wider">
                Precipitation
              </div>
              <div className="font-bold text-lg text-[#1B3A6B] mt-0.5">
                {weatherData.current.precipitation_mm} mm
              </div>
              <div className="text-[10px] text-[#6B7280]">
                24h Sum: {weatherData.precipitation_sum_24h} mm
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] border border-[#E2E6EC] rounded-[3px]">
              <div className="text-[10px] uppercase font-semibold text-[#5B7A99] tracking-wider">
                Rain Probability
              </div>
              <div className="font-bold text-lg text-[#DC2626] mt-0.5">
                {weatherData.max_rain_probability_24h}%
              </div>
              <div className="text-[10px] text-[#6B7280]">
                Wind: {weatherData.current.wind_speed_kmh} km/h
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-[#6B7280] py-2">Loading live atmospheric data...</div>
        )}
      </div>

      {/* 2. What-If Scenario Control Board */}
      <div className="card-surface bg-white border border-[#1B3A6B] rounded-[4px] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E6EC] pb-3">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold text-[#1B3A6B] uppercase tracking-wider">
              <IconSpark size={14} className="text-[#1B3A6B]" />
              <span>Digital Twin Graph What-If Simulator</span>
            </div>
            <p className="text-xs text-[#5B7A99] mt-0.5">
              Simulates transit graph delay propagation, indoor/outdoor risk, and vendor demand shifts
            </p>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulatingTwin || !activeItinerary}
            className="px-5 py-2 bg-[#1B3A6B] text-white text-xs font-bold rounded-[2px] hover:bg-[#152e55] disabled:opacity-50 transition-colors shadow-sm self-start sm:self-auto flex items-center space-x-1.5"
          >
            <IconSpark size={13} />
            <span>{isSimulatingTwin ? 'Executing Graph Simulation...' : 'Run Simulation'}</span>
          </button>
        </div>

        {/* Preset Selector */}
        <div>
          <label className="block text-[11px] font-bold text-[#111827] uppercase tracking-wider mb-2">
            Weather Scenario Presets
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {presets.map(p => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className={`p-2.5 text-left rounded-[3px] border transition-colors ${
                  selectedPreset === p.name
                    ? 'bg-[#EBF5FF] border-[#1B3A6B] text-[#1B3A6B]'
                    : 'bg-[#F8FAFC] border-[#E2E6EC] text-[#374151] hover:bg-[#F1F5F9]'
                }`}
              >
                <div className="font-semibold text-xs">{p.name}</div>
                <div className="text-[10px] text-[#6B7280] mt-0.5 leading-tight">
                  {p.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Fine-Tuning Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-[#E2E6EC]">
          {/* Rainfall Intensity */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#111827] mb-1">
              <span>Rain Intensity</span>
              <span className="text-[#1B3A6B] font-bold">
                {weatherSimulationParams.rainfall_intensity_mm} mm/h
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              step="2"
              value={weatherSimulationParams.rainfall_intensity_mm}
              onChange={e => {
                setSelectedPreset('Custom');
                setWeatherSimulationParams(prev => ({
                  ...prev,
                  rainfall_intensity_mm: Number(e.target.value)
                }));
              }}
              className="w-full accent-[#1B3A6B]"
            />
            <div className="text-[10px] text-[#6B7280] flex justify-between mt-0.5">
              <span>0 (Dry)</span>
              <span>25 (Heavy)</span>
              <span>80 (Cloudburst)</span>
            </div>
          </div>

          {/* Storm Duration */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#111827] mb-1">
              <span>Storm Duration</span>
              <span className="text-[#1B3A6B] font-bold">
                {weatherSimulationParams.storm_duration_hours} h
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="0.5"
              value={weatherSimulationParams.storm_duration_hours}
              onChange={e => {
                setSelectedPreset('Custom');
                setWeatherSimulationParams(prev => ({
                  ...prev,
                  storm_duration_hours: Number(e.target.value)
                }));
              }}
              className="w-full accent-[#1B3A6B]"
            />
            <div className="text-[10px] text-[#6B7280] flex justify-between mt-0.5">
              <span>0h</span>
              <span>3h</span>
              <span>6h</span>
            </div>
          </div>

          {/* Temperature */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-[#111827] mb-1">
              <span>Temperature</span>
              <span className="text-[#1B3A6B] font-bold">
                {weatherSimulationParams.temperature_c}°C
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="45"
              step="1"
              value={weatherSimulationParams.temperature_c}
              onChange={e => {
                setSelectedPreset('Custom');
                setWeatherSimulationParams(prev => ({
                  ...prev,
                  temperature_c: Number(e.target.value)
                }));
              }}
              className="w-full accent-[#1B3A6B]"
            />
            <div className="text-[10px] text-[#6B7280] flex justify-between mt-0.5">
              <span>15°C</span>
              <span>30°C</span>
              <span>45°C</span>
            </div>
          </div>

          {/* Waterlogging Severity */}
          <div>
            <label className="block text-xs font-semibold text-[#111827] mb-1">
              Waterlogging Severity
            </label>
            <div className="flex space-x-1.5">
              {(['none', 'moderate', 'severe'] as const).map(sev => (
                <button
                  key={sev}
                  type="button"
                  onClick={() => {
                    setSelectedPreset('Custom');
                    setWeatherSimulationParams(prev => ({ ...prev, waterlogging_severity: sev }));
                  }}
                  className={`flex-1 py-1.5 text-[11px] font-semibold capitalize rounded-[2px] border transition-colors ${
                    weatherSimulationParams.waterlogging_severity === sev
                      ? 'bg-[#1B3A6B] text-white border-[#1B3A6B]'
                      : 'bg-[#F8FAFC] border-[#E2E6EC] text-[#4B5563]'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Simulation Cascade Results (Side-by-Side Analysis) */}
      {simulatedTwin && (
        <div className="space-y-4">
          {/* Executive Metrics Bar */}
          <div className="card-surface bg-white border border-[#E2E6EC] rounded-[4px] p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E6EC] pb-3 mb-3">
              <div>
                <h4 className="font-serif font-bold text-base text-[#111827]">
                  Simulation Analysis & Cascade Forecast
                </h4>
                <div className="text-xs text-[#5B7A99] flex items-center space-x-2 mt-0.5">
                  <span>Simulated at: {simulatedTwin.simulated_at}</span>
                  <span>•</span>
                  <span>Rain: {simulatedTwin.params.rainfall_intensity_mm} mm/h</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-[#EBF5FF] text-[#1B3A6B] border border-[#BFDBFE] rounded-[2px] text-[10px] font-semibold">
                  Nugen Confidence: {simulatedTwin.nugen_confidence}%
                </span>
                <button
                  onClick={applySimulationToActual}
                  className="px-3 py-1 bg-[#15803D] text-white text-[11px] font-semibold rounded-[2px] hover:bg-[#166534] transition-colors"
                >
                  Apply to Live Itinerary
                </button>
                <button
                  onClick={clearSimulation}
                  className="px-3 py-1 border border-[#E2E6EC] text-[#4B5563] text-[11px] font-medium rounded-[2px] hover:bg-[#F8FAFC]"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-[3px]">
                <div className="text-[10px] uppercase font-bold text-[#DC2626] tracking-wider">
                  Total Schedule Lag
                </div>
                <div className="font-bold text-xl text-[#DC2626] mt-0.5">
                  +{simulatedTwin.total_delay_minutes} min
                </div>
                <div className="text-[10px] text-[#7F1D1D]">
                  Cascading across transit legs
                </div>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-[#E2E6EC] rounded-[3px]">
                <div className="text-[10px] uppercase font-bold text-[#5B7A99] tracking-wider">
                  Outdoor Exposure
                </div>
                <div className="font-bold text-xl text-[#111827] mt-0.5">
                  {simulatedTwin.outdoor_exposure_index}%
                </div>
                <div className="text-[10px] text-[#6B7280]">
                  Itinerary vulnerability index
                </div>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-[#E2E6EC] rounded-[3px]">
                <div className="text-[10px] uppercase font-bold text-[#5B7A99] tracking-wider">
                  Critical Stops
                </div>
                <div className="font-bold text-xl text-[#B45309] mt-0.5">
                  {simulatedTwin.severely_affected_stops_count} / {simulatedTwin.simulated_stops.length}
                </div>
                <div className="text-[10px] text-[#6B7280]">
                  High exposure / closure risk
                </div>
              </div>

              <div className="p-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-[3px]">
                <div className="text-[10px] uppercase font-bold text-[#15803D] tracking-wider">
                  Sheltered Venues
                </div>
                <div className="font-bold text-xl text-[#15803D] mt-0.5">
                  {simulatedTwin.simulated_stops.filter(s => s.is_indoor).length} stops
                </div>
                <div className="text-[10px] text-[#166534]">
                  Indoor workshops & tearooms
                </div>
              </div>
            </div>

            {/* Nugen Intelligence Behavioral Synthesis Card */}
            {simulatedTwin.nugen_insight && (
              <div className="mt-4 p-3.5 bg-[#F8FAFC] border border-[#E2E6EC] rounded-[3px] space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-[#1B3A6B]">
                  <IconSpark size={13} className="text-[#1B3A6B]" />
                  <span>Nugen Domain AI • Traveler & Merchant Behavioral Insight</span>
                </div>
                <p className="text-xs text-[#374151] leading-relaxed">
                  {simulatedTwin.nugen_insight}
                </p>
                {simulatedTwin.nugen_recommended_action && (
                  <div className="text-[11px] text-[#15803D] font-medium pt-1 border-t border-[#E2E6EC]">
                    <strong>Mitigation Action:</strong> {simulatedTwin.nugen_recommended_action}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Side-by-Side Stop Impact Timeline */}
          <div className="card-surface bg-white border border-[#E2E6EC] rounded-[4px] overflow-hidden">
            <div className="p-4 bg-[#F7F8FA] border-b border-[#E2E6EC] text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center justify-between">
              <span>Side-by-Side Stop Simulation Breakdown</span>
              <span className="text-[10px] text-[#5B7A99] font-normal">
                Actual Schedule vs. Weather Digital Twin
              </span>
            </div>

            <div className="divide-y divide-[#E2E6EC]">
              {simulatedTwin.simulated_stops.map((sim, idx) => (
                <div key={sim.stop_id} className="p-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-[#1B3A6B] text-white flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <h5 className="font-serif font-bold text-sm text-[#111827]">
                        {sim.title}
                      </h5>
                      <span className="card-tag px-2 py-0.5 bg-[#F0F4F8] text-[#1B3A6B] text-[10px] font-semibold">
                        {sim.category}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-[2px] font-semibold ${
                          sim.is_indoor
                            ? 'bg-[#F0FDF4] text-[#15803D]'
                            : 'bg-[#FEF2F2] text-[#DC2626]'
                        }`}
                      >
                        {sim.is_indoor ? 'Indoor Sheltered' : 'Outdoor Venue'}
                      </span>
                    </div>

                    <div className="text-xs">
                      <span className="text-[#6B7280]">Original: <strong>{sim.original_arrival_time}</strong></span>
                      <span className="mx-2 text-[#CBD5E1]">→</span>
                      <span className="text-[#DC2626] font-bold">
                        Simulated: {sim.simulated_arrival_time}{' '}
                        {sim.cumulative_delay_minutes > 0 ? `(+${sim.cumulative_delay_minutes}m)` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                    <div className="p-2 bg-[#F8FAFC] border border-[#E2E6EC] rounded-[2px]">
                      <div className="text-[10px] text-[#6B7280]">Outdoor Exposure Risk</div>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <div className="flex-1 bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              sim.exposure_risk_percentage > 50 ? 'bg-[#DC2626]' : 'bg-[#10B981]'
                            }`}
                            style={{ width: `${sim.exposure_risk_percentage}%` }}
                          />
                        </div>
                        <span className="font-bold text-[11px] text-[#111827]">
                          {sim.exposure_risk_percentage}%
                        </span>
                      </div>
                    </div>

                    <div className="p-2 bg-[#F8FAFC] border border-[#E2E6EC] rounded-[2px]">
                      <div className="text-[10px] text-[#6B7280]">Expected Demand Shift</div>
                      <div className="font-bold text-xs mt-0.5">
                        <span
                          className={
                            sim.expected_occupancy_shift_percentage > 0
                              ? 'text-[#15803D]'
                              : 'text-[#DC2626]'
                          }
                        >
                          {sim.expected_occupancy_shift_percentage > 0 ? '+' : ''}
                          {sim.expected_occupancy_shift_percentage}% Footfall
                        </span>
                      </div>
                    </div>

                    <div className="p-2 bg-[#F8FAFC] border border-[#E2E6EC] rounded-[2px]">
                      <div className="text-[10px] text-[#6B7280]">Confidence Band (Delay)</div>
                      <div className="font-bold text-xs text-[#111827] mt-0.5">
                        [+{sim.confidence_band.delay_min}m ... +{sim.confidence_band.delay_max}m]
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Live Social Weather Signals Feed */}
      <div className="card-surface bg-white border border-[#E2E6EC] rounded-[4px] p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#E2E6EC] pb-2">
          <div>
            <h4 className="font-serif font-bold text-sm text-[#111827]">
              Community Weather & Transit Signals Feed
            </h4>
            <p className="text-[11px] text-[#5B7A99]">
              Public community posts, waterlogging alerts, and local artisan advisories
            </p>
          </div>
          {isLoadingSocialSignals && (
            <span className="text-[11px] text-[#1B3A6B] animate-pulse">Syncing signals...</span>
          )}
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {socialSignals.length > 0 ? (
            socialSignals.map(sig => (
              <div
                key={sig.id}
                className="p-3 bg-[#F8FAFC] border border-[#E2E6EC] rounded-[3px] space-y-1"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center space-x-1.5 font-semibold text-[#111827]">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        sig.severity === 'critical'
                          ? 'bg-[#DC2626]'
                          : sig.severity === 'warning'
                          ? 'bg-[#D97706]'
                          : 'bg-[#15803D]'
                      }`}
                    />
                    <span>{sig.source}</span>
                    {sig.verified && (
                      <span className="text-[9px] bg-[#EBF5FF] text-[#1B3A6B] px-1 py-0.2 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                  <span className="text-[#9CA3AF] text-[10px]">{sig.timestamp}</span>
                </div>

                <div className="text-xs font-bold text-[#111827]">{sig.headline}</div>
                <p className="text-xs text-[#4B5563] leading-relaxed">{sig.body}</p>

                <div className="text-[10px] text-[#1B3A6B] bg-white p-1.5 rounded border border-[#E2E6EC]">
                  <strong>Traveler Impact:</strong> {sig.traveler_impact}
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-[#6B7280] py-3 text-center">
              Run a simulation to pull live weather community alerts for {currentCity.name}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
