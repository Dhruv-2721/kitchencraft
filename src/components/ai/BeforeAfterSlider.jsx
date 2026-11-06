import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeftRight, Sparkles, Download, Maximize2 } from 'lucide-react';

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Existing Kitchen Photo',
  afterLabel = 'KITCHENcraft Modular AI Redesign',
  className = ''
}) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
  const [containerWidth, setContainerWidth] = useState(800);
  const isDragging = useRef(false);
  const containerRef = useRef(null);

  // Sync container width for pixel-perfect image alignment
  useEffect(() => {
    if (!containerRef.current) return;
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const onTouchMove = (e) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleDownloadTransformed = (e) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.download = `KITCHENcraft-Transformed-Kitchen-${Date.now()}.jpg`;
    link.href = afterImage;
    link.click();
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={() => (isDragging.current = true)}
      onMouseUp={() => (isDragging.current = false)}
      onMouseLeave={() => (isDragging.current = false)}
      onMouseMove={onMouseMove}
      onTouchStart={() => (isDragging.current = true)}
      onTouchEnd={() => (isDragging.current = false)}
      onTouchMove={onTouchMove}
      className={`relative select-none overflow-hidden rounded-3xl border border-[#D9C8AE]/50 card-shadow bg-black cursor-ew-resize group ${className}`}
      style={{ height: '520px' }}
    >
      {/* After Transformed Image (Full background) */}
      <img
        src={afterImage}
        alt="After AI Transformation"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <div className="px-3.5 py-1.5 bg-[#52634A]/90 text-white rounded-full text-xs font-semibold backdrop-blur-md shadow-md flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" /> {afterLabel}
        </div>
        <button
          onClick={handleDownloadTransformed}
          title="Download Transformed Image"
          className="p-2 bg-black/60 hover:bg-black text-white rounded-full backdrop-blur-md transition-all shadow-md pointer-events-auto"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Before Original Image (Clipped overlay) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforeImage}
          alt="Before Kitchen"
          className="absolute inset-0 h-full object-cover max-w-none pointer-events-none"
          style={{ width: `${containerWidth}px` }}
        />
        <div className="absolute top-4 left-4 z-10 px-3.5 py-1.5 bg-black/70 text-white rounded-full text-xs font-semibold backdrop-blur-md shadow-md">
          {beforeLabel}
        </div>
      </div>

      {/* Draggable Divider Line & Grip */}
      <div
        className="absolute top-0 bottom-0 z-20 w-1 bg-white shadow-2xl transition-transform"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 bg-white text-[#52634A] rounded-full shadow-2xl flex items-center justify-center border-2 border-[#52634A] cursor-ew-resize group-hover:scale-110 transition-transform">
          <ArrowLeftRight className="w-4 h-4" />
        </div>
      </div>

      {/* Bottom Floating Legend / Comparison Pill */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/70 backdrop-blur-md text-white text-xs rounded-full pointer-events-none flex items-center gap-2 shadow-lg">
        <span className="text-gray-300">◄ Original Photo</span>
        <span className="text-[#B69A65]">•</span>
        <span className="text-amber-200 font-medium">Drag to Compare</span>
        <span className="text-[#B69A65]">•</span>
        <span className="text-emerald-300">Modular Redesign ►</span>
      </div>
    </div>
  );
}
