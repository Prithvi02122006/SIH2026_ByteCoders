import React from 'react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { SourceTag } from '../components/common/SourceTag';
import {
  UtensilsCrossed,
  ShieldCheck,
  Building2,
  Truck,
  BarChart3,
  ArrowRight,
  Clock,
  Thermometer,
  QrCode,
  HeartHandshake,
  CheckCircle2,
  FileCheck2,
  TrendingDown,
  Sparkles
} from 'lucide-react';

interface LandingPageProps {
  setCurrentTab: (tab: string) => void;
  onEnterDemo: () => void;
  onQuickDemoSwitch: (role: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  setCurrentTab,
  onEnterDemo,
  onQuickDemoSwitch,
}) => {
  return (
    <div className="space-y-24 py-8 animate-fade-in">
      {/* 1. Hero Section (Editorial Asymmetric Layout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#DDD4BE] bg-[#F2EDE1] text-xs font-semibold text-[#3D5528]">
              <span className="w-2 h-2 rounded-full bg-[#5F7A3E]"></span>
              <span>FSSAI 2019 Food Recovery & Redistribution Standards</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-[#1F201C] tracking-tight leading-[1.08]">
              Safe food cooked today shouldn't end up in a landfill tonight.
            </h1>

            <p className="font-script text-2xl text-[#5F7A3E] -mt-2">
              where institutional kitchen intelligence meets dignified feeding
            </p>

            <p className="text-base sm:text-lg text-[#55524A] leading-relaxed max-w-2xl">
              FoodLoop connects college messes, hostels, corporate dining halls, and caterers with verified food banks across India. Powered by demand-forecasting intelligence, verified temperature cold-chains, and strict FSSAI food-safety inspections.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setCurrentTab('auth')}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Get Started with Your Kitchen
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={onEnterDemo}
                icon={<Sparkles className="w-4 h-4 text-[#C87D1E]" />}
              >
                Try Demo Workspace
              </Button>
            </div>

            <div className="pt-4 flex items-center gap-6 text-xs text-[#64625A]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#5F7A3E]" />
                <span>Zero fake data in real accounts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#5F7A3E]" />
                <span>Verified 14-digit FSSAI audit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#5F7A3E]" />
                <span>k-Anonymity research privacy</span>
              </div>
            </div>
          </div>

          {/* Hero Aside: Editorial Highlight Card */}
          <div className="lg:col-span-5">
            <div className="foodloop-card p-6 border-2 border-[#DDD4BE] bg-[#FCF9F2] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE3CE]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#5F7A3E]"></div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1F201C]">
                    Today's FSSAI Live Lot
                  </span>
                </div>
                <SourceTag type="your_data" sourceText="Live Demo Sandbox" />
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#5F7A3E] uppercase tracking-wide">
                  IISc Central Dining Hall • Mess Gate 2
                </span>
                <h4 className="font-serif text-xl font-bold text-[#1F201C] mt-0.5">
                  Steamed Ponni Rice & Dal Tadka
                </h4>
                <p className="text-xs text-[#64625A] mt-1">
                  Cooked holding surplus (38.5 kg • ~95 wholesome meal portions)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 py-2 bg-[#F7F2E4] p-3 rounded-[10px] text-xs">
                <div>
                  <span className="text-[10px] text-[#64625A] block uppercase">Holding Temp</span>
                  <span className="font-mono font-bold text-sm text-[#2E541E]">67.2°C (Safe)</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64625A] block uppercase">Safety Confidence</span>
                  <span className="font-mono font-bold text-sm text-[#2E541E]">94.5 / 100</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64625A] block uppercase">Safe Window</span>
                  <span className="font-mono font-bold text-sm text-[#C87D1E]">2h 45m left</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64625A] block uppercase">Assigned Partner</span>
                  <span className="font-medium text-[#1F201C]">Annapoorna NGO</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-[#55524A]">
                <div className="editorial-line">6-point sensory and hygiene inspection completed by FSSAI Officer.</div>
                <div className="editorial-line">Thermal insulated electric van dispatched via OSRM routing.</div>
                <div className="editorial-line">Beneficiary feeding receipt generated on OTP handshake.</div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => onQuickDemoSwitch('kitchen')}
                >
                  Explore Kitchen Dashboard & Listings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Official Cited Benchmarks (UNEP, FAO, WRAP) */}
      <section className="bg-[#F7F2E4] border-y border-[#E5DECE] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5F7A3E]">
              The Indian Context & Scale
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1F201C] mt-1">
              Food waste in numbers: the urgent institutional imperative
            </h2>
            <p className="text-xs text-[#64625A] mt-2">
              Every statistic below is drawn directly from published government and international environmental reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="foodloop-card p-5 bg-[#FCF9F2]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-[#64625A]">ANNUAL WASTE PER CAPITA</span>
                <SourceTag type="public_data" sourceText="UNEP 2024" />
              </div>
              <div className="font-serif text-3xl font-bold text-[#1F201C]">78 kg</div>
              <p className="text-xs text-[#64625A] mt-2 leading-relaxed">
                Per person per year in Indian urban centers, totaling over 78.2 million tonnes annually.
              </p>
            </div>

            <div className="foodloop-card p-5 bg-[#FCF9F2]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-[#64625A]">INSTITUTIONAL OVERPREP</span>
                <SourceTag type="public_data" sourceText="FAO 2019" />
              </div>
              <div className="font-serif text-3xl font-bold text-[#1F201C]">11.4%</div>
              <p className="text-xs text-[#64625A] mt-2 leading-relaxed">
                Average buffer cooked beyond headcount across student hostels and corporate cafeterias.
              </p>
            </div>

            <div className="foodloop-card p-5 bg-[#FCF9F2]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-[#64625A]">CARBON INTENSITY</span>
                <SourceTag type="public_data" sourceText="WRAP / IPCC" />
              </div>
              <div className="font-serif text-3xl font-bold text-[#1F201C]">2.5 kg</div>
              <p className="text-xs text-[#64625A] mt-2 leading-relaxed">
                CO2e avoided per kilogram of cooked surplus recovered before landfill degradation.
              </p>
            </div>

            <div className="foodloop-card p-5 bg-[#FCF9F2]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-[#64625A]">AVERAGE MEAL NORM</span>
                <SourceTag type="public_data" sourceText="ICMR-NIN" />
              </div>
              <div className="font-serif text-3xl font-bold text-[#1F201C]">400 g</div>
              <p className="text-xs text-[#64625A] mt-2 leading-relaxed">
                Cooked food equivalent per wholesome balanced adult meal as prescribed by dietary guidelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The End-to-End Workflow (How It Works) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5F7A3E]">
            End-to-End Closed Loop
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F201C] mt-1">
            How FoodLoop guarantees safety from kettle to community
          </h2>
          <p className="text-xs text-[#64625A] mt-2 font-script text-lg">
            no expired or uninspected lot is ever exposed to distribution partners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="foodloop-card p-5 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#EAE3CE] text-[#2D431E] flex items-center justify-center font-serif font-bold text-sm">
              1
            </div>
            <h4 className="font-serif font-bold text-base text-[#1F201C]">AI Demand Forecast</h4>
            <div className="space-y-1 text-xs text-[#55524A]">
              <div className="editorial-line">Messes log daily meal counts.</div>
              <div className="editorial-line">scikit-learn gradient boosting predicts optimal kg.</div>
              <div className="editorial-line">Integrates weather & holidays.</div>
            </div>
          </div>

          <div className="foodloop-card p-5 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#EAE3CE] text-[#2D431E] flex items-center justify-center font-serif font-bold text-sm">
              2
            </div>
            <h4 className="font-serif font-bold text-base text-[#1F201C]">Surplus Logging</h4>
            <div className="space-y-1 text-xs text-[#55524A]">
              <div className="editorial-line">Under 2-min logging.</div>
              <div className="editorial-line">Hot holding verified &gt;= 60°C.</div>
              <div className="editorial-line">Allergens & prep timestamp noted.</div>
            </div>
          </div>

          <div className="foodloop-card p-5 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#EAE3CE] text-[#2D431E] flex items-center justify-center font-serif font-bold text-sm">
              3
            </div>
            <h4 className="font-serif font-bold text-base text-[#1F201C]">Safety Inspection</h4>
            <div className="space-y-1 text-xs text-[#55524A]">
              <div className="editorial-line">FSSAI 6-point checklist.</div>
              <div className="editorial-line">0–100 Confidence score.</div>
              <div className="editorial-line">Unsafe lots rejected instantly.</div>
            </div>
          </div>

          <div className="foodloop-card p-5 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#EAE3CE] text-[#2D431E] flex items-center justify-center font-serif font-bold text-sm">
              4
            </div>
            <h4 className="font-serif font-bold text-base text-[#1F201C]">NGO Claim & Route</h4>
            <div className="space-y-1 text-xs text-[#55524A]">
              <div className="editorial-line">Nearby verified NGOs notified.</div>
              <div className="editorial-line">Capacity matched strictly.</div>
              <div className="editorial-line">Driver gets route & QR handshake.</div>
            </div>
          </div>

          <div className="foodloop-card p-5 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#EAE3CE] text-[#2D431E] flex items-center justify-center font-serif font-bold text-sm">
              5
            </div>
            <h4 className="font-serif font-bold text-base text-[#1F201C]">Confirmed Impact</h4>
            <div className="space-y-1 text-xs text-[#55524A]">
              <div className="editorial-line">OTP verified upon handover.</div>
              <div className="editorial-line">Beneficiary counts logged.</div>
              <div className="editorial-line">CO2e & cost audit updated.</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Five Role Portals (Explore Role-Based Workspaces) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#E5DECE]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#5F7A3E]">
              Five Tailored Workspaces
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1F201C] mt-1">
              Purpose-built tools for every stakeholder in the recovery chain
            </h2>
          </div>
          <div className="text-xs text-[#64625A]">
            Select a role card to launch its live interactive dashboard
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* Role 1 */}
          <div className="foodloop-card p-5 flex flex-col justify-between hover:border-[#5F7A3E] transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#EAE3CE] text-[#2D431E] flex items-center justify-center border border-[#DDD4BE]">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-lg text-[#1F201C]">Kitchen Manager</h4>
              <div className="space-y-1 text-xs text-[#55524A]">
                <div className="editorial-line">Headcount demand prediction</div>
                <div className="editorial-line">Sub-2-min daily dish logging</div>
                <div className="editorial-line">FEFO inventory alerts</div>
                <div className="editorial-line">IoT temperature probe stream</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-6 w-full"
              onClick={() => onQuickDemoSwitch('kitchen')}
            >
              Open Kitchen Portal
            </Button>
          </div>

          {/* Role 2 */}
          <div className="foodloop-card p-5 flex flex-col justify-between hover:border-[#5F7A3E] transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#EAE3CE] text-[#2D431E] flex items-center justify-center border border-[#DDD4BE]">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-lg text-[#1F201C]">NGO / Food Bank</h4>
              <div className="space-y-1 text-xs text-[#55524A]">
                <div className="editorial-line">Map of vetted nearby food</div>
                <div className="editorial-line">Portions & safe expiry clocks</div>
                <div className="editorial-line">Storage & reheating checks</div>
                <div className="editorial-line">Distribution proof tracking</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-6 w-full"
              onClick={() => onQuickDemoSwitch('ngo')}
            >
              Open NGO Portal
            </Button>
          </div>

          {/* Role 3 */}
          <div className="foodloop-card p-5 flex flex-col justify-between hover:border-[#5F7A3E] transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#EAE3CE] text-[#2D431E] flex items-center justify-center border border-[#DDD4BE]">
                <Truck className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-lg text-[#1F201C]">Delivery Partner</h4>
              <div className="space-y-1 text-xs text-[#55524A]">
                <div className="editorial-line">Assigned jobs (privacy-locked)</div>
                <div className="editorial-line">Turn-by-turn route ETA</div>
                <div className="editorial-line">QR & OTP custody transfer</div>
                <div className="editorial-line">Cold-chain handling alerts</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-6 w-full"
              onClick={() => onQuickDemoSwitch('driver')}
            >
              Open Driver Portal
            </Button>
          </div>

          {/* Role 4 */}
          <div className="foodloop-card p-5 flex flex-col justify-between hover:border-[#5F7A3E] transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#EAE3CE] text-[#2D431E] flex items-center justify-center border border-[#DDD4BE]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-lg text-[#1F201C]">Safety Officer</h4>
              <div className="space-y-1 text-xs text-[#55524A]">
                <div className="editorial-line">FSSAI inspection queue</div>
                <div className="editorial-line">Temperature sensor audit</div>
                <div className="editorial-line">6-point hygiene verification</div>
                <div className="editorial-line">Safety score authorization</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-6 w-full"
              onClick={() => onQuickDemoSwitch('safety_officer')}
            >
              Open Safety Portal
            </Button>
          </div>

          {/* Role 5 */}
          <div className="foodloop-card p-5 flex flex-col justify-between hover:border-[#5F7A3E] transition-colors">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#EAE3CE] text-[#2D431E] flex items-center justify-center border border-[#DDD4BE]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-lg text-[#1F201C]">Admin / ESG</h4>
              <div className="space-y-1 text-xs text-[#55524A]">
                <div className="editorial-line">Prepared vs Discarded %</div>
                <div className="editorial-line">Verified kg CO2e avoided</div>
                <div className="editorial-line">Financial loss saved (₹)</div>
                <div className="editorial-line">One-click ESG audit export</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-6 w-full"
              onClick={() => onQuickDemoSwitch('admin')}
            >
              Open ESG Portal
            </Button>
          </div>
        </div>
      </section>

      {/* 5. Final CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="foodloop-card-dark p-8 sm:p-12 bg-[#2D431E] text-[#FBF3DC] rounded-[20px] relative overflow-hidden">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A4C286]">
              Join the National Recovery Movement
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-black text-[#FBF3DC]">
              Ready to eliminate mess overproduction and nourish your community?
            </h3>
            <p className="text-sm text-[#D7E4CB] leading-relaxed">
              Start with empty, genuine data. Configure your kitchen menu, record daily headcount, and let FoodLoop handle the FSSAI compliance, cold-chain safety scoring, and volunteer dispatch.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setCurrentTab('auth')}
              >
                Register Your Kitchen
              </Button>
              <button
                className="inline-flex items-center justify-center font-medium rounded-[10px] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#A4C286] focus:ring-offset-1 text-sm px-4 py-2 gap-2 bg-transparent text-[#FBF3DC] border border-[#A4C286] hover:bg-[#3D5528] active:translate-y-0.5"
                onClick={() => setCurrentTab('insights-lab')}
              >
                Explore Public Insights Lab
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
