import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { initialMaterials } from '../../server/src/seedData.js';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  // Current active project metadata
  const [projectTitle, setProjectTitle] = useState('My Dream Modular Kitchen');
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [savedProjects, setSavedProjects] = useState([]);
  const [shareToken, setShareToken] = useState('kc-demo-share-2026');

  // Step 2 & 3: Dimensions & Layout
  const [layoutType, setLayoutType] = useState('L-Shaped'); // 'Straight', 'L-Shaped', 'U-Shaped', 'Parallel', 'Island', 'G-Shaped'
  const [dimensions, setDimensions] = useState({
    length: 12, // feet
    width: 10,  // feet
    ceilingHeight: 9.5, // feet
    counterHeight: 2.8, // feet (34 inches)
    cabinetDepth: 2.0,  // feet (24 inches)
    overheadHeight: 2.5 // feet
  });

  // Step 4 & 5: Material Selections (Name / Product reference)
  const [materials, setMaterials] = useState({
    carcass: 'High-Density Moisture-Resistant (HDHMR)',
    shutters: 'European Anti-Fingerprint Matte Acrylic',
    countertop: 'Engineered Calacatta Gold Quartz Slab',
    backsplash: 'Handcrafted Moroccan Zellige Subway Glazed Tiles',
    hardware: 'InnoTech Atira Double-Wall Tandem Box System (50kg)',
    storage: 'LeMans II Blind Corner Swing-Out Carousel',
    appliances: 'Filterless Curved Touch & Gesture Smart Chimney 90cm',
    sinks: 'German Granite Composite Single Bowl Sink (Large)',
    lighting: 'Continuous Under-Cabinet Warm White Profile LED (3000K)',
    flooring: 'Large Format Matte Vitrified Porcelain Slab Tiles (4ft x 2ft)'
  });

  // Step 6: 3D Visualization Visual States
  const [visuals, setVisuals] = useState({
    cabinetColor: '#52634A', // Default Dark Olive
    shutterFinish: 'matte',   // 'matte', 'gloss', 'veneer', 'glass'
    counterColor: '#F5F5F0',  // Calacatta Marble White
    counterType: 'quartz',    // 'quartz', 'granite', 'sintered'
    backsplashColor: '#52634A',
    backsplashType: 'zellige',
    floorColor: '#DDD7CC',
    wallColor: '#F8F5EF',
    handleType: 'gola',       // 'gola', 'brass', 'profile', 'black'
    lightingMode: 'warm',     // 'daylight', 'warm', 'evening'
    showUpperCabinets: true,
    showIsland: true,
    lightsOn: true
  });

  // Uploaded and AI Transformed photos
  const [uploadedImage, setUploadedImage] = useState(null);
  const [transformedImage, setTransformedImage] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [activeDesignStyle, setActiveDesignStyle] = useState('Modern Minimalist');

  // Dynamic Cost Calculation Engine
  const costBreakdown = useMemo(() => {
    const { length, width } = dimensions;

    // Estimate running feet (Rft) of base counter based on layout
    let runningFeet = 0;
    if (layoutType === 'Straight') runningFeet = length;
    else if (layoutType === 'L-Shaped') runningFeet = length + (width * 0.75);
    else if (layoutType === 'Parallel') runningFeet = (length * 0.9) * 2;
    else if (layoutType === 'U-Shaped') runningFeet = length + (width * 1.5);
    else if (layoutType === 'Island') runningFeet = length + (width * 0.7) + 6; // + 6ft island
    else if (layoutType === 'G-Shaped') runningFeet = (length * 1.2) + (width * 1.5);
    else runningFeet = 20;

    // Carcass surface area (base + overhead)
    const carcassSqft = runningFeet * 2.8 * 2.5;
    // Shutters surface area
    const shutterSqft = runningFeet * (visuals.showUpperCabinets ? 5.2 : 2.8);
    // Countertop area
    const counterSqft = runningFeet * dimensions.cabinetDepth;
    // Backsplash area (between lower and upper cabinets)
    const backsplashSqft = runningFeet * 2.0;
    // Floor area
    const floorSqft = length * width;

    // Retrieve selected material pricing (supports unselected/optional categories)
    const getPrice = (cat, defaultPrice, isOptional = false) => {
      const selectedName = materials[cat];
      if (!selectedName && isOptional) return 0;
      const match = initialMaterials.find(m => m.name === selectedName);
      return match ? match.price_inr : (selectedName ? defaultPrice : (isOptional ? 0 : defaultPrice));
    };

    const carcassRate = getPrice('carcass', 110, false);
    const shuttersRate = getPrice('shutters', 580, false);
    const counterRate = getPrice('countertops', 780, false);
    const backsplashRate = getPrice('backsplash', 180, true);
    const hardwareRate = getPrice('hardware', 4200, false);
    const storageRate = getPrice('storage', 32500, true);
    const appliancesRate = getPrice('appliances', 28500, true);
    const sinksRate = getPrice('sinks', 16500, true);
    const lightingRate = getPrice('lighting', 450, true);
    const flooringRate = getPrice('flooring', 135, true);

    // Itemized computations
    const carcass = Math.round(carcassSqft * carcassRate);
    const shutters = Math.round(shutterSqft * shuttersRate);
    const countertop = Math.round(counterSqft * counterRate);
    const backsplash = backsplashRate > 0 ? Math.round(backsplashSqft * backsplashRate) : 0;
    const hardware = Math.round((runningFeet / 2.5) * hardwareRate);
    const storage = storageRate;
    const appliances = appliancesRate > 0 ? appliancesRate + 24900 : 0;
    const sinks = sinksRate > 0 ? sinksRate + 9800 : 0;
    const lighting = lightingRate > 0 ? Math.round(runningFeet * lightingRate) + 8500 : 0;
    const flooring = flooringRate > 0 ? Math.round(floorSqft * flooringRate) : 0;

    const materialSubtotal = carcass + shutters + countertop + backsplash + hardware + storage + appliances + sinks + lighting + flooring;
    const labour = Math.round(materialSubtotal * 0.12); // 12% precision carpentry & civil installation
    const transportation = 12500; // Specialized furniture transport & packaging
    const subtotal = materialSubtotal + labour + transportation;
    const gst = Math.round(subtotal * 0.18); // 18% standard GST
    const total = subtotal + gst;

    return {
      runningFeet: Math.round(runningFeet),
      carcassSqft: Math.round(carcassSqft),
      shutterSqft: Math.round(shutterSqft),
      counterSqft: Math.round(counterSqft),
      backsplashSqft: Math.round(backsplashSqft),
      floorSqft: Math.round(floorSqft),
      carcass,
      shutters,
      countertop,
      backsplash,
      hardware,
      storage,
      appliances,
      sinks,
      lighting,
      flooring,
      labour,
      transportation,
      gst,
      materialSubtotal,
      total
    };
  }, [dimensions, layoutType, materials, visuals]);

  // Load saved projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('kitchencraft_token');
        if (!token) return;
        const res = await fetch('/api/projects', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.projects) setSavedProjects(data.projects);
      } catch (e) {
        console.warn('Could not load saved projects from API, using defaults');
      }
    };
    fetchProjects();
  }, []);

  const selectMaterial = (category, materialName) => {
    setMaterials(prev => {
      // Toggle to unselect if already selected!
      if (prev[category] === materialName) {
        const next = { ...prev };
        delete next[category];
        return next;
      }
      return { ...prev, [category]: materialName };
    });

    // Auto-sync visual colors if relevant
    const found = initialMaterials.find(m => m.name === materialName);
    if (found && found.texture_color) {
      if (category === 'shutters') {
        setVisuals(v => ({ ...v, cabinetColor: found.texture_color }));
      } else if (category === 'countertops') {
        setVisuals(v => ({ ...v, counterColor: found.texture_color }));
      } else if (category === 'backsplash') {
        setVisuals(v => ({ ...v, backsplashColor: found.texture_color }));
      } else if (category === 'flooring') {
        setVisuals(v => ({ ...v, floorColor: found.texture_color }));
      }
    }
  };

  const updateVisual = (key, value) => {
    setVisuals(prev => ({ ...prev, [key]: value }));
  };

  const saveProject = async (titleToSave) => {
    const payload = {
      title: titleToSave || projectTitle,
      layout_type: layoutType,
      dimensions,
      selections: { ...materials, ...visuals },
      uploaded_image_url: uploadedImage,
      transformed_image_url: transformedImage,
      estimated_cost_inr: costBreakdown.total,
      status: 'Ready'
    };

    try {
      const token = localStorage.getItem('kitchencraft_token');
      const res = await fetch(currentProjectId ? `/api/projects/${currentProjectId}` : '/api/projects', {
        method: currentProjectId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.project) {
        setCurrentProjectId(data.project.id);
        setShareToken(data.project.share_token);
        setSavedProjects(prev => {
          const filtered = prev.filter(p => p.id !== data.project.id);
          return [data.project, ...filtered];
        });
        return data.project;
      }
    } catch (err) {
      console.warn('Local fallback save');
      const localProject = {
        id: Date.now(),
        ...payload,
        share_token: 'kc-local-' + Math.random().toString(36).substring(2, 8)
      };
      setSavedProjects(prev => [localProject, ...prev]);
      return localProject;
    }
  };

  const loadProject = (proj) => {
    setCurrentProjectId(proj.id);
    setProjectTitle(proj.title);
    setLayoutType(proj.layout_type || 'L-Shaped');
    if (proj.dimensions_json) {
      try {
        setDimensions(JSON.parse(proj.dimensions_json));
      } catch (e) {}
    }
    if (proj.selections_json) {
      try {
        const sel = JSON.parse(proj.selections_json);
        setMaterials(prev => ({ ...prev, ...sel }));
        setVisuals(prev => ({
          ...prev,
          cabinetColor: sel.cabinetColor || prev.cabinetColor,
          counterColor: sel.counterColor || prev.counterColor,
          floorColor: sel.floorColor || prev.floorColor,
          handleType: sel.handleType || prev.handleType
        }));
      } catch (e) {}
    }
    if (proj.share_token) setShareToken(proj.share_token);
    if (proj.uploaded_image_url) setUploadedImage(proj.uploaded_image_url);
    if (proj.transformed_image_url) setTransformedImage(proj.transformed_image_url);
  };

  return (
    <ProjectContext.Provider value={{
      projectTitle, setProjectTitle,
      currentProjectId, setCurrentProjectId,
      savedProjects, setSavedProjects,
      shareToken,
      layoutType, setLayoutType,
      dimensions, setDimensions,
      materials, selectMaterial,
      visuals, updateVisual,
      uploadedImage, setUploadedImage,
      transformedImage, setTransformedImage,
      aiAnalysis, setAiAnalysis,
      activeDesignStyle, setActiveDesignStyle,
      costBreakdown,
      saveProject, loadProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
