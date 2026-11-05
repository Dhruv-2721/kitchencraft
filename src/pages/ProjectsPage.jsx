import React, { useState } from 'react';
import {
  FolderHeart, Plus, Copy, Trash2, Edit3, Share2,
  ExternalLink, Scale, Check, Calendar, ArrowRight, Box
} from 'lucide-react';
import { useProject } from '../context/ProjectContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProjectsPage({ onSelectTab }) {
  const { savedProjects, loadProject, saveProject } = useProject();
  const { user } = useAuth();

  const [compareProjects, setCompareProjects] = useState([]);
  const [copiedToken, setCopiedToken] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  const handleShare = (token) => {
    const url = `${window.location.origin}/share/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(''), 2500);
  };

  const handleToggleCompare = (proj) => {
    setCompareProjects((prev) => {
      const exists = prev.find((p) => p.id === proj.id);
      if (exists) return prev.filter((p) => p.id !== proj.id);
      if (prev.length >= 2) return [prev[1], proj];
      return [...prev, proj];
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#D9C8AE]/50 card-shadow">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F0E8DC] text-[#52634A] rounded-full text-xs font-bold mb-1">
            <FolderHeart className="w-3.5 h-3.5" /> Project Portfolio
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#292929]">
            My Kitchen Designs
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6862]">
            Reopen previously customized designs, create version duplicates, and compare different material aesthetics.
          </p>
        </div>

        <button
          onClick={() => onSelectTab('designer')}
          className="flex items-center gap-2 px-5 py-3 bg-[#52634A] hover:bg-[#3E4B38] text-white rounded-2xl text-xs font-semibold shadow-md transition-all"
        >
          <Plus className="w-4 h-4" /> Start New Design
        </button>
      </div>

      {/* Side-by-Side Design Comparison Drawer if 2 projects selected */}
      {compareProjects.length === 2 && (
        <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border-2 border-[#52634A] card-shadow space-y-6">
          <div className="flex items-center justify-between border-b border-[#D9C8AE]/50 pb-4">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#52634A]" />
              <h3 className="font-serif font-bold text-xl text-[#292929]">
                Side-by-Side Design Comparison
              </h3>
            </div>
            <button
              onClick={() => setCompareProjects([])}
              className="text-xs text-red-600 font-semibold hover:underline"
            >
              Close Comparison
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {compareProjects.map((p, idx) => (
              <div key={p.id} className="p-5 bg-[#F8F5EF] rounded-2xl border border-[#D9C8AE]/50 space-y-3">
                <span className="text-[10px] font-bold text-[#52634A] uppercase tracking-wider">
                  Design Option {idx + 1}
                </span>
                <h4 className="font-serif font-bold text-2xl text-[#292929]">{p.title}</h4>
                <div className="text-xl font-serif font-bold text-[#52634A]">
                  ₹{(p.estimated_cost_inr || 450000).toLocaleString('en-IN')}
                </div>
                <div className="text-xs space-y-1.5 pt-2 border-t border-[#D9C8AE]/40 text-[#6B6862]">
                  <div><span className="font-semibold text-[#292929]">Layout:</span> {p.layout_type}</div>
                  <div><span className="font-semibold text-[#292929]">Status:</span> {p.status || 'Ready'}</div>
                </div>
                <button
                  onClick={() => {
                    loadProject(p);
                    onSelectTab('3d-studio');
                  }}
                  className="w-full mt-2 py-2.5 bg-[#52634A] text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-[#3E4B38]"
                >
                  Load in 3D Studio
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedProjects.map((proj) => {
          const isCompared = Boolean(compareProjects.find((cp) => cp.id === proj.id));
          return (
            <div
              key={proj.id}
              className={`bg-white rounded-3xl overflow-hidden border transition-all card-shadow flex flex-col justify-between ${
                isCompared ? 'border-[#52634A] ring-2 ring-[#52634A]/20' : 'border-[#D9C8AE]/50 hover:border-[#52634A]'
              }`}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-[#F0E8DC] text-[#52634A] rounded-full text-[11px] font-bold">
                    {proj.layout_type || 'L-Shaped'}
                  </span>
                  <span className="text-[10px] text-[#6B6862] font-mono">
                    v{proj.version || 1}.0
                  </span>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-xl text-[#292929] mb-1">
                    {proj.title}
                  </h4>
                  <div className="text-lg font-serif font-bold text-[#52634A]">
                    ₹{(proj.estimated_cost_inr || 485000).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="text-xs text-[#6B6862] space-y-1 bg-[#F8F5EF] p-3 rounded-2xl border border-[#D9C8AE]/30">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-semibold text-emerald-800">{proj.status || 'Ready'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Modified:</span>
                    <span>{new Date(proj.updated_at || Date.now()).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleCompare(proj)}
                    title="Compare two designs"
                    className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                      isCompared
                        ? 'bg-[#52634A] text-white border-[#52634A]'
                        : 'bg-white text-[#6B6862] border-[#D9C8AE] hover:bg-[#F8F5EF]'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleShare(proj.share_token || 'demo')}
                    title="Copy share link"
                    className="p-2 rounded-xl bg-white text-[#6B6862] hover:text-[#292929] border border-[#D9C8AE] hover:bg-[#F8F5EF] transition-all"
                  >
                    {copiedToken === proj.share_token ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <button
                  onClick={() => {
                    loadProject(proj);
                    onSelectTab('3d-studio');
                  }}
                  className="px-4 py-2 bg-[#52634A] hover:bg-[#3E4B38] text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Box className="w-3.5 h-3.5" /> Open in 3D
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
