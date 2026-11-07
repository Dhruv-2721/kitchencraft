import React from 'react';
import { Check, Info, ShieldCheck, Sparkles, Scale } from 'lucide-react';
import { useProject } from '../../context/ProjectContext.jsx';
import Card3DTilt from '../common/Card3DTilt.jsx';

export default function MaterialCard({
  material,
  isSelected,
  onSelect,
  onViewDetails,
  onToggleCompare,
  isCompared
}) {
  const { selectMaterial } = useProject();

  const handleApply = () => {
    if (onSelect) onSelect(material);
    else selectMaterial(material.category_id, material.name);
  };

  // Quality badge color
  const qualityBadges = {
    Luxury: 'bg-amber-100 text-amber-900 border-amber-300',
    Premium: 'bg-[#52634A]/10 text-[#52634A] border-[#52634A]/30',
    Standard: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return (
    <Card3DTilt
      maxTilt={6}
      scale={1.015}
      className={`group relative bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col ${
        isSelected
          ? 'border-[#52634A] ring-2 ring-[#52634A]/20 shadow-xl'
          : 'border-[#D9C8AE]/50 hover:border-[#52634A]/60 card-shadow'
      }`}
    >
      {/* Product Image */}
      <div className="relative h-48 bg-[#F0E8DC] overflow-hidden">
        <img
          src={material.image_url || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'}
          alt={material.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Brand Tag Top Left */}
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-xl text-[11px] font-bold text-[#292929] shadow-sm">
          {material.brand}
        </div>

        {/* Quality Grade Badge Top Right */}
        <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-sm ${qualityBadges[material.quality_grade] || qualityBadges.Standard}`}>
          {material.quality_grade}
        </div>

        {/* Texture Swatch preview if available */}
        {material.texture_color && (
          <div
            title={`Surface color: ${material.texture_color}`}
            style={{ backgroundColor: material.texture_color }}
            className="absolute bottom-3 right-3 w-6 h-6 rounded-full border-2 border-white shadow-md"
          />
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="text-[11px] font-semibold text-[#879883] uppercase tracking-wider mb-1">
            {material.finish || material.material_type}
          </div>
          <h4 className="font-serif font-bold text-base text-[#292929] group-hover:text-[#52634A] transition-colors line-clamp-1">
            {material.name}
          </h4>
          <p className="text-xs text-[#6B6862] line-clamp-2 mt-1">
            {material.description}
          </p>
        </div>

        {/* Key Specs / Thickness & Warranty */}
        <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#F8F5EF] p-2.5 rounded-xl border border-[#D9C8AE]/30">
          <div>
            <span className="text-[#6B6862] block">Thickness:</span>
            <span className="font-semibold text-[#292929] truncate block">{material.thickness || 'Standard'}</span>
          </div>
          <div>
            <span className="text-[#6B6862] block">Warranty:</span>
            <span className="font-semibold text-[#52634A] truncate block">{material.warranty || 'Verified'}</span>
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-2 border-t border-[#D9C8AE]/40 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-[#6B6862] block">Indicative Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-bold text-[#292929]">
                ₹{material.price_inr.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-[#6B6862]">/{material.unit}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleCompare && onToggleCompare(material)}
              title="Compare side-by-side"
              className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                isCompared
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-white text-[#6B6862] border-[#D9C8AE] hover:bg-[#F8F5EF]'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onViewDetails && onViewDetails(material)}
              title="View full specifications"
              className="p-2 rounded-xl bg-white text-[#6B6862] hover:text-[#292929] border border-[#D9C8AE] hover:bg-[#F8F5EF] text-xs font-semibold transition-all"
            >
              <Info className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleApply}
              title={isSelected ? 'Click to unselect / remove from kitchen' : 'Add to your kitchen specification'}
              className={`px-3 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#52634A] hover:bg-rose-700 text-white group/btn'
                  : 'bg-[#52634A] hover:bg-[#3E4B38] text-white'
              }`}
            >
              {isSelected ? (
                <>
                  <Check className="w-3.5 h-3.5 group-hover/btn:hidden" />
                  <span className="group-hover/btn:hidden">Selected</span>
                  <span className="hidden group-hover/btn:inline font-bold">✕ Unselect</span>
                </>
              ) : (
                'Add to Kitchen'
              )}
            </button>
          </div>
        </div>
      </div>
    </Card3DTilt>
  );
}
