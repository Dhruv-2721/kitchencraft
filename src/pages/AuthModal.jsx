import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, LogIn, Sparkles, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register, demoLogin, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      if (isRegister) {
        await register(email, password, fullName, phone);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error');
    }
  };

  const handleQuickDemo = (role) => {
    demoLogin(role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#D9C8AE]/50 p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-1">
          <span className="font-serif font-bold text-2xl text-[#292929]">
            KITCHEN<span className="text-[#52634A]">craft</span>
          </span>
          <p className="text-xs text-[#6B6862]">
            {isRegister
              ? 'Join to save 3D designs, compare budgets & request consultations'
              : 'Sign in to access your saved kitchen projects'}
          </p>
        </div>

        {/* Quick Demo Login Pills */}
        <div className="p-3 bg-[#F8F5EF] rounded-2xl border border-[#D9C8AE]/40 space-y-2">
          <span className="text-[10px] font-bold text-[#6B6862] uppercase tracking-wider block text-center">
            One-Click Instant Demo Login:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('user')}
              className="py-2 px-3 bg-white hover:bg-gray-50 border border-[#D9C8AE] rounded-xl text-xs font-semibold text-[#292929] shadow-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <User className="w-3.5 h-3.5 text-[#52634A]" /> Homeowner
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-2 px-3 bg-[#52634A] hover:bg-[#3E4B38] text-white rounded-xl text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" /> Admin
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs font-bold text-[#292929] block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sarah Sharma"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#F8F5EF] border border-[#D9C8AE] rounded-xl text-xs text-[#292929] focus:outline-none focus:border-[#52634A]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-[#292929] block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-[#F8F5EF] border border-[#D9C8AE] rounded-xl text-xs text-[#292929] focus:outline-none focus:border-[#52634A]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#292929] block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-[#F8F5EF] border border-[#D9C8AE] rounded-xl text-xs text-[#292929] focus:outline-none focus:border-[#52634A]"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="text-xs font-bold text-[#292929] block mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#F8F5EF] border border-[#D9C8AE] rounded-xl text-xs text-[#292929] focus:outline-none focus:border-[#52634A]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#52634A] hover:bg-[#3E4B38] text-white font-semibold rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Toggle Register / Sign In */}
        <div className="text-center text-xs text-[#6B6862]">
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-[#52634A] font-bold hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New to KITCHENcraft?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-[#52634A] font-bold hover:underline"
              >
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
