import React, { useState } from 'react';
import {
  Box, Camera, Palette, Sun, Moon, Sparkles, Layers,
  Download, Play, Check, RefreshCw, Bookmark
} from 'lucide-react';
import KitchenScene3D from '../components/3d/KitchenScene3D.jsx';
import { useProject } from '../context/ProjectContext.jsx';

export default function Kitchen3DStudioPage({ onSelectTab }) {
  const {
    projectTitle, layoutType, setLayoutType,
    visuals, updateVisual, costBreakdown, saveProject
  } = useProject();

  const [saved, setSaved] = useState(false);

  const layouts = ['Straight', 'L-Shaped', 'U-Shaped', 'Parallel', 'Island', 'G-Shaped'];

  const shutterColors = [
    { name: 'Dark Olive', hex: '#52634A' },
    { name: 'Warm Cream', hex: '#F8F5EF' },
    { name: 'Cashmere Taupe', hex: '#D9C8AE' },
    { name: 'Charcoal Black', hex: '#292929' },
    { name: 'Walnut Wood', hex: '#5A3825' },
    { name: 'Pure White', hex: '#FFFFFF' },
    { name: 'Sage Mist', hex: '#879883' }
  ];

  const counterTypes = [
    { id: 'quartz', name: 'Calacatta Gold Quartz', color: '#F5F5F0' },
    { id: 'granite', name: 'Absolute Black Granite', color: '#1E1E1E' },
    { id: 'sintered', name: 'Neolith Laurent Stone', color: '#343330' }
  ];

  const handleSave = async () => {
    await saveProject();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#D9C8AE]/50 card-shadow">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0E8DC] text-[#52634A] rounded-full text-xs font-bold mb-1">
            <Box className="w-3.5 h-3.5" /> Interactive 3D Visualization Studio
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#292929]">
            {projectTitle} — 3D Studio
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6862]">
            Active Layout: <span className="font-bold text-[#52634A]">{layoutType}</span> • Estimated Cost: <span className="font-bold text-[#292929]">₹{costBreakdown.total.toLocaleString('en-IN')}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('estimator')}
            className="px-4 py-2.5 bg-[#F8F5EF] hover:bg-[#F0E8DC] text-[#292929] border border-[#D9C8AE] rounded-xl text-xs font-semibold transition-all"
          >
            Cost Breakdown
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#52634A] hover:bg-[#3E4B38] text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
          >
            {saved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Bookmark className="w-3.5 h-3.5" />}
            {saved ? 'Saved!' : 'Save 3D Scene'}
          </button>
        </div>
      </div>

      {/* Main 3D Viewport Component */}
      <KitchenScene3D height="620px" />

      {/* Real-time Material & Layout Customization Dock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Layout Selector */}
        <div className="bg-white p-6 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-4">
          <h4 className="font-serif font-bold text-lg text-[#292929] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#52634A]" /> Modular Layout Switcher
          </h4>
          <p className="text-xs text-[#6B6862]">Switch layout in real time to see 3D geometry rebuild instantly.</p>
          <div className="grid grid-cols-2 gap-2">
            {layouts.map((l) => (
              <button
                key={l}
                onClick={() => setLayoutType(l)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  layoutType === l
                    ? 'bg-[#52634A] text-white shadow-sm'
                    : 'bg-[#F8F5EF] text-[#292929] hover:bg-[#F0E8DC]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Shutter Color & Finishes */}
        <div className="bg-white p-6 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-4">
          <h4 className="font-serif font-bold text-lg text-[#292929] flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#52634A]" /> Shutter Color & Finish
          </h4>
          <div className="flex flex-wrap items-center gap-2">
            {shutterColors.map((swatch) => (
              <button
                key={swatch.hex}
                onClick={() => updateVisual('cabinetColor', swatch.hex)}
                title={swatch.name}
                style={{ backgroundColor: swatch.hex }}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                  visuals.cabinetColor === swatch.hex
                    ? 'border-[#52634A] ring-2 ring-[#52634A] scale-110 shadow-md'
                    : 'border-white hover:scale-105'
                }`}
              />
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-gray-100">
            <span className="text-[#6B6862]">Shutter Texture:</span>
            <select
              value={visuals.shutterFinish}
              onChange={(e) => updateVisual('shutterFinish', e.target.value)}
              className="bg-[#F8F5EF] border border-[#D9C8AE] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#292929]"
            >
              <option value="matte">Super Matte Silk</option>
              <option value="gloss">Mirror High Gloss</option>
              <option value="veneer">Walnut Wood Veneer</option>
              <option value="glass">Lacquered Glass</option>
            </select>
          </div>
        </div>

        {/* 3. Countertop & Handles */}
        <div className="bg-white p-6 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-4">
          <h4 className="font-serif font-bold text-lg text-[#292929] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#52634A]" /> Countertop & Hardware
          </h4>

          <div className="space-y-2 text-xs">
            {counterTypes.map((c) => (
              <button
                key={c.id}
                onClick={() => updateVisual('counterColor', c.color)}
                className={`w-full flex items-center justify-between p-2 rounded-xl border transition-all ${
                  visuals.counterColor === c.color
                    ? 'bg-[#F8F5EF] border-[#52634A] font-bold text-[#292929]'
                    : 'border-transparent hover:bg-gray-50 text-[#6B6862]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: c.color }}
                  />
                  <span>{c.name}</span>
                </div>
                {visuals.counterColor === c.color && <Check className="w-3.5 h-3.5 text-[#52634A]" />}
              </button>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-gray-100">
            <span className="text-[#6B6862]">Handle Style:</span>
            <select
              value={visuals.handleType}
              onChange={(e) => updateVisual('handleType', e.target.value)}
              className="bg-[#F8F5EF] border border-[#D9C8AE] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#292929]"
            >
              <option value="gola">Handleless Integrated Gola</option>
              <option value="brass">Brushed Brass Bar</option>
              <option value="black">Matte Black Profile</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
