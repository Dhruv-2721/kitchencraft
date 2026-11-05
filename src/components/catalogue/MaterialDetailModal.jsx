import React from 'react';
import { X, Check, ShieldCheck, Sparkles, Wrench, Heart, Share2 } from 'lucide-react';
import { useProject } from '../../context/ProjectContext.jsx';

export default function MaterialDetailModal({ material, isOpen, onClose }) {
  const { selectMaterial, materials } = useProject();

  if (!isOpen || !material) return null;

  const isSelected = materials[material.category_id] === material.name;

  const handleApply = () => {
    selectMaterial(material.category_id, material.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#D9C8AE]/50 my-8 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-[#292929] rounded-full shadow-md backdrop-blur-sm transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Top Image */}
        <div className="relative h-64 bg-gray-100 overflow-hidden">
          <img
            src={material.image_url}
            alt={material.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="px-3 py-1 bg-[#52634A] rounded-full text-[11px] font-bold uppercase tracking-wider inline-block mb-1">
              {material.brand}
            </span>
            <h3 className="text-2xl font-serif font-bold text-white">{material.name}</h3>
          </div>
        </div>

        {/* Body Specifications */}
        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-sm text-[#6B6862] leading-relaxed">
            {material.description}
          </p>

          {/* Key Attribute Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-[#F8F5EF] p-3 rounded-2xl border border-[#D9C8AE]/40">
              <span className="text-[#6B6862] block mb-0.5">Quality Grade</span>
              <span className="font-bold text-[#52634A] text-sm">{material.quality_grade}</span>
            </div>
            <div className="bg-[#F8F5EF] p-3 rounded-2xl border border-[#D9C8AE]/40">
              <span className="text-[#6B6862] block mb-0.5">Thickness</span>
              <span className="font-bold text-[#292929] text-sm">{material.thickness || 'Standard'}</span>
            </div>
            <div className="bg-[#F8F5EF] p-3 rounded-2xl border border-[#D9C8AE]/40">
              <span className="text-[#6B6862] block mb-0.5">Finish / Texture</span>
              <span className="font-bold text-[#292929] text-sm">{material.finish || 'Custom'}</span>
            </div>
          </div>

          {/* Durability, Maintenance, Warranty */}
          <div className="space-y-3 border-t border-[#D9C8AE]/40 pt-4 text-xs">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-[#52634A] mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-[#292929]">Durability & Weather Resistance:</span>
                <p className="text-[#6B6862]">{material.durability || 'Resistant to moisture, stains and daily household wear.'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Wrench className="w-4 h-4 text-[#52634A] mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-[#292929]">Care & Maintenance:</span>
                <p className="text-[#6B6862]">{material.maintenance || 'Wipe clean with a microfiber cloth and mild neutral cleaner.'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-[#292929]">Manufacturer Warranty:</span>
                <p className="text-[#6B6862]">{material.warranty || 'Standard 10-Year Comprehensive Warranty.'}</p>
              </div>
            </div>
          </div>

          {/* Pricing and Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#D9C8AE]/40">
            <div>
              <span className="text-xs text-[#6B6862] block">Indian Market Benchmark Rate</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-[#292929]">₹{material.price_inr.toLocaleString('en-IN')}</span>
                <span className="text-xs text-[#6B6862]">per {material.unit}</span>
              </div>
            </div>

            <button
              onClick={handleApply}
              className={`px-6 py-3 rounded-2xl text-xs font-bold shadow-lg transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#52634A] hover:bg-[#3E4B38] text-white'
              }`}
            >
              {isSelected ? <Check className="w-4 h-4" /> : null}
              {isSelected ? 'Applied to Kitchen' : 'Select for Kitchen'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
