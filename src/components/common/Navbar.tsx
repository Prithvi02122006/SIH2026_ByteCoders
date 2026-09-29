import React from 'react';
import { Button } from './Button';
import { UserSession } from '../../services/api';
import {
  UtensilsCrossed,
  ShieldCheck,
  Building2,
  Truck,
  BarChart3,
  FlaskConical,
  BookOpen,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  Info
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  session: UserSession | null;
  onLogout: () => void;
  onQuickDemoSwitch: (role: string) => void;
  onEnterDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  session,
  onLogout,
  onQuickDemoSwitch,
  onEnterDemo,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);

  const roles = [
    { id: 'kitchen', label: 'Kitchen Manager / Donor', icon: <UtensilsCrossed className="w-3.5 h-3.5 text-[#5F7A3E]" /> },
    { id: 'ngo', label: 'NGO / Food Bank', icon: <Building2 className="w-3.5 h-3.5 text-[#5F7A3E]" /> },
    { id: 'driver', label: 'Delivery Volunteer / Partner', icon: <Truck className="w-3.5 h-3.5 text-[#5F7A3E]" /> },
    { id: 'safety_officer', label: 'Food Safety Officer', icon: <ShieldCheck className="w-3.5 h-3.5 text-[#5F7A3E]" /> },
    { id: 'admin', label: 'Admin / ESG Manager', icon: <BarChart3 className="w-3.5 h-3.5 text-[#5F7A3E]" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FCF9F2]/95 backdrop-blur-md border-b border-[#E5DECE]">
      {/* Permanent Demo Workspace Banner when in Demo Mode */}
      {session?.is_demo && (
        <div className="bg-[#FEF3D6] border-b border-[#EACFA8] px-4 py-1.5 text-xs text-[#8C5511] font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <span className="w-2 h-2 rounded-full bg-[#C87D1E] animate-ping" />
            <span>Demo data: not real. Sandbox environment isolated from national audits and Insights Lab research records.</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Editorial Title */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setCurrentTab('landing')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-full bg-[#2D431E] flex items-center justify-center text-[#FBF3DC] shadow-xs group-hover:scale-105 transition-transform">
                <span className="font-serif font-black text-sm tracking-tighter">FL</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-xl font-bold tracking-tight text-[#1F201C]">
                    FoodLoop
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#EAE3CE] text-[#3D5528] border border-[#DDD4BE]">
                    FSSAI 2019
                  </span>
                </div>
                <p className="text-[10px] text-[#64625A] -mt-0.5 font-script">
                  surplus redistribution & kitchen intelligence
                </p>
              </div>
            </button>

            {/* Main Nav Links */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
              <button
                onClick={() => setCurrentTab('landing')}
                className={`px-3 py-1.5 rounded-[8px] transition-colors ${
                  currentTab === 'landing'
                    ? 'bg-[#EAE3CE] text-[#1F201C] font-semibold'
                    : 'text-[#64625A] hover:text-[#1F201C] hover:bg-[#F3EBD4]'
                }`}
              >
                Home
              </button>

              {session && (
                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className={`px-3 py-1.5 rounded-[8px] transition-colors ${
                    currentTab === 'dashboard'
                      ? 'bg-[#EAE3CE] text-[#1F201C] font-semibold'
                      : 'text-[#64625A] hover:text-[#1F201C] hover:bg-[#F3EBD4]'
                  }`}
                >
                  Dashboard
                </button>
              )}

              <button
                onClick={() => setCurrentTab('insights-lab')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] transition-colors ${
                  currentTab === 'insights-lab'
                    ? 'bg-[#EAE3CE] text-[#1F201C] font-semibold'
                    : 'text-[#64625A] hover:text-[#1F201C] hover:bg-[#F3EBD4]'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5 text-[#5F7A3E]" />
                Insights Lab
              </button>

              <button
                onClick={() => setCurrentTab('methodology')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] transition-colors ${
                  currentTab === 'methodology'
                    ? 'bg-[#EAE3CE] text-[#1F201C] font-semibold'
                    : 'text-[#64625A] hover:text-[#1F201C] hover:bg-[#F3EBD4]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#5F7A3E]" />
                Methodology
              </button>

              <button
                onClick={() => setCurrentTab('about')}
                className={`px-3 py-1.5 rounded-[8px] transition-colors ${
                  currentTab === 'about'
                    ? 'bg-[#EAE3CE] text-[#1F201C] font-semibold'
                    : 'text-[#64625A] hover:text-[#1F201C] hover:bg-[#F3EBD4]'
                }`}
              >
                About & Contact
              </button>
            </nav>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Workspace Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-[8px] border border-[#DDD4BE] bg-[#F7F2E4] text-[#2D431E] hover:bg-[#EFE6D2] transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#6E8B4E]" />
                <span>Switch Role</span>
                <ChevronDown className="w-3 h-3 text-[#64625A]" />
              </button>

              {roleMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-[12px] bg-[#FCF9F2] border border-[#DDD4BE] shadow-lg py-1.5 z-50 animate-fade-in"
                  onMouseLeave={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-[#EAE3CE] text-[11px] font-bold text-[#64625A] uppercase tracking-wider">
                    Interactive Role Dashboards
                  </div>
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        onQuickDemoSwitch(r.id);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-[#F3EBD4] transition-colors ${
                        session?.role === r.id ? 'font-bold bg-[#EAE3CE]/60 text-[#2D431E]' : 'text-[#1F201C]'
                      }`}
                    >
                      <span className="p-1 rounded bg-[#EAE3CE]">{r.icon}</span>
                      <span>{r.label}</span>
                    </button>
                  ))}
                  <div className="p-2 border-t border-[#EAE3CE] mt-1">
                    <p className="text-[10px] text-[#64625A] leading-tight">
                      Instantly loads seeded FSSAI inspection & surplus redistribution scenarios for each actor.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Auth Session State */}
            {session ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab('settings')}
                  title="Settings & Data Export"
                  className="p-1.5 rounded-[8px] text-[#64625A] hover:text-[#1F201C] hover:bg-[#EAE3CE]"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-semibold text-[#1F201C] truncate max-w-[140px]">
                    {session.full_name}
                  </div>
                  <div className="text-[10px] text-[#64625A] uppercase tracking-wider">
                    {session.role.replace('_', ' ')}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onLogout} title="Sign Out">
                  <LogOut className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEnterDemo}
                >
                  Try Demo Workspace
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setCurrentTab('auth')}
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Subnav for Active Session */}
      {session && (
        <div className="md:hidden flex items-center justify-around border-t border-[#E5DECE] bg-[#F7F2E4] px-2 py-1 text-xs">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3 py-1 font-medium ${currentTab === 'dashboard' ? 'text-[#2D431E] font-bold' : 'text-[#64625A]'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentTab('insights-lab')}
            className={`px-3 py-1 font-medium ${currentTab === 'insights-lab' ? 'text-[#2D431E] font-bold' : 'text-[#64625A]'}`}
          >
            Insights Lab
          </button>
          <button
            onClick={() => setCurrentTab('methodology')}
            className={`px-3 py-1 font-medium ${currentTab === 'methodology' ? 'text-[#2D431E] font-bold' : 'text-[#64625A]'}`}
          >
            Methodology
          </button>
          <button
            onClick={() => setCurrentTab('settings')}
            className={`px-3 py-1 font-medium ${currentTab === 'settings' ? 'text-[#2D431E] font-bold' : 'text-[#64625A]'}`}
          >
            Settings
          </button>
        </div>
      )}
    </header>
  );
};
