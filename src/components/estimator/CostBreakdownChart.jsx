import React from 'react';
import { IndianRupee, PieChart, TrendingUp } from 'lucide-react';
import { useProject } from '../../context/ProjectContext.jsx';

export default function CostBreakdownChart({ showHeader = true }) {
  const { costBreakdown } = useProject();

  const items = [
    { label: 'Cabinet Carcass', amount: costBreakdown.carcass, color: '#C29B72' },
    { label: 'Shutters & Finishes', amount: costBreakdown.shutters, color: '#52634A' },
    { label: 'Countertop Slab', amount: costBreakdown.countertop, color: '#B69A65' },
    { label: 'Backsplash Wall', amount: costBreakdown.backsplash, color: '#879883' },
    { label: 'Hardware & Fittings', amount: costBreakdown.hardware, color: '#3E4B38' },
    { label: 'Storage Solutions', amount: costBreakdown.storage, color: '#D9C8AE' },
    { label: 'Built-in Appliances', amount: costBreakdown.appliances, color: '#292929' },
    { label: 'Sink & Faucets', amount: costBreakdown.sinks, color: '#7E8B76' },
    { label: 'LED & Lighting', amount: costBreakdown.lighting, color: '#E4A853' },
    { label: 'Flooring & Paint', amount: costBreakdown.flooring, color: '#A39988' },
    { label: 'Labour & Installation', amount: costBreakdown.labour, color: '#6B6862' },
    { label: 'Packaging & Transit', amount: costBreakdown.transportation, color: '#8D7B68' }
  ];

  const totalWithoutGst = costBreakdown.materialSubtotal + costBreakdown.labour + costBreakdown.transportation;

  // Compute SVG Donut Chart slices
  let cumulativePercent = 0;
  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-6">
      {showHeader && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D9C8AE]/40 pb-5">
          <div>
            <span className="text-xs font-bold text-[#52634A] uppercase tracking-wider block">
              Automated Estimation Engine
            </span>
            <h3 className="text-2xl font-serif font-bold text-[#292929]">
              Comprehensive Cost Breakdown
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#6B6862] block">Total Estimated Cost (incl. 18% GST)</span>
            <div className="text-3xl font-serif font-bold text-[#52634A] flex items-center justify-end">
              <span>₹{costBreakdown.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Donut & High-Level Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* SVG Donut Chart */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-56 h-56">
            <svg viewBox="-1 -1 2 2" className="w-full h-full -rotate-90">
              {items.map((item, idx) => {
                const fraction = item.amount / totalWithoutGst;
                const startPercent = cumulativePercent;
                const endPercent = cumulativePercent + fraction;
                cumulativePercent += fraction;

                const [startX, startY] = getCoordinatesForPercent(startPercent);
                const [endX, endY] = getCoordinatesForPercent(endPercent);
                const largeArcFlag = fraction > 0.5 ? 1 : 0;
                const pathData = `M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;

                return (
                  <path
                    key={idx}
                    d={pathData}
                    fill={item.color}
                    className="hover:opacity-85 transition-opacity cursor-pointer"
                  >
                    <title>{`${item.label}: ₹${item.amount.toLocaleString('en-IN')}`}</title>
                  </path>
                );
              })}
              {/* Inner cutout for donut hole */}
              <circle cx="0" cy="0" r="0.65" fill="#FFFFFF" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[11px] font-semibold text-[#6B6862] uppercase tracking-wider">Estimated Budget</span>
              <span className="text-xl font-serif font-bold text-[#292929]">
                ₹{(costBreakdown.total / 100000).toFixed(2)}L
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                Indicative Quote
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Bars & Legend */}
        <div className="md:col-span-7 space-y-3">
          {items.map((item, idx) => {
            const percentage = ((item.amount / totalWithoutGst) * 100).toFixed(1);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-medium text-[#292929]">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.label}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#6B6862] text-[11px]">{percentage}%</span>
                    <span className="font-semibold text-[#292929] w-20 text-right">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-[#F0E8DC] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tax and Grand Total Summary Box */}
      <div className="bg-[#F8F5EF] p-5 rounded-2xl border border-[#D9C8AE]/50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div>
          <span className="text-[11px] text-[#6B6862] block">Material Subtotal</span>
          <span className="text-base font-bold text-[#292929]">
            ₹{costBreakdown.materialSubtotal.toLocaleString('en-IN')}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[#6B6862] block">Labour & Civil Work</span>
          <span className="text-base font-bold text-[#292929]">
            ₹{costBreakdown.labour.toLocaleString('en-IN')}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[#6B6862] block">Applicable GST (18%)</span>
          <span className="text-base font-bold text-[#292929]">
            ₹{costBreakdown.gst.toLocaleString('en-IN')}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[#52634A] font-bold block">Final Estimate</span>
          <span className="text-lg font-serif font-bold text-[#52634A]">
            ₹{costBreakdown.total.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}
