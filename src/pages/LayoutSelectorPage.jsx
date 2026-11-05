import React, { useState } from 'react';
import { Layers, CheckCircle2, Ruler, ArrowRight, Compass, Box } from 'lucide-react';
import { useProject } from '../context/ProjectContext.jsx';

export default function LayoutSelectorPage({ onSelectTab }) {
  const { layoutType, setLayoutType, dimensions, setDimensions } = useProject();
  const [activeLayout, setActiveLayout] = useState(layoutType);

  const layouts = [
    {
      id: 'Straight',
      name: 'Straight Line Kitchen (Single Wall)',
      advantages: [
        'Ideal for narrow linear rooms, compact studio apartments and penthouses',
        'Minimal footprint keeping all services (water, gas, exhaust) on a single wall',
        'Lowest overall fabrication and countertop installation cost',
        'Effortless movement with zero corner blind spots'
      ],
      suitableDimensions: 'Length: 8 to 14 ft • Width: Min 6 ft',
      minSqft: '48 – 84 sq.ft',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
      description: 'A sleek, space-saving layout where cabinets, cooktop, sink, and storage are aligned along a continuous single architectural elevation.'
    },
    {
      id: 'L-Shaped',
      name: 'L-Shaped Kitchen (Adjoining Perpendicular Walls)',
      advantages: [
        'Most popular ergonomic layout worldwide for Indian apartments and bungalows',
        'Forms an effortless natural work triangle between hob, sink, and refrigerator',
        'Accommodates multiple cooks without traffic bottleneck',
        'Maximizes storage capacity with LeMans corner swing-out carousel units'
      ],
      suitableDimensions: 'Main Wall: 10 to 16 ft • Return Wall: 8 to 12 ft',
      minSqft: '80 – 160 sq.ft',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      description: 'The golden standard of residential kitchen design, utilizing two adjacent walls to leave the center of the room open for seamless dining circulation.'
    },
    {
      id: 'U-Shaped',
      name: 'U-Shaped Kitchen (Three Wall Surround)',
      advantages: [
        'Maximum continuous countertop work surface for high-volume family cooking',
        'Abundant upper overhead cabinetry and tall pantry storage',
        'Dedicated independent prep, washing, and cooking zones',
        'Zero cross-traffic through the cook’s primary working zone'
      ],
      suitableDimensions: 'Main Wall: 11 to 16 ft • Depth: 10 to 14 ft',
      minSqft: '110 – 220 sq.ft',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
      description: 'Envelops the culinary space along three contiguous walls, creating an unrivaled culinary cockpit with maximum storage density.'
    },
    {
      id: 'Parallel',
      name: 'Parallel / Galley Kitchen (Opposing Counter Runs)',
      advantages: [
        'Favored by gourmet professional chefs for ultimate efficiency',
        'Strict separation between wet zone (sink/dishwasher) and dry zone (hob/prep)',
        'Compact walking distance between counters (3.5 to 4.5 ft aisle clearance)',
        'Very easy to ventilate with direct utility balcony access'
      ],
      suitableDimensions: 'Length: 10 to 15 ft • Room Width: 8 to 11 ft',
      minSqft: '80 – 150 sq.ft',
      image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
      description: 'Two parallel runs facing each other across a central walkway, eliminating wasted corner cabinets and optimizing line of sight.'
    },
    {
      id: 'Island',
      name: 'Island Kitchen (L-Shape + Central Workstation)',
      advantages: [
        'The centerpiece of modern luxury living and open-plan homes',
        'Multifunctional island functions as prep counter, breakfast bar, and social hub',
        'Can house an undermount sink or flush-mounted induction hob with island chimney',
        'Waterfall stone edge creates a high-end architectural statement'
      ],
      suitableDimensions: 'Room Length: Min 14 ft • Width: Min 11 ft',
      minSqft: '150 – 300+ sq.ft',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      description: 'Features a freestanding centerpiece counter isolated in the middle of the room, providing extra prep space and casual family bar seating.'
    },
    {
      id: 'G-Shaped',
      name: 'G-Shaped Kitchen (U-Shape with Attached Peninsula)',
      advantages: [
        'Combines all the storage of a U-Shape with an integrated 4th breakfast counter',
        'Acts as an organic room divider between the kitchen and living lounge',
        'Eliminates the need for a separate breakfast dining table',
        'Generates immense storage with under-peninsula double-sided drawers'
      ],
      suitableDimensions: 'Room Length: 13 to 17 ft • Width: 11 to 14 ft',
      minSqft: '140 – 240 sq.ft',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
      description: 'A modified U-shaped layout that extends a partial 4th wall or peninsula arm out into the room, creating an intimate breakfast nook.'
    }
  ];

  const current = layouts.find((l) => l.id === activeLayout) || layouts[1];

  const handleApplyLayout = (id) => {
    setActiveLayout(id);
    setLayoutType(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0E8DC] text-[#52634A] rounded-full text-xs font-bold">
          <Layers className="w-3.5 h-3.5" /> Architectural Space Planning
        </div>
        <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#292929]">
          Modular Kitchen Layout Designer
        </h2>
        <p className="text-xs sm:text-sm text-[#6B6862] max-w-xl">
          Evaluate each architectural layout against your room dimensions, family lifestyle, and workflow preferences.
        </p>
      </div>

      {/* Layout Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {layouts.map((l) => (
          <button
            key={l.id}
            onClick={() => handleApplyLayout(l.id)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeLayout === l.id
                ? 'bg-[#52634A] text-white shadow-lg border-[#52634A]'
                : 'bg-white text-[#292929] hover:bg-[#F8F5EF] border-[#D9C8AE]/50'
            }`}
          >
            <span className="text-xs font-bold block truncate">{l.name.split(' (')[0]}</span>
            <span className={`text-[10px] block mt-1 ${activeLayout === l.id ? 'text-amber-200' : 'text-[#6B6862]'}`}>
              {l.minSqft}
            </span>
          </button>
        ))}
      </div>

      {/* Featured Layout Deep Dive */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#D9C8AE]/50 card-shadow grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Information (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#52634A] uppercase tracking-wider block">
              Architectural Analysis
            </span>
            <h3 className="font-serif font-bold text-3xl sm:text-4xl text-[#292929]">
              {current.name}
            </h3>
            <p className="text-sm text-[#6B6862] leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Suitable Dimensions & Metrics Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#F8F5EF] rounded-2xl border border-[#D9C8AE]/40 text-xs">
            <div>
              <span className="text-[#6B6862] block font-semibold mb-0.5">Suitable Room Dimensions</span>
              <span className="font-bold text-[#292929]">{current.suitableDimensions}</span>
            </div>
            <div>
              <span className="text-[#6B6862] block font-semibold mb-0.5">Optimal Floor Area</span>
              <span className="font-bold text-[#52634A]">{current.minSqft}</span>
            </div>
          </div>

          {/* Key Advantages */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#292929] uppercase tracking-wider block">
              Key Advantages & Functional Highlights:
            </span>
            <div className="space-y-2 text-xs">
              {current.advantages.map((adv, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-[#292929]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                  <span>{adv}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setLayoutType(current.id);
                onSelectTab('designer');
              }}
              className="px-6 py-3.5 bg-[#52634A] hover:bg-[#3E4B38] text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-2"
            >
              Customize in Guided Designer <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setLayoutType(current.id);
                onSelectTab('3d-studio');
              }}
              className="px-5 py-3.5 bg-[#F8F5EF] hover:bg-[#F0E8DC] text-[#292929] border border-[#D9C8AE] rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
            >
              <Box className="w-4 h-4 text-[#52634A]" /> Inspect in 3D
            </button>
          </div>
        </div>

        {/* Right Reference Photography (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl overflow-hidden card-shadow border border-[#D9C8AE]/50 h-[380px] relative group">
            <img
              src={current.image}
              alt={current.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-[#52634A]">
              Active in Studio
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
