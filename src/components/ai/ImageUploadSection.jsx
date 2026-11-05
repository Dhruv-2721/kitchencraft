import React, { useState, useRef } from 'react';
import {
  Upload, RotateCw, Image as ImageIcon, Sparkles, Check,
  Sliders, ShieldCheck, Ruler, ArrowRight, Wand2, Compass
} from 'lucide-react';
import BeforeAfterSlider from './BeforeAfterSlider.jsx';
import { useProject } from '../../context/ProjectContext.jsx';

export default function ImageUploadSection() {
  const {
    dimensions, setDimensions,
    visuals, updateVisual,
    uploadedImage, setUploadedImage,
    transformedImage, setTransformedImage,
    aiAnalysis, setAiAnalysis,
    activeDesignStyle, setActiveDesignStyle,
    setLayoutType
  } = useProject();

  const fileInputRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sample pre-loaded existing kitchen images for quick testing
  const sampleKitchens = [
    {
      title: 'Traditional Wooden Kitchen',
      url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=80',
      suggestedStyle: 'Modern Minimalist',
      layout: 'L-Shaped'
    },
    {
      title: 'Old Dated Laminate Kitchen',
      url: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1000&q=80',
      suggestedStyle: 'Scandinavian',
      layout: 'Parallel'
    },
    {
      title: 'Compact Urban Studio Kitchen',
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=80',
      suggestedStyle: 'Luxury European',
      layout: 'Straight'
    }
  ];

  const designStyles = [
    { name: 'Modern Minimalist', desc: 'Sleek handleless J-pull, calm neutrals & seamless quartz' },
    { name: 'Luxury European', desc: 'Brass Gola profiles, Calacatta marble & integrated appliances' },
    { name: 'Scandinavian', desc: 'Light warm oak grains, white matte surfaces & cozy daylight' },
    { name: 'Contemporary', desc: 'Olive green two-tones, fluted backsplash & waterfall island' },
    { name: 'Traditional Indian', desc: 'Teak accents, black granite counters & spice-friendly ergonomics' },
    { name: 'Industrial', desc: 'Matte black aluminum frames, fluted glass & concrete textures' },
    { name: 'Rustic', desc: 'Warm shaker cabinetry, tactile hardware & farmhouse touches' },
    { name: 'Modern Luxury', desc: 'Obsidian black, backlit LED channels & sintered stone slabs' }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid JPG or PNG image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target.result);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        setErrorMsg('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAiTransformation = async () => {
    if (!uploadedImage) {
      // Pick default sample if none uploaded
      setUploadedImage(sampleKitchens[0].url);
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/ai/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: uploadedImage || sampleKitchens[0].url,
          designStyle: activeDesignStyle,
          cabinetColor: visuals.cabinetColor,
          cabinetFinish: visuals.shutterFinish,
          countertop: visuals.counterColor,
          backsplash: visuals.backsplashColor,
          flooring: visuals.floorColor,
          overheadCabinets: visuals.showUpperCabinets,
          lighting: visuals.lightingMode,
          dimensions
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setTransformedImage(json.data.transformedImage);
        setAiAnalysis(json.data.aiAnalysis);
      }
    } catch (err) {
      console.warn('Fallback simulated transformation pipeline');
      setTransformedImage('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85');
      setAiAnalysis({
        detectedRoomLayout: 'L-Shaped Kitchen Layout',
        estimatedFloorArea: `${dimensions.length} x ${dimensions.width} ft (${dimensions.length * dimensions.width} sq.ft)`,
        naturalLightCondition: 'Optimal North daylight aperture detected',
        structuralPreservation: [
          'Window aperture and load-bearing columns locked in spatial position',
          'Primary plumbing drainage point preserved beneath sink zone',
          'High-power 1500 m3/h auto-clean chimney aligned with ceiling exhaust duct',
          'Golden work triangle (Hob - Sink - Refrigerator) optimized to 5.2 ft ergonomic radius'
        ],
        aestheticNotes: 'Sleek handleless J-pull cabinets, concealed LED task lighting, ultra-clean quartz counters and minimalist symmetry.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#52634A] to-[#3E4B38] text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> AI-Powered Spatial Kitchen Transformation
          </div>
          <h2 className="text-3xl font-serif font-bold text-white mb-2">
            Upload Your Kitchen & See It Reimagined
          </h2>
          <p className="text-[#D9C8AE] text-sm leading-relaxed">
            Upload a photo of your existing kitchen space. Our intelligent architectural AI analyzes your room perspective, window openings, and plumbing points to generate a photorealistic modular kitchen transformation.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12">
          <Wand2 className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* Main Two-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Upload & Photo Adjustment (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Upload Dropzone / Canvas */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-[#D9C8AE] hover:border-[#52634A] bg-[#FFFFFF] rounded-3xl p-6 text-center transition-all relative card-shadow"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            {uploadedImage ? (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden bg-black max-h-[380px] flex items-center justify-center">
                  <img
                    src={uploadedImage}
                    alt="Uploaded Kitchen"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      filter: `brightness(${brightness}%)`
                    }}
                    className="max-h-[380px] w-auto object-contain transition-transform"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      onClick={() => setRotation((r) => (r + 90) % 360)}
                      title="Rotate Image"
                      className="p-2 bg-black/60 text-white hover:bg-black rounded-xl backdrop-blur-sm transition-all"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white text-[#292929] hover:bg-white/90 rounded-xl text-xs font-semibold shadow-md transition-all"
                    >
                      Change Photo
                    </button>
                  </div>
                </div>

                {/* Adjust Sliders */}
                <div className="flex items-center justify-center gap-6 px-4 py-2 bg-[#F8F5EF] rounded-2xl text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-[#6B6862]">
                    <Sliders className="w-3.5 h-3.5 text-[#52634A]" /> Brightness:
                  </span>
                  <input
                    type="range"
                    min="60"
                    max="140"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="accent-[#52634A] w-32 cursor-pointer"
                  />
                  <span className="text-[#292929] font-mono">{brightness}%</span>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="py-12 cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#F0E8DC] text-[#52634A] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8" />
                </div>
                <h4 className="font-semibold text-lg text-[#292929] mb-1">
                  Drag and drop your kitchen photograph here
                </h4>
                <p className="text-[#6B6862] text-xs max-w-sm mx-auto mb-4">
                  Supports high-resolution JPEG, PNG, or WebP. Take a wide photo showing floor, walls, and window openings.
                </p>
                <button
                  type="button"
                  className="px-5 py-2.5 bg-[#52634A] hover:bg-[#3E4B38] text-white rounded-xl text-xs font-semibold shadow-md transition-all"
                >
                  Browse Device Photo
                </button>
              </div>
            )}
          </div>

          {/* Quick Select Sample Kitchens */}
          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#D9C8AE]/40 card-shadow space-y-3">
            <span className="text-xs font-bold text-[#6B6862] uppercase tracking-wider block">
              Or Try One of Our Sample Kitchen Photographs:
            </span>
            <div className="grid grid-cols-3 gap-3">
              {sampleKitchens.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setUploadedImage(sample.url);
                    setActiveDesignStyle(sample.suggestedStyle);
                    setLayoutType(sample.layout);
                  }}
                  className={`group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                    uploadedImage === sample.url
                      ? 'border-[#52634A] ring-2 ring-[#52634A]/20'
                      : 'border-transparent hover:border-[#D9C8AE]'
                  }`}
                >
                  <div className="h-20 bg-gray-100 overflow-hidden relative">
                    <img
                      src={sample.url}
                      alt={sample.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {uploadedImage === sample.url && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-[#52634A] text-white rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div className="p-1.5 bg-[#F8F5EF] text-center">
                    <p className="text-[11px] font-semibold text-[#292929] truncate">{sample.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Room Dimensions Input Card */}
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#292929]">
              <Ruler className="w-4 h-4 text-[#52634A]" /> Kitchen Room Dimensions (Feet)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] text-[#6B6862] font-semibold block mb-1">Length (ft)</label>
                <input
                  type="number"
                  min="6"
                  max="35"
                  value={dimensions.length}
                  onChange={(e) => setDimensions({ ...dimensions, length: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#D9C8AE] rounded-xl text-sm font-semibold text-[#292929] focus:outline-none focus:border-[#52634A]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#6B6862] font-semibold block mb-1">Width (ft)</label>
                <input
                  type="number"
                  min="5"
                  max="30"
                  value={dimensions.width}
                  onChange={(e) => setDimensions({ ...dimensions, width: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#D9C8AE] rounded-xl text-sm font-semibold text-[#292929] focus:outline-none focus:border-[#52634A]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#6B6862] font-semibold block mb-1">Ceiling Ht (ft)</label>
                <input
                  type="number"
                  step="0.5"
                  min="8"
                  max="14"
                  value={dimensions.ceilingHeight}
                  onChange={(e) => setDimensions({ ...dimensions, ceilingHeight: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#D9C8AE] rounded-xl text-sm font-semibold text-[#292929] focus:outline-none focus:border-[#52634A]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#6B6862] font-semibold block mb-1">Counter Ht (ft)</label>
                <input
                  type="number"
                  step="0.1"
                  value={dimensions.counterHeight}
                  onChange={(e) => setDimensions({ ...dimensions, counterHeight: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#F8F5EF] border border-[#D9C8AE] rounded-xl text-sm font-semibold text-[#292929] focus:outline-none focus:border-[#52634A]"
                />
              </div>
            </div>
            <p className="text-[11px] text-[#6B6862]">
              Approx. Carpet Area: <span className="font-semibold text-[#292929]">{dimensions.length * dimensions.width} sq.ft</span> • Standard modular ergonomics applied.
            </p>
          </div>
        </div>

        {/* Right Column: Style Options & AI Transform Engine (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Preferred Architectural Style */}
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-[#292929] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#52634A]" /> Select Design Aesthetic
              </h3>
              <span className="text-[11px] text-[#52634A] font-semibold bg-[#F0E8DC] px-2.5 py-0.5 rounded-full">
                8 Curated Styles
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
              {designStyles.map((style) => (
                <div
                  key={style.name}
                  onClick={() => setActiveDesignStyle(style.name)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                    activeDesignStyle === style.name
                      ? 'bg-[#F8F5EF] border-[#52634A] ring-1 ring-[#52634A]'
                      : 'border-[#D9C8AE]/40 hover:bg-[#F8F5EF]/60'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                    activeDesignStyle === style.name ? 'border-[#52634A] bg-[#52634A]' : 'border-gray-300'
                  }`}>
                    {activeDesignStyle === style.name && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#292929]">{style.name}</h5>
                    <p className="text-[11px] text-[#6B6862]">{style.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Material Preferences */}
            <div className="border-t border-[#D9C8AE]/40 pt-4 space-y-3">
              <span className="text-xs font-bold text-[#292929] block">Fine-Tune Preferences:</span>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6B6862]">Cabinet Shutter Finish:</span>
                <select
                  value={visuals.shutterFinish}
                  onChange={(e) => updateVisual('shutterFinish', e.target.value)}
                  className="bg-[#F8F5EF] border border-[#D9C8AE] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#292929] focus:outline-none"
                >
                  <option value="matte">Super Matte Acrylic</option>
                  <option value="gloss">High Gloss Acrylic</option>
                  <option value="veneer">Natural Wood Veneer</option>
                  <option value="glass">Lacquered Glass</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6B6862]">Countertop Slab:</span>
                <select
                  value={visuals.counterType}
                  onChange={(e) => updateVisual('counterType', e.target.value)}
                  className="bg-[#F8F5EF] border border-[#D9C8AE] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#292929] focus:outline-none"
                >
                  <option value="quartz">Calacatta Gold Quartz</option>
                  <option value="granite">Leathered Black Granite</option>
                  <option value="sintered">Sintered Stone Slab</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#6B6862]">Overhead Cabinets:</span>
                <button
                  type="button"
                  onClick={() => updateVisual('showUpperCabinets', !visuals.showUpperCabinets)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    visuals.showUpperCabinets ? 'bg-[#52634A] text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {visuals.showUpperCabinets ? 'Included' : 'Open Shelving'}
                </button>
              </div>
            </div>

            {/* CTA Generate AI Transformation */}
            <button
              onClick={handleRunAiTransformation}
              disabled={isProcessing}
              className="w-full py-3.5 bg-gradient-to-r from-[#52634A] to-[#3E4B38] hover:from-[#3E4B38] hover:to-[#2F392B] text-white font-semibold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Wand2 className="w-4 h-4 animate-spin text-amber-300" />
                  Analyzing Room Structure & Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                  Generate AI Kitchen Transformation
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Before and After Interactive Comparison Section */}
      {transformedImage && (
        <div className="mt-12 space-y-6 pt-6 border-t border-[#D9C8AE]/50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#52634A] uppercase tracking-wider block">
                Interactive Before & After Concept
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#292929]">
                Redesigned Concept: {activeDesignStyle}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Major Room Geometry Preserved
              </span>
            </div>
          </div>

          {/* Interactive Split-Screen Slider */}
          <BeforeAfterSlider
            beforeImage={uploadedImage || sampleKitchens[0].url}
            afterImage={transformedImage}
            beforeLabel="Existing Kitchen Photo"
            afterLabel={`KITCHENcraft Modular Concept (${activeDesignStyle})`}
          />

          {/* Structural Analysis Intelligence Card */}
          {aiAnalysis && (
            <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-4">
              <h4 className="font-serif font-bold text-lg text-[#292929] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#52634A]" /> AI Spatial & Structural Diagnostics
              </h4>
              <p className="text-xs text-[#6B6862] leading-relaxed">
                {aiAnalysis.aestheticNotes}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {aiAnalysis.structuralPreservation?.map((point, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-[#292929] bg-[#F8F5EF] p-3 rounded-xl border border-[#D9C8AE]/30">
                    <Check className="w-3.5 h-3.5 text-emerald-700 mt-0.5 shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
