import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Camera, Eye, Sun, Moon, Sparkles, Maximize2, Minimize2,
  Download, Play, Square, Check, RefreshCw, Palette,
  RotateCw, FolderOpen, FolderCheck, Info
} from 'lucide-react';
import { buildKitchenModel } from './KitchenProceduralModel.js';
import { useProject } from '../../context/ProjectContext.jsx';

export default function KitchenScene3D({ className = '', height = '620px' }) {
  const containerRef = useRef(null);
  const { layoutType, dimensions, visuals, updateVisual, saveProject } = useProject();

  const [activeView, setActiveView] = useState('perspective');
  const [isWalkthrough, setIsWalkthrough] = useState(false);
  const [isAutoOrbit, setIsAutoOrbit] = useState(false);
  const [cabinetsOpen, setCabinetsOpen] = useState(false);
  const [hoveredItemName, setHoveredItemName] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [walkthroughProgress, setWalkthroughProgress] = useState(0);
  const [savedNotification, setSavedNotification] = useState(false);

  // Three.js instances
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelGroupRef = useRef(null);
  const dirLightRef = useRef(null);
  const ambientLightRef = useRef(null);
  const animFrameRef = useRef(null);
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Camera target & damped spherical physics
  const orbitRef = useRef({
    currentTheta: Math.PI / 4.2,
    targetTheta: Math.PI / 4.2,
    currentPhi: Math.PI / 2.8,
    targetPhi: Math.PI / 2.8,
    currentRadius: 6.8,
    targetRadius: 6.8,
    currentLookAt: new THREE.Vector3(0, 1.2, 0),
    targetLookAt: new THREE.Vector3(0, 1.2, 0)
  });

  // Setup Three.js Scene on mount
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(visuals.lightingMode === 'evening' ? '#181614' : '#F4EFE6');
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;

    // 3. Renderer with antialiasing, shadow map, tone mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = visuals.lightingMode === 'evening' ? 0.95 : 1.18;
    rendererRef.current = renderer;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(
      visuals.lightingMode === 'evening' ? 0xFFE8D0 : 0xFFFFFF,
      visuals.lightingMode === 'evening' ? 0.65 : 0.9
    );
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const dirLight = new THREE.DirectionalLight(0xFFF9F0, visuals.lightingMode === 'evening' ? 0.85 : 1.35);
    dirLight.position.set(4, 7, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0004;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Soft architectural fill light
    const fillLight = new THREE.DirectionalLight(0xD9C8AE, 0.45);
    fillLight.position.set(-4, 5, -3);
    scene.add(fillLight);

    // 5. Initial Model
    const model = buildKitchenModel(layoutType, dimensions, visuals);
    scene.add(model);
    modelGroupRef.current = model;

    // 6. Interactive Mouse & Touch Handlers
    const dom = renderer.domElement;

    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      const rect = dom.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDraggingRef.current && !isWalkthrough) {
        const deltaX = e.clientX - prevMousePosRef.current.x;
        const deltaY = e.clientY - prevMousePosRef.current.y;
        prevMousePosRef.current = { x: e.clientX, y: e.clientY };

        orbitRef.current.targetTheta -= deltaX * 0.007;
        orbitRef.current.targetPhi = Math.max(0.08, Math.min(Math.PI / 2.05, orbitRef.current.targetPhi - deltaY * 0.007));
        setIsAutoOrbit(false);
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      if (isWalkthrough) return;
      orbitRef.current.targetRadius = Math.max(2.4, Math.min(14.0, orbitRef.current.targetRadius + e.deltaY * 0.006));
    };

    // Click handler to toggle individual drawers/doors on raycast
    const onClick = (e) => {
      if (isDraggingRef.current) return;
      const rect = dom.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
      if (modelGroupRef.current) {
        const intersects = raycasterRef.current.intersectObjects(modelGroupRef.current.children, true);
        if (intersects.length > 0) {
          let curr = intersects[0].object;
          while (curr && curr !== modelGroupRef.current) {
            if (curr.userData?.isAnimatable) {
              curr.userData.targetProgress = curr.userData.targetProgress > 0.5 ? 0 : 1;
              break;
            }
            curr = curr.parent;
          }
        }
      }
    };

    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('click', onClick);

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 7. Master Physics & Animation Loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      // Auto Orbit turntable mode
      if (isAutoOrbit && !isDraggingRef.current && !isWalkthrough) {
        orbitRef.current.targetTheta += 0.003;
      }

      // Smooth camera interpolation (Damped physics lerping)
      const orbit = orbitRef.current;
      orbit.currentTheta += (orbit.targetTheta - orbit.currentTheta) * 0.08;
      orbit.currentPhi += (orbit.targetPhi - orbit.currentPhi) * 0.08;
      orbit.currentRadius += (orbit.targetRadius - orbit.currentRadius) * 0.08;
      orbit.currentLookAt.lerp(orbit.targetLookAt, 0.08);

      camera.position.x = orbit.currentLookAt.x + orbit.currentRadius * Math.sin(orbit.currentPhi) * Math.sin(orbit.currentTheta);
      camera.position.y = orbit.currentLookAt.y + orbit.currentRadius * Math.cos(orbit.currentPhi);
      camera.position.z = orbit.currentLookAt.z + orbit.currentRadius * Math.sin(orbit.currentPhi) * Math.cos(orbit.currentTheta);
      camera.lookAt(orbit.currentLookAt);

      // Smoothly animate modular drawers and overhead doors
      if (modelGroupRef.current?.userData?.animatables) {
        modelGroupRef.current.userData.animatables.forEach((item) => {
          if (Math.abs(item.userData.currentProgress - item.userData.targetProgress) > 0.001) {
            item.userData.currentProgress += (item.userData.targetProgress - item.userData.currentProgress) * 0.12;

            if (item.userData.type === 'drawer') {
              // Slide forward on z-axis
              const offset = item.userData.openVal * item.userData.currentProgress;
              item.position.z = item.userData.closedVal + offset;
            } else if (item.userData.type === 'overhead') {
              // Lift-up swing on x-axis
              item.rotation.x = item.userData.openAngle * item.userData.currentProgress;
            }
          }
        });
      }

      // Raycast hover check for interactive cursor and HUD tooltip
      if (modelGroupRef.current && !isDraggingRef.current) {
        raycasterRef.current.setFromCamera(mouseRef.current, camera);
        const hits = raycasterRef.current.intersectObjects(modelGroupRef.current.children, true);
        if (hits.length > 0) {
          let curr = hits[0].object;
          let foundInteractive = null;
          while (curr && curr !== modelGroupRef.current) {
            if (curr.userData?.name) {
              foundInteractive = curr.userData.name;
              break;
            }
            curr = curr.parent;
          }
          if (foundInteractive) {
            dom.style.cursor = 'pointer';
            setHoveredItemName(foundInteractive);
          } else {
            dom.style.cursor = 'grab';
            setHoveredItemName(null);
          }
        } else {
          dom.style.cursor = 'grab';
          setHoveredItemName(null);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('click', onClick);
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

    // Reset cabinet open state when layout rebuilds
    setCabinetsOpen(false);

    // Adjust environment background & lighting based on visuals.lightingMode
    if (sceneRef.current && dirLightRef.current && ambientLightRef.current) {
      if (visuals.lightingMode === 'evening') {
        sceneRef.current.background.set('#181614');
        ambientLightRef.current.color.set('#FFE8D0');
        ambientLightRef.current.intensity = 0.55;
        dirLightRef.current.intensity = 0.7;
      } else {
        sceneRef.current.background.set('#F4EFE6');
        ambientLightRef.current.color.set('#FFFFFF');
        ambientLightRef.current.intensity = 0.9;
        dirLightRef.current.intensity = 1.35;
      }
    }
  }, [layoutType, dimensions, visuals]);

  // Switch View Presets with Damped Easing
  const setCameraView = (view) => {
    setActiveView(view);
    setIsWalkthrough(false);
    setIsAutoOrbit(false);

    if (view === 'top') {
      orbitRef.current.targetTheta = 0;
      orbitRef.current.targetPhi = 0.06;
      orbitRef.current.targetRadius = 8.5;
      orbitRef.current.targetLookAt.set(0, 0, 0);
    } else if (view === 'front') {
      orbitRef.current.targetTheta = 0;
      orbitRef.current.targetPhi = Math.PI / 2.3;
      orbitRef.current.targetRadius = 6.2;
      orbitRef.current.targetLookAt.set(0, 1.2, 0);
    } else if (view === 'island') {
      orbitRef.current.targetTheta = Math.PI / 3;
      orbitRef.current.targetPhi = Math.PI / 2.6;
      orbitRef.current.targetRadius = 4.2;
      orbitRef.current.targetLookAt.set(0, 0.9, 0.5);
    } else if (view === 'isometric') {
      orbitRef.current.targetTheta = Math.PI / 4;
      orbitRef.current.targetPhi = Math.PI / 3.4;
      orbitRef.current.targetRadius = 7.5;
      orbitRef.current.targetLookAt.set(0, 1.0, 0);
    } else {
      // Perspective
      orbitRef.current.targetTheta = Math.PI / 4.2;
      orbitRef.current.targetPhi = Math.PI / 2.8;
      orbitRef.current.targetRadius = 6.8;
      orbitRef.current.targetLookAt.set(0, 1.2, 0);
    }
  };

  // Global Toggle to Open / Close All Cabinets & Drawers
  const toggleAllCabinets = () => {
    const nextState = !cabinetsOpen;
    setCabinetsOpen(nextState);

    if (modelGroupRef.current?.userData?.animatables) {
      modelGroupRef.current.userData.animatables.forEach((item, index) => {
        // Staggered soft-close opening animation
        setTimeout(() => {
          item.userData.targetProgress = nextState ? 1 : 0;
        }, index * 40);
      });
    }
  };

  // Cinematic 3D Walkthrough
  useEffect(() => {
    if (!isWalkthrough) return;

    let startTime = Date.now();
    const duration = 18000;

    const tourKeyframes = [
      { t: 0.0, theta: Math.PI / 4, phi: Math.PI / 3, radius: 7.2, target: [0, 1.2, 0] },
      { t: 0.22, theta: 0.15, phi: Math.PI / 2.4, radius: 4.6, target: [0.2, 1.1, -1.2] }, // Hob & Chimney
      { t: 0.48, theta: Math.PI / 2.1, phi: Math.PI / 2.3, radius: 4.0, target: [-1.4, 1.0, 0] }, // Sink zone
      { t: 0.72, theta: Math.PI / 3.2, phi: Math.PI / 2.8, radius: 4.4, target: [0, 0.9, 0.8] }, // Island & seating
      { t: 1.0, theta: Math.PI / 4, phi: Math.PI / 3, radius: 6.8, target: [0, 1.2, 0] } // Overview return
    ];

    const runTour = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % duration) / duration;
      setWalkthroughProgress(Math.round(progress * 100));

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
      const ease = (1 - Math.cos(segmentFactor * Math.PI)) / 2;

      orbitRef.current.targetTheta = k1.theta + (k2.theta - k1.theta) * ease;
      orbitRef.current.targetPhi = k1.phi + (k2.phi - k1.phi) * ease;
      orbitRef.current.targetRadius = k1.radius + (k2.radius - k1.radius) * ease;
      orbitRef.current.targetLookAt.set(
        k1.target[0] + (k2.target[0] - k1.target[0]) * ease,
        k1.target[1] + (k2.target[1] - k1.target[1]) * ease,
        k1.target[2] + (k2.target[2] - k1.target[2]) * ease
      );
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
            Floorplan
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

        {/* Right Tools: Interactive Cabinets, Auto-Orbit, Walkthrough, Capture */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Animate / Open Cabinets button */}
          <button
            onClick={toggleAllCabinets}
            title="Open or Close all drawers and overhead shutters"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold shadow-lg transition-all ${
              cabinetsOpen
                ? 'bg-amber-600 text-white'
                : 'bg-white/95 text-[#292929] hover:bg-white border border-[#D9C8AE]/50'
            }`}
          >
            {cabinetsOpen ? <FolderCheck className="w-3.5 h-3.5" /> : <FolderOpen className="w-3.5 h-3.5 text-[#52634A]" />}
            {cabinetsOpen ? 'Close Cabinets' : 'Open Cabinets'}
          </button>

          {/* 360° Auto Orbit */}
          <button
            onClick={() => setIsAutoOrbit(!isAutoOrbit)}
            title="Continuous 360° Architectural Turntable Orbit"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold shadow-lg transition-all ${
              isAutoOrbit
                ? 'bg-[#52634A] text-white ring-2 ring-[#52634A]/30'
                : 'bg-white/95 text-[#292929] hover:bg-white border border-[#D9C8AE]/50'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoOrbit ? 'animate-spin' : 'text-[#52634A]'}`} />
            360° Orbit
          </button>

          {/* Cinematic 3D Walkthrough button */}
          <button
            onClick={() => setIsWalkthrough(!isWalkthrough)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-semibold shadow-lg transition-all ${
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
                <Play className="w-3.5 h-3.5 fill-current" /> 3D Walkthrough
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

      {/* Floating 3D Hover Tooltip / HUD Banner */}
      {hoveredItemName && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-200">
          <div className="px-4 py-1.5 bg-black/75 backdrop-blur-md text-white rounded-full text-xs font-medium border border-white/20 shadow-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>{hoveredItemName}</span>
            <span className="text-[10px] text-[#D9C8AE] border-l border-white/20 pl-2">Click to interact</span>
          </div>
        </div>
      )}

      {/* Bottom Floating Material & Lighting Quick Palette */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Real-time Cabinet Color Selector */}
        <div className="flex items-center gap-2 p-2 bg-[#FFFFFF]/90 backdrop-blur-md rounded-2xl shadow-lg border border-[#D9C8AE]/50 pointer-events-auto">
          <span className="text-xs font-semibold text-[#6B6862] px-2 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-[#52634A]" /> Shutter Color:
          </span>
          <div className="flex items-center gap-1.5">
            {colorSwatches.map((swatch) => (
              <button
                key={swatch.hex}
                onClick={() => updateVisual('cabinetColor', swatch.hex)}
                title={swatch.name}
                style={{ backgroundColor: swatch.hex }}
                className={`w-6 h-6 rounded-full border transition-all ${
                  visuals.cabinetColor === swatch.hex
                    ? 'ring-2 ring-[#52634A] ring-offset-2 scale-110 shadow'
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
        <span className="px-3.5 py-1 bg-black/60 text-white/90 backdrop-blur-sm rounded-full text-[11px] flex items-center gap-1.5 shadow">
          <span>Click cabinets/drawers to open</span> • <span>Drag to orbit</span> • <span>Scroll to zoom</span>
        </span>
      </div>
    </div>
  );
}
