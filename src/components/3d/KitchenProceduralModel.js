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
  ctx.lineWidth = 1.8;
  ctx.globalAlpha = 0.45;

  ctx.beginPath();
  ctx.moveTo(0, 100);
  ctx.bezierCurveTo(150, 80, 300, 260, 512, 320);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(50, 0);
  ctx.bezierCurveTo(220, 180, 280, 380, 480, 512);
  ctx.stroke();

  ctx.lineWidth = 0.8;
  ctx.globalAlpha = 0.25;
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

export function buildKitchenModel(layoutType, dimensions, visuals) {
  const kitchenGroup = new THREE.Group();

  const {
    cabinetColor = '#52634A',
    shutterFinish = 'matte',
    counterColor = '#F5F5F0',
    backsplashColor = '#52634A',
    floorColor = '#DDD7CC',
    wallColor = '#F8F5EF',
    handleType = 'gola',
    lightsOn = true,
    showUpperCabinets = true,
    showIsland = true
  } = visuals;

  // Material setup
  const roughness = shutterFinish === 'gloss' ? 0.08 : shutterFinish === 'veneer' ? 0.7 : 0.35;
  const metalness = shutterFinish === 'glass' ? 0.2 : 0.05;

  const cabinetMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(cabinetColor),
    roughness,
    metalness,
    map: shutterFinish === 'veneer' ? createWoodTexture(cabinetColor) : null
  });

  const counterMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(counterColor),
    roughness: 0.15,
    metalness: 0.08,
    map: createMarbleTexture(counterColor, '#9B968D')
  });

  const backsplashMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(backsplashColor),
    roughness: 0.2,
    metalness: 0.1,
    map: createTileTexture(backsplashColor)
  });

  const floorMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(floorColor),
    roughness: 0.4,
    metalness: 0.05
  });

  const wallMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(wallColor),
    roughness: 0.9,
    metalness: 0.0
  });

  const kickplateMat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.5
  });

  const applianceSteelMat = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.85,
    roughness: 0.2
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xCCCCCC,
    metalness: 0.95,
    roughness: 0.1
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#B69A65'),
    metalness: 0.8,
    roughness: 0.25
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x111111,
    transmission: 0.6,
    opacity: 0.85,
    transparent: true,
    roughness: 0.1
  });

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

  // Helper to create a modular lower cabinet run
  function createLowerRun(width, depth, x, z, rotY = 0) {
    const group = new THREE.Group();

    // Kickplate
    const kickGeo = new THREE.BoxGeometry(width, 0.15, depth - 0.08);
    const kick = new THREE.Mesh(kickGeo, kickplateMat);
    kick.position.set(0, 0.075, 0.04);
    kick.castShadow = true;
    group.add(kick);

    // Carcass & Shutters
    const cabinetH = 0.82;
    const cabGeo = new THREE.BoxGeometry(width, cabinetH, depth);
    const cab = new THREE.Mesh(cabGeo, cabinetMat);
    cab.position.set(0, 0.15 + cabinetH / 2, 0);
    cab.castShadow = true;
    cab.receiveShadow = true;
    group.add(cab);

    // Individual Shutter dividing lines
    const numDoors = Math.max(2, Math.round(width / 0.6));
    const doorW = width / numDoors;
    for (let i = 0; i <= numDoors; i++) {
      const lineGeo = new THREE.BoxGeometry(0.008, cabinetH, 0.01);
      const line = new THREE.Mesh(lineGeo, kickplateMat);
      line.position.set(-width / 2 + i * doorW, 0.15 + cabinetH / 2, depth / 2 + 0.005);
      group.add(line);

      // Handle or Gola profile
      if (i < numDoors) {
        if (handleType === 'brass') {
          const handleGeo = new THREE.BoxGeometry(0.12, 0.015, 0.025);
          const handle = new THREE.Mesh(handleGeo, brassMat);
          handle.position.set(-width / 2 + (i + 0.5) * doorW, 0.85, depth / 2 + 0.02);
          group.add(handle);
        } else if (handleType === 'black' || handleType === 'profile') {
          const handleGeo = new THREE.BoxGeometry(0.14, 0.015, 0.02);
          const handle = new THREE.Mesh(handleGeo, applianceSteelMat);
          handle.position.set(-width / 2 + (i + 0.5) * doorW, 0.85, depth / 2 + 0.018);
          group.add(handle);
        }
      }
    }

    // Countertop
    const counterGeo = new THREE.BoxGeometry(width + 0.04, 0.06, depth + 0.05);
    const counter = new THREE.Mesh(counterGeo, counterMat);
    counter.position.set(0, 0.15 + cabinetH + 0.03, 0.025);
    counter.castShadow = true;
    counter.receiveShadow = true;
    group.add(counter);

    group.position.set(x, 0, z);
    group.rotation.y = rotY;
    return group;
  }

  // Helper to create overhead cabinet run
  function createOverheadRun(width, depth, height, x, y, z, rotY = 0) {
    const group = new THREE.Group();
    const cabGeo = new THREE.BoxGeometry(width, height, depth);
    const cab = new THREE.Mesh(cabGeo, cabinetMat);
    cab.position.set(0, height / 2, 0);
    cab.castShadow = true;
    cab.receiveShadow = true;
    group.add(cab);

    // Subtle door partitions
    const numDoors = Math.max(2, Math.round(width / 0.6));
    const doorW = width / numDoors;
    for (let i = 0; i <= numDoors; i++) {
      const lineGeo = new THREE.BoxGeometry(0.006, height, 0.01);
      const line = new THREE.Mesh(lineGeo, kickplateMat);
      line.position.set(-width / 2 + i * doorW, height / 2, depth / 2 + 0.005);
      group.add(line);
    }

    // Under-cabinet LED Strip light source & glow
    if (lightsOn) {
      const ledBarGeo = new THREE.BoxGeometry(width * 0.95, 0.01, 0.03);
      const ledBarMat = new THREE.MeshBasicMaterial({ color: 0xFFE0B2 });
      const ledBar = new THREE.Mesh(ledBarGeo, ledBarMat);
      ledBar.position.set(0, -0.01, depth * 0.2);
      group.add(ledBar);

      const stripLight = new THREE.PointLight(0xFFD180, 1.2, 2.5);
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
    const hobBase = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.02, 0.5), glassMat);
    hobBase.position.set(0, 1.05, 0);
    group.add(hobBase);

    // 4 Burner rings
    const burnerGeo = new THREE.CylinderGeometry(0.06, 0.07, 0.015, 16);
    const burnerMat = brassMat;
    const offsets = [[-0.2, -0.12], [0.2, -0.12], [-0.15, 0.12], [0.15, 0.12]];
    offsets.forEach(([bx, bz]) => {
      const burner = new THREE.Mesh(burnerGeo, burnerMat);
      burner.position.set(bx, 1.065, bz);
      group.add(burner);
    });

    // Chimney Hood
    const chimneyBase = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.5), applianceSteelMat);
    chimneyBase.position.set(0, 2.05, 0);
    chimneyBase.castShadow = true;
    group.add(chimneyBase);

    const chimneyCurved = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.35, 0.15), glassMat);
    chimneyCurved.position.set(0, 2.15, 0.18);
    chimneyCurved.rotation.x = -0.3;
    group.add(chimneyCurved);

    const chimneyDuct = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.9, 0.28), applianceSteelMat);
    chimneyDuct.position.set(0, 2.55, -0.05);
    group.add(chimneyDuct);

    group.position.set(x, 0, z);
    group.rotation.y = rotY;
    return group;
  }

  // Sink and Faucet
  function createSinkAndFaucet(x, z, rotY = 0) {
    const group = new THREE.Group();

    // Sink basin
    const sinkRim = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.02, 0.5), applianceSteelMat);
    sinkRim.position.set(0, 1.04, 0);
    group.add(sinkRim);

    const basinInner = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.25, 0.42), applianceSteelMat);
    basinInner.position.set(0, 0.9, 0);
    group.add(basinInner);

    // High-arc gooseneck faucet
    const faucetGroup = new THREE.Group();
    const baseCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.1, 16), chromeMat);
    baseCyl.position.set(0, 1.08, -0.18);
    faucetGroup.add(baseCyl);

    const neckCurve = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.015, 12, 24, Math.PI), chromeMat);
    neckCurve.position.set(0, 1.25, -0.18);
    neckCurve.rotation.y = Math.PI / 2;
    faucetGroup.add(neckCurve);

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

    const body = new THREE.Mesh(new THREE.BoxGeometry(fridgeW, fridgeH, fridgeD), applianceSteelMat);
    body.position.set(0, fridgeH / 2, 0);
    body.castShadow = true;
    group.add(body);

    // French door line
    const split = new THREE.Mesh(new THREE.BoxGeometry(0.008, fridgeH * 0.65, 0.02), kickplateMat);
    split.position.set(0, fridgeH * 0.65, fridgeD / 2 + 0.01);
    group.add(split);

    group.position.set(x, 0, z);
    return group;
  }

  // Kitchen Island with Breakfast Bar
  function createKitchenIsland(x, z) {
    const group = new THREE.Group();
    const islandW = 2.2;
    const islandD = 1.0;
    const islandH = 0.88;

    // Island base
    const base = new THREE.Mesh(new THREE.BoxGeometry(islandW, islandH, islandD), cabinetMat);
    base.position.set(0, islandH / 2 + 0.1, 0);
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

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
    [-0.5, 0.5].forEach(sx => {
      const stoolGroup = new THREE.Group();
      const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.04, 24), brassMat);
      seat.position.set(0, 0.68, 0);
      stoolGroup.add(seat);

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.65, 12), applianceSteelMat);
      pole.position.set(0, 0.33, 0);
      stoolGroup.add(pole);

      const baseRing = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.02, 24), applianceSteelMat);
      baseRing.position.set(0, 0.01, 0);
      stoolGroup.add(baseRing);

      stoolGroup.position.set(sx, 0, islandD / 2 + 0.45);
      group.add(stoolGroup);
    });

    // Hanging Pendants above Island
    if (lightsOn) {
      [-0.6, 0.6].forEach(px => {
        const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 1.2, 8), applianceSteelMat);
        wire.position.set(px, 2.8, 0);
        group.add(wire);

        const shade = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 16, 1, true), brassMat);
        shade.position.set(px, 2.15, 0);
        group.add(shade);

        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), new THREE.MeshBasicMaterial({ color: 0xFFE0B2 }));
        bulb.position.set(px, 2.08, 0);
        group.add(bulb);

        const pendantLight = new THREE.PointLight(0xFFD180, 1.5, 3.5);
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
    // 1. Single Long Counter along Back Wall
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
    // 2. Parallel Kitchen: Two opposing runs
    const counterWidth = Math.min(roomW * 0.85, 4.2);
    // Back run (Cooking zone)
    kitchenGroup.add(createLowerRun(counterWidth, runD, 0, backZ, 0));
    kitchenGroup.add(createBacksplashPanel(counterWidth, 0.75, 0, 1.45, backZ - runD / 2 - 0.01, 0));
    if (showUpperCabinets) {
      kitchenGroup.add(createOverheadRun(counterWidth, 0.38, 0.8, 0, 1.9, backZ - 0.12, 0));
    }
    kitchenGroup.add(createCooktopAndChimney(0, backZ, 0));

    // Front run (Wet / Prep zone)
    const frontZ = backZ + 1.8;
    kitchenGroup.add(createLowerRun(counterWidth, runD, 0, frontZ, Math.PI));
    kitchenGroup.add(createSinkAndFaucet(0, frontZ, Math.PI));
    kitchenGroup.add(createRefrigerator(counterWidth / 2 + 0.55, backZ));

  } else if (layoutType === 'U-Shaped') {
    // 3. U-Shaped Kitchen: Back, Left, and Right runs
    const backW = Math.min(roomW * 0.9, 4.5);
    const sideL = Math.min(roomD * 0.75, 3.2);

    // Back Run
    kitchenGroup.add(createLowerRun(backW, runD, 0, backZ, 0));
    kitchenGroup.add(createBacksplashPanel(backW, 0.75, 0, 1.45, backZ - runD / 2 - 0.01, 0));
    if (showUpperCabinets) {
      kitchenGroup.add(createOverheadRun(backW, 0.38, 0.8, 0, 1.9, backZ - 0.12, 0));
    }
    kitchenGroup.add(createCooktopAndChimney(0, backZ, 0));

    // Left Run
    const leftRunX = -(backW / 2) + runD / 2;
    kitchenGroup.add(createLowerRun(sideL, runD, leftRunX, backZ + sideL / 2, Math.PI / 2));
    kitchenGroup.add(createBacksplashPanel(sideL, 0.75, leftRunX - runD / 2 - 0.01, 1.45, backZ + sideL / 2, Math.PI / 2));
    kitchenGroup.add(createSinkAndFaucet(leftRunX, backZ + sideL / 2, Math.PI / 2));

    // Right Run
    const rightRunX = (backW / 2) - runD / 2;
    kitchenGroup.add(createLowerRun(sideL, runD, rightRunX, backZ + sideL / 2, -Math.PI / 2));
    kitchenGroup.add(createTallUnit(rightRunX, backZ + sideL + 0.4));

  } else if (layoutType === 'Island') {
    // 4. Island Layout: L-Shape base + central Island with Breakfast counter
    const backW = Math.min(roomW * 0.9, 4.5);
    const sideL = Math.min(roomD * 0.7, 2.8);

    kitchenGroup.add(createLowerRun(backW, runD, 0, backZ, 0));
    kitchenGroup.add(createBacksplashPanel(backW, 0.75, 0, 1.45, backZ - runD / 2 - 0.01, 0));
    if (showUpperCabinets) {
      kitchenGroup.add(createOverheadRun(backW, 0.38, 0.8, 0, 1.9, backZ - 0.12, 0));
    }
    kitchenGroup.add(createCooktopAndChimney(-0.5, backZ, 0));
    kitchenGroup.add(createTallUnit(backW / 2 - 0.35, backZ));

    const leftRunX = -(backW / 2) + runD / 2;
    kitchenGroup.add(createLowerRun(sideL, runD, leftRunX, backZ + sideL / 2, Math.PI / 2));
    kitchenGroup.add(createSinkAndFaucet(leftRunX, backZ + sideL / 2, Math.PI / 2));

    // Freestanding Island
    if (showIsland) {
      kitchenGroup.add(createKitchenIsland(0.2, backZ + 1.8));
    }

  } else if (layoutType === 'G-Shaped') {
    // 5. G-Shaped Kitchen: U-Shape + Peninsula breakfast counter
    const backW = Math.min(roomW * 0.9, 4.2);
    const sideL = Math.min(roomD * 0.7, 2.8);

    kitchenGroup.add(createLowerRun(backW, runD, 0, backZ, 0));
    kitchenGroup.add(createBacksplashPanel(backW, 0.75, 0, 1.45, backZ - runD / 2 - 0.01, 0));
    if (showUpperCabinets) {
      kitchenGroup.add(createOverheadRun(backW, 0.38, 0.8, 0, 1.9, backZ - 0.12, 0));
    }
    kitchenGroup.add(createCooktopAndChimney(0, backZ, 0));

    const leftRunX = -(backW / 2) + runD / 2;
    kitchenGroup.add(createLowerRun(sideL, runD, leftRunX, backZ + sideL / 2, Math.PI / 2));
    kitchenGroup.add(createSinkAndFaucet(leftRunX, backZ + sideL / 2, Math.PI / 2));

    const rightRunX = (backW / 2) - runD / 2;
    kitchenGroup.add(createLowerRun(sideL, runD, rightRunX, backZ + sideL / 2, -Math.PI / 2));

    // G-Shape Peninsula
    kitchenGroup.add(createLowerRun(1.6, runD, rightRunX - 0.8, backZ + sideL - runD / 2, Math.PI));

  } else {
    // 6. Default: Classic L-Shaped Kitchen
    const backW = Math.min(roomW * 0.85, 4.2);
    const sideL = Math.min(roomD * 0.75, 3.2);

    // Back Run (Cooking zone)
    kitchenGroup.add(createLowerRun(backW, runD, 0, backZ, 0));
    kitchenGroup.add(createBacksplashPanel(backW, 0.75, 0, 1.45, backZ - runD / 2 - 0.01, 0));
    if (showUpperCabinets) {
      kitchenGroup.add(createOverheadRun(backW - 0.7, 0.38, 0.8, 0.35, 1.9, backZ - 0.12, 0));
    }
    kitchenGroup.add(createCooktopAndChimney(0.2, backZ, 0));

    // Left Run (Sink & cleaning zone)
    const leftRunX = -(backW / 2) + runD / 2;
    kitchenGroup.add(createLowerRun(sideL, runD, leftRunX, backZ + sideL / 2, Math.PI / 2));
    kitchenGroup.add(createBacksplashPanel(sideL, 0.75, leftRunX - runD / 2 - 0.01, 1.45, backZ + sideL / 2, Math.PI / 2));
    kitchenGroup.add(createSinkAndFaucet(leftRunX, backZ + sideL / 2, Math.PI / 2));

    // Tall Unit & Fridge on right end
    kitchenGroup.add(createTallUnit(backW / 2 - 0.35, backZ));
    kitchenGroup.add(createRefrigerator(backW / 2 + 0.45, backZ));
  }

  return kitchenGroup;
}
