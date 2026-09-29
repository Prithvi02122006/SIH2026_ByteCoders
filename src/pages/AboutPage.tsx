import React from 'react';
import { Card } from '../components/common/Card';
import { ShieldCheck, Mail, Phone, MapPin, Building, HeartHandshake } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in">
      {/* Header */}
      <div className="border-b border-[#E5DECE] pb-4">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F201C]">
          About FoodLoop India
        </h1>
        <p className="font-script text-2xl text-[#5F7A3E] mt-1">
          dignified surplus redistribution, backed by national food safety law
        </p>
      </div>

      {/* Narrative Section */}
      <div className="space-y-6 text-sm text-[#3D3B34] leading-relaxed">
        <p>
          Every evening across Bengaluru, Delhi NCR, Mumbai, Hyderabad, Pune, and Chennai, institutional kitchens cook generous safety margins to ensure no student, worker, or banquet guest goes hungry. But when headcount drops unexpectedly due to exams, rainstorms, or work-from-home shifts, thousands of kilograms of wholesome, freshly prepared food face immediate disposal.
        </p>

        <p>
          Meanwhile, feeding centers, orphanages, and community shelters struggle with inconsistent donations. Traditional food rescue often stumbles on logistics: food arrives cold, unverified, or dangerously close to spoilage.
        </p>

        <div className="p-6 rounded-[14px] bg-[#FCF9F2] border border-[#DDD4BE] space-y-3">
          <div className="flex items-center gap-2 text-[#2E541E] font-bold text-base font-serif">
            <ShieldCheck className="w-5 h-5 text-[#5F7A3E]" />
            <span>The Legal & Safety Foundation: FSSAI Regulations, 2019</span>
          </div>
          <p className="text-xs text-[#55524A] leading-relaxed">
            The Food Safety and Standards Authority of India established the <em>Food Safety and Standards (Recovery and Distribution of Surplus Food) Regulations, 2019</em> to grant clear statutory legal protection for food donors acting in good faith, while imposing strict hygiene, hot-holding (&ge;60°C), and thermal transit obligations on surplus recovery agencies. FoodLoop translates these legal mandates into algorithmic safeguards.
          </p>
        </div>
      </div>

      {/* Stakeholders & Partner Network */}
      <div className="space-y-4">
        <h3 className="font-serif text-2xl font-bold text-[#1F201C]">
          Our Multi-Stakeholder Ecosystem
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="foodloop-card p-5 bg-[#FCF9F2] space-y-2">
            <div className="font-bold text-[#1F201C] text-sm">Institutional Kitchens</div>
            <p className="text-xs text-[#64625A] leading-relaxed">
              Messes, hostels, hotels, corporate food courts, and caterers seeking zero-waste ESG compliance.
            </p>
          </div>

          <div className="foodloop-card p-5 bg-[#FCF9F2] space-y-2">
            <div className="font-bold text-[#1F201C] text-sm">Vetted Food Recovery NGOs</div>
            <p className="text-xs text-[#64625A] leading-relaxed">
              FSSAI-registered charities equipped with clean insulated transport and compliant reheating facilities.
            </p>
          </div>

          <div className="foodloop-card p-5 bg-[#FCF9F2] space-y-2">
            <div className="font-bold text-[#1F201C] text-sm">Food Safety Officers</div>
            <p className="text-xs text-[#64625A] leading-relaxed">
              State food safety inspectors ensuring rigorous adherence to temperature and Schedule 4 sanitary audits.
            </p>
          </div>
        </div>
      </div>

      {/* Official Help & Support Channels */}
      <div className="space-y-4">
        <h3 className="font-serif text-2xl font-bold text-[#1F201C]">
          Contact & Coordination Directorate
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#55524A]">
          <div className="foodloop-card p-5 bg-[#FCF9F2] space-y-3">
            <div className="font-bold text-[#1F201C] text-sm">Operations Directorate</div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#5F7A3E]" />
              <span>operations@foodloop.org.in</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#5F7A3E]" />
              <span>+91 80 2360 0000 (Kitchen Support Desk)</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#5F7A3E]" />
              <span>C-Block, Innovation Park, Malleshwaram, Bengaluru 560012</span>
            </div>
          </div>

          <div className="foodloop-card p-5 bg-[#FCF9F2] space-y-3">
            <div className="font-bold text-[#1F201C] text-sm">FSSAI Rapid Inspection Cell</div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#5F7A3E]" />
              <span>safety.audit@foodloop.org.in</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#5F7A3E]" />
              <span>National Food Sharing Alliance (IFSA) Liaison Desk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
