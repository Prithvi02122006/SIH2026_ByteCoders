import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { SourceTag } from '../components/common/SourceTag';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { api, UserSession } from '../services/api';
import {
  Settings,
  Download,
  Trash2,
  KeyRound,
  Shield,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface SettingsPageProps {
  session: UserSession;
  onLogout: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ session, onLogout }) => {
  const [consentInsights, setConsentInsights] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sensorKeyName, setSensorKeyName] = useState('Kitchen Steam Table Probe #1');
  const [generatedKey, setGeneratedKey] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleExportData = () => {
    window.open('/api/data/export', '_blank');
  };

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.generateSensorKey(sensorKeyName);
      setGeneratedKey(res);
      setMessage('Sensor API Key successfully generated. Keep it safe.');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await api.deleteAccount();
      alert('Your account and all associated kitchen logs have been permanently deleted.');
      onLogout();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-[#E5DECE] pb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#5F7A3E]" />
          <h1 className="font-serif text-3xl font-bold text-[#1F201C]">
            Account Settings & Data Privacy
          </h1>
        </div>
        <p className="text-xs text-[#64625A] mt-1">
          Manage your enterprise data rights, export registers, configure hardware IoT telemetry, and research consent.
        </p>
      </div>

      {message && (
        <div className="p-3 bg-[#EBF3E4] border border-[#CFDFBF] text-[#2E541E] rounded-[8px] text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#48782D]" />
          <span>{message}</span>
        </div>
      )}

      {/* 1. Data Export Section */}
      <div className="foodloop-card p-6 bg-[#FCF9F2] space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1F201C]">
              Export All Personal & Kitchen Data (CSV)
            </h3>
            <p className="text-xs text-[#64625A] mt-1 max-w-xl">
              Under our transparent data policy, you can download a complete CSV copy of your profile, daily logs, dish quantities, and surplus donation records at any time.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export Complete CSV
          </Button>
        </div>
      </div>

      {/* 2. Research Consent for Insights Lab */}
      <div className="foodloop-card p-6 bg-[#FCF9F2] space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1F201C]">
              Insights Lab Aggregation Consent
            </h3>
            <p className="text-xs text-[#64625A] mt-1 max-w-xl leading-relaxed">
              Include your kitchen's anonymized, aggregated waste logs in the public Insights Lab. Published only if your ward has at least 5 contributing kitchens (k-anonymity privacy standard).
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-1">
            <input
              type="checkbox"
              checked={consentInsights}
              onChange={(e) => {
                setConsentInsights(e.target.checked);
                setMessage('Insights Lab consent setting updated.');
              }}
              className="w-4 h-4 rounded text-[#5F7A3E] focus:ring-[#5F7A3E] border-[#DDD4BE]"
            />
            <span className="text-xs font-bold text-[#2D431E]">
              {consentInsights ? 'Consented' : 'Opted Out'}
            </span>
          </label>
        </div>
      </div>

      {/* 3. IoT Sensor API Key Generator */}
      {session.role === 'kitchen' && (
        <div className="foodloop-card p-6 bg-[#FCF9F2] space-y-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1F201C]">
              IoT Hardware & Telemetry API Keys
            </h3>
            <p className="text-xs text-[#64625A] mt-1 max-w-xl">
              Connect digital food probes, ESP32 microcontrollers, or LoRaWAN cold-chain sensors to push automated temperature telemetry to your audit log.
            </p>
          </div>

          <form onSubmit={handleGenerateKey} className="space-y-3 max-w-md pt-2">
            <Input
              label="Sensor Name / Location Tag"
              required
              value={sensorKeyName}
              onChange={(e) => setSensorKeyName(e.target.value)}
            />
            <Button
              type="submit"
              variant="outline"
              size="sm"
              loading={loading}
              icon={<KeyRound className="w-3.5 h-3.5 text-[#5F7A3E]" />}
            >
              Generate New Sensor API Key
            </Button>
          </form>

          {generatedKey && (
            <div className="p-4 bg-[#F7F2E4] rounded-[10px] border border-[#DDD4BE] space-y-2 text-xs">
              <span className="font-bold text-[#1F201C] block">Secret Sensor API Key:</span>
              <div className="p-2 bg-[#FCF9F2] rounded border border-[#DDD4BE] font-mono break-all text-[#2D431E]">
                {generatedKey.api_key}
              </div>
              <p className="text-[#A83232]">
                Copy this key now. It will not be shown again.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4. Delete Account & Permanent Data Wipe */}
      <div className="foodloop-card p-6 bg-[#FCF9F2] border border-[#E8BFBD] space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#A83232]">
              Permanently Delete Account & Wipe Records
            </h3>
            <p className="text-xs text-[#64625A] mt-1 max-w-xl leading-relaxed">
              In full compliance with India's Digital Personal Data Protection (DPDP) Act, this immediately and permanently purges your login, profile, and kitchen logs.
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
            icon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Delete Account
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Permanent Data Deletion"
        subtitle="This action is irreversible and immediately wipes all records."
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-[#A83232] font-semibold leading-relaxed">
            Are you sure you want to permanently delete your account and all production logs? All historical data will be expunged.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={loading}
              onClick={handleDeleteAccount}
            >
              Yes, Permanently Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
