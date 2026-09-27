import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Itinerary, ItineraryStop, DigitalTwinSimulationResult, WeatherData } from '../../types';
import { useApp } from '../../context/AppContext';
import { MapSkeleton } from '../common/SkeletonLoaders';

interface DynamicMapViewProps {
  itinerary: Itinerary | null;
  isLoading: boolean;
  onSelectStop?: (stop: ItineraryStop) => void;
  isPickerMode?: boolean;
  onPickCoordinates?: (coords: { lat: number; lng: number }) => void;
  pickedCoordinates?: { lat: number; lng: number } | null;
  simulatedTwin?: DigitalTwinSimulationResult | null;
  weatherData?: WeatherData | null;
}

export const DynamicMapView: React.FC<DynamicMapViewProps> = ({
  itinerary,
  isLoading,
  onSelectStop,
  isPickerMode = false,
  onPickCoordinates,
  pickedCoordinates,
  simulatedTwin: propSimulatedTwin,
  weatherData: propWeatherData
}) => {
  const { simulatedTwin: contextTwin, weatherData: contextWeather } = useApp();
  const simulatedTwin = propSimulatedTwin !== undefined ? propSimulatedTwin : contextTwin;
  const weatherData = propWeatherData !== undefined ? propWeatherData : contextWeather;
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const animatedMarkerRef = useRef<L.Marker | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const [isTraveling, setIsTraveling] = useState<boolean>(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = pickedCoordinates?.lat || itinerary?.start_location.lat || 28.6506;
      const initialLng = pickedCoordinates?.lng || itinerary?.start_location.lng || 77.2303;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: false
      });

      L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19
        }
      ).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;

      // Picker mode click handler for vendors
      if (isPickerMode && onPickCoordinates) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          onPickCoordinates({ lat: Math.round(e.latlng.lat * 10000) / 10000, lng: Math.round(e.latlng.lng * 10000) / 10000 });
        });
      }
    }

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update map contents
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // clearLayers() detaches any in-flight animated travel marker from the
    // map, so drop our stale reference and stop the animation loop too —
    // otherwise the next "Simulate Route Travel" click sees a non-null ref
    // and tries to move a marker that's no longer attached to anything.
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    animatedMarkerRef.current = null;
    setIsTraveling(false);

    // Mode 1: Vendor Point Picker Mode
    if (isPickerMode) {
      if (pickedCoordinates) {
        const pinIcon = L.divIcon({
          className: 'custom-map-pin',
          html: '<span>*</span>',
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });
        L.marker([pickedCoordinates.lat, pickedCoordinates.lng], { icon: pinIcon })
          .addTo(layerGroup)
          .bindPopup('Your Selected Business Location');
        map.panTo([pickedCoordinates.lat, pickedCoordinates.lng]);
      }
      return;
    }

    // Mode 2: Dynamic Itinerary Mode
    if (!itinerary || itinerary.stops.length === 0) return;

    const bounds = L.latLngBounds([]);

    // Add Start Location Marker
    const startCoord = [itinerary.start_location.lat, itinerary.start_location.lng] as [number, number];
    bounds.extend(startCoord);

    const startIcon = L.divIcon({
      className: 'custom-map-pin hotel-pin',
      html: '<span>H</span>',
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });

    const startMarker = L.marker(startCoord, { icon: startIcon }).addTo(layerGroup);
    startMarker.bindPopup(`
      <div style="font-family: 'IBM Plex Sans', sans-serif; font-size: 12px; padding: 2px;">
        <div style="font-weight: 700; color: #111827;">Starting Hub Anchor</div>
        <div style="color: #6B7280; font-size: 11px;">${itinerary.start_location.name}</div>
        <div style="color: #1B3A6B; font-weight: 600; margin-top: 4px;">Depart: ${itinerary.start_time}</div>
      </div>
    `);

    const polylineCoords: [number, number][] = [startCoord];

    // Add Itinerary Stops (Ordered nearest-to-farthest)
    itinerary.stops.forEach((stop, index) => {
      const stopCoord = [stop.geolocation.lat, stop.geolocation.lng] as [number, number];
      bounds.extend(stopCoord);
      polylineCoords.push(stopCoord);

      const isCompleted = Boolean(stop.completed);
      const simImpact = simulatedTwin?.simulated_stops.find(s => s.stop_id === stop.id);

      // Render Digital Twin Weather Impact Circle
      if (simImpact) {
        const circleColor =
          simImpact.status === 'critical' ? '#DC2626' :
          simImpact.status === 'delayed' ? '#D97706' :
          simImpact.is_indoor ? '#059669' : '#3B82F6';

        L.circle(stopCoord, {
          radius: 130,
          color: circleColor,
          fillColor: circleColor,
          fillOpacity: 0.22,
          weight: 2
        }).addTo(layerGroup);
      }

      const markerColorClass = simImpact
        ? (simImpact.status === 'critical' ? 'bg-[#DC2626]' : simImpact.status === 'delayed' ? 'bg-[#D97706]' : 'bg-[#059669]')
        : (isCompleted ? 'bg-[#15803D]' : 'bg-[#1B3A6B]');

      const stopIcon = L.divIcon({
        className: `custom-map-pin ${markerColorClass}`,
        html: `<span>${index + 1}</span>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker(stopCoord, { icon: stopIcon }).addTo(layerGroup);

      marker.bindPopup(`
        <div style="font-family: 'IBM Plex Sans', sans-serif; font-size: 12px; max-width: 240px; padding: 2px;">
          <div style="font-weight: 700; color: #111827; font-size: 13px;">
            #${index + 1} ${stop.title}
          </div>
          <div style="color: #5B7A99; font-size: 11px; margin-top: 2px;">
            ${stop.neighborhood} • ${stop.distance_from_start_km || 0} km from start
          </div>
          <div style="margin-top: 4px; display: flex; justify-content: space-between; font-size: 11px;">
            <span>Arrival: <strong>${stop.arrival_time}</strong></span>
            <span>Fee: <strong>${stop.price_per_head === 0 ? 'Free' : `₹${stop.price_per_head}`}</strong></span>
          </div>
          ${
            stop.step_free
              ? '<div style="color: #15803D; font-size: 10px; margin-top: 4px;">Verified Step-Free</div>'
              : ''
          }
          ${
            isCompleted
              ? '<div style="color: #15803D; font-weight: bold; font-size: 10px; margin-top: 4px;">Completed</div>'
              : ''
          }
          ${
            simImpact
              ? `
              <div style="margin-top: 6px; padding: 6px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 3px;">
                <div style="font-size: 10px; font-weight: 700; color: #1B3A6B; text-transform: uppercase; letter-spacing: 0.5px;">
                  Weather Twin Impact
                </div>
                <div style="font-size: 11px; margin-top: 2px;">
                  Arrival: <s>${stop.arrival_time}</s> -> <strong style="color: #B45309;">${simImpact.simulated_arrival_time}</strong> (+${simImpact.cumulative_delay_minutes}m)
                </div>
                <div style="font-size: 10px; margin-top: 2px; display: flex; justify-content: space-between;">
                  <span>Exposure: <strong style="color: ${simImpact.exposure_risk_percentage > 50 ? '#DC2626' : '#059669'};">${simImpact.exposure_risk_percentage}%</strong></span>
                  <span>Footfall: <strong style="color: ${simImpact.expected_occupancy_shift_percentage > 0 ? '#059669' : '#DC2626'};">${simImpact.expected_occupancy_shift_percentage > 0 ? '+' : ''}${simImpact.expected_occupancy_shift_percentage}%</strong></span>
                </div>
                <div style="font-size: 10px; color: #6B7280; margin-top: 2px;">
                  Vendor Risk: <strong>${simImpact.vendor_availability_risk}</strong>
                </div>
              </div>
              `
              : ''
          }
        </div>
      `);

      if (onSelectStop) {
        marker.on('click', () => onSelectStop(stop));
      }
    });

    // Draw Route Polylines with Weather Delay styling
    if (polylineCoords.length > 1) {
      const isSevereRainDelay = Boolean(simulatedTwin && simulatedTwin.total_delay_minutes > 15);
      const polyline = L.polyline(polylineCoords, {
        color: isSevereRainDelay ? '#DC2626' : '#1B3A6B',
        weight: isSevereRainDelay ? 4 : 3.5,
        opacity: 0.85,
        dashArray: isSevereRainDelay ? '6, 8' : (itinerary.transport_preference === 'walking' ? '4, 8' : undefined)
      }).addTo(layerGroup);

      if (isSevereRainDelay) {
        polyline.bindTooltip(
          `Weather Transit Penalty: +${simulatedTwin!.total_delay_minutes}m cumulative lag`,
          { sticky: true, className: 'bg-white text-xs font-semibold px-2 py-1 shadow' }
        );
      }
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 16 });
    }
  }, [itinerary, isPickerMode, pickedCoordinates, onSelectStop, simulatedTwin]);

  /**
   * Part D.7: Animated map vehicle travel along polyline coordinates
   */
  const triggerTravelAnimation = () => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup || !itinerary || itinerary.stops.length === 0) return;

    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }

    setIsTraveling(true);

    const coords: [number, number][] = [
      [itinerary.start_location.lat, itinerary.start_location.lng],
      ...itinerary.stops.map(s => [s.geolocation.lat, s.geolocation.lng] as [number, number])
    ];

    if (!animatedMarkerRef.current) {
      const transitIcon = L.divIcon({
        className: 'custom-map-pin',
        html: '<span style="font-size:11px;">-></span>',
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });
      animatedMarkerRef.current = L.marker(coords[0], { icon: transitIcon }).addTo(layerGroup);
    }

    let legIndex = 0;
    let progress = 0;
    const speed = 0.015;

    const animateStep = () => {
      if (legIndex >= coords.length - 1) {
        setIsTraveling(false);
        return;
      }

      const p1 = coords[legIndex];
      const p2 = coords[legIndex + 1];

      const lat = p1[0] + (p2[0] - p1[0]) * progress;
      const lng = p1[1] + (p2[1] - p1[1]) * progress;

      if (animatedMarkerRef.current) {
        animatedMarkerRef.current.setLatLng([lat, lng]);
      }

      progress += speed;
      if (progress >= 1) {
        progress = 0;
        legIndex++;
      }

      animationFrameIdRef.current = requestAnimationFrame(animateStep);
    };

    animationFrameIdRef.current = requestAnimationFrame(animateStep);
  };

  if (isLoading) {
    return <MapSkeleton />;
  }

  return (
    <div className="card-surface bg-white border border-[#E2E6EC] rounded-[4px] overflow-hidden flex flex-col h-full min-h-[460px]">
      <div className="px-4 py-2.5 bg-[#F7F8FA] border-b border-[#E2E6EC] flex items-center justify-between text-xs text-[#5B7A99]">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#15803D]" />
          <span className="font-semibold text-[#111827]">
            {isPickerMode ? 'Click Map to Place Business Pin' : 'Cartographic Route Visualizer'}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          {simulatedTwin ? (
            <span className="px-2 py-0.5 bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] rounded-[2px] font-semibold text-[11px] flex items-center space-x-1">
              <span>🌧️ Digital Twin Active (+{simulatedTwin.total_delay_minutes}m)</span>
            </span>
          ) : weatherData ? (
            <span className="px-2 py-0.5 bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7] rounded-[2px] font-medium text-[11px] hidden sm:inline-block">
              ⛅ {weatherData.city_name}: {weatherData.current.temperature_c}°C {weatherData.current.weather_description}
            </span>
          ) : null}

          {!isPickerMode && itinerary && itinerary.stops.length > 1 && (
            <button
              onClick={triggerTravelAnimation}
              disabled={isTraveling}
              className="text-[#1B3A6B] font-semibold hover:underline disabled:opacity-50"
            >
              {isTraveling ? 'Traveling Route...' : 'Simulate Route Travel'}
            </button>
          )}
          <span>{itinerary?.stops.length || 0} Scheduled Stops</span>
        </div>
      </div>
      <div ref={mapContainerRef} className="w-full flex-1 min-h-[420px]" />
    </div>
  );
};
