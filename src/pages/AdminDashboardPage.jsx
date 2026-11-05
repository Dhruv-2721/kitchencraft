import React, { useState, useEffect } from 'react';
import {
  Shield, Users, FolderHeart, BookOpen, CalendarCheck,
  TrendingUp, Plus, Edit2, Trash2, Check, X, Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { initialMaterials, initialCategories } from '../../server/src/seedData.js';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [adminTab, setAdminTab] = useState('overview'); // 'overview', 'materials', 'consultations', 'users'

  // Admin state
  const [materialsList, setMaterialsList] = useState(initialMaterials);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [newMaterialModal, setNewMaterialModal] = useState(false);
  const [consultations, setConsultations] = useState([
    {
      id: 1,
      name: 'Sarah Sharma',
      email: 'sarah@example.com',
      phone: '+91 91234 56789',
      preferred_date: '2026-11-12',
      preferred_time: '11:30 AM - 12:30 PM',
      project_title: 'The Malabar Emerald Modular Kitchen',
      status: 'Confirmed',
      assigned_designer: 'Ar. Vikramaditya (Principal Architect)'
    },
    {
      id: 2,
      name: 'Rajesh & Pooja Varma',
      email: 'varma.family@gmail.com',
      phone: '+91 98450 11223',
      preferred_date: '2026-11-15',
      preferred_time: '04:00 PM - 05:00 PM',
      project_title: 'Scandinavian Warm Oak Island Kitchen',
      status: 'Pending',
      assigned_designer: 'Ar. Ananya Sen (Senior Designer)'
    }
  ]);

  const [usersList, setUsersList] = useState([
    { id: 1, full_name: 'Principal Architect Admin', email: 'admin@kitchencraft.com', role: 'admin', phone: '+91 98765 43210', created_at: '2026-10-01' },
    { id: 2, full_name: 'Sarah Sharma', email: 'sarah@example.com', role: 'user', phone: '+91 91234 56789', created_at: '2026-10-15' },
    { id: 3, full_name: 'Rajesh Varma', email: 'varma.family@gmail.com', role: 'user', phone: '+91 98450 11223', created_at: '2026-11-02' }
  ]);

  // Form states for adding material
  const [newForm, setNewForm] = useState({
    name: '',
    brand: 'Hettich',
    category_id: 'hardware',
    quality_grade: 'Premium',
    price_inr: 4500,
    unit: 'unit',
    warranty: '10 Years',
    description: '',
    thickness: '18mm',
    texture_color: '#52634A'
  });

  const handleUpdateConsultationStatus = (id, newStatus) => {
    setConsultations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const handleAddMaterial = (e) => {
    e.preventDefault();
    const created = {
      id: Date.now(),
      ...newForm,
      image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'
    };
    setMaterialsList([created, ...materialsList]);
    setNewMaterialModal(false);
  };

  const handleUpdatePrice = (matName, newPrice) => {
    setMaterialsList((prev) =>
      prev.map((m) => (m.name === matName ? { ...m, price_inr: Number(newPrice) } : m))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-[#292929] to-[#1E1E1E] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5" /> Administrator Control Center
          </div>
          <h2 className="font-serif font-bold text-3xl text-white">
            KITCHENcraft Management System
          </h2>
          <p className="text-xs text-gray-300">
            Signed in as {user?.email} • Role: {user?.role?.toUpperCase()}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
          {[
            { id: 'overview', label: 'Overview Metrics' },
            { id: 'materials', label: 'Materials & Pricing' },
            { id: 'consultations', label: 'Consultations' },
            { id: 'users', label: 'User Directory' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                adminTab === tab.id
                  ? 'bg-white text-[#292929] shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. OVERVIEW METRICS */}
      {adminTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-2">
              <span className="text-xs font-bold text-[#6B6862] uppercase">Total Homeowners</span>
              <div className="text-3xl font-serif font-bold text-[#292929]">{usersList.length} Registered</div>
              <span className="text-[11px] text-emerald-700 font-semibold">+18% this month</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-2">
              <span className="text-xs font-bold text-[#6B6862] uppercase">Active 3D Kitchens</span>
              <div className="text-3xl font-serif font-bold text-[#52634A]">42 Projects</div>
              <span className="text-[11px] text-[#6B6862]">L-Shaped is #1 (48%)</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-2">
              <span className="text-xs font-bold text-[#6B6862] uppercase">Live Catalogue Items</span>
              <div className="text-3xl font-serif font-bold text-[#292929]">{materialsList.length} Products</div>
              <span className="text-[11px] text-[#6B6862]">Across 10 Categories</span>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-2">
              <span className="text-xs font-bold text-[#6B6862] uppercase">Consultations Pipeline</span>
              <div className="text-3xl font-serif font-bold text-amber-700">{consultations.length} Booked</div>
              <span className="text-[11px] text-emerald-700 font-semibold">1 Confirmed, 1 Pending</span>
            </div>
          </div>

          {/* Popular Layout Distribution */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-4">
            <h4 className="font-serif font-bold text-xl text-[#292929]">
              Most Popular Modular Layouts
            </h4>
            <div className="space-y-3">
              {[
                { name: 'L-Shaped Kitchen', percent: 48, count: 20 },
                { name: 'Island Kitchen', percent: 26, count: 11 },
                { name: 'Parallel / Galley', percent: 14, count: 6 },
                { name: 'Straight Line Kitchen', percent: 8, count: 3 },
                { name: 'U-Shaped Kitchen', percent: 4, count: 2 }
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-[#292929]">
                    <span>{item.name}</span>
                    <span>{item.percent}% ({item.count} kitchens)</span>
                  </div>
                  <div className="w-full h-2 bg-[#F0E8DC] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#52634A] rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. MATERIALS & PRICING MANAGEMENT */}
      {adminTab === 'materials' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D9C8AE]/40 pb-4">
            <div>
              <h4 className="font-serif font-bold text-2xl text-[#292929]">
                Material Master & Real-time Rates (INR)
              </h4>
              <p className="text-xs text-[#6B6862]">
                Update unit prices directly. Changes immediately propagate to user cost estimations.
              </p>
            </div>
            <button
              onClick={() => setNewMaterialModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#52634A] text-white rounded-xl text-xs font-semibold hover:bg-[#3E4B38]"
            >
              <Plus className="w-4 h-4" /> Add New Material
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#D9C8AE] text-[#6B6862]">
                  <th className="py-2.5 font-bold">Material Name</th>
                  <th className="py-2.5 font-bold">Brand</th>
                  <th className="py-2.5 font-bold">Category</th>
                  <th className="py-2.5 font-bold">Quality</th>
                  <th className="py-2.5 font-bold">Current Rate (INR)</th>
                  <th className="py-2.5 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {materialsList.map((m) => (
                  <tr key={m.name} className="hover:bg-[#F8F5EF]/50">
                    <td className="py-3 font-semibold text-[#292929]">{m.name}</td>
                    <td className="py-3 font-bold text-[#52634A]">{m.brand}</td>
                    <td className="py-3 text-[#6B6862] capitalize">{m.category_id}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F0E8DC] text-[#292929]">
                        {m.quality_grade}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        <span>₹</span>
                        <input
                          type="number"
                          defaultValue={m.price_inr}
                          onBlur={(e) => handleUpdatePrice(m.name, e.target.value)}
                          className="w-20 px-2 py-1 bg-white border border-[#D9C8AE] rounded-lg text-xs font-bold text-[#292929]"
                        />
                        <span className="text-[10px] text-[#6B6862]">/{m.unit}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                        Live Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CONSULTATIONS MANAGEMENT */}
      {adminTab === 'consultations' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-6">
          <h4 className="font-serif font-bold text-2xl text-[#292929]">
            Homeowner Consultation Requests
          </h4>
          <div className="space-y-4">
            {consultations.map((c) => (
              <div key={c.id} className="p-5 bg-[#F8F5EF] rounded-2xl border border-[#D9C8AE]/50 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-sm text-[#292929]">{c.name}</h5>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-[#6B6862]">
                    Contact: {c.phone} • {c.email}
                  </p>
                  <p className="text-[#52634A] font-semibold">
                    Date & Slot: {c.preferred_date} ({c.preferred_time})
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    Project Attached: {c.project_title}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateConsultationStatus(c.id, 'Confirmed')}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve & Confirm
                  </button>
                  <button
                    onClick={() => handleUpdateConsultationStatus(c.id, 'Cancelled')}
                    className="px-3 py-1.5 bg-white text-red-600 hover:bg-red-50 border border-red-200 rounded-xl text-xs font-semibold"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. USER DIRECTORY */}
      {adminTab === 'users' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-6">
          <h4 className="font-serif font-bold text-2xl text-[#292929]">
            Registered Homeowners & Architects
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#D9C8AE] text-[#6B6862]">
                  <th className="py-2.5 font-bold">Full Name</th>
                  <th className="py-2.5 font-bold">Email</th>
                  <th className="py-2.5 font-bold">Phone</th>
                  <th className="py-2.5 font-bold">Role</th>
                  <th className="py-2.5 font-bold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F8F5EF]/50">
                    <td className="py-3 font-semibold text-[#292929]">{u.full_name}</td>
                    <td className="py-3 text-[#6B6862]">{u.email}</td>
                    <td className="py-3 font-mono">{u.phone}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-amber-100 text-amber-900' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">{u.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal to Add New Material */}
      {newMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#D9C8AE] w-full max-w-lg space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-xl text-[#292929]">Add New Material to Catalogue</h3>
            <form onSubmit={handleAddMaterial} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newForm.name}
                  onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                  placeholder="e.g. Slim Fluted Glass Shutter"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Brand</label>
                  <input
                    type="text"
                    required
                    value={newForm.brand}
                    onChange={(e) => setNewForm({ ...newForm, brand: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Rate in INR (₹)</label>
                  <input
                    type="number"
                    required
                    value={newForm.price_inr}
                    onChange={(e) => setNewForm({ ...newForm, price_inr: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setNewMaterialModal(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#52634A] text-white rounded-xl font-bold"
                >
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
