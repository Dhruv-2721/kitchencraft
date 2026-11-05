import React, { useState } from 'react';
import {
  ArrowRight, Box, Compass, Sparkles, Wand2, ShieldCheck,
  CheckCircle2, Star, Calculator, Layers, HeartHandshake,
  Calendar, ChevronRight, Award, Zap, PhoneCall
} from 'lucide-react';
import KitchenScene3D from '../components/3d/KitchenScene3D.jsx';
import { useProject } from '../context/ProjectContext.jsx';

export default function HomePage({ onSelectTab }) {
  const { setLayoutType, layoutType, costBreakdown } = useProject();
  const [selectedLayoutTab, setSelectedLayoutTab] = useState('L-Shaped');

  // Featured Kitchen Designs
  const featuredDesigns = [
    {
      title: 'The Malabar Emerald',
      style: 'Modern Minimalist',
      layout: 'L-Shaped',
      cost: '₹4,85,000',
      finish: 'Matte Sage Green Acrylic + Calacatta Gold Quartz',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Scandinavian Warm Oak & Island',
      style: 'Scandinavian',
      layout: 'Island',
      cost: '₹6,85,000',
      finish: 'Natural Walnut Crown Veneer + Neolith Sintered Slabs',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Monochrome City Parallel',
      style: 'Contemporary',
      layout: 'Parallel',
      cost: '₹3,45,000',
      finish: 'Ultra High Gloss Acrylic + Leathered Black Granite',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
    }
  ];

  // 6 Kitchen Layouts
  const kitchenLayouts = [
    {
      id: 'Straight',
      name: 'Straight Kitchen',
      bestFor: 'Compact apartments, studio flats, narrow galley rooms',
      perk: 'Ultra space-efficient, linear workflow along a single wall',
      dimensions: 'Min 8 × 6 ft',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'L-Shaped',
      name: 'L-Shaped Kitchen',
      bestFor: 'Small to medium homes, open-plan dining concepts',
      perk: 'Natural ergonomic work triangle with corner carousel optimization',
      dimensions: 'Min 10 × 8 ft',
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'U-Shaped',
      name: 'U-Shaped Kitchen',
      bestFor: 'Spacious independent villas and high-volume cooking',
      perk: 'Maximum continuous countertop prep area and ceiling overhead storage',
      dimensions: 'Min 11 × 10 ft',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'Parallel',
      name: 'Parallel / Galley Kitchen',
      bestFor: 'Rectangular floor plans, serious gourmet chefs',
      perk: 'Clean separation between wet preparation zone and dry cooking run',
      dimensions: 'Min 10 × 7 ft',
      image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'Island',
      name: 'Island Kitchen',
      bestFor: 'Large open living spaces, entertaining & family breakfast',
      perk: 'Freestanding architectural island with bar seating & waterfall slab',
      dimensions: 'Min 14 × 11 ft',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'G-Shaped',
      name: 'G-Shaped Kitchen',
      bestFor: 'Gourmet cooking with attached breakfast peninsula',
      perk: 'Full U-Shape layout enhanced with a 4th dining peninsula counter',
      dimensions: 'Min 13 × 11 ft',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80'
    }
  ];

  // Trusted Brands
  const trustedBrands = [
    { name: 'Hettich', category: 'German Hardware' },
    { name: 'Häfele', category: 'Architectural Fittings' },
    { name: 'Blum', category: 'Austrian Lift-Ups' },
    { name: 'Bosch', category: 'German Built-ins' },
    { name: 'Faber', category: 'Smart Chimneys' },
    { name: 'Elica', category: 'Italian Hobs' },
    { name: 'Franke', category: 'Swiss Sinks' },
    { name: 'Jaquar', category: 'Sanitary Fittings' },
    { name: 'Kajaria', category: 'Porcelain Tiles' },
    { name: 'Asian Paints', category: 'Royale Teflon Care' },
    { name: 'CenturyPly', category: 'Marine BWP Plywood' }
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Ananya & Rohan Deshmukh',
      location: 'Indiranagar, Bangalore',
      quote: 'We uploaded our 15-year-old kitchen photo and within seconds had a gorgeous Scandinavian transformation. Being able to rotate in 3D and see the real cost in INR gave us 100% confidence before signing the contract.',
      rating: 5,
      project: 'Scandinavian Island Kitchen'
    },
    {
      name: 'Vikram Sengupta',
      location: 'Koregaon Park, Pune',
      quote: 'KITCHENcraft is unlike any basic quotation website. Swapping from matte white to walnut veneer updated the 3D model immediately, and the itemized price breakdown accounted for every Blum hinge.',
      rating: 5,
      project: 'L-Shaped Modern Minimalist'
    },
    {
      name: 'Dr. Meera Nambiar',
      location: 'Kochi, Kerala',
      quote: 'The cinematic 3D walkthrough felt like an architectural studio presentation. Our kitchen renovation was delivered exactly as visualized with zero hidden costs.',
      rating: 5,
      project: 'Parallel Gourmet Kitchen'
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content (6 Cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#F0E8DC] text-[#52634A] rounded-full text-xs font-bold border border-[#D9C8AE]/80">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Architectural 3D Modular Kitchen Studio
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#292929] leading-[1.12]">
                Design Your Dream Kitchen, <br />
                <span className="text-[#52634A] italic">Before You Build It.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#6B6862] leading-relaxed max-w-xl">
                Upload your kitchen, customize every detail, explore stunning 3D designs and discover the perfect budget for your dream modular kitchen.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onSelectTab('designer')}
                  className="px-7 py-4 bg-[#52634A] hover:bg-[#3E4B38] text-white rounded-2xl font-semibold shadow-xl transition-all flex items-center gap-2.5 text-sm group hover:scale-[1.02]"
                >
                  Start Designing
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onSelectTab('catalogue')}
                  className="px-7 py-4 bg-white hover:bg-[#F8F5EF] text-[#292929] border border-[#D9C8AE] rounded-2xl font-semibold shadow-sm transition-all text-sm"
                >
                  Explore Kitchen Designs
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-6 border-t border-[#D9C8AE]/50 grid grid-cols-3 gap-4 text-left">
                <div>
                  <span className="font-serif font-bold text-xl text-[#292929] block">80+</span>
                  <span className="text-xs text-[#6B6862]">Premium Materials</span>
                </div>
                <div>
                  <span className="font-serif font-bold text-xl text-[#292929] block">360°</span>
                  <span className="text-xs text-[#6B6862]">Real-time 3D Studio</span>
                </div>
                <div>
                  <span className="font-serif font-bold text-xl text-[#52634A] block">100%</span>
                  <span className="text-xs text-[#6B6862]">Transparent INR Pricing</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image (6 Cols) */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden card-shadow border border-[#D9C8AE]/60 group">
                <img
                  src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85"
                  alt="Modern Luxury Modular Kitchen"
                  className="w-full h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Floating 3D Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-[#D9C8AE]/60 shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#52634A] uppercase tracking-wider block">Featured Concept</span>
                    <h4 className="font-serif font-bold text-base text-[#292929]">The Malabar Emerald Modular Kitchen</h4>
                    <span className="text-xs text-[#6B6862]">Super Matte Acrylic • Calacatta Gold Quartz</span>
                  </div>
                  <button
                    onClick={() => onSelectTab('3d-studio')}
                    className="px-3.5 py-2 bg-[#52634A] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md hover:bg-[#3E4B38] transition-all"
                  >
                    <Box className="w-3.5 h-3.5" /> View in 3D
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW KITCHENCRAFT WORKS */}
      <section className="bg-white py-16 border-y border-[#D9C8AE]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#52634A] uppercase tracking-wider">
              Seamless 4-Step Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#292929]">
              How KITCHENcraft Works
            </h2>
            <p className="text-sm text-[#6B6862]">
              From an ordinary kitchen photo to an architectural 3D walkthrough with complete itemized Indian cost calculations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Upload or Choose Layout',
                desc: 'Upload a smartphone photo of your existing space or start from scratch choosing from 6 architectural layouts.'
              },
              {
                step: '02',
                title: 'Select Real Materials',
                desc: 'Hand-pick calibrated BWP plywood, acrylic shutters, quartz slabs, Blum hardware and smart built-in appliances.'
              },
              {
                step: '03',
                title: 'Interactive 3D Walkthrough',
                desc: 'Rotate 360°, inspect textures under warm daylight or evening spotlights, and run cinematic animated tours.'
              },
              {
                step: '04',
                title: 'Automated Cost Estimate',
                desc: 'Instant transparent quotation broken down across carcass, shutters, hardware, labour and GST.'
              }
            ].map((s, idx) => (
              <div key={idx} className="relative p-6 bg-[#F8F5EF] rounded-3xl border border-[#D9C8AE]/50 space-y-3 card-shadow hover:-translate-y-1 transition-transform">
                <span className="font-serif font-bold text-3xl text-[#B69A65]">{s.step}</span>
                <h4 className="font-serif font-bold text-lg text-[#292929]">{s.title}</h4>
                <p className="text-xs text-[#6B6862] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. POPULAR KITCHEN DESIGNS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#52634A] uppercase tracking-wider block">
              Curated Masterpieces
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#292929]">
              Popular Kitchen Designs
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('catalogue')}
            className="text-xs font-bold text-[#52634A] hover:text-[#3E4B38] flex items-center gap-1"
          >
            Explore all 80+ materials <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredDesigns.map((d, i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden border border-[#D9C8AE]/50 card-shadow group">
              <div className="h-60 overflow-hidden relative">
                <img
                  src={d.image}
                  alt={d.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-[#52634A]">
                  {d.layout}
                </div>
                <div className="absolute top-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full text-xs font-bold text-white">
                  {d.style}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="font-serif font-bold text-xl text-[#292929] mb-1">{d.title}</h4>
                  <p className="text-xs text-[#6B6862]">{d.finish}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div>
                    <span className="text-[10px] text-[#6B6862] block">Estimated Cost</span>
                    <span className="font-bold text-base text-[#52634A]">{d.cost}</span>
                  </div>
                  <button
                    onClick={() => {
                      setLayoutType(d.layout);
                      onSelectTab('3d-studio');
                    }}
                    className="px-4 py-2 bg-[#52634A] text-white rounded-xl text-xs font-semibold hover:bg-[#3E4B38] transition-all"
                  >
                    Customize in 3D
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. EXPLORE MODULAR KITCHEN LAYOUTS */}
      <section className="bg-white py-16 border-y border-[#D9C8AE]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#52634A] uppercase tracking-wider">
              Ergonomic Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#292929]">
              Explore Different Kitchen Layouts
            </h2>
            <p className="text-sm text-[#6B6862]">
              Select a floor plan designed around the golden work triangle between your cooking hob, sink, and refrigerator.
            </p>
          </div>

          {/* Layout Tab Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {kitchenLayouts.map((l) => (
              <button
                key={l.id}
                onClick={() => setSelectedLayoutTab(l.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
                  selectedLayoutTab === l.id
                    ? 'bg-[#52634A] text-white shadow-md'
                    : 'bg-[#F8F5EF] text-[#292929] hover:bg-[#F0E8DC]'
                }`}
              >
                {l.name}
              </button>
            ))}
          </div>

          {/* Active Layout Showcase Card */}
          {(() => {
            const active = kitchenLayouts.find((l) => l.id === selectedLayoutTab) || kitchenLayouts[1];
            return (
              <div className="bg-[#F8F5EF] rounded-3xl p-6 sm:p-10 border border-[#D9C8AE]/60 card-shadow grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-block px-3 py-1 bg-white rounded-full text-xs font-bold text-[#52634A] border border-[#D9C8AE]">
                    Recommended: {active.dimensions}
                  </div>
                  <h3 className="font-serif font-bold text-3xl text-[#292929]">{active.name}</h3>
                  <p className="text-sm text-[#6B6862] leading-relaxed">{active.perk}</p>

                  <div className="space-y-2 text-xs bg-white p-4 rounded-2xl border border-[#D9C8AE]/40">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold text-[#292929]">Ideal Suitability:</span> {active.bestFor}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold text-[#292929]">Traffic & Clearance:</span> Smooth two-person movement clearance of 4 feet maintained.
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setLayoutType(active.id);
                        onSelectTab('designer');
                      }}
                      className="px-6 py-3.5 bg-[#52634A] hover:bg-[#3E4B38] text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-2"
                    >
                      Design with {active.name} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="rounded-2xl overflow-hidden card-shadow border border-[#D9C8AE]/50 h-[340px]">
                    <img
                      src={active.image}
                      alt={active.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* 5. 3D VISUALIZATION INTERACTIVE PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#52634A] uppercase tracking-wider">
            Signature Feature
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#292929]">
            Interactive 3D Kitchen Visualization
          </h2>
          <p className="text-sm text-[#6B6862]">
            Experience your kitchen in full 3D right now. Click and drag to orbit 360°, change cabinet colors, switch to evening lighting, or launch the automated walkthrough.
          </p>
        </div>

        {/* Embedded Live 3D Scene */}
        <KitchenScene3D height="560px" />
      </section>

      {/* 6. SMART COST ESTIMATION HIGHLIGHT */}
      <section className="bg-white py-16 border-y border-[#D9C8AE]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-[#52634A] uppercase tracking-wider">
                Automated Estimator
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#292929]">
                Zero Surprises. Real Market Cost Estimation.
              </h2>
              <p className="text-sm text-[#6B6862] leading-relaxed">
                Unlike vague contractor quotes that double midway, KITCHENcraft computes real quantities down to the linear running foot, plywood square footage, Blum hardware sets, and GST.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  '12 Itemized breakdown categories',
                  'Actual Indian market prices in INR',
                  'Instant comparison of Budget, Premium & Luxury packages',
                  'Downloadable professional PDF quotations'
                ].map((pt, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#292929]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onSelectTab('estimator')}
                  className="px-6 py-3.5 bg-[#52634A] hover:bg-[#3E4B38] text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4" /> Open Full Cost Estimator
                </button>
              </div>
            </div>

            {/* 3 Budget Packages Preview */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Budget Tier */}
              <div className="p-5 bg-[#F8F5EF] rounded-2xl border border-[#D9C8AE]/50 space-y-3">
                <span className="text-[10px] font-bold text-[#6B6862] uppercase">Budget Kitchen</span>
                <div className="text-2xl font-serif font-bold text-[#292929]">₹2.5L – ₹3.5L</div>
                <p className="text-[11px] text-[#6B6862]">BWR Plywood carcass, matte laminates, black granite & soft-close channels.</p>
              </div>

              {/* Premium Tier */}
              <div className="p-5 bg-[#52634A] text-white rounded-2xl shadow-xl space-y-3 relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-amber-400 text-black text-[9px] font-bold px-2 py-0.5 rounded-full">
                  Most Popular
                </div>
                <span className="text-[10px] font-bold text-amber-200 uppercase">Premium Kitchen</span>
                <div className="text-2xl font-serif font-bold text-white">₹4.5L – ₹6.5L</div>
                <p className="text-[11px] text-gray-200">HDHMR core, super matte acrylic, quartz slabs, Hettich tandem boxes & smart chimney.</p>
              </div>

              {/* Luxury Tier */}
              <div className="p-5 bg-[#F8F5EF] rounded-2xl border border-[#D9C8AE]/50 space-y-3">
                <span className="text-[10px] font-bold text-[#B69A65] uppercase">Luxury Kitchen</span>
                <div className="text-2xl font-serif font-bold text-[#292929]">₹7.5L – ₹14L+</div>
                <p className="text-[11px] text-[#6B6862]">BWP Marine ply, natural wood veneers, Neolith sintered stone, Blum Aventos bi-folds & Bosch built-ins.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TRUSTED BRANDS & MANUFACTURERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
        <span className="text-xs font-bold text-[#6B6862] uppercase tracking-widest block">
          Engineered With Leading Architectural Brands
        </span>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {trustedBrands.map((b, i) => (
            <div key={i} className="px-4 py-2 bg-white rounded-xl border border-[#D9C8AE]/40 shadow-sm flex flex-col items-center">
              <span className="font-serif font-bold text-lg text-[#292929]">{b.name}</span>
              <span className="text-[9px] text-[#6B6862] uppercase font-semibold">{b.category}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CUSTOMER TESTIMONIALS */}
      <section className="bg-white py-16 border-y border-[#D9C8AE]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#52634A] uppercase tracking-wider">
              Homeowner Stories
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#292929]">
              Loved by Homeowners Across India
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-[#F8F5EF] p-6 rounded-3xl border border-[#D9C8AE]/50 space-y-4 card-shadow flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, r) => (
                      <Star key={r} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-[#292929] leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="pt-3 border-t border-[#D9C8AE]/40">
                  <h5 className="font-serif font-bold text-sm text-[#292929]">{t.name}</h5>
                  <span className="text-[11px] text-[#6B6862] block">{t.location} • {t.project}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. BOOK A FREE DESIGN CONSULTATION CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#52634A] to-[#3E4B38] text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-bold text-amber-200 uppercase tracking-wider block">
              Personal Design Architect Support
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Ready to Bring Your 3D Kitchen to Life?
            </h2>
            <p className="text-sm text-gray-200 leading-relaxed">
              Book a complimentary 1-on-1 virtual or on-site consultation with a KITCHENcraft senior architect. Review your 3D walkthrough, confirm plumbing feasibility, and lock in manufacturer pricing.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => onSelectTab('consultation')}
              className="px-8 py-4 bg-white hover:bg-gray-50 text-[#52634A] font-bold rounded-2xl shadow-xl transition-all text-sm flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" /> Book Design Consultation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
