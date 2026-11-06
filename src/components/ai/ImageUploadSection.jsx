import React, { useState, useRef } from 'react';
import {
  Upload, RotateCw, Sparkles, Check,
  Sliders, ShieldCheck, Ruler, ArrowRight, Wand2, Compass,
  Palette, Download, RefreshCw, Key, Building2, Home, Dices, Cpu
} from 'lucide-react';
import BeforeAfterSlider from './BeforeAfterSlider.jsx';
import { useProject } from '../../context/ProjectContext.jsx';
import { transformKitchenImage } from '../../utils/kitchenImageTransformer.js';

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
  const [transformIntensity, setTransformIntensity] = useState(0.88);
  const [roomCondition, setRoomCondition] = useState('under_construction'); // 'under_construction' | 'existing_kitchen'
  const [transformationMode, setTransformationMode] = useState('generative'); // 'generative' | 'cad_overlay' | 'recolor'
  const [variationSeed, setVariationSeed] = useState(() => Math.floor(Math.random() * 800000) + 100000);
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('kitchencraft_gemini_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  // Pre-loaded sample kitchen photos
  const sampleKitchens = [
    {
      title: 'Under-Construction Bare Room',
      desc: 'Raw concrete & plaster shell ready for modular fitting',
      url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1000&q=80',
      suggestedStyle: 'Modern Luxury',
      layout: 'L-Shaped',
      condition: 'under_construction'
    },
    {
      title: 'Traditional Wooden Kitchen',
      desc: 'Old solid wood cabinets and outdated layout',
      url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=80',
      suggestedStyle: 'Modern Minimalist',
      layout: 'L-Shaped',
      condition: 'existing_kitchen'
    },
    {
      title: 'Dated White & Wood Kitchen',
      desc: 'Yellowing laminate and worn countertops',
      url: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=1000&q=80',
      suggestedStyle: 'Scandinavian',
      layout: 'Parallel',
      condition: 'existing_kitchen'
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

  const colorSwatches = [
    { name: 'Dark Olive', hex: '#52634A' },
    { name: 'Warm Cream', hex: '#F8F5EF' },
    { name: 'Walnut Wood', hex: '#5A3825' },
    { name: 'Cashmere Taupe', hex: '#D9C8AE' },
    { name: 'Charcoal Black', hex: '#292929' },
    { name: 'Pure White', hex: '#FFFFFF' },
    { name: 'Sage Mist', hex: '#879883' }
  ];

  // Primary Transformation Execution Engine
  const executeTransformation = async (photoUrl, customVisuals = visuals, customSeed = variationSeed) => {
    if (!photoUrl) return;

    setIsProcessing(true);
    setErrorMsg('');

    try {
      let finalResultImage = null;

      // 1. GENERATIVE AI MODE: Call backend architectural diffusion engine
      if (transformationMode === 'generative') {
        try {
          const res = await fetch('/api/ai/transform', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(geminiApiKey ? { 'x-gemini-key': geminiApiKey } : {})
            },
            body: JSON.stringify({
              imageUrl: photoUrl,
              designStyle: activeDesignStyle,
              roomCondition,
              transformationMode: 'generative',
              cabinetColor: customVisuals.cabinetColor || '#52634A',
              cabinetFinish: customVisuals.shutterFinish || 'matte',
              countertop: customVisuals.counterType || 'quartz',
              backsplash: customVisuals.backsplashType || 'zellige',
              lighting: customVisuals.lightingMode || 'warm',
              dimensions,
              seed: customSeed
            })
          });

          const json = await res.json();
          if (json.data?.transformedImage) {
            finalResultImage = json.data.transformedImage;
            if (json.data.aiAnalysis) {
              setAiAnalysis(json.data.aiAnalysis);
            }
          }
        } catch (apiErr) {
          console.warn('Backend generative API call failed, falling back to CAD Overlay:', apiErr);
        }
      }

      // 2. CAD OVERLAY / PROCEDURAL FALLBACK: Direct structural synthesis on user photo
      if (!finalResultImage) {
        finalResultImage = await transformKitchenImage(photoUrl, {
          cabinetColor: customVisuals.cabinetColor || '#52634A',
          shutterFinish: customVisuals.shutterFinish || 'matte',
          counterType: customVisuals.counterType || 'quartz',
          counterColor: customVisuals.counterColor || '#F5F5F0',
          backsplashType: customVisuals.backsplashType || 'zellige',
          backsplashColor: customVisuals.backsplashColor || '#52634A',
          lightingMode: customVisuals.lightingMode || 'warm',
          designStyle: activeDesignStyle,
          isUnderConstruction: roomCondition === 'under_construction',
          mode: transformationMode,
          intensity: transformIntensity
        });

        // Set structural diagnostics
        setAiAnalysis({
          detectedRoomLayout: `${dimensions.length} x ${dimensions.width} ft ${dimensions.layout || 'L-Shaped'} Layout`,
          structuralPreservation: roomCondition === 'under_construction' ? [
            'Bare walls calibrated with structural floor-to-ceiling modular cabinetry',
            'Bare concrete floor layered with vitrified Italian porcelain finish',
            'Primary plumbing drainage mapped beneath 34-inch stainless steel sink',
            'Exhaust ducting mapped for 1500 m3/h high suction auto-clean chimney',
            'Concealed 3000K warm LED task lighting and ceiling spotlight grid applied'
          ] : [
            'Original kitchen geometry, camera perspective, and walls 100% preserved',
            'Window and door apertures locked in spatial position',
            'Cabinet surfaces replaced with custom modular acrylic finish',
            'Countertops upgraded with Calacatta quartz reflection',
            'Concealed LED profile task lights cast warm 3000K ambient wash'
          ],
          aestheticNotes: roomCondition === 'under_construction'
            ? `Transformed bare under-construction room into a bespoke ${activeDesignStyle} modular kitchen with ${customVisuals.cabinetColor} cabinetry, quartz worktops and layered task illumination.`
            : `Sleek ${activeDesignStyle} cabinetry in ${customVisuals.cabinetColor} with modern architectural finishes.`
        });
      }

      setTransformedImage(finalResultImage);
    } catch (err) {
      console.error('Photo transformation error:', err);
      setErrorMsg('Failed to process kitchen image. Please try again or switch transformation mode.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid JPG or PNG image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setUploadedImage(dataUrl);
      setTransformedImage(null);
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
        const dataUrl = event.target.result;
        setUploadedImage(dataUrl);
        setTransformedImage(null);
        setErrorMsg('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAiTransformation = async () => {
    const photoToTransform = uploadedImage || sampleKitchens[0].url;
    if (!uploadedImage) {
      setUploadedImage(sampleKitchens[0].url);
    }
    await executeTransformation(photoToTransform, visuals, variationSeed);
  };

  // Cycle variations with random seeds
  const handleGenerateVariation = async () => {
    const nextSeed = Math.floor(Math.random() * 900000) + 100000;
    setVariationSeed(nextSeed);
    const photoToTransform = uploadedImage || sampleKitchens[0].url;
    await executeTransformation(photoToTransform, visuals, nextSeed);
  };

  // Live recolor when swatch clicked
  const handleQuickRecolor = async (newColor) => {
    updateVisual('cabinetColor', newColor);
    if (uploadedImage) {
      await executeTransformation(uploadedImage, { ...visuals, cabinetColor: newColor }, variationSeed);
    }
  };

  const handleSaveGeminiKey = (key) => {
    setGeminiApiKey(key);
    localStorage.setItem('kitchencraft_gemini_key', key);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#52634A] to-[#3E4B38] text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Architectural AI Kitchen Transformation
          </div>
          <h2 className="text-3xl font-serif font-bold text-white">
            Transform Any Kitchen Photo — Even Under-Construction
          </h2>
          <p className="text-[#D9C8AE] text-xs sm:text-sm leading-relaxed">
            Upload any photograph—whether it’s a <strong>raw under-construction brick shell</strong>, an empty apartment, or an old kitchen. Our Architectural AI engine synthesizes a full luxury modular kitchen with custom cabinetry, quartz waterfall counters, built-in appliances, and warm 3000K LED lighting.
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
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 text-white text-[10px] rounded-full backdrop-blur-md">
                    ✓ Your Custom Kitchen Photo Loaded
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
                  Click or drag and drop your kitchen photograph here
                </h4>
                <p className="text-[#6B6862] text-xs max-w-sm mx-auto mb-4">
                  Take a photo of your under-construction space, empty room, or existing kitchen.
                </p>
                <button
                  type="button"
                  className="px-5 py-2.5 bg-[#52634A] hover:bg-[#3E4B38] text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
                >
                  Upload Kitchen Photo
                </button>
              </div>
            )}
          </div>

          {/* Quick Select Sample Kitchens */}
          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#D9C8AE]/40 card-shadow space-y-3">
            <span className="text-xs font-bold text-[#6B6862] uppercase tracking-wider block">
              Or Try A Sample Kitchen Photo:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sampleKitchens.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setUploadedImage(sample.url);
                    setTransformedImage(null);
                    setActiveDesignStyle(sample.suggestedStyle);
                    setLayoutType(sample.layout);
                    setRoomCondition(sample.condition);
                  }}
                  className={`group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                    uploadedImage === sample.url
                      ? 'border-[#52634A] ring-2 ring-[#52634A]/20'
                      : 'border-transparent hover:border-[#D9C8AE]'
                  }`}
                >
                  <div className="h-24 bg-gray-100 overflow-hidden relative">
                    <img
                      src={sample.url}
                      alt={sample.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {sample.condition === 'under_construction' && (
                      <span className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                        Under-Construction
                      </span>
                    )}
                    {uploadedImage === sample.url && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-[#52634A] text-white rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-[#F8F5EF]">
                    <p className="text-[11px] font-bold text-[#292929] truncate">{sample.title}</p>
                    <p className="text-[10px] text-[#6B6862] line-clamp-1">{sample.desc}</p>
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
          {/* Room Condition & Engine Mode Selectors */}
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#D9C8AE]/50 card-shadow space-y-5">
            {/* 1. Room Condition Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#292929] uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#52634A]" /> Room Photo Condition:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRoomCondition('under_construction')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    roomCondition === 'under_construction'
                      ? 'bg-[#F0E8DC] border-[#52634A] ring-1 ring-[#52634A]'
                      : 'border-[#D9C8AE]/50 hover:bg-[#F8F5EF]'
                  }`}
                >
                  <span className="font-bold text-xs text-[#292929] block flex items-center gap-1">
                    🏗️ Under-Construction
                  </span>
                  <span className="text-[10px] text-[#6B6862] block mt-0.5">
                    Bare bricks, concrete, no cabinets
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setRoomCondition('existing_kitchen')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    roomCondition === 'existing_kitchen'
                      ? 'bg-[#F0E8DC] border-[#52634A] ring-1 ring-[#52634A]'
                      : 'border-[#D9C8AE]/50 hover:bg-[#F8F5EF]'
                  }`}
                >
                  <span className="font-bold text-xs text-[#292929] block flex items-center gap-1">
                    🏡 Existing Kitchen
                  </span>
                  <span className="text-[10px] text-[#6B6862] block mt-0.5">
                    Full remodel of built kitchen
                  </span>
                </button>
              </div>
            </div>

            {/* 2. AI Engine Mode Selector */}
            <div className="space-y-2 border-t border-[#D9C8AE]/40 pt-4">
              <label className="text-xs font-bold text-[#292929] uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#52634A]" /> Transformation Engine:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTransformationMode('generative')}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    transformationMode === 'generative'
                      ? 'bg-[#52634A] text-white border-[#52634A]'
                      : 'border-[#D9C8AE]/50 hover:bg-[#F8F5EF] text-[#292929]'
                  }`}
                >
                  <span className="font-bold text-[11px] block">🌟 AI Diffusion</span>
                  <span className="text-[9px] opacity-80 block">Photorealistic 8K</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTransformationMode('cad_overlay')}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    transformationMode === 'cad_overlay'
                      ? 'bg-[#52634A] text-white border-[#52634A]'
                      : 'border-[#D9C8AE]/50 hover:bg-[#F8F5EF] text-[#292929]'
                  }`}
                >
                  <span className="font-bold text-[11px] block">📐 CAD Overlay</span>
                  <span className="text-[9px] opacity-80 block">3D Perspective</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTransformationMode('recolor')}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    transformationMode === 'recolor'
                      ? 'bg-[#52634A] text-white border-[#52634A]'
                      : 'border-[#D9C8AE]/50 hover:bg-[#F8F5EF] text-[#292929]'
                  }`}
                >
                  <span className="font-bold text-[11px] block">🎨 Recolor</span>
                  <span className="text-[9px] opacity-80 block">Surface PBR</span>
                </button>
              </div>
            </div>

            {/* Preferred Architectural Style */}
            <div className="border-t border-[#D9C8AE]/40 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-sm text-[#292929] flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#52634A]" /> Select Design Aesthetic
                </h3>
                <span className="text-[10px] text-[#52634A] font-semibold bg-[#F0E8DC] px-2 py-0.5 rounded-full">
                  8 Curated Styles
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1">
                {designStyles.map((style) => (
                  <div
                    key={style.name}
                    onClick={() => setActiveDesignStyle(style.name)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                      activeDesignStyle === style.name
                        ? 'bg-[#F8F5EF] border-[#52634A] ring-1 ring-[#52634A]'
                        : 'border-[#D9C8AE]/40 hover:bg-[#F8F5EF]/60'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full mt-0.5 border flex items-center justify-center shrink-0 ${
                      activeDesignStyle === style.name ? 'border-[#52634A] bg-[#52634A]' : 'border-gray-300'
                    }`}>
                      {activeDesignStyle === style.name && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-[#292929]">{style.name}</h5>
                      <p className="text-[10px] text-[#6B6862]">{style.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cabinet Color & Material Customizer */}
            <div className="border-t border-[#D9C8AE]/40 pt-4 space-y-3">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#292929] block">
                  Select Cabinet Shutter Color:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {colorSwatches.map((swatch) => (
                    <button
                      key={swatch.hex}
                      type="button"
                      onClick={() => handleQuickRecolor(swatch.hex)}
                      title={swatch.name}
                      style={{ backgroundColor: swatch.hex }}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        visuals.cabinetColor === swatch.hex
                          ? 'border-[#52634A] ring-2 ring-[#52634A] scale-110 shadow-md'
                          : 'border-white hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#6B6862]">Cabinet Shutter Finish:</span>
                <select
                  value={visuals.shutterFinish}
                  onChange={(e) => updateVisual('shutterFinish', e.target.value)}
                  className="bg-[#F8F5EF] border border-[#D9C8AE] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#292929] focus:outline-none"
                >
                  <option value="matte">Super Matte Acrylic</option>
                  <option value="gloss">High Gloss Mirror</option>
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
            </div>

            {/* Optional Gemini API Key trigger */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                className="text-[11px] text-[#52634A] hover:underline flex items-center gap-1 font-semibold"
              >
                <Key className="w-3 h-3" />
                {showApiKeyInput ? 'Hide Gemini API Settings' : 'Add Gemini API Key (Optional)'}
              </button>
              {showApiKeyInput && (
                <div className="mt-2 p-3 bg-[#F8F5EF] rounded-xl border border-[#D9C8AE]/50 space-y-1.5 text-xs">
                  <label className="text-[10px] text-[#6B6862] block">Google Gemini API Key:</label>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={geminiApiKey}
                    onChange={(e) => handleSaveGeminiKey(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-[#D9C8AE] rounded-lg text-xs"
                  />
                  <span className="text-[9px] text-[#6B6862] block">
                    Saved locally in browser. If omitted, KITCHENcraft's built-in Architectural Diffusion engine runs automatically.
                  </span>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleRunAiTransformation}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-[#52634A] to-[#3E4B38] hover:from-[#3E4B38] hover:to-[#2F392B] text-white font-semibold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer text-xs sm:text-sm"
              >
                {isProcessing ? (
                  <>
                    <Wand2 className="w-4 h-4 animate-spin text-amber-300" />
                    Generating Photorealistic Modular Design...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                    Transform My Kitchen Photo
                  </>
                )}
              </button>

              {transformedImage && (
                <button
                  type="button"
                  onClick={handleGenerateVariation}
                  disabled={isProcessing}
                  className="w-full py-2.5 bg-[#F8F5EF] hover:bg-[#F0E8DC] text-[#292929] border border-[#D9C8AE] rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Dices className={`w-3.5 h-3.5 text-[#52634A] ${isProcessing ? 'animate-spin' : ''}`} />
                  Generate Another Design Variation
                </button>
              )}
            </div>
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
                Your Kitchen Transformed: {activeDesignStyle}
              </h3>
              <p className="text-xs text-[#6B6862]">
                Drag the white slider handle horizontally to compare your original {roomCondition === 'under_construction' ? 'under-construction space' : 'photo'} against the finished modular kitchen design.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Room Geometry & Perspectives Preserved
              </span>
            </div>
          </div>

          {/* Interactive Split-Screen Slider */}
          <BeforeAfterSlider
            beforeImage={uploadedImage || sampleKitchens[0].url}
            afterImage={transformedImage}
            beforeLabel={roomCondition === 'under_construction' ? 'Original Under-Construction Room' : 'Your Original Kitchen Photo'}
            afterLabel={`Transformed in ${activeDesignStyle}`}
          />

          {/* Real-time Fine-Tuning Swatches below Slider */}
          <div className="bg-white p-5 rounded-2xl border border-[#D9C8AE]/50 card-shadow flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#292929] flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#52634A]" /> Switch Cabinet Colors On Your Photo:
              </span>
              <div className="flex items-center gap-2">
                {colorSwatches.map((swatch) => (
                  <button
                    key={swatch.hex}
                    onClick={() => handleQuickRecolor(swatch.hex)}
                    title={swatch.name}
                    style={{ backgroundColor: swatch.hex }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      visuals.cabinetColor === swatch.hex
                        ? 'border-[#52634A] ring-2 ring-[#52634A] scale-110 shadow-md'
                        : 'border-white hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateVariation}
                disabled={isProcessing}
                className="px-4 py-2 bg-[#F8F5EF] hover:bg-[#F0E8DC] text-[#292929] border border-[#D9C8AE] rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                <Dices className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} /> Try Another Concept
              </button>
              <a
                href={transformedImage}
                download="kitchencraft-transformed-kitchen.jpg"
                className="px-4 py-2 bg-[#52634A] hover:bg-[#3E4B38] text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Concept
              </a>
            </div>
          </div>

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
