import React from 'react';
import { ShieldCheck, ExternalLink, Leaf } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  return (
    <footer className="mt-20 border-t border-[#E5DECE] bg-[#F7F2E4] text-[#3D3B34] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Regulatory Statement */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#2D431E] flex items-center justify-center text-[#FBF3DC]">
                <span className="font-serif font-bold text-xs">FL</span>
              </div>
              <span className="font-serif text-lg font-bold text-[#1F201C]">FoodLoop India</span>
            </div>
            <p className="text-xs text-[#64625A] leading-relaxed max-w-md">
              A multi-stakeholder food intelligence and surplus redistribution platform engineered for institutional messes, hostels, cafeterias, caterers, and food banks across Indian cities.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#3D5528] font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-[#5F7A3E]" />
              <span>Compliant with FSSAI (Recovery and Distribution of Surplus Food) Regulations, 2019</span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-2">
            <h5 className="font-serif font-bold text-sm text-[#1F201C] tracking-tight">Platform</h5>
            <ul className="space-y-1.5 text-xs text-[#64625A]">
              <li>
                <button onClick={() => setCurrentTab('landing')} className="hover:text-[#1F201C] hover:underline">
                  Home & Overview
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('insights-lab')} className="hover:text-[#1F201C] hover:underline">
                  Public Insights Lab
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('methodology')} className="hover:text-[#1F201C] hover:underline">
                  Data Sources & Methodology
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('about')} className="hover:text-[#1F201C] hover:underline">
                  About & Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Regulatory & External Benchmarks */}
          <div className="space-y-2">
            <h5 className="font-serif font-bold text-sm text-[#1F201C] tracking-tight">Official Sources</h5>
            <ul className="space-y-1.5 text-xs text-[#64625A]">
              <li>
                <a
                  href="https://fssai.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#1F201C]"
                >
                  FSSAI India Portal <ExternalLink className="w-3 h-3 text-[#8F8D84]" />
                </a>
              </li>
              <li>
                <a
                  href="https://data.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#1F201C]"
                >
                  Open Government Data (data.gov.in) <ExternalLink className="w-3 h-3 text-[#8F8D84]" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.unep.org/resources/publication/food-waste-index-report-2024"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#1F201C]"
                >
                  UNEP Food Waste Index 2024 <ExternalLink className="w-3 h-3 text-[#8F8D84]" />
                </a>
              </li>
              <li>
                <a
                  href="https://wrap.org.uk/resources/guide/food-waste-carbon-metric"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 hover:text-[#1F201C]"
                >
                  WRAP Carbon Metric (2.5 kg CO2e) <ExternalLink className="w-3 h-3 text-[#8F8D84]" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-[#E5DECE] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#64625A]">
          <div className="flex items-center gap-2">
            <Leaf className="w-3.5 h-3.5 text-[#5F7A3E]" />
            <span>Zero pre-filled fake data. Real entries marked with source tags. Indian metric standards (kg, INR ₹, DD/MM/YYYY).</span>
          </div>
          <div>
            <span>FoodLoop Engine v1.0 • Built for Indian Institutional Hospitality & Dining</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
