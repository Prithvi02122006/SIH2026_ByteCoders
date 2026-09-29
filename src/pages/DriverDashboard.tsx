import React, { useState, useEffect } from 'react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { StatusBadge } from '../components/common/StatusBadge';
import { SourceTag } from '../components/common/SourceTag';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { api, UserSession } from '../services/api';
import {
  Truck,
  MapPin,
  Clock,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Navigation,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface DriverDashboardProps {
  session: UserSession;
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({ session }) => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verification Modals
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [verifyType, setVerifyType] = useState<'pickup' | 'dropoff' | 'escalate' | null>(null);

  const [otpInput, setOtpInput] = useState('');
  const [beneficiaryInput, setBeneficiaryInput] = useState('65');
  const [escalateReason, setEscalateReason] = useState('Thermal box failure / Vehicle puncture');
  const [submitting, setSubmitting] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDriverJobs();
      setJobs(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch assigned delivery jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleVerifyPickup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    setSubmitting(true);
    try {
      await api.verifyPickup({
        listing_id: selectedJob.listing_id,
        qr_token: selectedJob.qr_token || '',
        otp_code: otpInput,
      });
      setVerifyType(null);
      setSelectedJob(null);
      fetchJobs();
      alert('Pickup verified! Thermal chain custody transferred to you.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyDropoff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    setSubmitting(true);
    try {
      await api.verifyDropoff({
        listing_id: selectedJob.listing_id,
        beneficiary_count: parseInt(beneficiaryInput) || 50,
      });
      setVerifyType(null);
      setSelectedJob(null);
      fetchJobs();
      alert('Dropoff verified! Wholesome meals distributed successfully.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEscalate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    setSubmitting(true);
    try {
      await api.escalateJob({
        listing_id: selectedJob.listing_id,
        reason: escalateReason,
      });
      setVerifyType(null);
      setSelectedJob(null);
      fetchJobs();
      alert('Escalation recorded. Operations cell and Safety Officer notified.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5DECE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1F201C]">
              Delivery Logistics & Custody Handshake
            </span>
            <SourceTag
              type={session.is_demo ? 'public_data' : 'your_data'}
              sourceText={session.is_demo ? 'Demo Sandbox' : 'Assigned Driver View'}
            />
          </div>
          <p className="text-xs text-[#64625A] mt-1">
            Privacy Protected: You see strictly your assigned runs. Personal donor numbers and individual beneficiary identities are shielded.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchJobs}>
          Refresh Runs
        </Button>
      </div>

      {error && <ErrorMessage message={error} variant="error" onDismiss={() => setError(null)} />}

      {/* Assigned Runs List */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-[#1F201C]">Active Assigned Jobs</h3>

        {jobs.length === 0 ? (
          <EmptyState
            title="No Active Delivery Runs Assigned"
            description="You will automatically receive high-priority route dispatches when nearby verified NGOs claim food batches."
            actionText="Check for New Jobs"
            onAction={fetchJobs}
            icon={<Truck className="w-6 h-6 text-[#5F7A3E]" />}
          />
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job.run_id}
                className="foodloop-card p-6 bg-[#FCF9F2] border border-[#DDD4BE] space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EAE3CE]">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={job.status} />
                    <span className="font-mono text-xs text-[#64625A]">
                      Batch #{job.listing_id}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#64625A]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#5F7A3E]" />
                      <span>Deliver within safe window</span>
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-serif text-2xl font-bold text-[#1F201C]">
                    {job.food_title}
                  </h4>
                  <p className="text-xs text-[#64625A] mt-0.5">
                    Payload: <strong>{job.quantity_kg} kg</strong> (~{job.portions} wholesome portions)
                  </p>
                </div>

                {/* Route Leg Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-[10px] bg-[#F7F2E4] border border-[#E5DECE] text-xs">
                  {/* Pickup Leg */}
                  <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-[#DDD4BE] pb-3 md:pb-0 md:pr-4">
                    <div className="flex items-center gap-1.5 font-bold text-[#2D431E] uppercase text-[10px]">
                      <MapPin className="w-3.5 h-3.5 text-[#5F7A3E]" />
                      <span>1. Kitchen Pickup Location</span>
                    </div>
                    <div className="text-sm font-semibold text-[#1F201C]">{job.pickup_address}</div>
                    <div className="text-[#64625A]">
                      Status: {job.pickup_verified ? 'Verified with Kitchen Staff' : 'Pending Physical Handshake'}
                    </div>
                    {!job.pickup_verified && (
                      <div className="pt-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedJob(job);
                            setVerifyType('pickup');
                          }}
                          icon={<QrCode className="w-3.5 h-3.5" />}
                        >
                          Scan QR / Enter Pickup OTP ({job.otp_code})
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Dropoff Leg */}
                  <div className="space-y-1.5 md:pl-2">
                    <div className="flex items-center gap-1.5 font-bold text-[#2D431E] uppercase text-[10px]">
                      <Navigation className="w-3.5 h-3.5 text-[#5F7A3E]" />
                      <span>2. NGO Distribution Center</span>
                    </div>
                    <div className="text-sm font-semibold text-[#1F201C]">{job.dropoff_org}</div>
                    <div className="text-[#64625A]">
                      {job.dropoff_ward}, {job.dropoff_city}
                    </div>
                    {job.pickup_verified && !job.dropoff_verified && (
                      <div className="pt-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setSelectedJob(job);
                            setVerifyType('dropoff');
                          }}
                          icon={<CheckCircle2 className="w-3.5 h-3.5 text-[#FBF3DC]" />}
                        >
                          Confirm Shelter Dropoff
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Handling Rules & Escalation Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 text-xs">
                  <div className="text-[#55524A] flex items-center gap-2">
                    <span className="font-semibold text-[#2D431E]">FSSAI Handling:</span>
                    <span>{job.handling_notes}</span>
                  </div>

                  {job.status !== 'delivered' && job.status !== 'escalated' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#A83232] hover:bg-[#FDF2F2]"
                      onClick={() => {
                        setSelectedJob(job);
                        setVerifyType('escalate');
                      }}
                      icon={<ShieldAlert className="w-3.5 h-3.5" />}
                    >
                      Report Escalation / Road Issue
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pickup Verification Modal */}
      <Modal
        isOpen={verifyType === 'pickup'}
        onClose={() => setVerifyType(null)}
        title="Kitchen Pickup Handshake"
        subtitle="Match the 4-digit OTP provided by the kitchen manager to verify hot/cold chain custody transfer."
        maxWidth="md"
      >
        {selectedJob && (
          <form onSubmit={handleVerifyPickup} className="space-y-4">
            <div className="p-3 bg-[#F7F2E4] rounded-[8px] text-xs space-y-1 border border-[#DDD4BE]">
              <div>Lot: <strong>{selectedJob.food_title}</strong></div>
              <div>Weight: {selectedJob.quantity_kg} kg</div>
              <div>Assigned QR Token: <code>{selectedJob.qr_token}</code></div>
              <div>Target Handshake OTP: <strong>{selectedJob.otp_code}</strong></div>
            </div>

            <Input
              label="Enter 4-Digit Pickup OTP"
              required
              placeholder="e.g. 4892"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              loading={submitting}
            >
              Confirm Custody Transfer
            </Button>
          </form>
        )}
      </Modal>

      {/* Dropoff Verification Modal */}
      <Modal
        isOpen={verifyType === 'dropoff'}
        onClose={() => setVerifyType(null)}
        title="Shelter Handover & Beneficiary Count"
        subtitle="Confirm safe delivery to the NGO feeding center and record meal recipients."
        maxWidth="md"
      >
        {selectedJob && (
          <form onSubmit={handleVerifyDropoff} className="space-y-4">
            <div className="p-3 bg-[#F7F2E4] rounded-[8px] text-xs space-y-1 border border-[#DDD4BE]">
              <div>Receiving NGO: <strong>{selectedJob.dropoff_org}</strong></div>
              <div>Delivered Food: {selectedJob.food_title} ({selectedJob.quantity_kg} kg)</div>
            </div>

            <Input
              label="Beneficiaries Served"
              type="number"
              required
              helperText="Count of individuals nourished by this recovered batch."
              value={beneficiaryInput}
              onChange={(e) => setBeneficiaryInput(e.target.value)}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              loading={submitting}
            >
              Complete Run & Update ESG Audit
            </Button>
          </form>
        )}
      </Modal>

      {/* Escalation Modal */}
      <Modal
        isOpen={verifyType === 'escalate'}
        onClose={() => setVerifyType(null)}
        title="Escalate Transit Disruption"
        subtitle="Triggers emergency reallocation if vehicle breakdown, severe traffic, or thermal compromise occurs."
        maxWidth="md"
      >
        {selectedJob && (
          <form onSubmit={handleEscalate} className="space-y-4">
            <Input
              label="Reason for Escalation"
              required
              value={escalateReason}
              onChange={(e) => setEscalateReason(e.target.value)}
            />

            <Button
              type="submit"
              variant="danger"
              size="md"
              className="w-full"
              loading={submitting}
            >
              Submit Transit Escalation
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
