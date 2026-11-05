import React, { useState } from 'react';
import {
  Calculator, Printer, Share2, ArrowRight, ShieldCheck,
  CheckCircle2, IndianRupee, Sparkles, Sliders
} from 'lucide-react';
import CostBreakdownChart from '../components/estimator/CostBreakdownChart.jsx';
import CostQuotationModal from '../components/estimator/CostQuotationModal.jsx';
import { useProject } from '../context/ProjectContext.jsx';

export default function CostEstimatorPage({ onSelectTab }) {
  const { dimensions, setDimensions, layoutType, costBreakdown, shareToken } = useProject();
  const [quotationModalOpen, setQuotationModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = `${window.location.origin}/share/${shareToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const budgetPackages = [
    {
      title: 'Budget Modular Kitchen',
      range: '₹2,50,000 – ₹3,50,000',
      carcass: 'Commercial BWR Plywood (IS:303) / MR Particle Board',
      shutters: '1mm Suede Finish High-Pressure Laminates',
      countertop: 'Absolute Black Galaxy Polished Granite (18mm)',
      hardware: 'Ebco Soft-Close Drawer Slides & Standard Hinges',
      idealFor: 'Rental apartments, secondary kitchens, and cost-conscious renovations.'
    },
    {
      title: 'Premium Modular Kitchen',
      range: '₹4,50,000 – ₹6,50,000',
      popular: true,
      carcass: 'High-Density Moisture-Resistant (HDHMR) Green Board',
      shutters: 'Anti-Fingerprint European Matte Acrylic & Polymer Glass',
      countertop: 'Engineered Calacatta Gold Quartz Slab (20mm Mitered)',
      hardware: 'Hettich InnoTech Atira Double-Wall Tandem Box System (50kg)',
      idealFor: 'Urban apartments, luxury builder floors, and passionate home chefs.'
    },
    {
      title: 'Luxury Architectural Kitchen',
      range: '₹7,50,000 – ₹14,00,000+',
      carcass: '100% Boiling Water Proof (BWP) Marine Plywood (IS:710)',
      shutters: 'Crown Cut Walnut Veneer (ICA PU Coated) & Lacquered Glass',
      countertop: 'Italian Sintered Ultra-Compact Porcelain Slab (Neolith / Dekton)',
      hardware: 'Blum Aventos Bi-fold Hydraulic Lift-Ups & Gola Profiles',
      idealFor: 'Architectural villas, penthouses, and bespoke custom residences.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#D9C8AE]/50 card-shadow">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0E8DC] text-[#52634A] rounded-full text-xs font-bold">
            <Calculator className="w-3.5 h-3.5" /> Dynamic Financial Engineering
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#292929]">
            Automated Kitchen Cost Estimator
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6862] max-w-xl">
            Real-time itemized quotation recalculating dynamically with your selected materials, running feet, and room dimensions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-[#292929] hover:bg-gray-50 border border-[#D9C8AE] rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <Share2 className="w-3.5 h-3.5 text-[#52634A]" />
            {copied ? 'Share Link Copied!' : 'Share Estimate'}
          </button>
          <button
            onClick={() => setQuotationModalOpen(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#52634A] hover:bg-[#3E4B38] text-white rounded-xl text-xs font-semibold shadow-md transition-all"
          >
            <Printer className="w-3.5 h-3.5" /> Generate Official PDF Quote
          </button>
        </div>
      </div>

      {/* Interactive Dimension Sliders Bar */}
      <div className="bg-white p-6 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#292929] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#52634A]" /> Live Dimension Modifiers (Auto-Recalculate Estimate)
          </span>
          <span className="text-xs text-[#52634A] font-semibold bg-[#F0E8DC] px-2.5 py-0.5 rounded-full">
            {layoutType} Layout • {dimensions.length * dimensions.width} sq.ft
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-[#292929]">
              <span>Room Length: {dimensions.length} Feet</span>
              <span className="text-[#6B6862]">Min 8ft – Max 35ft</span>
            </div>
            <input
              type="range"
              min="8"
              max="35"
              value={dimensions.length}
              onChange={(e) => setDimensions({ ...dimensions, length: Number(e.target.value) })}
              className="w-full accent-[#52634A] cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-[#292929]">
              <span>Room Width: {dimensions.width} Feet</span>
              <span className="text-[#6B6862]">Min 6ft – Max 25ft</span>
            </div>
            <input
              type="range"
              min="6"
              max="25"
              value={dimensions.width}
              onChange={(e) => setDimensions({ ...dimensions, width: Number(e.target.value) })}
              className="w-full accent-[#52634A] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Visual Chart & Breakdown */}
      <CostBreakdownChart showHeader={true} />

      {/* 3 Budget Packages Comparison Section */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#52634A] uppercase tracking-wider">
            Budget Archetypes
          </span>
          <h3 className="font-serif font-bold text-3xl text-[#292929]">
            Compare Three Budget Packages
          </h3>
          <p className="text-xs text-[#6B6862]">
            Choose the package tier that aligns with your family’s investment goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {budgetPackages.map((pkg, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-6 ${
                pkg.popular
                  ? 'bg-[#52634A] text-white shadow-xl border-[#52634A] scale-[1.02]'
                  : 'bg-white text-[#292929] border-[#D9C8AE]/50 card-shadow'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${pkg.popular ? 'text-amber-300' : 'text-[#52634A]'}`}>
                    {pkg.popular ? '★ Most Popular' : 'Tier Package'}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-2xl">{pkg.title}</h4>
                <div className="text-3xl font-serif font-bold">{pkg.range}</div>

                <div className="space-y-2.5 text-xs pt-2">
                  <div>
                    <span className={`block font-bold mb-0.5 ${pkg.popular ? 'text-gray-200' : 'text-[#6B6862]'}`}>Carcass Core:</span>
                    <p>{pkg.carcass}</p>
                  </div>
                  <div>
                    <span className={`block font-bold mb-0.5 ${pkg.popular ? 'text-gray-200' : 'text-[#6B6862]'}`}>Shutters:</span>
                    <p>{pkg.shutters}</p>
                  </div>
                  <div>
                    <span className={`block font-bold mb-0.5 ${pkg.popular ? 'text-gray-200' : 'text-[#6B6862]'}`}>Countertop:</span>
                    <p>{pkg.countertop}</p>
                  </div>
                  <div>
                    <span className={`block font-bold mb-0.5 ${pkg.popular ? 'text-gray-200' : 'text-[#6B6862]'}`}>Hardware:</span>
                    <p>{pkg.hardware}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectTab('designer')}
                className={`w-full py-3 rounded-2xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 ${
                  pkg.popular
                    ? 'bg-white text-[#52634A] hover:bg-gray-100'
                    : 'bg-[#52634A] text-white hover:bg-[#3E4B38]'
                }`}
              >
                Select Package <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Official PDF Quotation Modal */}
      <CostQuotationModal
        isOpen={quotationModalOpen}
        onClose={() => setQuotationModalOpen(false)}
      />
    </div>
  );
}
