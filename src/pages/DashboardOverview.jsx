import React from 'react';
import {
  LayoutDashboard, FolderHeart, Plus, Box, Calculator,
  CalendarCheck, ArrowRight, Sparkles, BookOpen, Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useProject } from '../context/ProjectContext.jsx';

export default function DashboardOverview({ onSelectTab }) {
  const { user } = useAuth();
  const { savedProjects, projectTitle, layoutType, costBreakdown, loadProject } = useProject();

  const metrics = [
    { label: 'Saved Kitchen Designs', value: savedProjects.length || 3, icon: FolderHeart, color: '#52634A' },
    { label: 'Active Project Budget', value: `₹${(costBreakdown.total / 100000).toFixed(2)}L`, icon: Calculator, color: '#B69A65' },
    { label: 'Active Kitchen Layout', value: layoutType, icon: Box, color: '#292929' },
    { label: 'Consultations Scheduled', value: '1 Active', icon: CalendarCheck, color: '#879883' }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white p-8 rounded-3xl border border-[#D9C8AE]/50 card-shadow flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#52634A] uppercase tracking-wider block">
            Welcome back to your studio
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#292929]">
            Hello, {user?.full_name || 'Homeowner'}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6862]">
            Continue customizing your modular kitchen or launch the 3D walkthrough to review lighting and material finishes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('designer')}
            className="flex items-center gap-2 px-5 py-3 bg-[#52634A] hover:bg-[#3E4B38] text-white rounded-2xl text-xs font-semibold shadow-md transition-all"
          >
            <Plus className="w-4 h-4" /> Start New Kitchen
          </button>
          <button
            onClick={() => onSelectTab('3d-studio')}
            className="flex items-center gap-2 px-5 py-3 bg-[#F8F5EF] hover:bg-[#F0E8DC] text-[#292929] border border-[#D9C8AE] rounded-2xl text-xs font-semibold transition-all"
          >
            <Box className="w-4 h-4 text-[#52634A]" /> Launch 3D Studio
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#6B6862] uppercase tracking-wider">{m.label}</span>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: m.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-serif font-bold text-[#292929]">{m.value}</div>
            </div>
          );
        })}
      </div>

      {/* Currently Active Kitchen Preview Card */}
      <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border border-[#D9C8AE]/50 card-shadow space-y-4">
        <div className="flex items-center justify-between border-b border-[#D9C8AE]/40 pb-4">
          <div>
            <span className="text-[11px] font-bold text-[#52634A] uppercase tracking-wider block">
              Currently Loaded Design
            </span>
            <h3 className="font-serif font-bold text-2xl text-[#292929]">{projectTitle}</h3>
          </div>
          <button
            onClick={() => onSelectTab('3d-studio')}
            className="px-4 py-2 bg-[#52634A] text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-[#3E4B38] flex items-center gap-1.5"
          >
            <Box className="w-3.5 h-3.5" /> View in 3D Studio
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-[#F8F5EF] p-4 rounded-2xl border border-[#D9C8AE]/30">
          <div>
            <span className="text-[#6B6862] block mb-0.5">Layout Geometry</span>
            <span className="font-bold text-[#292929]">{layoutType} Kitchen</span>
          </div>
          <div>
            <span className="text-[#6B6862] block mb-0.5">Estimated Budget</span>
            <span className="font-bold text-[#52634A] text-sm">₹{costBreakdown.total.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-[#6B6862] block mb-0.5">Running Counter</span>
            <span className="font-bold text-[#292929]">{costBreakdown.runningFeet} Rft</span>
          </div>
          <div>
            <span className="text-[#6B6862] block mb-0.5">Civil Installation</span>
            <span className="font-bold text-[#292929]">Included (₹{costBreakdown.labour.toLocaleString('en-IN')})</span>
          </div>
        </div>
      </div>

      {/* Recent Kitchen Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-2xl text-[#292929]">
            Saved Kitchen Projects
          </h3>
          <button
            onClick={() => onSelectTab('projects')}
            className="text-xs font-bold text-[#52634A] hover:underline flex items-center gap-1"
          >
            View all projects <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {savedProjects.slice(0, 3).map((p) => (
            <div key={p.id} className="bg-white p-5 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-4 flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-0.5 bg-[#F0E8DC] text-[#52634A] rounded-full text-[10px] font-bold">
                  {p.layout_type || 'L-Shaped'}
                </span>
                <h4 className="font-serif font-bold text-lg text-[#292929] mt-2 line-clamp-1">{p.title}</h4>
                <div className="text-base font-serif font-bold text-[#52634A]">
                  ₹{(p.estimated_cost_inr || 450000).toLocaleString('en-IN')}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-[#6B6862]">Ready for Build</span>
                <button
                  onClick={() => {
                    loadProject(p);
                    onSelectTab('3d-studio');
                  }}
                  className="px-3 py-1.5 bg-[#52634A] text-white rounded-xl text-xs font-semibold hover:bg-[#3E4B38]"
                >
                  Load in 3D
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
