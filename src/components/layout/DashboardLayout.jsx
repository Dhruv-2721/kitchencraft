import React from 'react';
import {
  LayoutDashboard, FolderHeart, PlusCircle, UploadCloud,
  Layers, BookOpen, Box, Calculator, BookmarkCheck,
  CalendarCheck, UserCircle, Settings, LogOut, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useProject } from '../../context/ProjectContext.jsx';

export default function DashboardLayout({ activeSection, onSelectSection, children }) {
  const { user, logout } = useAuth();
  const { projectTitle, costBreakdown } = useProject();

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'My Kitchen Projects', icon: FolderHeart },
    { id: 'designer', label: 'Start New Design', icon: PlusCircle, badge: 'New' },
    { id: 'upload', label: 'Upload Kitchen Image', icon: UploadCloud },
    { id: 'layouts', label: 'Kitchen Layouts', icon: Layers },
    { id: 'catalogue', label: 'Material Catalogue', icon: BookOpen },
    { id: '3d-studio', label: '3D Visualization', icon: Box, highlight: true },
    { id: 'estimator', label: 'Cost Estimator', icon: Calculator },
    { id: 'saved-designs', label: 'Saved Designs', icon: BookmarkCheck },
    { id: 'consultations', label: 'Consultations', icon: CalendarCheck },
    { id: 'profile', label: 'My Profile', icon: UserCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#F8F5EF] flex">
      {/* Dashboard Sidebar */}
      <aside className="w-64 bg-white border-r border-[#D9C8AE]/50 hidden md:flex flex-col justify-between shrink-0 p-5">
        <div className="space-y-6">
          {/* User profile capsule */}
          <div className="p-3 bg-[#F8F5EF] rounded-2xl border border-[#D9C8AE]/40 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#52634A] text-white flex items-center justify-center font-bold text-sm">
              {user?.full_name ? user.full_name.charAt(0) : 'U'}
            </div>
            <div className="overflow-hidden">
              <h5 className="text-xs font-bold text-[#292929] truncate">{user?.full_name || 'Homeowner'}</h5>
              <span className="text-[10px] text-[#6B6862] block truncate">{user?.email || 'sarah@example.com'}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="text-[10px] font-bold text-[#6B6862] uppercase tracking-wider px-3 block mb-2">
              Workspace
            </span>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectSection(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#52634A] text-white shadow-sm'
                      : 'text-[#292929] hover:bg-[#F8F5EF] hover:text-[#52634A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-200' : 'text-[#6B6862]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[9px] font-bold">
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#52634A]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Current Estimate Pill & Logout */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="p-3 bg-[#F8F5EF] rounded-xl text-center border border-[#D9C8AE]/40">
            <span className="text-[10px] text-[#6B6862] block">Current Estimate</span>
            <span className="text-sm font-bold text-[#52634A]">
              ₹{costBreakdown.total.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
