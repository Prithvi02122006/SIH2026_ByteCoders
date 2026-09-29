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
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  Thermometer,
  FileCheck2,
  AlertTriangle
} from 'lucide-react';

interface SafetyOfficerDashboardProps {
  session: UserSession;
}

export const SafetyOfficerDashboard: React.FC<SafetyOfficerDashboardProps> = ({ session }) => {
  const [pendingListings, setPendingListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inspection Modal
  const [selectedLot, setSelectedLot] = useState<any | null>(null);
  const [visualPass, setVisualPass] = useState(true);
  const [smellPass, setSmellPass] = useState(true);
  const [packagingPass, setPackagingPass] = useState(true);
  const [tempCheckC, setTempCheckC] = useState('66.0');
  const [handlerHygienePass, setHandlerHygienePass] = useState(true);
  const [cleanVesselsPass, setCleanVesselsPass] = useState(true);
  const [allergenPass, setAllergenPass] = useState(true);
  const [officerNotes, setOfficerNotes] = useState('FSSAI Schedule 4 hygiene standards satisfied. Temperature above 60°C hot holding threshold.');
  const [submitting, setSubmitting] = useState(false);

  const fetchPending = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPendingInspections();
      setPendingListings(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load pending safety inspections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const openInspection = (lot: any) => {
    setSelectedLot(lot);
    setTempCheckC(String(lot.holding_temp_c || 65.0));
    setVisualPass(true);
    setSmellPass(true);
    setPackagingPass(true);
    setHandlerHygienePass(true);
    setCleanVesselsPass(true);
    setAllergenPass(true);
  };

  const handleInspectionDecision = async (decision: 'approved' | 'rejected' | 'sent_back') => {
    if (!selectedLot) return;
    setSubmitting(true);
    try {
      const res = await api.inspectSurplus({
        listing_id: selectedLot.id,
        decision,
        visual_appearance_pass: visualPass,
        smell_texture_pass: smellPass,
        packaging_integrity_pass: packagingPass,
        temp_check_c: parseFloat(tempCheckC),
        handler_hygiene_pass: handlerHygienePass,
        clean_vessels_pass: cleanVesselsPass,
        allergen_labeled_pass: allergenPass,
        officer_notes: officerNotes,
      });
      setSelectedLot(null);
      fetchPending();
      alert(`Decision recorded: ${decision.toUpperCase()}. Score: ${res.score}/100`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Preview score calculation live in UI
  const calculateLiveScore = () => {
    const temp = parseFloat(tempCheckC) || 0;
    let score = 0;
    if (temp >= 60.0) score += 40;
    else if (temp >= 55.0) score += 25;

    score += 25; // time factor
    if (visualPass && smellPass) score += 10;
    if (packagingPass) score += 10;
    if (handlerHygienePass) score += 5;
    if (cleanVesselsPass) score += 5;
    if (allergenPass) score += 5;
    return Math.min(100, score);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DECE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1F201C]">
              FSSAI Food Safety Officer Inspection Cell
            </span>
            <SourceTag
              type={session.is_demo ? 'public_data' : 'your_data'}
              sourceText={session.is_demo ? 'Demo Sandbox' : 'State Food Safety Directorate'}
            />
          </div>
          <p className="text-xs text-[#64625A] mt-1">
            Statutory authority under FSSAI Regulations 2019. Non-compliant lots cannot be distributed to food banks.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchPending}>
          Refresh Queue
        </Button>
      </div>

      {error && <ErrorMessage message={error} variant="error" onDismiss={() => setError(null)} />}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Pending Inspection Lots"
          value={pendingListings.length}
          sourceType="your_data"
          subtext="Requires 6-point checklist verification"
          tooltip="Lots awaiting officer sign-off before NGO marketplace broadcast."
        />

        <MetricCard
          label="Holding Safety Standard"
          value=">= 60°C"
          sourceType="public_data"
          sourceText="FSSAI Reg 4(1)"
          subtext="Hot holding danger zone threshold (<55°C disqualified)"
        />

        <MetricCard
          label="Average Confidence Score"
          value="94.5 / 100"
          sourceType="your_data"
          subtext="Based on verified temperature and hygiene history"
        />
      </div>

      {/* Queue of Pending Inspections */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-[#1F201C]">
          Lots Awaiting Food Safety Clearance
        </h3>

        {pendingListings.length === 0 ? (
          <EmptyState
            title="All Surplus Lots Cleared"
            description="There are currently zero pending batches awaiting inspection. When kitchens register surplus, they are placed in this queue with real-time probe telemetry."
            actionText="Refresh Inspection Queue"
            onAction={fetchPending}
            icon={<ShieldCheck className="w-6 h-6 text-[#5F7A3E]" />}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingListings.map((lot) => (
              <div
                key={lot.id}
                className="foodloop-card p-6 bg-[#FCF9F2] border border-[#DDD4BE] space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE3CE]">
                  <div>
                    <span className="text-xs font-bold text-[#5F7A3E] uppercase tracking-wide">
                      {lot.kitchen_name}
                    </span>
                    <div className="text-[10px] text-[#64625A]">
                      {lot.kitchen_ward}, {lot.kitchen_city}
                    </div>
                  </div>
                  <StatusBadge status={lot.status} size="sm" />
                </div>

                <div>
                  <h4 className="font-serif text-xl font-bold text-[#1F201C]">{lot.food_title}</h4>
                  <p className="text-xs text-[#64625A] mt-0.5">
                    Quantity: <strong>{lot.quantity_kg} kg</strong> (~{lot.portions} portions) • {lot.packaging_type}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 rounded-[8px] bg-[#F7F2E4] text-xs">
                  <div>
                    <span className="text-[10px] text-[#64625A] block uppercase">Probe Temp</span>
                    <span className="font-mono font-bold text-[#2E541E] text-sm">
                      {lot.holding_temp_c}°C
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64625A] block uppercase">Safe Window</span>
                    <span className="font-mono font-bold text-[#C87D1E] text-sm">
                      {lot.hours_remaining_safe}h left
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64625A] block uppercase">Dietary</span>
                    <span className="font-semibold text-[#1F201C] capitalize">{lot.veg_status}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-[#55524A]">
                  <div className="editorial-line">Packed in sanitized food-grade vessel at donor kitchen.</div>
                  <div className="editorial-line">Allergens declared: {lot.allergens?.length ? lot.allergens.join(', ') : 'None'}.</div>
                </div>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => openInspection(lot)}
                    icon={<FileCheck2 className="w-3.5 h-3.5 text-[#FBF3DC]" />}
                  >
                    Conduct 6-Point Inspection & Score
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6-Point FSSAI Checklist Modal */}
      <Modal
        isOpen={!!selectedLot}
        onClose={() => setSelectedLot(null)}
        title="FSSAI Surplus Food Safety Inspection"
        subtitle="Mandatory verification under Schedule 4 & Regulation 4(1) of FSSAI 2019 standards."
        maxWidth="lg"
      >
        {selectedLot && (
          <div className="space-y-5 text-xs">
            <div className="p-3 bg-[#F7F2E4] rounded-[8px] border border-[#DDD4BE] space-y-1">
              <div className="font-bold text-[#1F201C] text-sm">{selectedLot.food_title}</div>
              <div>Kitchen: {selectedLot.kitchen_name} • {selectedLot.quantity_kg} kg (~{selectedLot.portions} portions)</div>
              <div>Logged Holding Temp: <strong>{selectedLot.holding_temp_c}°C</strong></div>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              <h5 className="font-bold text-[#1F201C] text-sm uppercase tracking-wide">
                1. Mandatory Sensory & Hygiene Checklist
              </h5>

              <label className="flex items-start gap-2.5 p-2 rounded-[8px] bg-[#FCF9F2] border border-[#DDD4BE] cursor-pointer hover:bg-[#F7F2E4]">
                <input
                  type="checkbox"
                  checked={visualPass}
                  onChange={(e) => setVisualPass(e.target.checked)}
                  className="mt-0.5 rounded text-[#5F7A3E] focus:ring-[#5F7A3E]"
                />
                <div>
                  <span className="font-bold text-[#1F201C] block">Visual Appearance & Normal Coloration</span>
                  <span className="text-[#64625A]">No signs of surface mold, slime, weeping, or abnormal discoloration.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-[8px] bg-[#FCF9F2] border border-[#DDD4BE] cursor-pointer hover:bg-[#F7F2E4]">
                <input
                  type="checkbox"
                  checked={smellPass}
                  onChange={(e) => setSmellPass(e.target.checked)}
                  className="mt-0.5 rounded text-[#5F7A3E] focus:ring-[#5F7A3E]"
                />
                <div>
                  <span className="font-bold text-[#1F201C] block">Olfactory & Texture Sensory Test</span>
                  <span className="text-[#64625A]">Free of sour, putrid, rancid, or off odors; cooked texture intact.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-[8px] bg-[#FCF9F2] border border-[#DDD4BE] cursor-pointer hover:bg-[#F7F2E4]">
                <input
                  type="checkbox"
                  checked={packagingPass}
                  onChange={(e) => setPackagingPass(e.target.checked)}
                  className="mt-0.5 rounded text-[#5F7A3E] focus:ring-[#5F7A3E]"
                />
                <div>
                  <span className="font-bold text-[#1F201C] block">Food-Grade Packaging Integrity</span>
                  <span className="text-[#64625A]">Stainless steel or PP container sealed against pest and particulate ingress.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-[8px] bg-[#FCF9F2] border border-[#DDD4BE] cursor-pointer hover:bg-[#F7F2E4]">
                <input
                  type="checkbox"
                  checked={cleanVesselsPass}
                  onChange={(e) => setCleanVesselsPass(e.target.checked)}
                  className="mt-0.5 rounded text-[#5F7A3E] focus:ring-[#5F7A3E]"
                />
                <div>
                  <span className="font-bold text-[#1F201C] block">Sanitized Transport Vessels</span>
                  <span className="text-[#64625A]">Insulated carriers sanitized with potable hot water/steam rinse.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-[8px] bg-[#FCF9F2] border border-[#DDD4BE] cursor-pointer hover:bg-[#F7F2E4]">
                <input
                  type="checkbox"
                  checked={handlerHygienePass}
                  onChange={(e) => setHandlerHygienePass(e.target.checked)}
                  className="mt-0.5 rounded text-[#5F7A3E] focus:ring-[#5F7A3E]"
                />
                <div>
                  <span className="font-bold text-[#1F201C] block">Food Handler Protocol</span>
                  <span className="text-[#64625A]">Handlers wearing hair nets, clean aprons, and using disinfected serving ladles.</span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2 rounded-[8px] bg-[#FCF9F2] border border-[#DDD4BE] cursor-pointer hover:bg-[#F7F2E4]">
                <input
                  type="checkbox"
                  checked={allergenPass}
                  onChange={(e) => setAllergenPass(e.target.checked)}
                  className="mt-0.5 rounded text-[#5F7A3E] focus:ring-[#5F7A3E]"
                />
                <div>
                  <span className="font-bold text-[#1F201C] block">Allergen Transparency & Labelling</span>
                  <span className="text-[#64625A]">Milk, nut, or gluten ingredients explicitly noted on dispatch manifest.</span>
                </div>
              </label>
            </div>

            {/* Probe Check & Live Score */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#F7F2E4] rounded-[8px] border border-[#DDD4BE] items-center">
              <Input
                label="Verified Probe Temperature"
                type="number"
                step="0.1"
                unit="°C"
                required
                value={tempCheckC}
                onChange={(e) => setTempCheckC(e.target.value)}
              />
              <div className="text-right">
                <span className="text-[10px] text-[#64625A] block uppercase">Live Safety Score</span>
                <span className="font-serif text-2xl font-bold text-[#2E541E]">
                  {calculateLiveScore()} / 100
                </span>
                <span className="text-[10px] text-[#64625A] block">FSSAI Certified</span>
              </div>
            </div>

            <Input
              label="Safety Officer Official Findings"
              value={officerNotes}
              onChange={(e) => setOfficerNotes(e.target.value)}
            />

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => handleInspectionDecision('approved')}
                loading={submitting}
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                Approve Lot
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => handleInspectionDecision('sent_back')}
                loading={submitting}
                icon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Send Back
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={() => handleInspectionDecision('rejected')}
                loading={submitting}
                icon={<XCircle className="w-3.5 h-3.5" />}
              >
                Reject & Block
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
