import React from 'react';
import { Compass, Phone, Mail, MapPin, Globe, Share2, MessageCircle, ShieldCheck } from 'lucide-react';

export default function Footer({ onSelectTab }) {
  return (
    <footer className="bg-[#292929] text-white pt-16 pb-12 border-t border-[#D9C8AE]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#52634A] flex items-center justify-center text-white shadow-md">
                <Compass className="w-5 h-5 text-amber-200" />
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-white">
                KITCHEN<span className="text-[#D9C8AE]">craft</span>
              </span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed max-w-sm">
              Empowering homeowners to architect their dream modular kitchens through intelligent AI spatial redesign, interactive 3D walkthroughs, and automated transparent cost estimation.
            </p>
            <div className="flex items-center gap-3 pt-2 text-[#D9C8AE]">
              <a href="#globe" title="Global Architectural Standards" className="p-2 rounded-xl bg-white/5 hover:bg-[#52634A] transition-all"><Globe className="w-4 h-4" /></a>
              <a href="#chat" title="Live Architect Support" className="p-2 rounded-xl bg-white/5 hover:bg-[#52634A] transition-all"><MessageCircle className="w-4 h-4" /></a>
              <a href="#share" title="Community Designs" className="p-2 rounded-xl bg-white/5 hover:bg-[#52634A] transition-all"><Share2 className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick Design Tools */}
          <div className="space-y-3">
            <h5 className="font-serif font-bold text-base text-[#D9C8AE] tracking-wide">Design Tools</h5>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><button onClick={() => onSelectTab('designer')} className="hover:text-white transition-colors">8-Step Guided Designer</button></li>
              <li><button onClick={() => onSelectTab('3d-studio')} className="hover:text-white transition-colors">Interactive 3D Studio</button></li>
              <li><button onClick={() => onSelectTab('layouts')} className="hover:text-white transition-colors">Modular Layout Explorer</button></li>
              <li><button onClick={() => onSelectTab('designer')} className="hover:text-white transition-colors">AI Kitchen Transformation</button></li>
              <li><button onClick={() => onSelectTab('estimator')} className="hover:text-white transition-colors">Instant Cost Estimator</button></li>
            </ul>
          </div>

          {/* Material Categories */}
          <div className="space-y-3">
            <h5 className="font-serif font-bold text-base text-[#D9C8AE] tracking-wide">Material Library</h5>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><button onClick={() => onSelectTab('catalogue')} className="hover:text-white transition-colors">Marine Plywood & HDHMR</button></li>
              <li><button onClick={() => onSelectTab('catalogue')} className="hover:text-white transition-colors">Matte & Gloss Acrylics</button></li>
              <li><button onClick={() => onSelectTab('catalogue')} className="hover:text-white transition-colors">Quartz & Granite Slabs</button></li>
              <li><button onClick={() => onSelectTab('catalogue')} className="hover:text-white transition-colors">German Soft-Close Hardware</button></li>
              <li><button onClick={() => onSelectTab('catalogue')} className="hover:text-white transition-colors">Built-in Chimneys & Hobs</button></li>
            </ul>
          </div>

          {/* Direct Studio Contact */}
          <div className="space-y-3">
            <h5 className="font-serif font-bold text-base text-[#D9C8AE] tracking-wide">Design Studio</h5>
            <div className="space-y-2.5 text-xs text-gray-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#B69A65] shrink-0 mt-0.5" />
                <span>Promenade Design Square, MG Road, Bangalore 560001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#B69A65] shrink-0" />
                <span>+91 (080) 4122-8900</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#B69A65] shrink-0" />
                <span>architect@kitchencraft.com</span>
              </div>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#52634A]/40 text-[#D9C8AE] rounded-full text-[10px] font-semibold border border-[#52634A]">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Manufacturer Direct
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} KITCHENcraft Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-white">Privacy Policy</a>
            <a href="#terms" className="hover:text-white">Terms of Architecture Service</a>
            <a href="#pricing" className="hover:text-white">Price Transparency Guarantee</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
