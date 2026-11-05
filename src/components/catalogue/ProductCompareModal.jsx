import React from 'react';
import { X, Check, Scale } from 'lucide-react';
import { useProject } from '../../context/ProjectContext.jsx';

export default function ProductCompareModal({ products = [], isOpen, onClose, onClear }) {
  const { selectMaterial, materials } = useProject();

  if (!isOpen || products.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#D9C8AE]/50 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F8F5EF] border-b border-[#D9C8AE]/50">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#52634A]" />
            <h3 className="font-serif font-bold text-lg text-[#292929]">
              Compare Materials ({products.length} Selected)
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClear}
              className="text-xs font-semibold text-[#6B6862] hover:text-red-600 transition-colors"
            >
              Clear Comparison
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Side-by-side comparison grid */}
        <div className="p-6 sm:p-8 overflow-x-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((item) => {
              const isSelected = materials[item.category_id] === item.name;
              return (
                <div key={item.id} className="bg-[#F8F5EF] p-5 rounded-2xl border border-[#D9C8AE]/50 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-36 rounded-xl overflow-hidden bg-gray-200">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-[#52634A] uppercase block">{item.brand}</span>
                      <h4 className="font-serif font-bold text-base text-[#292929] line-clamp-1">{item.name}</h4>
                    </div>

                    <div className="space-y-2 text-xs divide-y divide-[#D9C8AE]/30">
                      <div className="pt-2 flex justify-between">
                        <span className="text-[#6B6862]">Price:</span>
                        <span className="font-bold text-[#292929]">₹{item.price_inr.toLocaleString('en-IN')}/{item.unit}</span>
                      </div>
                      <div className="pt-2 flex justify-between">
                        <span className="text-[#6B6862]">Grade:</span>
                        <span className="font-bold text-[#52634A]">{item.quality_grade}</span>
                      </div>
                      <div className="pt-2 flex justify-between">
                        <span className="text-[#6B6862]">Thickness:</span>
                        <span className="font-semibold text-[#292929]">{item.thickness || 'N/A'}</span>
                      </div>
                      <div className="pt-2 flex justify-between">
                        <span className="text-[#6B6862]">Warranty:</span>
                        <span className="font-semibold text-[#292929]">{item.warranty || 'N/A'}</span>
                      </div>
                      <div className="pt-2">
                        <span className="text-[#6B6862] block mb-1">Durability:</span>
                        <p className="text-[11px] text-[#292929]">{item.durability}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      selectMaterial(item.category_id, item.name);
                      onClose();
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#52634A] hover:bg-[#3E4B38] text-white'
                    }`}
                  >
                    {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                    {isSelected ? 'Currently Selected' : 'Choose This Material'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
