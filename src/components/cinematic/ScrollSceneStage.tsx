/**
 * ScrollSceneStage.tsx
 * Three.js WebGL Engine that creates 5 distinct cinematic scenes and seamlessly
 * transitions between them using the custom organic torn-wave shader pipeline.
 *
 * Upgraded Features:
 * - Scene 01: Photo A (/Photos/kamel-shah-suit.png) with gyro rings and depth particles.
 * - Scene 02: High-contrast B&W Cognitive Bridge (/Photos/kamel-shah-bw.png) +
 *             Agentic AI Core with 3 capability clusters, pulse propagation,
 *             and data streams communicating INPUT -> REASONING -> RETRIEVAL -> TOOL EXECUTION -> OUTPUT.
 * - Scene 03: Full-Stack Architecture with Tech Workspace backdrop (/Photos/tech-workspace.png).
 * - Scene 04: 3D Orbital Project Solar System featuring all 7 projects with real textures,
 *             central project core, interactive orbit drag/scroll, and depth scaling.
 * - Scene 05: Collaboration Nexus with glowing portal and embers.
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SceneTimelineState } from './SceneController';
import { SceneTransition } from './SceneTransition';

interface ScrollSceneStageProps {
  timelineState: SceneTimelineState;
  reducedMotion?: boolean;
}

export default function ScrollSceneStage({ timelineState, reducedMotion = false }: ScrollSceneStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(timelineState);
  stateRef.current = timelineState;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(0x08080a, 1);
      renderer.domElement.style.touchAction = 'pan-y';
      container.style.touchAction = 'pan-y';
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL initialization failed:', e);
      return;
    }

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / Math.max(container.clientHeight, 1),
      0.1,
      100
    );
    camera.position.set(0, 0, 18);

    const transitionManager = new SceneTransition(container.clientWidth, container.clientHeight);
    if (reducedMotion) {
      transitionManager.setIntensity(0.25);
    }

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    const loadTex = (url: string) => {
      const tex = textureLoader.load(url);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    };

    // Preload Real Personal Photographs & Project Textures
    const suitPortraitTex = loadTex('/Photos/kamel-shah-suit.png'); // Photo A: Suit
    const bwPortraitTex = loadTex('/Photos/kamel-shah-bw.png');     // Photo B: B&W "THINK"
    const workspaceTex = loadTex('/Photos/tech-workspace.png');     // Photo C: Tech Workspace
    const meTex = loadTex('/Photos/kamel-shah-portrait.png');        // Photo D: Kamel portrait (Scene 05 Nexus)

    // All 7 Real Project Textures for 3D Solar System
    const projectTextures = [
      loadTex('/Photos/CampusOne.png'),          // 01 CampusOne
      loadTex('/Photos/Decent.png'),             // 02 Decent Apparels
      loadTex('/Photos/Soap & Soul.png'),        // 03 The Soap & Soul
      loadTex('/Photos/Masjid.png'),             // 04 Masjid Portal
      loadTex('/Photos/Shah Construction.png'),  // 05 Shah Construction
      loadTex('/Photos/Who Will Pay.png'),       // 06 Who Will Pay?
      loadTex('/Photos/LumenAPIs.png'),          // 07 Lumen REST API
    ];

    // =========================================================================
    // SCENE 01: PERSONAL IDENTITY (FEATURING PHOTO A: BLACK SUIT PHOTOGRAPH)
    // =========================================================================
    const scene1 = new THREE.Scene();
    scene1.fog = new THREE.FogExp2(0x08080a, 0.032);

    const s1ParticleCount = 95;
    const s1Geo = new THREE.BufferGeometry();
    const s1Pos = new Float32Array(s1ParticleCount * 3);
    const s1Colors = new Float32Array(s1ParticleCount * 3);
    const colVermilion = new THREE.Color(0xe0231c);
    const colIndigo = new THREE.Color(0x6366f1);

    for (let i = 0; i < s1ParticleCount; i++) {
      s1Pos[i * 3] = (Math.random() - 0.5) * 34;
      s1Pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      s1Pos[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2;

      const mixed = colVermilion.clone().lerp(colIndigo, Math.random());
      s1Colors[i * 3] = mixed.r;
      s1Colors[i * 3 + 1] = mixed.g;
      s1Colors[i * 3 + 2] = mixed.b;
    }

    s1Geo.setAttribute('position', new THREE.BufferAttribute(s1Pos, 3));
    s1Geo.setAttribute('color', new THREE.BufferAttribute(s1Colors, 3));

    const s1Mat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const s1Points = new THREE.Points(s1Geo, s1Mat);
    scene1.add(s1Points);

    // Gyro Rings
    const ringGeo1 = new THREE.TorusGeometry(3.5, 0.035, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.38 });
    const gyroRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    gyroRing1.position.set(3.4, 0.2, -1.0);
    scene1.add(gyroRing1);

    const ringGeo2 = new THREE.TorusGeometry(4.2, 0.025, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xe0231c, transparent: true, opacity: 0.25 });
    const gyroRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    gyroRing2.position.set(3.4, 0.2, -1.2);
    scene1.add(gyroRing2);

    // Editorial Portrait Plane (PHOTO A: Suit Photograph)
    const suitPortraitGeo = new THREE.PlaneGeometry(4.0, 5.2);
    const suitPortraitMat = new THREE.MeshBasicMaterial({
      map: suitPortraitTex,
      transparent: true,
      opacity: 0.92,
    });
    const suitPortraitMesh = new THREE.Mesh(suitPortraitGeo, suitPortraitMat);
    suitPortraitMesh.position.set(3.4, 0.2, 0.5);
    scene1.add(suitPortraitMesh);

    const frameGeo = new THREE.EdgesGeometry(suitPortraitGeo);
    const frameMat = new THREE.LineBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.35 });
    const frameMesh = new THREE.LineSegments(frameGeo, frameMat);
    suitPortraitMesh.add(frameMesh);

    // =========================================================================
    // SCENE 02: AGENTIC AI & NEURAL SYSTEMS (COGNITIVE ARCHITECTURE)
    // =========================================================================
    const scene2 = new THREE.Scene();
    scene2.fog = new THREE.FogExp2(0x08080a, 0.028);

    // 1. High-Contrast B&W Cognitive Portrait Plane (PHOTO B)
    const bwPortraitGeo = new THREE.PlaneGeometry(4.2, 7.2);
    const bwPortraitMat = new THREE.MeshBasicMaterial({
      map: bwPortraitTex,
      transparent: true,
      opacity: 0.88,
    });
    const bwPortraitMesh = new THREE.Mesh(bwPortraitGeo, bwPortraitMat);
    bwPortraitMesh.position.set(0, 0.2, 1.0);
    scene2.add(bwPortraitMesh);

    // 2. Central Autonomous Agent Brain Core
    const coreGeo = new THREE.IcosahedronGeometry(2.4, 1);
    const coreWire = new THREE.WireframeGeometry(coreGeo);
    const coreLineMat = new THREE.LineBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.75,
    });
    const coreMesh = new THREE.LineSegments(coreWire, coreLineMat);
    coreMesh.position.set(0, 0.5, 0);
    scene2.add(coreMesh);

    // Glowing Inner Pulsing Core
    const innerCoreGeo = new THREE.SphereGeometry(1.2, 24, 24);
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.45,
      wireframe: true,
    });
    const innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    coreMesh.add(innerCore);

    // 3. Multi-Agent Capability Node Clusters (3 Major Clusters)
    // Cluster 1: Autonomous Agents (Indigo)
    // Cluster 2: RAG & Vector Retrieval (Cyan)
    // Cluster 3: LLM Integration (Rose/Vermilion)
    const clusterColors = [0x6366f1, 0x06b6d4, 0xf43f5e];
    const totalNodes = 18;
    const nodeGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const nodeGroup = new THREE.Group();
    const nodePositions: THREE.Vector3[] = [];
    const nodeMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < totalNodes; i++) {
      const clusterIdx = Math.floor(i / 6);
      const angle = (i / totalNodes) * Math.PI * 2;
      const radius = 5.2 + (i % 3) * 1.3;
      const y = (Math.sin(i * 1.4) - 0.2) * 2.8;
      const pos = new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      nodePositions.push(pos);

      const nMat = new THREE.MeshBasicMaterial({
        color: clusterColors[clusterIdx],
        transparent: true,
        opacity: 0.85,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nMat);
      nodeMesh.position.copy(pos);
      nodeGroup.add(nodeMesh);
      nodeMeshes.push(nodeMesh);
    }
    scene2.add(nodeGroup);

    // Dynamic Connections between nodes and core
    const connMat = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.28,
    });
    const connGeo = new THREE.BufferGeometry();
    const connPositions = new Float32Array(totalNodes * 6);
    for (let i = 0; i < totalNodes; i++) {
      connPositions[i * 6] = 0;
      connPositions[i * 6 + 1] = 0.5;
      connPositions[i * 6 + 2] = 0;
      connPositions[i * 6 + 3] = nodePositions[i].x;
      connPositions[i * 6 + 4] = nodePositions[i].y;
      connPositions[i * 6 + 5] = nodePositions[i].z;
    }
    connGeo.setAttribute('position', new THREE.BufferAttribute(connPositions, 3));
    const connLines = new THREE.LineSegments(connGeo, connMat);
    scene2.add(connLines);

    // Traveling Data Packets along connection lines
    const packetCount = 28;
    const packetGeo = new THREE.BufferGeometry();
    const packetPos = new Float32Array(packetCount * 3);
    const packetSpeeds = new Float32Array(packetCount);
    const packetTargets = new Int32Array(packetCount);

    for (let i = 0; i < packetCount; i++) {
      packetTargets[i] = i % totalNodes;
      packetSpeeds[i] = 0.4 + Math.random() * 0.8;
      packetPos[i * 3] = 0;
      packetPos[i * 3 + 1] = 0.5;
      packetPos[i * 3 + 2] = 0;
    }
    packetGeo.setAttribute('position', new THREE.BufferAttribute(packetPos, 3));
    const packetMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.22,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const packetPoints = new THREE.Points(packetGeo, packetMat);
    scene2.add(packetPoints);

    // Neural Particulate Field
    const s2ParticlesGeo = new THREE.BufferGeometry();
    const s2ParticlePos = new Float32Array(130 * 3);
    for (let i = 0; i < 130 * 3; i += 3) {
      s2ParticlePos[i] = (Math.random() - 0.5) * 30;
      s2ParticlePos[i + 1] = (Math.random() - 0.5) * 20;
      s2ParticlePos[i + 2] = (Math.random() - 0.5) * 22;
    }
    s2ParticlesGeo.setAttribute('position', new THREE.BufferAttribute(s2ParticlePos, 3));
    const s2ParticlesMat = new THREE.PointsMaterial({
      color: 0xa5b4fc,
      size: 0.12,
      transparent: true,
      opacity: 0.6,
    });
    const s2Points = new THREE.Points(s2ParticlesGeo, s2ParticlesMat);
    scene2.add(s2Points);

    // =========================================================================
    // SCENE 03: FULL-STACK ARCHITECTURE (FEATURING PHOTO C: TECH WORKSPACE)
    // =========================================================================
    const scene3 = new THREE.Scene();
    scene3.fog = new THREE.FogExp2(0x08080a, 0.032);

    const wsGeo = new THREE.PlaneGeometry(16.0, 6.4);
    const wsMat = new THREE.MeshBasicMaterial({
      map: workspaceTex,
      transparent: true,
      opacity: 0.32,
    });
    const wsMesh = new THREE.Mesh(wsGeo, wsMat);
    wsMesh.position.set(0, 0.6, -4.5);
    scene3.add(wsMesh);

    const stackGroup = new THREE.Group();
    stackGroup.position.set(0, -0.6, 0);
    stackGroup.rotation.set(0.42, -0.52, 0.12);

    const slabGeo = new THREE.BoxGeometry(7.5, 0.25, 4.8);
    const slabLayers = [
      { name: 'UI / Client', color: 0x38bdf8, y: 2.2 },
      { name: 'REST API & Services', color: 0x818cf8, y: 0.0 },
      { name: 'Data & Storage', color: 0xe0231c, y: -2.2 },
    ];

    const slabMeshes: THREE.Mesh[] = [];
    slabLayers.forEach((layer) => {
      const mat = new THREE.MeshBasicMaterial({
        color: layer.color,
        transparent: true,
        opacity: 0.24,
        wireframe: true,
      });
      const mesh = new THREE.Mesh(slabGeo, mat);
      mesh.position.y = layer.y;

      const plateGeo = new THREE.PlaneGeometry(7.4, 4.7);
      const plateMat = new THREE.MeshBasicMaterial({
        color: layer.color,
        transparent: true,
        opacity: 0.09,
        side: THREE.DoubleSide,
      });
      const plate = new THREE.Mesh(plateGeo, plateMat);
      plate.rotation.x = Math.PI / 2;
      mesh.add(plate);

      stackGroup.add(mesh);
      slabMeshes.push(mesh);
    });

    const pipeCount = 6;
    const pipeGeo = new THREE.BufferGeometry();
    const pipePos = new Float32Array(pipeCount * 6);
    for (let i = 0; i < pipeCount; i++) {
      const px = (i - pipeCount / 2 + 0.5) * 1.2;
      pipePos[i * 6] = px;
      pipePos[i * 6 + 1] = 2.4;
      pipePos[i * 6 + 2] = 0;
      pipePos[i * 6 + 3] = px;
      pipePos[i * 6 + 4] = -2.4;
      pipePos[i * 6 + 5] = 0;
    }
    pipeGeo.setAttribute('position', new THREE.BufferAttribute(pipePos, 3));
    const pipeMat = new THREE.LineBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.45,
    });
    const pipelineLines = new THREE.LineSegments(pipeGeo, pipeMat);
    stackGroup.add(pipelineLines);
    scene3.add(stackGroup);

    // =========================================================================
    // SCENE 04: 3D ORBITAL PROJECT SOLAR SYSTEM (ALL 7 PROJECTS)
    // =========================================================================
    const scene4 = new THREE.Scene();
    scene4.fog = new THREE.FogExp2(0x08080a, 0.026);

    // 1. Central "PROJECT CORE" (Pulsing Solar Hub)
    const projectCoreGroup = new THREE.Group();
    projectCoreGroup.position.set(0, 0, -2.0);

    const solarCoreGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const solarCoreMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const solarCoreMesh = new THREE.Mesh(solarCoreGeo, solarCoreMat);
    projectCoreGroup.add(solarCoreMesh);

    const solarInnerGeo = new THREE.SphereGeometry(0.8, 16, 16);
    const solarInnerMat = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.8,
    });
    const solarInnerMesh = new THREE.Mesh(solarInnerGeo, solarInnerMat);
    projectCoreGroup.add(solarInnerMesh);

    // 3 Distinct Orbital Rings with varying inclinations and depths
    // Ring 1: Primary Equatorial Orbit (Indigo)
    const orbitRingGeo1 = new THREE.RingGeometry(7.35, 7.42, 80);
    const orbitRingMat1 = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.28,
    });
    const orbitRing1 = new THREE.Mesh(orbitRingGeo1, orbitRingMat1);
    orbitRing1.rotation.x = Math.PI / 2.35;
    orbitRing1.rotation.z = 0.04;
    projectCoreGroup.add(orbitRing1);

    // Ring 2: Inclined Mid Orbit (Cyan)
    const orbitRingGeo2 = new THREE.RingGeometry(8.8, 8.86, 80);
    const orbitRingMat2 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18,
    });
    const orbitRing2 = new THREE.Mesh(orbitRingGeo2, orbitRingMat2);
    orbitRing2.rotation.x = Math.PI / 2.65;
    orbitRing2.rotation.y = 0.12;
    projectCoreGroup.add(orbitRing2);

    // Ring 3: Outer Inclined Halo Orbit (Rose/Vermilion)
    const orbitRingGeo3 = new THREE.RingGeometry(10.2, 10.25, 80);
    const orbitRingMat3 = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.14,
    });
    const orbitRing3 = new THREE.Mesh(orbitRingGeo3, orbitRingMat3);
    orbitRing3.rotation.x = Math.PI / 2.15;
    orbitRing3.rotation.y = -0.14;
    projectCoreGroup.add(orbitRing3);

    scene4.add(projectCoreGroup);

    // Tiny Orbital Particles travelling along orbit paths
    const orbitParticleCount = 56;
    const orbitParticlesGeo = new THREE.BufferGeometry();
    const orbitParticlesPos = new Float32Array(orbitParticleCount * 3);
    const orbitParticleAngles = new Float32Array(orbitParticleCount);
    const orbitParticleSpeeds = new Float32Array(orbitParticleCount);
    const orbitParticleRadii = new Float32Array(orbitParticleCount);

    for (let i = 0; i < orbitParticleCount; i++) {
      orbitParticleAngles[i] = (i / orbitParticleCount) * Math.PI * 2;
      orbitParticleSpeeds[i] = 0.12 + Math.random() * 0.18;
      // Stagger particles across the 3 orbit tracks
      orbitParticleRadii[i] = i % 3 === 0 ? 7.4 : i % 3 === 1 ? 8.8 : 10.2;
    }
    orbitParticlesGeo.setAttribute('position', new THREE.BufferAttribute(orbitParticlesPos, 3));
    const orbitParticlesMat = new THREE.PointsMaterial({
      color: 0xa5b4fc,
      size: 0.14,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const orbitParticlesMesh = new THREE.Points(orbitParticlesGeo, orbitParticlesMat);
    projectCoreGroup.add(orbitParticlesMesh);

    // 2. All 7 Projects Orbiting around Project Core
    const projectOrbitGroup = new THREE.Group();
    projectOrbitGroup.position.set(0, 0, -2.0);
    scene4.add(projectOrbitGroup);

    const orbitalProjectMeshes: THREE.Mesh[] = [];
    const numProjects = 7;
    let orbitRadiusX = container.clientWidth < 768 ? 3.4 : 7.4;
    let orbitRadiusZ = container.clientWidth < 768 ? 2.2 : 4.2;
    let orbitTiltY = container.clientWidth < 768 ? 0.6 : 1.3;

    // Single reusable card geometry
    const cardGeo = new THREE.PlaneGeometry(3.6, 2.25);
    const cardBorderGeo = new THREE.EdgesGeometry(cardGeo);

    projectTextures.forEach((tex) => {
      const cardMat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(cardGeo, cardMat);

      // Emissive Frame
      const borderLine = new THREE.LineSegments(
        cardBorderGeo,
        new THREE.LineBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.45 })
      );
      mesh.add(borderLine);

      projectOrbitGroup.add(mesh);
      orbitalProjectMeshes.push(mesh);
    });

    // Orbit State Variables
    let currentOrbitAngle = 0;
    let targetOrbitAngle = 0;
    let activeProjectIdx = 0;
    let isDraggingOrbit = false;
    let dragStartX = 0;

    // Listen for custom project select events from SceneTypography
    const handleProjectSelect = (e: Event) => {
      const custom = e as CustomEvent<{ index: number }>;
      if (typeof custom.detail?.index === 'number') {
        const idx = custom.detail.index;
        activeProjectIdx = idx;
        // Calculate target orbit angle so selected project faces front (angle = Math.PI/2)
        const targetAngleForIdx = Math.PI / 2 - (idx / numProjects) * Math.PI * 2;
        targetOrbitAngle = targetAngleForIdx;
      }
    };
    window.addEventListener('cinematic:select-project', handleProjectSelect);

    // Drag Interaction on canvas for orbit rotation
    const onMouseDown = (e: MouseEvent) => {
      if (stateRef.current.activeSceneIndex === 3) {
        isDraggingOrbit = true;
        dragStartX = e.clientX;
      }
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingOrbit) {
        const deltaX = e.clientX - dragStartX;
        dragStartX = e.clientX;
        targetOrbitAngle += deltaX * 0.006;
      }
    };
    const onMouseUp = () => {
      isDraggingOrbit = false;
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch interaction with pan-y safety so vertical swipe continues page scrolling
    let touchStartX = 0;
    let touchStartY = 0;
    let isHorizontalTouch = false;
    let isTouching = false;

    const onTouchStart = (e: TouchEvent) => {
      if (stateRef.current.activeSceneIndex === 3 && e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        dragStartX = touchStartX;
        isHorizontalTouch = false;
        isTouching = true;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isTouching || stateRef.current.activeSceneIndex !== 3) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const dx = currentX - touchStartX;
      const dy = currentY - touchStartY;

      if (!isHorizontalTouch) {
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
          isHorizontalTouch = true;
        } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 8) {
          isTouching = false;
          return; // Allow native vertical page scrolling uninterrupted!
        }
      }

      if (isHorizontalTouch) {
        if (e.cancelable) e.preventDefault();
        const deltaX = currentX - dragStartX;
        dragStartX = currentX;
        targetOrbitAngle += deltaX * 0.008;
      }
    };

    const onTouchEnd = () => {
      isTouching = false;
      isHorizontalTouch = false;
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });
    container.addEventListener('touchend', onTouchEnd, { passive: true });

    // Raycasting for direct 3D project card clicks
    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2();

    const onWindowClick = (e: MouseEvent) => {
      if (stateRef.current.activeSceneIndex !== 3) return;
      if ((e.target as HTMLElement)?.closest('button, a, input')) return;

      const rect = container.getBoundingClientRect();
      mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVec, camera);
      const intersects = raycaster.intersectObjects(orbitalProjectMeshes);
      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        const hitIdx = orbitalProjectMeshes.indexOf(hitMesh);
        if (hitIdx !== -1) {
          window.dispatchEvent(new CustomEvent('cinematic:select-project', { detail: { index: hitIdx } }));
        }
      }
    };
    window.addEventListener('click', onWindowClick);

    // Scene 4 Particles
    const s4Geo = new THREE.BufferGeometry();
    const s4Pos = new Float32Array(90 * 3);
    for (let i = 0; i < 90 * 3; i += 3) {
      s4Pos[i] = (Math.random() - 0.5) * 32;
      s4Pos[i + 1] = (Math.random() - 0.5) * 20;
      s4Pos[i + 2] = (Math.random() - 0.5) * 16;
    }
    s4Geo.setAttribute('position', new THREE.BufferAttribute(s4Pos, 3));
    const s4Points = new THREE.Points(
      s4Geo,
      new THREE.PointsMaterial({ color: 0x6366f1, size: 0.14, transparent: true, opacity: 0.5 })
    );
    scene4.add(s4Points);

    // =========================================================================
    // SCENE 05: EXPERIENCE & COLLABORATION NEXUS (FEATURING ME.JPG PORTAL)
    // =========================================================================
    const scene5 = new THREE.Scene();
    scene5.fog = new THREE.FogExp2(0x08080a, 0.025);

    const gridHelper = new THREE.GridHelper(36, 36, 0xe0231c, 0x4f46e5);
    gridHelper.position.y = -3.5;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.28;
    scene5.add(gridHelper);

    // Scene 05: Floating Embers background atmosphere
    const emberCount = 100;
    const emberGeo = new THREE.BufferGeometry();
    const emberPos = new Float32Array(emberCount * 3);
    for (let i = 0; i < emberCount * 3; i += 3) {
      emberPos[i] = (Math.random() - 0.5) * 26;
      emberPos[i + 1] = (Math.random() - 0.5) * 16 - 2;
      emberPos[i + 2] = (Math.random() - 0.5) * 18;
    }
    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));
    const emberPoints = new THREE.Points(
      emberGeo,
      new THREE.PointsMaterial({
        color: 0xe0231c,
        size: 0.16,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
      })
    );
    scene5.add(emberPoints);

    const scenesArray = [scene1, scene2, scene3, scene4, scene5];

    // Mouse Tracking for subtle camera parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      if (reducedMotion) return;
      const rect = container.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetMouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = Math.max(container.clientHeight, 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      transitionManager.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation & Render Loop
    let animId: number;
    const clock = new THREE.Clock();

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      if (!renderer) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      const state = stateRef.current;

      // Mouse Parallax Damping
      mouseX += (targetMouseX - mouseX) * (1 - Math.exp(-delta * 6));
      mouseY += (targetMouseY - mouseY) * (1 - Math.exp(-delta * 6));

      // Camera base parallax
      camera.position.x = mouseX * 0.75;
      camera.position.y = mouseY * 0.5;
      camera.lookAt(0, 0, 0);

      // =======================================================================
      // Scene 1 Dynamics (PHOTO A: Suit Portrait & Rings)
      // =======================================================================
      const isMobile = container.clientWidth < 768;

      s1Points.rotation.y = time * 0.03 + mouseX * 0.1;
      gyroRing1.rotation.x = time * 0.15;
      gyroRing1.rotation.y = time * 0.25;
      gyroRing2.rotation.y = -time * 0.2;
      gyroRing2.rotation.z = time * 0.12;

      // On mobile, hide 3D plane so it does not compete with DOM HoloIdentityCard
      suitPortraitMesh.visible = !isMobile;
      suitPortraitMesh.position.y = 0.2 + Math.sin(time * 0.75) * 0.1;
      suitPortraitMesh.rotation.y = mouseX * 0.08;

      gyroRing1.position.x = isMobile ? 0 : 3.4;
      gyroRing2.position.x = isMobile ? 0 : 3.4;
      gyroRing1.scale.setScalar(isMobile ? 0.65 : 1.0);
      gyroRing2.scale.setScalar(isMobile ? 0.65 : 1.0);

      // =======================================================================
      // Scene 2 Dynamics (Agentic AI Core, 3 Clusters, & Data Flow)
      // =======================================================================
      const s2Progress = state.sceneProgress;
      const isLLMStage = s2Progress >= 0.7;
      const pulseSpeed = isLLMStage ? 4.5 : 2.0;

      if (state.activeSceneIndex === 1) {
        // Cognitive bridge: B&W portrait dissolves into neural network (desktop only)
        bwPortraitMesh.visible = !isMobile;
        bwPortraitMat.opacity = Math.max(0, 0.88 * (1 - s2Progress * 2.2));
        bwPortraitMesh.position.y = 0.2 + s2Progress * 0.4;
        bwPortraitMesh.scale.setScalar(1 + s2Progress * 0.08);

        // Core pulsing depends on activation stage
        const coreScale = 1 + Math.sin(time * pulseSpeed) * (isLLMStage ? 0.15 : 0.06);
        coreMesh.scale.setScalar(isMobile ? 0.65 * coreScale : coreScale);
      } else {
        bwPortraitMesh.visible = !isMobile;
        bwPortraitMat.opacity = 0.88;
        coreMesh.scale.setScalar(isMobile ? 0.65 : 1.0);
      }

      // Move neural core behind DOM text on mobile
      coreMesh.position.set(0, isMobile ? -0.4 : 0.5, isMobile ? -3.5 : 0);
      coreMesh.rotation.x = time * 0.2;
      coreMesh.rotation.y = time * 0.28;

      nodeGroup.position.set(0, isMobile ? -0.4 : 0, isMobile ? -3.5 : 0);
      nodeGroup.scale.setScalar(isMobile ? 0.65 : 1.0);
      nodeGroup.rotation.y = -time * 0.1;

      connLines.position.set(0, isMobile ? -0.4 : 0, isMobile ? -3.5 : 0);
      connLines.scale.setScalar(isMobile ? 0.65 : 1.0);

      packetPoints.position.set(0, isMobile ? -0.4 : 0, isMobile ? -3.5 : 0);
      packetPoints.scale.setScalar(isMobile ? 0.65 : 1.0);

      // Update traveling data packets
      const packetArr = packetGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < packetCount; i++) {
        const targetNode = nodePositions[packetTargets[i]];
        const t = (time * packetSpeeds[i] + i * 0.3) % 1;
        packetArr[i * 3] = targetNode.x * t;
        packetArr[i * 3 + 1] = 0.5 + (targetNode.y - 0.5) * t;
        packetArr[i * 3 + 2] = targetNode.z * t;
      }
      packetGeo.attributes.position.needsUpdate = true;

      // =======================================================================
      // Scene 3 Dynamics (Full-Stack Slabs)
      // =======================================================================
      // Move server slabs behind DOM content on mobile
      stackGroup.position.set(0, isMobile ? -1.6 : -0.6, isMobile ? -4.5 : 0);
      stackGroup.scale.setScalar(isMobile ? 0.55 : 1.0);
      stackGroup.rotation.y = -0.52 + Math.sin(time * 0.4) * 0.07 + mouseX * 0.14;

      wsMesh.position.set(0, isMobile ? 0.2 : 0.6 + Math.sin(time * 0.5) * 0.06, isMobile ? -6.5 : -4.5);
      wsMesh.scale.setScalar(isMobile ? 0.65 : 1.0);

      slabMeshes.forEach((mesh, idx) => {
        mesh.position.y = slabLayers[idx].y + Math.sin(time * 0.9 + idx * 1.2) * 0.1;
      });

      // =======================================================================
      // Scene 4 Dynamics (3D Solar System Project Orbit)
      // =======================================================================
      // Continuous slow, majestic idle orbit when not dragging
      if (!isDraggingOrbit && !isTouching) {
        targetOrbitAngle += delta * 0.06;
      }
      currentOrbitAngle += (targetOrbitAngle - currentOrbitAngle) * (1 - Math.exp(-delta * 3.5));

      // Connected to cinematic scroll timeline:
      // At beginning of Scene 04: orbit enters from depth.
      // At end of Scene 04: orbit departs into depth.
      if (state.activeSceneIndex === 3) {
        const sp = state.sceneProgress;
        let targetZ = isMobile ? -2.2 : -1.8;
        if (sp < 0.18) {
          targetZ = -12 + (sp / 0.18) * (isMobile ? 9.8 : 10.2);
        } else if (sp > 0.82) {
          targetZ = (isMobile ? -2.2 : -1.8) - ((sp - 0.82) / 0.18) * (isMobile ? 9.8 : 10.2);
        }
        projectOrbitGroup.position.z += (targetZ - projectOrbitGroup.position.z) * (1 - Math.exp(-delta * 5.0));
        projectCoreGroup.position.z = projectOrbitGroup.position.z;
      }

      // Responsive orbit radii
      orbitRadiusX = isMobile ? 3.4 : 7.4;
      orbitRadiusZ = isMobile ? 2.2 : 4.2;
      orbitTiltY = isMobile ? 0.6 : 1.3;

      projectCoreGroup.scale.setScalar(isMobile ? 0.68 : 1.0);
      orbitRing1.scale.setScalar(isMobile ? 0.48 : 1.0);
      orbitRing2.scale.setScalar(isMobile ? 0.48 : 1.0);
      orbitRing3.scale.setScalar(isMobile ? 0.48 : 1.0);

      // Subtle precession / tilt movement of the entire orbital system
      projectOrbitGroup.rotation.x = Math.sin(time * 0.25) * 0.04;
      projectOrbitGroup.rotation.z = Math.cos(time * 0.2) * 0.02;

      solarCoreMesh.rotation.x = time * 0.35;
      solarCoreMesh.rotation.y = time * 0.5;
      solarInnerMesh.scale.setScalar(1 + Math.sin(time * 3) * 0.15);
      orbitRing1.rotation.z = time * 0.05;
      orbitRing2.rotation.z = -time * 0.04;
      orbitRing3.rotation.z = time * 0.03;

      // Update orbital particles travelling along their circular orbit paths
      const pArr = orbitParticlesGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < orbitParticleCount; i++) {
        orbitParticleAngles[i] += delta * orbitParticleSpeeds[i];
        const a = orbitParticleAngles[i];
        const r = orbitParticleRadii[i] * (isMobile ? 0.48 : 1.0);
        pArr[i * 3] = Math.cos(a) * r;
        pArr[i * 3 + 1] = Math.sin(a) * (orbitTiltY * (r / orbitRadiusX));
        pArr[i * 3 + 2] = Math.sin(a) * (orbitRadiusZ * (r / orbitRadiusX));
      }
      orbitParticlesGeo.attributes.position.needsUpdate = true;

      // Position all 7 project cards on the 3D orbit with strict depth hierarchy
      orbitalProjectMeshes.forEach((mesh, idx) => {
        const angle = currentOrbitAngle + (idx / numProjects) * Math.PI * 2;
        const isActive = idx === activeProjectIdx;

        // Base elliptical orbit coordinates
        const x = Math.cos(angle) * orbitRadiusX;
        const z = Math.sin(angle) * orbitRadiusZ;
        const y = Math.sin(angle) * orbitTiltY;

        // Depth perspective calculation: 0 (farthest behind core) to 1 (nearest front)
        const depthFactor = (z + orbitRadiusZ) / (orbitRadiusZ * 2);

        let targetX = x;
        let targetY = y;
        let targetZ = z;
        let targetScale: number;
        let targetOpacity: number;

        // Strict 3D Depth Hierarchy
        if (isActive) {
          targetZ = isMobile ? 2.4 : 3.2;
          targetScale = isMobile ? 1.15 : 1.36;
          targetOpacity = 1.0;
        } else {
          targetScale = isMobile ? (0.50 + depthFactor * 0.22) : (0.68 + depthFactor * 0.22);
          targetOpacity = isMobile
            ? (depthFactor > 0.35 ? 0.45 * depthFactor : 0.12)
            : (0.28 + depthFactor * 0.37);
          targetZ = z;
        }

        // Slower, more inertial damped interpolation (no snapping when selecting projects)
        const smoothFactor = 1 - Math.exp(-delta * 3.8);
        mesh.position.x += (targetX - mesh.position.x) * smoothFactor;
        mesh.position.y += (targetY - mesh.position.y) * smoothFactor;
        mesh.position.z += (targetZ - mesh.position.z) * smoothFactor;

        const curScale = mesh.scale.x;
        mesh.scale.setScalar(curScale + (targetScale - curScale) * smoothFactor);

        const cardMat = mesh.material as THREE.MeshBasicMaterial;
        cardMat.opacity += (targetOpacity - cardMat.opacity) * smoothFactor;

        // Billboard orientation toward camera with subtle mouse yaw
        mesh.rotation.y = -angle + Math.PI / 2 + mouseX * 0.12;

        // Active project emissive border styling
        const border = mesh.children[0] as THREE.LineSegments | undefined;
        if (border && border.material) {
          const lineMat = border.material as THREE.LineBasicMaterial;
          if (isActive) {
            lineMat.color.setHex(0xf43f5e);
            lineMat.opacity = 0.95;
          } else {
            lineMat.color.setHex(0x818cf8);
            lineMat.opacity = 0.20 + depthFactor * 0.35;
          }
        }
      });

      // =======================================================================
      // Scene 5 Dynamics (Atmospheric Collaboration Nexus)
      // =======================================================================
      const isS5Active = state.activeSceneIndex === 4 || (state.nextSceneIndex === 4 && state.isTransitioning);
      if (isS5Active) {
        gridHelper.position.x = mouseX * 0.08;
      }
      gridHelper.material.opacity = isMobile ? 0.10 : 0.28;

      const emberArr = emberGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < emberCount * 3; i += 3) {
        emberArr[i] += 0.025;
        if (emberArr[i] > 8) emberArr[i] = -6;
      }
      emberGeo.attributes.position.needsUpdate = true;
      emberPoints.material.opacity = isMobile ? 0.45 : 0.75;

      // WebGL Rendering: Either Single Scene or Shader Transition
      const activeIdx = Math.min(state.activeSceneIndex, scenesArray.length - 1);
      const nextIdx = Math.min(state.nextSceneIndex, scenesArray.length - 1);

      if (state.isTransitioning && activeIdx !== nextIdx && !reducedMotion) {
        transitionManager.render(
          renderer,
          scenesArray[activeIdx],
          scenesArray[nextIdx],
          camera,
          state.transitionProgress,
          time
        );
      } else {
        renderer.setRenderTarget(null);
        renderer.render(scenesArray[activeIdx], camera);
      }
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('cinematic:select-project', handleProjectSelect);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('click', onWindowClick);
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
      container.removeEventListener('touchend', onTouchEnd);

      transitionManager.dispose();
      s1Geo.dispose();
      s1Mat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      suitPortraitGeo.dispose();
      suitPortraitMat.dispose();
      bwPortraitGeo.dispose();
      bwPortraitMat.dispose();
      wsGeo.dispose();
      wsMat.dispose();
      coreGeo.dispose();
      coreLineMat.dispose();
      innerCoreGeo.dispose();
      innerCoreMat.dispose();
      nodeGeo.dispose();
      connGeo.dispose();
      connMat.dispose();
      packetGeo.dispose();
      packetMat.dispose();
      s2ParticlesGeo.dispose();
      s2ParticlesMat.dispose();
      slabGeo.dispose();
      pipeGeo.dispose();
      pipeMat.dispose();
      solarCoreGeo.dispose();
      solarCoreMat.dispose();
      solarInnerGeo.dispose();
      solarInnerMat.dispose();
      orbitRingGeo1.dispose();
      orbitRingMat1.dispose();
      orbitRingGeo2.dispose();
      orbitRingMat2.dispose();
      orbitRingGeo3.dispose();
      orbitRingMat3.dispose();
      orbitParticlesGeo.dispose();
      orbitParticlesMat.dispose();
      cardGeo.dispose();
      cardBorderGeo.dispose();
      s4Geo.dispose();
      emberGeo.dispose();

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
