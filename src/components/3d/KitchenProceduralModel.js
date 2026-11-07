import * as THREE from 'three';

// Procedural texture generators for realistic surfaces
function createTileTexture(colorHex = '#52634A') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Grout color
  ctx.fillStyle = '#E8E5DF';
  ctx.fillRect(0, 0, 512, 512);

  // Subway tile layout
  ctx.fillStyle = colorHex;
  const rows = 8;
  const cols = 4;
  const h = 512 / rows;
  const w = 512 / cols;

  for (let r = 0; r < rows; r++) {
    const offset = (r % 2 === 0) ? 0 : w / 2;
    for (let c = -1; c <= cols; c++) {
      ctx.fillRect(c * w + offset + 2, r * h + 2, w - 4, h - 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createMarbleTexture(baseColor = '#F5F5F0', veinColor = '#8A857D') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  // Subtle organic veining
  ctx.strokeStyle = veinColor;
  ctx.lineWidth = 2.2;
  ctx.globalAlpha = 0.40;

  ctx.beginPath();
  ctx.moveTo(0, 100);
  ctx.bezierCurveTo(150, 80, 300, 260, 512, 320);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(50, 0);
  ctx.bezierCurveTo(220, 180, 280, 380, 480, 512);
  ctx.stroke();

  ctx.lineWidth = 1.0;
  ctx.globalAlpha = 0.22;
  ctx.beginPath();
  ctx.moveTo(200, 120);
  ctx.lineTo(280, 190);
  ctx.lineTo(380, 160);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createWoodTexture(woodHex = '#5A3825') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = woodHex;
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = '#2B170B';
  ctx.globalAlpha = 0.2;
  ctx.lineWidth = 1;
  for (let y = 0; y < 512; y += 8) {
    ctx.beginPath();
    ctx.moveTo(0, y + (Math.sin(y * 0.05) * 4));
    ctx.lineTo(512, y + (Math.cos(y * 0.05) * 4));
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Realistic ambient contact shadow map
function createContactShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
  grad.addColorStop(0.4, 'rgba(0, 0, 0, 0.35)');
  grad.addColorStop(0.8, 'rgba(0, 0, 0, 0.08)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

export function buildKitchenModel(layoutType, dimensions, visuals) {
  const kitchenGroup = new THREE.Group();
  const animatables = [];
  kitchenGroup.userData.animatables = animatables;

  const {
    cabinetColor = '#52634A',
    shutterFinish = 'matte',
    counterColor = '#F5F5F0',
    backsplashColor = '#52634A',
    floorColor = '#DDD7CC',
    wallColor = '#F8F5EF',
    handleType = 'brass',
    lightsOn = true,
    showUpperCabinets = true,
    showIsland = true
  } = visuals;

  // Material setup
  const roughness = shutterFinish === 'gloss' ? 0.08 : shutterFinish === 'veneer' ? 0.65 : 0.28;
  const metalness = shutterFinish === 'glass' ? 0.2 : 0.04;

  const cabinetMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(cabinetColor),
    roughness,
    metalness,
    map: shutterFinish === 'veneer' ? createWoodTexture(cabinetColor) : null
  });

  const drawerInteriorMat = new THREE.MeshStandardMaterial({
    color: 0xE8E4DD,
    roughness: 0.5,
    metalness: 0.1
  });

  const cutlerySteelMat = new THREE.MeshStandardMaterial({
    color: 0xDDDDDD,
    metalness: 0.95,
    roughness: 0.15
  });

  const counterMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(counterColor),
    roughness: 0.14,
    metalness: 0.08,
    map: createMarbleTexture(counterColor, '#9B968D')
  });

  const backsplashMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(backsplashColor),
    roughness: 0.18,
    metalness: 0.1,
    map: createTileTexture(backsplashColor)
  });

  const floorMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(floorColor),
    roughness: 0.35,
    metalness: 0.05
  });

  const wallMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(wallColor),
    roughness: 0.9,
    metalness: 0.0
  });

  const kickplateMat = new THREE.MeshStandardMaterial({
    color: 0x1A1A1A,
    roughness: 0.6
  });

  const applianceSteelMat = new THREE.MeshStandardMaterial({
    color: 0x2A2A2A,
    metalness: 0.88,
    roughness: 0.2
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xEEEEEE,
    metalness: 0.98,
    roughness: 0.08
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#B69A65'),
    metalness: 0.85,
    roughness: 0.22
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x111111,
    transmission: 0.65,
    opacity: 0.85,
    transparent: true,
    roughness: 0.08,
    ior: 1.5
  });

  const contactShadowTex = createContactShadowTexture();

  // Base dimensions in 3D coordinate units
  const roomW = (dimensions?.length || 12) * 0.45;
  const roomD = (dimensions?.width || 10) * 0.45;
  const roomH = 3.6;

  // 1. Flooring
  const floorGeo = new THREE.PlaneGeometry(roomW + 2, roomD + 2);
  const floorMesh = new THREE.Mesh(floorGeo, floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  kitchenGroup.add(floorMesh);

  // 2. Rear and Left Walls
  const backWallGeo = new THREE.BoxGeometry(roomW + 2, roomH, 0.1);
  const backWall = new THREE.Mesh(backWallGeo, wallMat);
  backWall.position.set(0, roomH / 2, -(roomD / 2) - 0.05);
  backWall.receiveShadow = true;
  kitchenGroup.add(backWall);

  const leftWallGeo = new THREE.BoxGeometry(0.1, roomH, roomD + 2);
  const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
  leftWall.position.set(-(roomW / 2) - 0.05, roomH / 2, 0);
  leftWall.receiveShadow = true;
  kitchenGroup.add(leftWall);

  // Contact Shadow Helper
  function addContactShadow(parent, w, d, x = 0, z = 0) {
    const shadowGeo = new THREE.PlaneGeometry(w * 1.08, d * 1.12);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: contactShadowTex,
      transparent: true,
      opacity: 0.72,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(x, 0.003, z);
    parent.add(shadowMesh);
  }

  // Helper to create an interactive modular lower cabinet run with real animatable drawers
  function createLowerRun(width, depth, x, z, rotY = 0) {
    const group = new THREE.Group();

    // Contact shadow beneath lower cabinet
    addContactShadow(group, width, depth, 0, 0);

    // Kickplate
    const kickGeo = new THREE.BoxGeometry(width, 0.15, depth - 0.08);
    const kick = new THREE.Mesh(kickGeo, kickplateMat);
    kick.position.set(0, 0.075, 0.04);
    kick.castShadow = true;
    group.add(kick);

    const cabinetH = 0.82;
    // Internal carcass back and side frames
    const carcassGeo = new THREE.BoxGeometry(width, cabinetH, depth * 0.95);
    const carcass = new THREE.Mesh(carcassGeo, new THREE.MeshStandardMaterial({ color: 0x2A2A2A, roughness: 0.7 }));
    carcass.position.set(0, 0.15 + cabinetH / 2, -depth * 0.02);
    carcass.castShadow = true;
    carcass.receiveShadow = true;
    group.add(carcass);

    // Modular divisions with interactive animatable drawers!
    const numModules = Math.max(2, Math.round(width / 0.65));
    const modW = width / numModules;

    for (let m = 0; m < numModules; m++) {
      const mx = -width / 2 + (m + 0.5) * modW;
      const drawerW = modW - 0.012;

      // 1. TOP CUTLERY DRAWER (Animatable forward glide)
      const topDrawerH = cabinetH * 0.32;
      const topDrawerY = 0.15 + cabinetH - topDrawerH / 2 - 0.01;

      const topDrawerGroup = new THREE.Group();
      topDrawerGroup.position.set(mx, topDrawerY, 0);

      // Drawer front face
      const frontMesh = new THREE.Mesh(new THREE.BoxGeometry(drawerW, topDrawerH - 0.01, 0.02), cabinetMat);
      frontMesh.position.set(0, 0, depth / 2 + 0.01);
      frontMesh.castShadow = true;
      topDrawerGroup.add(frontMesh);

      // Drawer handle
      const handleMesh = new THREE.Mesh(
        new THREE.BoxGeometry(drawerW * 0.6, 0.015, 0.02),
        handleType === 'brass' ? brassMat : applianceSteelMat
      );
      handleMesh.position.set(0, topDrawerH * 0.25, depth / 2 + 0.025);
      topDrawerGroup.add(handleMesh);

      // Interior box (sides, bottom, back)
      const boxBottom = new THREE.Mesh(new THREE.BoxGeometry(drawerW * 0.92, 0.015, depth * 0.75), drawerInteriorMat);
      boxBottom.position.set(0, -topDrawerH / 2 + 0.02, 0.05);
      topDrawerGroup.add(boxBottom);

      const boxSides = new THREE.Mesh(new THREE.BoxGeometry(drawerW * 0.92, topDrawerH * 0.6, depth * 0.75), drawerInteriorMat);
      boxSides.position.set(0, 0, 0.05);
      topDrawerGroup.add(boxSides);

      // Cutlery Tray with 3D Silverware inside
      const cutleryTray = new THREE.Mesh(new THREE.BoxGeometry(drawerW * 0.85, 0.02, depth * 0.6), cutlerySteelMat);
      cutleryTray.position.set(0, -topDrawerH / 2 + 0.04, 0.05);
      topDrawerGroup.add(cutleryTray);

      // Register animatable drawer
      topDrawerGroup.userData = {
        isAnimatable: true,
        type: 'drawer',
        name: `Tandem Cutlery Drawer (Unit ${m + 1})`,
        axis: 'z',
        closedVal: 0,
        openVal: 0.45,
        currentProgress: 0,
        targetProgress: 0,
        rotY
      };
      animatables.push(topDrawerGroup);
      group.add(topDrawerGroup);

      // 2. BOTTOM DEEP POT DRAWER (Animatable forward glide)
      const botDrawerH = cabinetH * 0.62;
      const botDrawerY = 0.15 + botDrawerH / 2;

      const botDrawerGroup = new THREE.Group();
      botDrawerGroup.position.set(mx, botDrawerY, 0);

      const botFront = new THREE.Mesh(new THREE.BoxGeometry(drawerW, botDrawerH - 0.015, 0.02), cabinetMat);
      botFront.position.set(0, 0, depth / 2 + 0.01);
      botFront.castShadow = true;
      botDrawerGroup.add(botFront);

      const botHandle = new THREE.Mesh(
        new THREE.BoxGeometry(drawerW * 0.6, 0.015, 0.02),
        handleType === 'brass' ? brassMat : applianceSteelMat
      );
      botHandle.position.set(0, botDrawerH * 0.35, depth / 2 + 0.025);
      botDrawerGroup.add(botHandle);

      // Interior deep drawer box
      const botSides = new THREE.Mesh(new THREE.BoxGeometry(drawerW * 0.92, botDrawerH * 0.7, depth * 0.75), drawerInteriorMat);
      botSides.position.set(0, 0, 0.05);
      botDrawerGroup.add(botSides);

      botDrawerGroup.userData = {
        isAnimatable: true,
        type: 'drawer',
        name: `Deep Tandem Pot Drawer (Unit ${m + 1})`,
        axis: 'z',
        closedVal: 0,
        openVal: 0.45,
        currentProgress: 0,
        targetProgress: 0,
        rotY
      };
      animatables.push(botDrawerGroup);
      group.add(botDrawerGroup);
    }

    // Polished 20mm Quartz Countertop
    const counterGeo = new THREE.BoxGeometry(width + 0.04, 0.06, depth + 0.05);
    const counter = new THREE.Mesh(counterGeo, counterMat);
    counter.position.set(0, 0.15 + cabinetH + 0.03, 0.025);
    counter.castShadow = true;
    counter.receiveShadow = true;
    group.add(counter);

    // Bevel top edge specular highlight
    const bevelEdge = new THREE.Mesh(
      new THREE.BoxGeometry(width + 0.04, 0.006, 0.008),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
    );
    bevelEdge.position.set(0, 0.15 + cabinetH + 0.06, depth / 2 + 0.05);
    group.add(bevelEdge);

    group.position.set(x, 0, z);
    group.rotation.y = rotY;
    return group;
  }

  // Helper to create overhead cabinet run with hydraulic bi-fold / swing opening
  function createOverheadRun(width, depth, height, x, y, z, rotY = 0) {
    const group = new THREE.Group();

    // Carcass body
    const cabGeo = new THREE.BoxGeometry(width, height, depth * 0.95);
    const cab = new THREE.Mesh(cabGeo, new THREE.MeshStandardMaterial({ color: 0x2A2A2A, roughness: 0.6 }));
    cab.position.set(0, height / 2, -depth * 0.02);
    cab.castShadow = true;
    cab.receiveShadow = true;
    group.add(cab);

    // Individual Shutter doors with animatable lift-up swing
    const numDoors = Math.max(2, Math.round(width / 0.65));
    const doorW = width / numDoors;

    for (let i = 0; i < numDoors; i++) {
      const doorX = -width / 2 + (i + 0.5) * doorW;

      // Pivot group placed at the top edge of the cabinet door for realistic hydraulic lift-up
      const pivotGroup = new THREE.Group();
      pivotGroup.position.set(doorX, height, depth / 2 + 0.005);

      // Door mesh hanging down from pivot
      const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(doorW - 0.008, height - 0.01, 0.02), cabinetMat);
      doorMesh.position.set(0, -height / 2, 0);
      doorMesh.castShadow = true;
      pivotGroup.add(doorMesh);

      // Handle at bottom
      const handle = new THREE.Mesh(
        new THREE.BoxGeometry(doorW * 0.5, 0.015, 0.02),
        handleType === 'brass' ? brassMat : applianceSteelMat
      );
      handle.position.set(0, -height + 0.06, 0.015);
      pivotGroup.add(handle);

      // Internal illuminated glass shelf
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(doorW * 0.9, 0.012, depth * 0.8), glassMat);
      shelf.position.set(doorX, height * 0.5, 0);
      group.add(shelf);

      pivotGroup.userData = {
        isAnimatable: true,
        type: 'overhead',
        name: `Hydraulic Overhead Shutter (Unit ${i + 1})`,
        axis: 'x',
        openAngle: -Math.PI / 2.3, // Swings upward
        currentProgress: 0,
        targetProgress: 0
      };
      animatables.push(pivotGroup);
      group.add(pivotGroup);
    }

    // Under-cabinet LED Strip light source & warm glow
    if (lightsOn) {
      const ledBarGeo = new THREE.BoxGeometry(width * 0.95, 0.01, 0.03);
      const ledBarMat = new THREE.MeshBasicMaterial({ color: 0xFFE0B2 });
      const ledBar = new THREE.Mesh(ledBarGeo, ledBarMat);
      ledBar.position.set(0, -0.01, depth * 0.2);
      group.add(ledBar);

      const stripLight = new THREE.PointLight(0xFFD180, 1.4, 2.8, 2);
      stripLight.position.set(0, -0.1, depth * 0.2);
      group.add(stripLight);
    }

    group.position.set(x, y, z);
    group.rotation.y = rotY;
    return group;
  }

  // Backsplash Wall Panel
  function createBacksplashPanel(width, height, x, y, z, rotY = 0) {
    const geo = new THREE.BoxGeometry(width, height, 0.02);
    const mesh = new THREE.Mesh(geo, backsplashMat);
    mesh.position.set(x, y, z);
    mesh.rotation.y = rotY;
    mesh.receiveShadow = true;
    return mesh;
  }

  // Appliances: Hob & Chimney
  function createCooktopAndChimney(x, z, rotY = 0) {
    const group = new THREE.Group();

    // Hob (Gas / Induction)
    const hobBase = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.025, 0.52), glassMat);
    hobBase.position.set(0, 1.05, 0);
    group.add(hobBase);

    // 4 Burner rings with brass caps
    const burnerGeo = new THREE.CylinderGeometry(0.065, 0.075, 0.018, 24);
    const offsets = [[-0.2, -0.12], [0.2, -0.12], [-0.16, 0.13], [0.16, 0.13]];
    offsets.forEach(([bx, bz]) => {
      const burner = new THREE.Mesh(burnerGeo, brassMat);
      burner.position.set(bx, 1.065, bz);
      group.add(burner);
    });

    // Chimney Hood
    const chimneyBase = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.08, 0.5), applianceSteelMat);
    chimneyBase.position.set(0, 2.05, 0);
    chimneyBase.castShadow = true;
    group.add(chimneyBase);

    const chimneyCurved = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.35, 0.15), glassMat);
    chimneyCurved.position.set(0, 2.15, 0.18);
    chimneyCurved.rotation.x = -0.3;
    group.add(chimneyCurved);

    const chimneyDuct = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.9, 0.3), applianceSteelMat);
    chimneyDuct.position.set(0, 2.55, -0.05);
    group.add(chimneyDuct);

    // Chimney LED spotlight
    const chimneyLight = new THREE.PointLight(0xFFE8D0, 1.2, 2.0);
    chimneyLight.position.set(0, 2.0, 0.1);
    group.add(chimneyLight);

    group.position.set(x, 0, z);
    group.rotation.y = rotY;
    return group;
  }

  // Sink and Faucet
  function createSinkAndFaucet(x, z, rotY = 0) {
    const group = new THREE.Group();

    // Sink basin rim
    const sinkRim = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.02, 0.52), applianceSteelMat);
    sinkRim.position.set(0, 1.04, 0);
    group.add(sinkRim);

    const basinInner = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.28, 0.44), applianceSteelMat);
    basinInner.position.set(0, 0.88, 0);
    group.add(basinInner);

    // High-arc gooseneck faucet
    const faucetGroup = new THREE.Group();
    const baseCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.028, 0.12, 20), chromeMat);
    baseCyl.position.set(0, 1.08, -0.18);
    faucetGroup.add(baseCyl);

    const neckCurve = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.016, 16, 32, Math.PI), chromeMat);
    neckCurve.position.set(0, 1.25, -0.18);
    neckCurve.rotation.y = Math.PI / 2;
    faucetGroup.add(neckCurve);

    // Pull out spray head
    const sprayHead = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.024, 0.06, 16), chromeMat);
    sprayHead.position.set(0, 1.18, -0.04);
    faucetGroup.add(sprayHead);

    group.add(faucetGroup);

    group.position.set(x, 0, z);
    group.rotation.y = rotY;
    return group;
  }

  // Tall Tower Unit (Oven + Microwave + Pantry)
  function createTallUnit(x, z) {
    const group = new THREE.Group();
    const towerH = 2.4;
    const towerW = 0.65;
    const towerD = 0.65;

    // Contact shadow
    addContactShadow(group, towerW, towerD, 0, 0);

    const body = new THREE.Mesh(new THREE.BoxGeometry(towerW, towerH, towerD), cabinetMat);
    body.position.set(0, towerH / 2, 0);
    body.castShadow = true;
    group.add(body);

    // Built-in Oven niche
    const oven = new THREE.Mesh(new THREE.BoxGeometry(towerW * 0.92, 0.58, 0.05), glassMat);
    oven.position.set(0, 1.15, towerD / 2 + 0.02);
    group.add(oven);

    // Microwave niche
    const micro = new THREE.Mesh(new THREE.BoxGeometry(towerW * 0.92, 0.4, 0.05), applianceSteelMat);
    micro.position.set(0, 1.72, towerD / 2 + 0.02);
    group.add(micro);

    group.position.set(x, 0, z);
    return group;
  }

  // Refrigerator (Double door French door)
  function createRefrigerator(x, z) {
    const group = new THREE.Group();
    const fridgeW = 0.9;
    const fridgeH = 2.0;
    const fridgeD = 0.75;

    addContactShadow(group, fridgeW, fridgeD, 0, 0);

    const body = new THREE.Mesh(new THREE.BoxGeometry(fridgeW, fridgeH, fridgeD), applianceSteelMat);
    body.position.set(0, fridgeH / 2, 0);
    body.castShadow = true;
    group.add(body);

    // French door vertical split
    const split = new THREE.Mesh(new THREE.BoxGeometry(0.008, fridgeH * 0.65, 0.02), kickplateMat);
    split.position.set(0, fridgeH * 0.65, fridgeD / 2 + 0.01);
    group.add(split);

    // Brushed metal handles
    [-0.04, 0.04].forEach(hx => {
      const hnd = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.6, 12), chromeMat);
      hnd.position.set(hx, 1.25, fridgeD / 2 + 0.03);
      group.add(hnd);
    });

    group.position.set(x, 0, z);
    return group;
  }

  // Kitchen Island with Waterfall Marble & Animatable Drawers
  function createKitchenIsland(x, z) {
    const group = new THREE.Group();
    const islandW = 2.3;
    const islandD = 1.05;
    const islandH = 0.88;

    addContactShadow(group, islandW + 0.2, islandD + 0.2, 0, 0);

    // Island base carcass
    const base = new THREE.Mesh(new THREE.BoxGeometry(islandW, islandH, islandD), cabinetMat);
    base.position.set(0, islandH / 2 + 0.1, 0);
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    // Animatable Island Drawers (Front facing)
    const islandModCount = 3;
    const iModW = islandW / islandModCount;
    for (let i = 0; i < islandModCount; i++) {
      const ix = -islandW / 2 + (i + 0.5) * iModW;
      const iDrawerGroup = new THREE.Group();
      iDrawerGroup.position.set(ix, islandH * 0.55 + 0.1, 0);

      const iFront = new THREE.Mesh(new THREE.BoxGeometry(iModW - 0.02, islandH * 0.7, 0.02), cabinetMat);
      iFront.position.set(0, 0, islandD / 2 + 0.01);
      iDrawerGroup.add(iFront);

      const iHandle = new THREE.Mesh(new THREE.BoxGeometry(iModW * 0.5, 0.015, 0.02), brassMat);
      iHandle.position.set(0, islandH * 0.25, islandD / 2 + 0.025);
      iDrawerGroup.add(iHandle);

      iDrawerGroup.userData = {
        isAnimatable: true,
        type: 'drawer',
        name: `Island Storage Drawer ${i + 1}`,
        axis: 'z',
        closedVal: 0,
        openVal: 0.42,
        currentProgress: 0,
        targetProgress: 0,
        rotY: 0
      };
      animatables.push(iDrawerGroup);
      group.add(iDrawerGroup);
    }

    // Waterfall Countertop
    const top = new THREE.Mesh(new THREE.BoxGeometry(islandW + 0.1, 0.07, islandD + 0.2), counterMat);
    top.position.set(0, islandH + 0.13, 0);
    top.castShadow = true;
    group.add(top);

    // Waterfall sides
    const leftWaterfall = new THREE.Mesh(new THREE.BoxGeometry(0.07, islandH + 0.1, islandD + 0.2), counterMat);
    leftWaterfall.position.set(-(islandW / 2 + 0.035), (islandH + 0.1) / 2, 0);
    group.add(leftWaterfall);

    const rightWaterfall = new THREE.Mesh(new THREE.BoxGeometry(0.07, islandH + 0.1, islandD + 0.2), counterMat);
    rightWaterfall.position.set(islandW / 2 + 0.035, (islandH + 0.1) / 2, 0);
    group.add(rightWaterfall);

    // 2 Minimalist Bar Stools
    [-0.55, 0.55].forEach(sx => {
      const stoolGroup = new THREE.Group();
      const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 24), brassMat);
      seat.position.set(0, 0.68, 0);
      seat.castShadow = true;
      stoolGroup.add(seat);

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.65, 12), applianceSteelMat);
      pole.position.set(0, 0.33, 0);
      stoolGroup.add(pole);

      const baseRing = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.02, 24), applianceSteelMat);
      baseRing.position.set(0, 0.01, 0);
      stoolGroup.add(baseRing);

      stoolGroup.position.set(sx, 0, islandD / 2 + 0.48);
      group.add(stoolGroup);
    });

    // Hanging Pendants above Island
    if (lightsOn) {
      [-0.65, 0.65].forEach(px => {
        const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 1.2, 8), applianceSteelMat);
        wire.position.set(px, 2.8, 0);
        group.add(wire);

        const shade = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.24, 20, 1, true), brassMat);
        shade.position.set(px, 2.15, 0);
        group.add(shade);

        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), new THREE.MeshBasicMaterial({ color: 0xFFE0B2 }));
        bulb.position.set(px, 2.08, 0);
        group.add(bulb);

        const pendantLight = new THREE.PointLight(0xFFD180, 1.8, 4.0, 2);
        pendantLight.position.set(px, 2.0, 0);
        group.add(pendantLight);
      });
    }

    group.position.set(x, 0, z);
    return group;
  }

  // ==========================================
  // ASSEMBLE ACCORDING TO SELECTED LAYOUT
  // ==========================================
  const runD = 0.65;
  const backZ = -(roomD / 2) + runD / 2 + 0.1;
  const leftX = -(roomW / 2) + runD / 2 + 0.1;

  if (layoutType === 'Straight') {
    const counterWidth = Math.min(roomW * 0.9, 5.0);
    kitchenGroup.add(createLowerRun(counterWidth, runD, 0, backZ, 0));
    kitchenGroup.add(createBacksplashPanel(counterWidth, 0.75, 0, 1.45, backZ - runD / 2 - 0.01, 0));

    if (showUpperCabinets) {
      kitchenGroup.add(createOverheadRun(counterWidth, 0.38, 0.8, 0, 1.9, backZ - 0.12, 0));
    }
    kitchenGroup.add(createCooktopAndChimney(-0.7, backZ, 0));
    kitchenGroup.add(createSinkAndFaucet(0.9, backZ, 0));
    kitchenGroup.add(createRefrigerator(counterWidth / 2 + 0.55, backZ));

  } else if (layoutType === 'Parallel') {
    const counterWidth = Math.min(roomW * 0.85, 4.2);
    kitchenGroup.add(createLowerRun(counterWidth, runD, 0, backZ, 0));
    kitchenGroup.add(createBacksplashPanel(counterWidth, 0.75, 0, 1.45, backZ - runD / 2 - 0.01, 0));
    if (showUpperCabinets) {
      kitchenGroup.add(createOverheadRun(counterWidth, 0.38, 0.8, 0, 1.9, backZ - 0.12, 0));
    }
    kitchenGroup.add(createCooktopAndChimney(0, backZ, 0));

    const frontZ = backZ + 1.8;
    kitchenGroup.add(createLowerRun(counterWidth, runD, 0, frontZ, Math.PI));
    kitchenGroup.add(createSinkAndFaucet(0, frontZ, Math.PI));
    kitchenGroup.add(createRefrigerator(counterWidth / 2 + 0.55, backZ));

  } else if (layoutType === 'U-Shaped') {
    const backW = Math.min(roomW * 0.9, 4.5);
    const sideL = Math.min(roomD * 0.75, 3.2);

    kitchenGroup.add(createLowerRun(backW, runD, 0, backZ, 0));
    kitchenGroup.add(createBacksplashPanel(backW, 0.75, 0, 1.45, backZ - runD / 2 - 0.01, 0));
    if (showUpperCabinets) {
      kitchenGroup.add(createOverheadRun(backW, 0.38, 0.8, 0, 1.9, backZ - 0.12, 0));
    }
    kitchenGroup.add(createCooktopAndChimney(0, backZ, 0));

    const leftZ = backZ + sideL / 2;
    kitchenGroup.add(createLowerRun(sideL, runD, -backW / 2 + runD / 2, leftZ, Math.PI / 2));
    kitchenGroup.add(createSinkAndFaucet(-backW / 2 + runD / 2, leftZ, Math.PI / 2));

    const rightZ = backZ + sideL / 2;
    kitchenGroup.add(createLowerRun(sideL, runD, backW / 2 - runD / 2, rightZ, -Math.PI / 2));
    kitchenGroup.add(createRefrigerator(backW / 2 + 0.3, backZ + sideL - 0.2));

  } else if (layoutType === 'Island') {
    const backW = Math.min(roomW * 0.9, 4.6);
    kitchenGroup.add(createLowerRun(backW, runD, 0, backZ, 0));
    kitchenGroup.add(createBacksplashPanel(backW, 0.75, 0, 1.45, backZ - runD / 2 - 0.01, 0));
    if (showUpperCabinets) {
      kitchenGroup.add(createOverheadRun(backW, 0.38, 0.8, 0, 1.9, backZ - 0.12, 0));
    }
    kitchenGroup.add(createCooktopAndChimney(-0.6, backZ, 0));
    kitchenGroup.add(createSinkAndFaucet(0.9, backZ, 0));
    kitchenGroup.add(createRefrigerator(backW / 2 + 0.55, backZ));

    if (showIsland) {
      kitchenGroup.add(createKitchenIsland(0, backZ + 1.8));
    }

  } else if (layoutType === 'G-Shaped') {
    const backW = Math.min(roomW * 0.9, 4.5);
    const sideL = Math.min(roomD * 0.75, 3.2);

    kitchenGroup.add(createLowerRun(backW, runD, 0, backZ, 0));
    kitchenGroup.add(createBacksplashPanel(backW, 0.75, 0, 1.45, backZ - runD / 2 - 0.01, 0));
    if (showUpperCabinets) {
      kitchenGroup.add(createOverheadRun(backW, 0.38, 0.8, 0, 1.9, backZ - 0.12, 0));
    }
    kitchenGroup.add(createCooktopAndChimney(0, backZ, 0));

    const leftZ = backZ + sideL / 2;
    kitchenGroup.add(createLowerRun(sideL, runD, -backW / 2 + runD / 2, leftZ, Math.PI / 2));
    kitchenGroup.add(createSinkAndFaucet(-backW / 2 + runD / 2, leftZ, Math.PI / 2));

    const rightZ = backZ + sideL / 2;
    kitchenGroup.add(createLowerRun(sideL, runD, backW / 2 - runD / 2, rightZ, -Math.PI / 2));

    // Peninsula Counter
    const penW = 1.8;
    const penZ = backZ + sideL;
    kitchenGroup.add(createLowerRun(penW, runD, backW / 2 - runD / 2 - penW / 2 + runD / 2, penZ, Math.PI));
    kitchenGroup.add(createTallUnit(-backW / 2 - 0.45, backZ + 0.3));

  } else {
    // Default: L-Shaped Kitchen
    const backW = Math.min(roomW * 0.85, 4.2);
    const sideL = Math.min(roomD * 0.75, 3.0);

    kitchenGroup.add(createLowerRun(backW, runD, 0, backZ, 0));
    kitchenGroup.add(createBacksplashPanel(backW, 0.75, 0, 1.45, backZ - runD / 2 - 0.01, 0));

    if (showUpperCabinets) {
      kitchenGroup.add(createOverheadRun(backW, 0.38, 0.8, 0, 1.9, backZ - 0.12, 0));
    }
    kitchenGroup.add(createCooktopAndChimney(-0.3, backZ, 0));

    const leftZ = backZ + sideL / 2;
    kitchenGroup.add(createLowerRun(sideL, runD, -backW / 2 + runD / 2, leftZ, Math.PI / 2));
    kitchenGroup.add(createSinkAndFaucet(-backW / 2 + runD / 2, leftZ, Math.PI / 2));
    kitchenGroup.add(createRefrigerator(backW / 2 + 0.55, backZ));
    kitchenGroup.add(createTallUnit(backW / 2 + 0.55, backZ + 1.0));
  }

  return kitchenGroup;
}
