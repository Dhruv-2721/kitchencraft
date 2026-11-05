import React, { useState } from 'react';
import {
  UploadCloud, Ruler, Layers, Palette, Wrench, Box,
  Calculator, CheckCircle, ArrowRight, ArrowLeft, Save,
  Calendar, Sparkles, Check
} from 'lucide-react';
import { useProject } from '../context/ProjectContext.jsx';
import ImageUploadSection from '../components/ai/ImageUploadSection.jsx';
import KitchenScene3D from '../components/3d/KitchenScene3D.jsx';
import CostBreakdownChart from '../components/estimator/CostBreakdownChart.jsx';
import CostQuotationModal from '../components/estimator/CostQuotationModal.jsx';
import MaterialCard from '../components/catalogue/MaterialCard.jsx';
import { initialMaterials } from '../../server/src/seedData.js';

export default function DesignerStudioPage({ onSelectTab }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [quotationModalOpen, setQuotationModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const {
    projectTitle, setProjectTitle,
    layoutType, setLayoutType,
    dimensions, setDimensions,
    materials, selectMaterial,
    visuals, updateVisual,
    costBreakdown, saveProject
  } = useProject();

  const steps = [
    { num: 1, title: 'Upload & Concept', icon: UploadCloud },
    { num: 2, title: 'Dimensions', icon: Ruler },
    { num: 3, title: 'Layout', icon: Layers },
    { num: 4, title: 'Cabinets & Finishes', icon: Palette },
    { num: 5, title: 'Hardware & Fittings', icon: Wrench },
    { num: 6, title: '3D Studio', icon: Box },
    { num: 7, title: 'Cost Estimator', icon: Calculator },
    { num: 8, title: 'Save & Finalize', icon: CheckCircle }
  ];

  const handleSave = async () => {
    await saveProject(projectTitle);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const layoutsList = [
    { id: 'Straight', name: 'Straight Kitchen', desc: 'Single linear wall run for studio apartments' },
    { id: 'L-Shaped', name: 'L-Shaped Kitchen', desc: 'Dual adjoining walls with optimal ergonomic triangle' },
    { id: 'U-Shaped', name: 'U-Shaped Kitchen', desc: 'Three walls with extensive worktops and storage' },
    { id: 'Parallel', name: 'Parallel / Galley', desc: 'Two opposing counter runs separating wet & dry zones' },
    { id: 'Island', name: 'Island Kitchen', desc: 'L-Shape base with freestanding breakfast island bar' },
    { id: 'G-Shaped', name: 'G-Shaped Kitchen', desc: 'U-Shape layout extended with a 4th dining peninsula' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Project Renaming */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#D9C8AE]/50 card-shadow">
        <div>
          <span className="text-xs font-bold text-[#52634A] uppercase tracking-wider block">
            Guided Kitchen Designer Studio
          </span>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="font-serif font-bold text-2xl sm:text-3xl text-[#292929] bg-transparent border-b border-dashed border-[#D9C8AE] hover:border-[#52634A] focus:border-[#52634A] focus:outline-none transition-colors"
          />
        </div>

        {/* Live Running Estimate Pill */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-[#6B6862] block">Live Estimated Investment</span>
            <span className="font-serif font-bold text-xl text-[#52634A]">
              ₹{costBreakdown.total.toLocaleString('en-IN')}
            </span>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2.5 bg-[#52634A] hover:bg-[#3E4B38] text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-1.5"
          >
            {saveSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Save className="w-3.5 h-3.5" />}
            {saveSuccess ? 'Saved!' : 'Save Progress'}
          </button>
        </div>
      </div>

      {/* 8-Step Stepper Progress Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#D9C8AE]/50 card-shadow overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] gap-2">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.num;
            const isCurrent = currentStep === step.num;
            return (
              <button
                key={step.num}
                onClick={() => setCurrentStep(step.num)}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl transition-all text-xs font-semibold ${
                  isCurrent
                    ? 'bg-[#52634A] text-white shadow-md'
                    : isCompleted
                    ? 'bg-[#F0E8DC] text-[#52634A]'
                    : 'text-[#6B6862] hover:bg-[#F8F5EF]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCurrent ? 'bg-white text-[#52634A]' : isCompleted ? 'bg-[#52634A] text-white' : 'bg-gray-200'
                }`}>
                  {isCompleted ? '✓' : step.num}
                </div>
                <span>{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Contents */}
      <div className="space-y-6">
        {/* STEP 1: Upload or Start From Scratch */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <ImageUploadSection />
          </div>
        )}

        {/* STEP 2: Enter Room Dimensions */}
        {currentStep === 2 && (
          <div className="bg-white p-8 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-6">
            <div>
              <span className="text-xs font-bold text-[#52634A] uppercase tracking-wider block">Step 2 of 8</span>
              <h3 className="font-serif font-bold text-3xl text-[#292929]">Enter Kitchen Room Dimensions</h3>
              <p className="text-xs text-[#6B6862]">Enter the architectural measurements of your kitchen room in feet.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="p-5 bg-[#F8F5EF] rounded-2xl border border-[#D9C8AE]/50 space-y-2">
                <label className="text-xs font-bold text-[#292929] block">Room Length (Feet)</label>
                <input
                  type="number"
                  min="6"
                  max="40"
                  value={dimensions.length}
                  onChange={(e) => setDimensions({ ...dimensions, length: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-white border border-[#D9C8AE] rounded-xl text-lg font-bold text-[#292929] focus:outline-none focus:border-[#52634A]"
                />
                <span className="text-[11px] text-[#6B6862]">Main wall run elevation</span>
              </div>

              <div className="p-5 bg-[#F8F5EF] rounded-2xl border border-[#D9C8AE]/50 space-y-2">
                <label className="text-xs font-bold text-[#292929] block">Room Width (Feet)</label>
                <input
                  type="number"
                  min="5"
                  max="35"
                  value={dimensions.width}
                  onChange={(e) => setDimensions({ ...dimensions, width: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-white border border-[#D9C8AE] rounded-xl text-lg font-bold text-[#292929] focus:outline-none focus:border-[#52634A]"
                />
                <span className="text-[11px] text-[#6B6862]">Perpendicular counter / walking span</span>
              </div>

              <div className="p-5 bg-[#F8F5EF] rounded-2xl border border-[#D9C8AE]/50 space-y-2">
                <label className="text-xs font-bold text-[#292929] block">Ceiling Height (Feet)</label>
                <input
                  type="number"
                  step="0.5"
                  min="8"
                  max="14"
                  value={dimensions.ceilingHeight}
                  onChange={(e) => setDimensions({ ...dimensions, ceilingHeight: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-white border border-[#D9C8AE] rounded-xl text-lg font-bold text-[#292929] focus:outline-none focus:border-[#52634A]"
                />
                <span className="text-[11px] text-[#6B6862]">Determines upper cabinet tier & lofts</span>
              </div>
            </div>

            {/* Computed Floor metrics */}
            <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold">Total Kitchen Carpet Area:</span> {dimensions.length * dimensions.width} sq.ft
              </div>
              <div>
                <span className="font-bold">Estimated Base Counter:</span> {costBreakdown.runningFeet} Running Feet (Rft)
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Select Modular Kitchen Layout */}
        {currentStep === 3 && (
          <div className="bg-white p-8 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-6">
            <div>
              <span className="text-xs font-bold text-[#52634A] uppercase tracking-wider block">Step 3 of 8</span>
              <h3 className="font-serif font-bold text-3xl text-[#292929]">Choose Modular Kitchen Layout</h3>
              <p className="text-xs text-[#6B6862]">The layout dictates cabinet arrangements and counter lengths.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
              {layoutsList.map((layout) => (
                <div
                  key={layout.id}
                  onClick={() => setLayoutType(layout.id)}
                  className={`p-6 rounded-3xl border cursor-pointer transition-all space-y-3 ${
                    layoutType === layout.id
                      ? 'bg-[#F8F5EF] border-[#52634A] ring-2 ring-[#52634A]/20 shadow-lg'
                      : 'border-[#D9C8AE]/50 hover:bg-[#F8F5EF]/50 hover:border-[#52634A]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-xl text-[#292929]">{layout.name}</h4>
                    {layoutType === layout.id && (
                      <span className="w-5 h-5 rounded-full bg-[#52634A] text-white flex items-center justify-center text-xs">✓</span>
                    )}
                  </div>
                  <p className="text-xs text-[#6B6862] leading-relaxed">{layout.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: Cabinets & Finishes */}
        {currentStep === 4 && (
          <div className="bg-white p-8 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-6">
            <div>
              <span className="text-xs font-bold text-[#52634A] uppercase tracking-wider block">Step 4 of 8</span>
              <h3 className="font-serif font-bold text-3xl text-[#292929]">Cabinet Carcass, Shutters & Surfaces</h3>
              <p className="text-xs text-[#6B6862]">Pick your internal carcass ply, exterior shutters, countertop slabs, and backsplash.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              {/* Carcass Options */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-[#292929] uppercase tracking-wider block">
                  A. Cabinet Internal Carcass Board
                </span>
                <div className="space-y-3">
                  {initialMaterials.filter(m => m.category_id === 'carcass').map((mat) => (
                    <MaterialCard
                      key={mat.name}
                      material={mat}
                      isSelected={materials.carcass === mat.name}
                      onSelect={() => selectMaterial('carcass', mat.name)}
                    />
                  ))}
                </div>
              </div>

              {/* Shutter Options */}
              <div className="space-y-4">
                <span className="text-xs font-bold text-[#292929] uppercase tracking-wider block">
                  B. Cabinet Shutters & External Finish
                </span>
                <div className="space-y-3">
                  {initialMaterials.filter(m => m.category_id === 'shutters').slice(0, 3).map((mat) => (
                    <MaterialCard
                      key={mat.name}
                      material={mat}
                      isSelected={materials.shutters === mat.name}
                      onSelect={() => selectMaterial('shutters', mat.name)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Hardware & Fittings */}
        {currentStep === 5 && (
          <div className="bg-white p-8 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-6">
            <div>
              <span className="text-xs font-bold text-[#52634A] uppercase tracking-wider block">Step 5 of 8</span>
              <h3 className="font-serif font-bold text-3xl text-[#292929]">Hardware, Appliances & Sinks</h3>
              <p className="text-xs text-[#6B6862]">Select German tandem drawer boxes, built-in chimneys, and composite sinks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#292929] block">Hardware Runners</span>
                {initialMaterials.filter(m => m.category_id === 'hardware').slice(0, 2).map((m) => (
                  <MaterialCard
                    key={m.name}
                    material={m}
                    isSelected={materials.hardware === m.name}
                    onSelect={() => selectMaterial('hardware', m.name)}
                  />
                ))}
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-[#292929] block">Built-in Chimneys</span>
                {initialMaterials.filter(m => m.category_id === 'appliances').slice(0, 2).map((m) => (
                  <MaterialCard
                    key={m.name}
                    material={m}
                    isSelected={materials.appliances === m.name}
                    onSelect={() => selectMaterial('appliances', m.name)}
                  />
                ))}
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-[#292929] block">Sinks & Faucets</span>
                {initialMaterials.filter(m => m.category_id === 'sinks').slice(0, 2).map((m) => (
                  <MaterialCard
                    key={m.name}
                    material={m}
                    isSelected={materials.sinks === m.name}
                    onSelect={() => selectMaterial('sinks', m.name)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Interactive 3D Visualization */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#52634A] uppercase tracking-wider block">Step 6 of 8</span>
                <h3 className="font-serif font-bold text-3xl text-[#292929]">Interactive 3D Kitchen Studio</h3>
                <p className="text-xs text-[#6B6862]">Real-time rendering reflecting your exact layout and material selections.</p>
              </div>
            </div>
            <KitchenScene3D height="620px" />
          </div>
        )}

        {/* STEP 7: Automated Cost Estimator */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <CostBreakdownChart />
            <div className="flex justify-end">
              <button
                onClick={() => setQuotationModalOpen(true)}
                className="px-6 py-3.5 bg-[#52634A] text-white rounded-2xl text-xs font-semibold shadow-md hover:bg-[#3E4B38] transition-all"
              >
                View Detailed Official PDF Quotation
              </button>
            </div>
          </div>
        )}

        {/* STEP 8: Save & Finalize / Consultation */}
        {currentStep === 8 && (
          <div className="bg-white p-8 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-8 text-center max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#52634A] uppercase tracking-wider block">Step 8 of 8 • Ready to Build</span>
              <h3 className="font-serif font-bold text-3xl text-[#292929]">Your Dream Kitchen is Designed</h3>
              <p className="text-sm text-[#6B6862] max-w-lg mx-auto">
                Estimated at <span className="font-bold text-[#52634A]">₹{costBreakdown.total.toLocaleString('en-IN')}</span> with all selected materials, Blum/Hettich hardware, and installation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto pt-2">
              <button
                onClick={handleSave}
                className="py-3.5 px-6 bg-[#52634A] hover:bg-[#3E4B38] text-white rounded-2xl text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Design to Account
              </button>

              <button
                onClick={() => onSelectTab('consultation')}
                className="py-3.5 px-6 bg-[#B69A65] hover:bg-[#9B804E] text-white rounded-2xl text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" /> Book Consultation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer (Back / Next Buttons) */}
      <div className="flex items-center justify-between pt-6 border-t border-[#D9C8AE]/50">
        <button
          onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-[#D9C8AE] text-[#292929] hover:bg-[#F8F5EF] text-xs font-semibold disabled:opacity-40 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Previous Step
        </button>

        <span className="text-xs text-[#6B6862] font-semibold">
          Step {currentStep} of {steps.length}
        </span>

        <button
          onClick={() => setCurrentStep((s) => Math.min(steps.length, s + 1))}
          disabled={currentStep === steps.length}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#52634A] hover:bg-[#3E4B38] text-white text-xs font-semibold shadow-md disabled:opacity-40 transition-all"
        >
          Next Step <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Official Quotation Modal */}
      <CostQuotationModal
        isOpen={quotationModalOpen}
        onClose={() => setQuotationModalOpen(false)}
      />
    </div>
  );
}
