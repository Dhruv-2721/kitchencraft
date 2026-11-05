import React, { useState } from 'react';
import {
  Compass, Box, Layers, Calculator, Calendar, User, LogIn, LogOut,
  Shield, Menu, X, Sparkles, FolderHeart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useProject } from '../../context/ProjectContext.jsx';

export default function Navbar({ activeTab, onSelectTab, onOpenAuth }) {
  const { user, logout, demoLogin, isAdmin } = useAuth();
  const { projectTitle, costBreakdown } = useProject();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'designer', label: 'Guided Designer', highlight: true },
    { id: '3d-studio', label: '3D Studio' },
    { id: 'layouts', label: 'Kitchen Layouts' },
    { id: 'catalogue', label: 'Material Catalogue' },
    { id: 'estimator', label: 'Cost Estimator' },
    { id: 'consultation', label: 'Book Consultation' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#D9C8AE]/50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#52634A] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <span className="font-serif font-bold text-2xl tracking-tight text-[#292929]">
              KITCHEN<span className="text-[#52634A]">craft</span>
            </span>
            <span className="text-[10px] tracking-widest text-[#B69A65] uppercase block font-semibold">
              Interactive 3D Studio
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onSelectTab(link.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                activeTab === link.id
                  ? 'text-[#52634A] bg-[#F0E8DC]/60'
                  : 'text-[#292929] hover:text-[#52634A] hover:bg-[#F8F5EF]'
              } ${link.highlight ? 'text-[#52634A]' : ''}`}
            >
              {link.label}
              {link.highlight && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
              )}
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => onSelectTab('admin')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'text-amber-800 hover:bg-amber-50'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Admin Panel
            </button>
          )}
        </nav>

        {/* Right Section: Active Project Tag & User Menu */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Active project mini pill */}
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#F8F5EF] hover:bg-[#F0E8DC] border border-[#D9C8AE]/60 rounded-xl text-xs transition-all"
          >
            <FolderHeart className="w-3.5 h-3.5 text-[#52634A]" />
            <span className="font-semibold text-[#292929] max-w-[120px] truncate">{projectTitle}</span>
            <span className="text-[11px] font-bold text-[#52634A] bg-white px-1.5 py-0.5 rounded-md border border-[#D9C8AE]/40">
              ₹{(costBreakdown.total / 100000).toFixed(1)}L
            </span>
          </button>

          {/* User Account / Login */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 bg-white hover:bg-[#F8F5EF] border border-[#D9C8AE] rounded-2xl transition-all shadow-sm"
              >
                <div className="w-7 h-7 rounded-full bg-[#52634A] text-white flex items-center justify-center text-xs font-bold">
                  {user.full_name ? user.full_name.charAt(0) : 'U'}
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-[#292929] block line-clamp-1">{user.full_name || user.email}</span>
                  <span className="text-[10px] text-[#6B6862] block capitalize">{user.role}</span>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-[#D9C8AE]/50 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-[#292929]">{user.full_name}</p>
                    <p className="text-[11px] text-[#6B6862] truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      onSelectTab('dashboard');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-[#292929] hover:bg-[#F8F5EF]"
                  >
                    User Dashboard
                  </button>
                  <button
                    onClick={() => {
                      onSelectTab('projects');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-[#292929] hover:bg-[#F8F5EF]"
                  >
                    My Saved Kitchens
                  </button>
                  <button
                    onClick={() => {
                      onSelectTab('consultation');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-[#292929] hover:bg-[#F8F5EF]"
                  >
                    Consultation Requests
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        onSelectTab('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-amber-800 hover:bg-amber-50"
                    >
                      Admin Dashboard
                    </button>
                  )}
                  <div className="border-t border-gray-100 my-1" />
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => demoLogin('user')}
                className="px-3 py-2 bg-[#F8F5EF] hover:bg-[#F0E8DC] text-[#292929] rounded-xl text-xs font-semibold transition-all border border-[#D9C8AE]/50"
                title="Log in with pre-configured homeowner account"
              >
                Demo User
              </button>
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#52634A] hover:bg-[#3E4B38] text-white rounded-xl text-xs font-semibold shadow-md transition-all"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In / Join
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#292929] hover:bg-[#F8F5EF]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#D9C8AE]/50 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onSelectTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
                activeTab === link.id
                  ? 'bg-[#52634A] text-white'
                  : 'text-[#292929] hover:bg-[#F8F5EF]'
              }`}
            >
              {link.label}
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => {
                onSelectTab('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold bg-amber-100 text-amber-900"
            >
              Admin Dashboard
            </button>
          )}
          <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
            {!user ? (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-[#52634A] text-white rounded-xl text-xs font-semibold text-center"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-red-600 text-xs font-semibold text-center"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
