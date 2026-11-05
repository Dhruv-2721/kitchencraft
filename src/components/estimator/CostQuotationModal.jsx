import React, { useRef } from 'react';
import { X, Printer, Download, Share2, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { useProject } from '../../context/ProjectContext.jsx';

export default function CostQuotationModal({ isOpen, onClose }) {
  const { projectTitle, layoutType, dimensions, materials, costBreakdown, shareToken } = useProject();
  const printRef = useRef(null);
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const url = `${window.location.origin}/share/${shareToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#D9C8AE]/50 my-8 overflow-hidden">
        {/* Top Action Toolbar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F8F5EF] border-b border-[#D9C8AE]/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#52634A] uppercase tracking-wider">
              Official Quotation Preview
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-[#292929] hover:bg-gray-50 border border-[#D9C8AE] rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? 'Link Copied!' : 'Share Estimate'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#52634A] hover:bg-[#3E4B38] text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Formal Quotation Body */}
        <div ref={printRef} className="p-8 sm:p-10 space-y-8 bg-white text-[#292929]">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-[#52634A] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-serif font-bold text-3xl tracking-tight text-[#52634A]">KITCHENcraft</span>
              </div>
              <p className="text-xs text-[#6B6862]">
                Architectural Modular Kitchens & 3D Interior Visualizations
              </p>
              <p className="text-[11px] text-[#6B6862] mt-1">
                Studio 402, Design Promenade, Bangalore 560001 • GSTIN: 29AABCK9981M1Z5
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#6B6862] block">Quotation Reference</span>
              <span className="font-mono text-xs font-bold text-[#292929] block">KC-EST-{shareToken.substring(0, 10).toUpperCase()}</span>
              <span className="text-xs text-[#6B6862] block mt-1">Date: {today}</span>
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F8F5EF] rounded-2xl text-xs">
            <div>
              <span className="text-[#6B6862] block">Project Name:</span>
              <span className="font-bold text-[#292929]">{projectTitle}</span>
            </div>
            <div>
              <span className="text-[#6B6862] block">Kitchen Layout:</span>
              <span className="font-bold text-[#292929]">{layoutType} Kitchen</span>
            </div>
            <div>
              <span className="text-[#6B6862] block">Dimensions:</span>
              <span className="font-bold text-[#292929]">{dimensions.length} × {dimensions.width} ft ({dimensions.length * dimensions.width} sq.ft)</span>
            </div>
            <div>
              <span className="text-[#6B6862] block">Running Counter:</span>
              <span className="font-bold text-[#292929]">{costBreakdown.runningFeet} Running Feet (Rft)</span>
            </div>
          </div>

          {/* Itemized Estimate Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#D9C8AE] text-[#6B6862]">
                  <th className="py-2.5 font-bold">Category</th>
                  <th className="py-2.5 font-bold">Selected Material / Specification</th>
                  <th className="py-2.5 font-bold text-right">Estimated Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2.5 font-semibold text-[#292929]">Cabinet Carcass</td>
                  <td className="py-2.5 text-[#6B6862]">{materials.carcass} ({costBreakdown.carcassSqft} sq.ft)</td>
                  <td className="py-2.5 font-semibold text-right">₹{costBreakdown.carcass.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-[#292929]">Cabinet Shutters</td>
                  <td className="py-2.5 text-[#6B6862]">{materials.shutters} ({costBreakdown.shutterSqft} sq.ft)</td>
                  <td className="py-2.5 font-semibold text-right">₹{costBreakdown.shutters.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-[#292929]">Countertop Slab</td>
                  <td className="py-2.5 text-[#6B6862]">{materials.countertop} ({costBreakdown.counterSqft} sq.ft)</td>
                  <td className="py-2.5 font-semibold text-right">₹{costBreakdown.countertop.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-[#292929]">Backsplash Surface</td>
                  <td className="py-2.5 text-[#6B6862]">{materials.backsplash} ({costBreakdown.backsplashSqft} sq.ft)</td>
                  <td className="py-2.5 font-semibold text-right">₹{costBreakdown.backsplash.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-[#292929]">Hardware & Runners</td>
                  <td className="py-2.5 text-[#6B6862]">{materials.hardware} (Soft-Close Quadro)</td>
                  <td className="py-2.5 font-semibold text-right">₹{costBreakdown.hardware.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-[#292929]">Storage Organizers</td>
                  <td className="py-2.5 text-[#6B6862]">{materials.storage}</td>
                  <td className="py-2.5 font-semibold text-right">₹{costBreakdown.storage.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-[#292929]">Built-in Appliances</td>
                  <td className="py-2.5 text-[#6B6862]">{materials.appliances} + Hob</td>
                  <td className="py-2.5 font-semibold text-right">₹{costBreakdown.appliances.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-[#292929]">Sink & Faucets</td>
                  <td className="py-2.5 text-[#6B6862]">{materials.sinks} + Gooseneck Faucet</td>
                  <td className="py-2.5 font-semibold text-right">₹{costBreakdown.sinks.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-[#292929]">LED Task Lighting</td>
                  <td className="py-2.5 text-[#6B6862]">{materials.lighting}</td>
                  <td className="py-2.5 font-semibold text-right">₹{costBreakdown.lighting.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-[#292929]">Flooring & Wall Care</td>
                  <td className="py-2.5 text-[#6B6862]">{materials.flooring} ({costBreakdown.floorSqft} sq.ft)</td>
                  <td className="py-2.5 font-semibold text-right">₹{costBreakdown.flooring.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-[#292929]">Labour & Carpentry</td>
                  <td className="py-2.5 text-[#6B6862]">Factory-precision CNC fitting & on-site installation</td>
                  <td className="py-2.5 font-semibold text-right">₹{costBreakdown.labour.toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-semibold text-[#292929]">Packaging & Logistics</td>
                  <td className="py-2.5 text-[#6B6862]">Heavy crate packaging and direct-to-home transit</td>
                  <td className="py-2.5 font-semibold text-right">₹{costBreakdown.transportation.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200">
                  <td colSpan="2" className="pt-3 font-semibold text-right text-gray-700">Subtotal:</td>
                  <td className="pt-3 font-semibold text-right text-gray-900">
                    ₹{(costBreakdown.materialSubtotal + costBreakdown.labour + costBreakdown.transportation).toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr>
                  <td colSpan="2" className="py-1 text-right text-gray-600">Goods & Service Tax (GST 18%):</td>
                  <td className="py-1 font-semibold text-right text-gray-900">
                    ₹{costBreakdown.gst.toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr className="border-t border-[#52634A] text-sm">
                  <td colSpan="2" className="pt-3 font-serif font-bold text-right text-[#52634A]">
                    Total Estimated Investment:
                  </td>
                  <td className="pt-3 font-serif font-bold text-right text-xl text-[#52634A]">
                    ₹{costBreakdown.total.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer & Notice */}
          <div className="border-t border-gray-100 pt-6 text-[10px] text-gray-500 space-y-1">
            <p className="font-semibold text-gray-700">Terms & Disclaimer:</p>
            <p>1. This estimate is computed using calibrated standard unit rates and selected materials for reference purposes.</p>
            <p>2. Final contractor quotation will be confirmed following a 3D laser room scan and plumbing audit by our design engineer.</p>
            <p>3. Electrical conduits, plumbing relocation and civil demolition, if required, are billed on actual site measurement.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
