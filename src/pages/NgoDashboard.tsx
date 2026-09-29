import React, { useState, useEffect } from 'react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { MetricCard } from '../components/common/MetricCard';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { StatusBadge } from '../components/common/StatusBadge';
import { SourceTag } from '../components/common/SourceTag';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { api, UserSession } from '../services/api';
import {
  Building2,
  MapPin,
  Clock,
  Thermometer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Truck,
  Users,
  Utensils
} from 'lucide-react';

interface NgoDashboardProps {
  session: UserSession;
}

export const NgoDashboard: React.FC<NgoDashboardProps> = ({ session }) => {
  const [availableListings, setAvailableListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Claim modal
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [beneficiariesExpected, setBeneficiariesExpected] = useState('80');
  const [claiming, setClaiming] = useState(false);

  const fetchAvailable = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAvailableSurplus();
      setAvailableListings(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load available surplus listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailable();
  }, []);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;
    setClaiming(true);
    try {
      const res = await api.claimSurplus({
        listing_id: selectedListing.id,
        beneficiaries_expected: parseInt(beneficiariesExpected) || 50,
      });
      setSelectedListing(null);
      fetchAvailable();
      alert(`Success: ${res.message}. Driver partner: ${res.driver_assigned}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setClaiming(false);
    }
  };

  const totalAvailableKg = availableListings.reduce((acc, l) => acc + (l.quantity_kg || 0), 0);
  const totalPortions = availableListings.reduce((acc, l) => acc + (l.portions || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DECE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1F201C]">
              {session.organization_name || 'NGO Surplus Recovery Center'}
            </span>
            <SourceTag
              type={session.is_demo ? 'public_data' : 'your_data'}
              sourceText={session.is_demo ? 'Demo Sandbox' : 'Verified NGO Registration'}
            />
          </div>
          <p className="text-xs text-[#64625A] mt-1">
            FSSAI Rule: Only certified, temperature-compliant lots appear. Expired or uninspected food is never visible.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchAvailable}>
            Refresh Listings
          </Button>
        </div>
      </div>

      {error && <ErrorMessage message={error} variant="error" onDismiss={() => setError(null)} />}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Available Vetted Food"
          value={`${totalAvailableKg.toFixed(1)} kg`}
          unit={`(~${totalPortions} meals)`}
          sourceType="your_data"
          subtext="Approved by FSSAI Food Safety Officers"
          tooltip="Sum of all currently active batches within safe consumption windows."
        />

        <MetricCard
          label="NGO Storage Capacity"
          value="600 kg"
          unit="(Cold + Dry)"
          sourceType="your_data"
          subtext="Reheating & thermal transit certified"
        />

        <MetricCard
          label="Active Distribution Radius"
          value="8.5 km"
          sourceType="public_data"
          sourceText="OSRM Routing"
          subtext="Under 45-minute thermal transit threshold"
        />
      </div>

      {/* Available Surplus Listings Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-[#1F201C]">
            Nearby Vetted Surplus Batches Ready for Claim
          </h3>
          <span className="text-xs text-[#64625A]">
            Showing {availableListings.length} safety-cleared lot(s)
          </span>
        </div>

        {availableListings.length === 0 ? (
          <EmptyState
            title="No Vetted Surplus Available Right Now"
            description="All active dining halls are currently in service or have had their safe lots claimed. As soon as a kitchen logs surplus and the Food Safety Officer approves it, it will appear here instantly."
            actionText="Refresh Marketplace"
            onAction={fetchAvailable}
            icon={<Building2 className="w-6 h-6 text-[#5F7A3E]" />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableListings.map((item) => (
              <div
                key={item.id}
                className="foodloop-card p-5 bg-[#FCF9F2] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#5F7A3E] uppercase tracking-wide">
                      {item.kitchen_name}
                    </span>
                    <StatusBadge status={item.veg_status} size="sm" />
                  </div>

                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#1F201C]">
                      {item.food_title}
                    </h4>
                    <p className="text-xs text-[#64625A] flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#5F7A3E] shrink-0" />
                      <span>{item.pickup_address}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-[8px] bg-[#F7F2E4] text-xs">
                    <div>
                      <span className="text-[10px] text-[#64625A] block uppercase">Weight</span>
                      <span className="font-mono font-bold text-sm text-[#1F201C]">
                        {item.quantity_kg} kg
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64625A] block uppercase">Portions</span>
                      <span className="font-mono font-bold text-sm text-[#1F201C]">
                        ~{item.portions} meals
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64625A] block uppercase">Holding Temp</span>
                      <span className="font-mono font-semibold text-[#2E541E]">
                        {item.holding_temp_c}°C
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#64625A] block uppercase">Safe Window</span>
                      <span className="font-mono font-semibold text-[#C87D1E]">
                        {item.hours_remaining_safe}h remaining
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-[#55524A]">
                    <div className="editorial-line">
                      Safety Confidence Score: <strong>{item.food_safety_score} / 100</strong>
                    </div>
                    <div className="editorial-line">
                      Packaging: <span className="capitalize">{item.packaging_type.replace(/_/g, ' ')}</span>
                    </div>
                    {item.allergens && item.allergens.length > 0 && (
                      <div className="editorial-line text-[#8F5912]">
                        Allergens disclosed: {item.allergens.join(', ')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedListing(item)}
                    icon={<CheckCircle2 className="w-3.5 h-3.5 text-[#FBF3DC]" />}
                  >
                    Claim & Request Delivery Driver
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Claim Confirmation Modal */}
      <Modal
        isOpen={!!selectedListing}
        onClose={() => setSelectedListing(null)}
        title="Confirm Surplus Claim & Delivery Dispatch"
        subtitle="Verifies capacity and triggers automated driver pickup assignment."
        maxWidth="md"
      >
        {selectedListing && (
          <form onSubmit={handleClaim} className="space-y-4">
            <div className="p-3 bg-[#F7F2E4] rounded-[8px] text-xs space-y-1.5 border border-[#DDD4BE]">
              <div className="font-bold text-[#1F201C]">{selectedListing.food_title}</div>
              <div>Donor: {selectedListing.kitchen_name}</div>
              <div>Quantity: {selectedListing.quantity_kg} kg (~{selectedListing.portions} portions)</div>
              <div>Pickup Gate: {selectedListing.pickup_address}</div>
            </div>

            <Input
              label="Estimated Beneficiaries to Feed"
              type="number"
              required
              helperText="Helps update impact metrics (children, shelter residents, senior citizens)."
              value={beneficiariesExpected}
              onChange={(e) => setBeneficiariesExpected(e.target.value)}
            />

            <div className="text-xs text-[#64625A] space-y-1">
              <div className="editorial-line">Upon confirmation, the nearest available thermal delivery driver will be assigned.</div>
              <div className="editorial-line">Driver verifies pickup via OTP/QR handshake with kitchen staff.</div>
              <div className="editorial-line">Beneficiary confirmation receipt recorded upon shelter delivery.</div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              loading={claiming}
            >
              Confirm Claim & Dispatch Partner
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
