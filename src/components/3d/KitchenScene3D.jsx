import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Camera, Eye, Sun, Moon, Sparkles, Maximize2, Minimize2,
  Download, Play, Square, Check, RefreshCw, Palette
} from 'lucide-react';
import { buildKitchenModel } from './KitchenProceduralModel.js';
import { useProject } from '../../context/ProjectContext.jsx';

export default function KitchenScene3D({ className = '', height = '600px' }) {
  const containerRef = useRef(null);
  const { layoutType, dimensions, visuals, updateVisual, saveProject } = useProject();

  const [activeView, setActiveView] = useState('perspective'); // 'perspective', 'top', 'front', 'isometric', 'island'
  const [isWalkthrough, setIsWalkthrough] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [walkthroughProgress, setWalkthroughProgress] = useState(0);
  const [savedNotification, setSavedNotification] = useState(false);

  // References to keep Three.js scene instances persistent across re-renders
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelGroupRef = useRef(null);
  const dirLightRef = useRef(null);
  const ambientLightRef = useRef(null);
  const animFrameRef = useRef(null);
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });

  // Camera target & spherical orbit values
  const orbitRef = useRef({
    theta: Math.PI / 4,
    phi: Math.PI / 3.2,
    radius: 6.8,
    target: new THREE.Vector3(0, 1.2, 0)
  });

  // Setup Three.js Scene on mount
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(visuals.lightingMode === 'evening' ? '#1A1815' : '#F4EFE6');
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer with antialiasing and shadow support
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = visuals.lightingMode === 'evening' ? 0.9 : 1.15;
    rendererRef.current = renderer;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(
      visuals.lightingMode === 'evening' ? 0xFFE8D0 : 0xFFFFFF,
      visuals.lightingMode === 'evening' ? 0.6 : 0.85
    );
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const dirLight = new THREE.DirectionalLight(0xFFF9F0, visuals.lightingMode === 'evening' ? 0.8 : 1.3);
    dirLight.position.set(4, 7, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Soft ceiling fill light
    const fillLight = new THREE.DirectionalLight(0xD9C8AE, 0.4);
    fillLight.position.set(-4, 5, -3);
    scene.add(fillLight);

    // 5. Initial Model
    const model = buildKitchenModel(layoutType, dimensions, visuals);
    scene.add(model);
    modelGroupRef.current = model;

    // 6. Mouse Orbit & Pan Handlers
    const dom = renderer.domElement;

    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current || isWalkthrough) return;
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };

      orbitRef.current.theta -= deltaX * 0.006;
      orbitRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2.05, orbitRef.current.phi - deltaY * 0.006));
      updateCameraPosition();
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      if (isWalkthrough) return;
      orbitRef.current.radius = Math.max(2.5, Math.min(14.0, orbitRef.current.radius + e.deltaY * 0.005));
      updateCameraPosition();
    };

    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 7. Render Loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update procedural kitchen whenever layout, dimensions, or visuals change
  useEffect(() => {
    if (!sceneRef.current) return;

    if (modelGroupRef.current) {
      sceneRef.current.remove(modelGroupRef.current);
    }
    const newModel = buildKitchenModel(layoutType, dimensions, visuals);
    sceneRef.current.add(newModel);
    modelGroupRef.current = newModel;

    // Adjust environment background & lighting based on visuals.lightingMode
    if (sceneRef.current && dirLightRef.current && ambientLightRef.current) {
      if (visuals.lightingMode === 'evening') {
        sceneRef.current.background.set('#1A1815');
        ambientLightRef.current.color.set('#FFE8D0');
        ambientLightRef.current.intensity = 0.5;
        dirLightRef.current.intensity = 0.6;
      } else {
        sceneRef.current.background.set('#F4EFE6');
        ambientLightRef.current.color.set('#FFFFFF');
        ambientLightRef.current.intensity = 0.85;
        dirLightRef.current.intensity = 1.3;
      }
    }
  }, [layoutType, dimensions, visuals]);

  // Spherical camera updater
  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { theta, phi, radius, target } = orbitRef.current;
    cameraRef.current.position.x = target.x + radius * Math.sin(phi) * Math.sin(theta);
    cameraRef.current.position.y = target.y + radius * Math.cos(phi);
    cameraRef.current.position.z = target.z + radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.lookAt(target);
  };

  // Switch View Presets
  const setCameraView = (view) => {
    setActiveView(view);
    setIsWalkthrough(false);

    if (view === 'top') {
      orbitRef.current.theta = 0;
      orbitRef.current.phi = 0.05; // directly overhead
      orbitRef.current.radius = 8.5;
      orbitRef.current.target.set(0, 0, 0);
    } else if (view === 'front') {
      orbitRef.current.theta = 0;
      orbitRef.current.phi = Math.PI / 2.3;
      orbitRef.current.radius = 6.2;
      orbitRef.current.target.set(0, 1.2, 0);
    } else if (view === 'island') {
      orbitRef.current.theta = Math.PI / 3;
      orbitRef.current.phi = Math.PI / 2.6;
      orbitRef.current.radius = 4.2;
      orbitRef.current.target.set(0, 0.9, 0.5);
    } else if (view === 'isometric') {
      orbitRef.current.theta = Math.PI / 4;
      orbitRef.current.phi = Math.PI / 3.4;
      orbitRef.current.radius = 7.5;
      orbitRef.current.target.set(0, 1.0, 0);
    } else {
      // Perspective
      orbitRef.current.theta = Math.PI / 4.2;
      orbitRef.current.phi = Math.PI / 2.8;
      orbitRef.current.radius = 6.8;
      orbitRef.current.target.set(0, 1.2, 0);
    }
    updateCameraPosition();
  };

  // Cinematic 3D Walkthrough
  useEffect(() => {
    if (!isWalkthrough) return;

    let startTime = Date.now();
    const duration = 16000; // 16 second cinematic guided tour

    const tourKeyframes = [
      { t: 0.0, theta: Math.PI / 4, phi: Math.PI / 3, radius: 7.2, target: [0, 1.2, 0] },
      { t: 0.25, theta: 0.2, phi: Math.PI / 2.4, radius: 4.8, target: [0.2, 1.1, -1.2] }, // Hob & Chimney
      { t: 0.5, theta: Math.PI / 2.1, phi: Math.PI / 2.3, radius: 4.2, target: [-1.4, 1.0, 0] }, // Sink zone
      { t: 0.75, theta: Math.PI / 3.2, phi: Math.PI / 2.8, radius: 4.5, target: [0, 0.9, 0.8] }, // Island & seating
      { t: 1.0, theta: Math.PI / 4, phi: Math.PI / 3, radius: 6.8, target: [0, 1.2, 0] } // Overview return
    ];

    const runTour = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % duration) / duration;
      setWalkthroughProgress(Math.round(progress * 100));

      // Interpolate between keyframes
      let k1 = tourKeyframes[0];
      let k2 = tourKeyframes[1];
      for (let i = 0; i < tourKeyframes.length - 1; i++) {
        if (progress >= tourKeyframes[i].t && progress <= tourKeyframes[i + 1].t) {
          k1 = tourKeyframes[i];
          k2 = tourKeyframes[i + 1];
          break;
        }
      }

      const segmentFactor = (progress - k1.t) / (k2.t - k1.t);
      // Smooth easing (cosine)
      const ease = (1 - Math.cos(segmentFactor * Math.PI)) / 2;

      orbitRef.current.theta = k1.theta + (k2.theta - k1.theta) * ease;
      orbitRef.current.phi = k1.phi + (k2.phi - k1.phi) * ease;
      orbitRef.current.radius = k1.radius + (k2.radius - k1.radius) * ease;
      orbitRef.current.target.set(
        k1.target[0] + (k2.target[0] - k1.target[0]) * ease,
        k1.target[1] + (k2.target[1] - k1.target[1]) * ease,
        k1.target[2] + (k2.target[2] - k1.target[2]) * ease
      );
      updateCameraPosition();
    };

    const interval = setInterval(runTour, 16);
    return () => clearInterval(interval);
  }, [isWalkthrough]);

  // Capture Screenshot
  const handleCaptureScreenshot = () => {
    if (!rendererRef.current) return;
    const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `KITCHENcraft-3D-Design-${layoutType}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleSave3D = async () => {
    await saveProject();
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.parentElement.requestFullscreen) {
        containerRef.current.parentElement.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Color Swatches
  const colorSwatches = [
    { name: 'Dark Olive', hex: '#52634A' },
    { name: 'Warm Cream', hex: '#F8F5EF' },
    { name: 'Cashmere Taupe', hex: '#D9C8AE' },
    { name: 'Charcoal Black', hex: '#292929' },
    { name: 'Walnut Wood', hex: '#5A3825' },
    { name: 'Sage Mist', hex: '#879883' }
  ];

  return (
    <div className={`relative bg-[#1A1815] rounded-3xl overflow-hidden border border-[#D9C8AE]/30 card-shadow ${className}`}>
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        style={{ height }}
        className="w-full cursor-grab active:cursor-grabbing select-none"
      />

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Camera Views */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl shadow-lg border border-[#D9C8AE]/50 pointer-events-auto">
          <button
            onClick={() => setCameraView('perspective')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeView === 'perspective' && !isWalkthrough
                ? 'bg-[#52634A] text-white shadow-sm'
                : 'text-[#292929] hover:bg-[#F0E8DC]'
            }`}
          >
            Perspective
          </button>
          <button
            onClick={() => setCameraView('top')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeView === 'top' && !isWalkthrough
                ? 'bg-[#52634A] text-white shadow-sm'
                : 'text-[#292929] hover:bg-[#F0E8DC]'
            }`}
          >
            Top / Floorplan
          </button>
          <button
            onClick={() => setCameraView('front')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeView === 'front' && !isWalkthrough
                ? 'bg-[#52634A] text-white shadow-sm'
                : 'text-[#292929] hover:bg-[#F0E8DC]'
            }`}
          >
            Front Elevation
          </button>
          <button
            onClick={() => setCameraView('island')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeView === 'island' && !isWalkthrough
                ? 'bg-[#52634A] text-white shadow-sm'
                : 'text-[#292929] hover:bg-[#F0E8DC]'
            }`}
          >
            Island Focus
          </button>
          <button
            onClick={() => setCameraView('isometric')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeView === 'isometric' && !isWalkthrough
                ? 'bg-[#52634A] text-white shadow-sm'
                : 'text-[#292929] hover:bg-[#F0E8DC]'
            }`}
          >
            Isometric
          </button>
        </div>

        {/* Right Tools: Walkthrough, Capture, Fullscreen */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Cinematic 3D Walkthrough button */}
          <button
            onClick={() => setIsWalkthrough(!isWalkthrough)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold shadow-lg transition-all ${
              isWalkthrough
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-[#B69A65] text-white hover:bg-[#9B804E]'
            }`}
          >
            {isWalkthrough ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" /> Stop Tour ({walkthroughProgress}%)
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Start 3D Walkthrough
              </>
            )}
          </button>

          <button
            onClick={handleCaptureScreenshot}
            title="Download 3D Screenshot"
            className="p-2.5 bg-white/90 backdrop-blur-md rounded-2xl text-[#292929] hover:bg-white shadow-lg border border-[#D9C8AE]/50 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4 text-[#52634A]" />
          </button>

          <button
            onClick={handleSave3D}
            title="Save 3D Design"
            className="flex items-center gap-1.5 px-3 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-xs font-semibold text-[#52634A] hover:bg-white shadow-lg border border-[#D9C8AE]/50 transition-all"
          >
            {savedNotification ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <RefreshCw className="w-3.5 h-3.5" />}
            {savedNotification ? 'Saved!' : 'Save 3D'}
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2.5 bg-white/90 backdrop-blur-md rounded-2xl text-[#292929] hover:bg-white shadow-lg border border-[#D9C8AE]/50 transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Bottom Floating Material & Lighting Quick Palette */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Real-time Cabinet Color Selector */}
        <div className="flex items-center gap-2 p-2 bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl shadow-lg border border-[#D9C8AE]/50 pointer-events-auto">
          <span className="text-xs font-semibold text-[#6B6862] px-2 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-[#52634A]" /> Shutter Color:
          </span>
          <div className="flex items-center gap-1.5">
            {colorSwatches.map(swatch => (
              <button
                key={swatch.hex}
                onClick={() => updateVisual('cabinetColor', swatch.hex)}
                title={swatch.name}
                style={{ backgroundColor: swatch.hex }}
                className={`w-6 h-6 rounded-full border transition-all ${
                  visuals.cabinetColor === swatch.hex
                    ? 'ring-2 ring-[#52634A] ring-offset-2 scale-110'
                    : 'border-black/20 hover:scale-105'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Lighting & Components Toggles */}
        <div className="flex items-center gap-2 p-1.5 bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl shadow-lg border border-[#D9C8AE]/50 pointer-events-auto">
          {/* Day / Evening Lighting Mode */}
          <button
            onClick={() => updateVisual('lightingMode', visuals.lightingMode === 'evening' ? 'daylight' : 'evening')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              visuals.lightingMode === 'evening'
                ? 'bg-[#292929] text-amber-300'
                : 'bg-amber-100 text-amber-900'
            }`}
          >
            {visuals.lightingMode === 'evening' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            {visuals.lightingMode === 'evening' ? 'Evening Mood' : 'Warm Daylight'}
          </button>

          {/* Lights ON/OFF */}
          <button
            onClick={() => updateVisual('lightsOn', !visuals.lightsOn)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              visuals.lightsOn
                ? 'bg-[#52634A] text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            {visuals.lightsOn ? 'Lights: ON' : 'Lights: OFF'}
          </button>

          {/* Toggle Upper Cabinets */}
          <button
            onClick={() => updateVisual('showUpperCabinets', !visuals.showUpperCabinets)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              visuals.showUpperCabinets
                ? 'bg-[#F0E8DC] text-[#292929] font-semibold'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {visuals.showUpperCabinets ? 'Overheads ON' : 'Overheads OFF'}
          </button>
        </div>
      </div>

      {/* Orbit Helper hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none hidden md:block">
        <span className="px-3 py-1 bg-black/50 text-white/80 backdrop-blur-sm rounded-full text-[11px]">
          Click & drag to rotate 360° • Scroll to zoom
        </span>
      </div>
    </div>
  );
}
