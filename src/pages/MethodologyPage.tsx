import React from 'react';
import { Card } from '../components/common/Card';
import { DataTable } from '../components/common/DataTable';
import { SourceTag } from '../components/common/SourceTag';
import { ExternalLink, BookOpen, ShieldCheck, Calculator, Sparkles } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  const dataSources = [
    {
      name: 'FSSAI Food Recovery Regulations 2019',
      url: 'https://fssai.gov.in',
      purpose: 'Statutory rules for hot holding (>=60°C), cold holding (<=5°C), time windows (2-4h), excluded food, and 6-point hygiene inspection.',
      status: 'Real / Statutory Standard',
    },
    {
      name: 'UNEP Food Waste Index Report 2024',
      url: 'https://www.unep.org/resources/publication/food-waste-index-report-2024',
      purpose: 'National benchmark for Indian per-capita food waste (78 kg/year) and municipal waste characterization.',
      status: 'Real / Published Benchmark',
    },
    {
      name: 'WRAP Food Waste Carbon Metric & IPCC AR6',
      url: 'https://wrap.org.uk/resources/guide/food-waste-carbon-metric',
      purpose: 'Documented constant: 2.5 kg CO2e emissions avoided per 1.0 kg of cooked food surplus diverted from landfills.',
      status: 'Real / Documented Factor',
    },
    {
      name: 'National Institute of Nutrition (ICMR-NIN 2020)',
      url: 'https://www.nin.res.in/',
      purpose: 'Standard portion benchmark: 400 grams cooked equivalent per adult wholesome balanced meal.',
      status: 'Real / Dietary Guideline',
    },
    {
      name: 'data.gov.in / Ministry of Food & Consumer Affairs',
      url: 'https://data.gov.in/resource/state-wise-allocation-and-offtake-foodgrains',
      purpose: 'District-level public distribution system (TPDS) allocations and buffer stock context.',
      status: 'Real / Open Government Data',
    },
    {
      name: 'Open-Meteo Weather API',
      url: 'https://open-meteo.com/',
      purpose: 'Live temperature, humidity, and rainfall telemetry for kitchen locations used in ML demand forecasting.',
      status: 'Real / Live API Integration',
    },
    {
      name: 'FSSAI 14-Digit Licence Number Verification',
      url: 'https://foscos.fssai.gov.in/',
      purpose: 'Format validation (14 numeric digits) and designated officer manual document review.',
      status: 'Format Validated / Manual Review',
    },
    {
      name: 'Demo Workspace Sandbox Data',
      url: '#',
      purpose: 'Pre-seeded sample records for immediate trial. Strictly tagged is_demo=True and isolated from real accounts.',
      status: 'Simulated Sandbox Only',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in">
      {/* Page Header */}
      <div className="border-b border-[#E5DECE] pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-[#5F7A3E]" />
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1F201C]">
            Data Sources & Scientific Methodology
          </h1>
        </div>
        <p className="text-xs text-[#64625A] mt-2 max-w-3xl leading-relaxed">
          In strict compliance with our Real Data Policy, every metric displayed across FoodLoop is either user-entered, sourced from public governmental archives, or calculated via documented scientific models.
        </p>
      </div>

      {/* 1. Complete Data Sources Table */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#1F201C]">
          1. Comprehensive Data Sources Register
        </h2>

        <DataTable
          columns={[
            {
              header: 'Data Source Name',
              cell: (row) => (
                <div className="font-bold text-[#1F201C]">{row.name}</div>
              ),
            },
            {
              header: 'Official Reference / URL',
              cell: (row) => (
                row.url !== '#' ? (
                  <a
                    href={row.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#2D431E] hover:underline"
                  >
                    <span>Visit Source</span>
                    <ExternalLink className="w-3 h-3 text-[#64625A]" />
                  </a>
                ) : (
                  <span className="text-[#64625A]">Internal Sandbox</span>
                )
              ),
            },
            {
              header: 'Application Usage & Scope',
              accessorKey: 'purpose',
              className: 'max-w-md',
            },
            {
              header: 'Status & Verification Tier',
              cell: (row) => (
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                    row.status.includes('Real')
                      ? 'bg-[#EBF3E4] text-[#2E541E] border-[#CFDFBF]'
                      : row.status.includes('Manual')
                      ? 'bg-[#FEF7E8] text-[#8F5912] border-[#F2DEB0]'
                      : 'bg-[#F2EDE1] text-[#55524A] border-[#DDD4BE]'
                  }`}
                >
                  {row.status}
                </span>
              ),
            },
          ]}
          data={dataSources}
        />
      </div>

      {/* 2. Mathematical & Algorithmic Formulations */}
      <div className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-[#1F201C]">
          2. Mathematical & Algorithmic Formulations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Formula 1: ML Demand Forecasting */}
          <div className="foodloop-card p-6 bg-[#FCF9F2] space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#EAE3CE] text-[#2D431E] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#5F7A3E]" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#1F201C]">
              A. Demand Forecasting Engine
            </h4>
            <div className="text-xs text-[#55524A] space-y-2 leading-relaxed">
              <p>
                <strong>Days 0–13 (Cold Start):</strong>
                <br />
                <code>Expected (kg) = Avg(DOW, Meal) &times; Headcount_Factor</code>
                <br />
                Transparent heuristic baseline without false precision.
              </p>
              <p>
                <strong>Days 14+ (Gradient Boosting):</strong>
                <br />
                Trained using scikit-learn <code>GradientBoostingRegressor</code> on 7 feature dimensions:
                Day of week, Meal type, Headcount, Indian Holiday flag, Event flag, Temperature (°C), Rainfall (mm).
              </p>
              <p>
                <strong>Automated Fallback:</strong>
                <br />
                If <code>MAE(ML) &gt; MAE(Baseline)</code>, the system automatically falls back to baseline and alerts the kitchen manager.
              </p>
            </div>
          </div>

          {/* Formula 2: Food Safety Confidence Score */}
          <div className="foodloop-card p-6 bg-[#FCF9F2] space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#EAE3CE] text-[#2D431E] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#5F7A3E]" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#1F201C]">
              B. Food Safety Confidence Score
            </h4>
            <div className="text-xs text-[#55524A] space-y-2 leading-relaxed">
              <p>
                Proprietary 0–100 composite index following FSSAI 2019 regulations:
              </p>
              <ul className="space-y-1 list-disc list-inside">
                <li><strong>Temperature (40 pts):</strong> 40 pts if &ge;60°C (hot) or &le;5°C (cold). Below 55°C results in immediate disqualification.</li>
                <li><strong>Time Freshness (25 pts):</strong> Linear decay over safe 4-hour window from cooking.</li>
                <li><strong>Sensory & Packaging (20 pts):</strong> Visual integrity, smell test, food-grade vessel seal.</li>
                <li><strong>Hygiene Protocol (10 pts):</strong> Clean transport vessels and handler hygiene.</li>
                <li><strong>Allergen Declaration (5 pts):</strong> Manifest transparency.</li>
              </ul>
            </div>
          </div>

          {/* Formula 3: Environmental CO2e Factor */}
          <div className="foodloop-card p-6 bg-[#FCF9F2] space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#EAE3CE] text-[#2D431E] flex items-center justify-center">
              <Calculator className="w-4 h-4 text-[#5F7A3E]" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#1F201C]">
              C. Carbon & Meal Equivalences
            </h4>
            <div className="text-xs text-[#55524A] space-y-2 leading-relaxed">
              <p>
                <strong>CO2e Avoided:</strong>
                <br />
                <code>CO2e Avoided (kg) = Mass Recovered (kg) &times; 2.5</code>
                <br />
                Based on WRAP Carbon Metric & IPCC greenhouse gas emissions per kg of cooked mixed diet food waste diverted from anaerobic landfill decomposition.
              </p>
              <p>
                <strong>Meal Equivalence:</strong>
                <br />
                <code>Meals = Math.round(Mass (kg) / 0.40)</code>
                <br />
                Based on ICMR-NIN recommended dietary adult standard meal (400 grams cooked mass).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
