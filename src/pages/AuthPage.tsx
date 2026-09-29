import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { api, UserSession, saveSession } from '../services/api';
import {
  UtensilsCrossed,
  ShieldCheck,
  Building2,
  Truck,
  BarChart3,
  Sparkles,
  Lock,
  Mail,
  User as UserIcon,
  Phone
} from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: (session: UserSession) => void;
  onQuickDemoSwitch: (role: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onAuthSuccess,
  onQuickDemoSwitch,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'kitchen' | 'ngo' | 'driver' | 'safety_officer' | 'admin'>('kitchen');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [phone, setPhone] = useState('');

  // NGO Specific fields during registration
  const [ngoFssai, setNgoFssai] = useState('');
  const [ngoStorageKg, setNgoStorageKg] = useState('250');
  const [ngoColdStorage, setNgoColdStorage] = useState(true);
  const [ngoReheating, setNgoReheating] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const session = await api.login({ email, password });
        saveSession(session);
        onAuthSuccess(session);
      } else {
        const session = await api.register({
          email,
          password,
          full_name: fullName,
          role,
          organization_name: orgName,
          phone_number: phone,
        });
        saveSession(session);
        onAuthSuccess(session);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'kitchen', label: 'Kitchen / Donor', desc: 'Hostels, Messes, Caterers' },
    { id: 'ngo', label: 'NGO / Food Bank', desc: 'Verified feeding charities' },
    { id: 'driver', label: 'Delivery Partner', desc: 'Volunteers & cold-logistics' },
    { id: 'safety_officer', label: 'Safety Officer', desc: 'FSSAI inspection audits' },
    { id: 'admin', label: 'Admin / ESG', desc: 'Directorates & sustainability' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="md:col-span-7 foodloop-card p-6 sm:p-8 bg-[#FCF9F2]">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EAE3CE]">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1F201C]">
                {mode === 'login' ? 'Sign in to FoodLoop' : 'Create Real Account'}
              </h2>
              <p className="text-xs text-[#64625A] mt-0.5">
                {mode === 'login'
                  ? 'Access your food intelligence workspace'
                  : 'Zero pre-filled fake data. Starts clean and auditable.'}
              </p>
            </div>
            <div className="flex rounded-[8px] bg-[#EAE3CE] p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`px-3 py-1 rounded-[6px] transition-colors ${
                  mode === 'login' ? 'bg-[#FCF9F2] text-[#1F201C] shadow-xs' : 'text-[#64625A]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`px-3 py-1 rounded-[6px] transition-colors ${
                  mode === 'register' ? 'bg-[#FCF9F2] text-[#1F201C] shadow-xs' : 'text-[#64625A]'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {error && (
            <ErrorMessage
              message={error}
              variant="error"
              onDismiss={() => setError(null)}
              className="mb-5"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#3B3A34] mb-1.5">
                    Select Your Organization Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRole(r.id as any)}
                        className={`text-left p-2.5 rounded-[8px] border text-xs transition-all ${
                          role === r.id
                            ? 'border-[#5F7A3E] bg-[#EBF3E4] font-semibold text-[#2D431E]'
                            : 'border-[#DDD4BE] bg-[#FCF9F2] text-[#55524A] hover:bg-[#F7F2E4]'
                        }`}
                      >
                        <div className="font-bold">{r.label}</div>
                        <div className="text-[10px] text-[#64625A]">{r.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Full Name"
                  required
                  placeholder="e.g. Chef Rameshwar Hegde"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />

                <Input
                  label="Organization / Kitchen Name"
                  required
                  placeholder={
                    role === 'kitchen'
                      ? 'e.g. IISc Central Dining Hall'
                      : role === 'ngo'
                      ? 'e.g. Annapoorna Food Rescue Foundation'
                      : 'e.g. Bengaluru Urban Logistics'
                  }
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />

                <Input
                  label="Official Phone Number"
                  placeholder="+91 98450 00000"
                  helperText="Access controlled. Never shown publicly to research lab or unverified drivers."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                {role === 'ngo' && (
                  <div className="p-3 bg-[#F7F2E4] rounded-[8px] space-y-3 border border-[#DDD4BE]">
                    <div className="text-xs font-bold text-[#2D431E] uppercase tracking-wide">
                      NGO FSSAI & Capacity Declaration
                    </div>
                    <Input
                      label="14-Digit FSSAI Licence / Reg Number"
                      placeholder="e.g. 21224455667788"
                      value={ngoFssai}
                      onChange={(e) => setNgoFssai(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Storage Capacity"
                        type="number"
                        unit="kg"
                        value={ngoStorageKg}
                        onChange={(e) => setNgoStorageKg(e.target.value)}
                      />
                      <div className="flex flex-col justify-end space-y-1.5 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={ngoColdStorage}
                            onChange={(e) => setNgoColdStorage(e.target.checked)}
                            className="rounded border-[#DDD4BE] text-[#5F7A3E] focus:ring-[#5F7A3E]"
                          />
                          <span>Cold storage (&lt;5°C)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={ngoReheating}
                            onChange={(e) => setNgoReheating(e.target.checked)}
                            className="rounded border-[#DDD4BE] text-[#5F7A3E] focus:ring-[#5F7A3E]"
                          />
                          <span>Safe reheating (&gt;74°C)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <Input
              label="Work Email Address"
              type="email"
              required
              placeholder="e.g. manager@dining.iisc.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-4"
              loading={loading}
            >
              {mode === 'login' ? 'Sign In to Workspace' : 'Create & Enter Onboarding'}
            </Button>
          </form>
        </div>

        {/* Right Column: Demo Workspace Shortcuts */}
        <div className="md:col-span-5 space-y-5">
          <div className="foodloop-card p-6 bg-[#FCF9F2] border-2 border-[#EACFA8]">
            <div className="flex items-center gap-2 pb-3 border-b border-[#EAE3CE] text-[#8C5511]">
              <Sparkles className="w-4 h-4 text-[#C87D1E]" />
              <h4 className="font-serif font-bold text-base text-[#1F201C]">
                Explore Sandbox Demo Accounts
              </h4>
            </div>

            <p className="text-xs text-[#64625A] my-3 leading-relaxed">
              Don't want to enter fresh kitchen data right now? Click any role below to test the full FSSAI inspection, ML forecasting, and donation dispatch flow immediately.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => onQuickDemoSwitch('kitchen')}
                className="w-full p-2.5 rounded-[8px] border border-[#DDD4BE] bg-[#F7F2E4] hover:bg-[#EFE6D2] text-left flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <UtensilsCrossed className="w-4 h-4 text-[#5F7A3E]" />
                  <div>
                    <span className="font-bold text-[#1F201C] block">Demo Kitchen Manager</span>
                    <span className="text-[10px] text-[#64625A]">IISc Dining Hall (16 logged days)</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#2D431E]">Enter &rarr;</span>
              </button>

              <button
                onClick={() => onQuickDemoSwitch('safety_officer')}
                className="w-full p-2.5 rounded-[8px] border border-[#DDD4BE] bg-[#F7F2E4] hover:bg-[#EFE6D2] text-left flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#5F7A3E]" />
                  <div>
                    <span className="font-bold text-[#1F201C] block">Demo Food Safety Officer</span>
                    <span className="text-[10px] text-[#64625A]">Dr. Priya Sharma (FSSAI audit)</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#2D431E]">Enter &rarr;</span>
              </button>

              <button
                onClick={() => onQuickDemoSwitch('ngo')}
                className="w-full p-2.5 rounded-[8px] border border-[#DDD4BE] bg-[#F7F2E4] hover:bg-[#EFE6D2] text-left flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#5F7A3E]" />
                  <div>
                    <span className="font-bold text-[#1F201C] block">Demo NGO / Food Bank</span>
                    <span className="text-[10px] text-[#64625A]">Annapoorna Foundation</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#2D431E]">Enter &rarr;</span>
              </button>

              <button
                onClick={() => onQuickDemoSwitch('driver')}
                className="w-full p-2.5 rounded-[8px] border border-[#DDD4BE] bg-[#F7F2E4] hover:bg-[#EFE6D2] text-left flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#5F7A3E]" />
                  <div>
                    <span className="font-bold text-[#1F201C] block">Demo Delivery Partner</span>
                    <span className="text-[10px] text-[#64625A]">Thermal Electric Van Driver</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#2D431E]">Enter &rarr;</span>
              </button>

              <button
                onClick={() => onQuickDemoSwitch('admin')}
                className="w-full p-2.5 rounded-[8px] border border-[#DDD4BE] bg-[#F7F2E4] hover:bg-[#EFE6D2] text-left flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#5F7A3E]" />
                  <div>
                    <span className="font-bold text-[#1F201C] block">Demo Admin & ESG Officer</span>
                    <span className="text-[10px] text-[#64625A]">State Directorate Audit</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#2D431E]">Enter &rarr;</span>
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-[#EAE3CE] text-[11px] text-[#8C5511]">
              <strong>Demo Data Isolation Notice:</strong> All demo records are marked <code>is_demo = true</code> and are permanently excluded from the public Insights Lab and real database exports.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
