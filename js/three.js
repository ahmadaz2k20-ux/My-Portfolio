/* ==========================================================================
   Awwwards-Level 3D Storytelling Portfolio - Three.js WebGL Engine
   ========================================================================== */

(function () {
  'use strict';

  let scene, camera, renderer;
  let planetMesh, planetRingMesh, planetCoreMesh;
  let particleSystem, particlePositions, originalParticlePositions;
  let floatingTechGroup;
  
  // Mouse position tracking
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  // Particle count based on device capability
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 3000 : 7000;

  function initThreeScene() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    // 1. Scene setup
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xfbfbfd, 0.015);

    // 2. Camera setup
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 18);

    // 3. Renderer setup
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xff8c32, 2.5);
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x60a5fa, 1.5);
    dirLight2.position.set(-10, -10, -10);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xff8c32, 3, 50);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // 5. Create 3D Glass Planet
    createGlassPlanet();

    // 6. Create Orbiting Orange Ring
    createOrbitRing();

    // 7. Create Particle Field (Starfield & Morphing System)
    createParticleSystem();

    // 8. Create Floating Tech Objects for Chapter 01
    createFloatingTechObjects();

    // 9. Event Listeners
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);

    // 10. Start Animation Loop
    animate();
  }

  function createGlassPlanet() {
    const planetGroup = new THREE.Group();

    // Outer Glass Shell
    const geometry = new THREE.IcosahedronGeometry(4, 4);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.9, // Glass translucency
      opacity: 0.85,
      transparent: true,
      ior: 1.5,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    });

    planetMesh = new THREE.Mesh(geometry, glassMaterial);
    planetGroup.add(planetMesh);

    // Inner Glowing Core
    const coreGeometry = new THREE.IcosahedronGeometry(2.6, 2);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0xff8c32,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });

    planetCoreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    planetGroup.add(planetCoreMesh);

    // Position planet dead-center behind central hero showcase card
    planetGroup.position.set(0, 0, -1.5);
    scene.add(planetGroup);

    // Save reference for global animation control
    window.threePlanetGroup = planetGroup;
  }

  function createOrbitRing() {
    const ringGeometry = new THREE.TorusGeometry(6.2, 0.12, 16, 100);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xff8c32,
      emissive: 0xff6b00,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8
    });

    planetRingMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    planetRingMesh.rotation.x = Math.PI / 3;
    planetRingMesh.rotation.y = Math.PI / 6;

    if (window.threePlanetGroup) {
      window.threePlanetGroup.add(planetRingMesh);
    }
  }

  function createParticleSystem() {
    const geometry = new THREE.BufferGeometry();
    particlePositions = new Float32Array(particleCount * 3);
    originalParticlePositions = new Float32Array(particleCount * 3);

    const radius = 35;
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * radius + 5;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      originalParticlePositions[i * 3] = x;
      originalParticlePositions[i * 3 + 1] = y;
      originalParticlePositions[i * 3 + 2] = z;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Particle texture canvas
    const pMaterial = new THREE.PointsMaterial({
      color: 0xff8c32,
      size: 0.14,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(geometry, pMaterial);
    scene.add(particleSystem);
    window.threeParticleSystem = particleSystem;
  }

  function createFloatingTechObjects() {
    floatingTechGroup = new THREE.Group();

    const techGeometries = [
      new THREE.OctahedronGeometry(0.85, 0),
      new THREE.TorusGeometry(0.7, 0.22, 12, 24),
      new THREE.TorusKnotGeometry(0.5, 0.15, 64, 8),
      new THREE.IcosahedronGeometry(0.75, 0),
      new THREE.BoxGeometry(0.9, 0.9, 0.9),
      new THREE.TetrahedronGeometry(0.9, 0)
    ];

    const techMaterial = new THREE.MeshStandardMaterial({
      color: 0xff8c32,
      roughness: 0.25,
      metalness: 0.8,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });

    // Create 24 floating wireframe polyhedrons spread vertically across the 3D space
    for (let i = 0; i < 24; i++) {
      const geom = techGeometries[i % techGeometries.length];
      const mesh = new THREE.Mesh(geom, techMaterial);

      mesh.position.set(
        (Math.random() - 0.5) * 44,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 30 - 5
      );

      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      mesh.scale.setScalar(0.7 + Math.random() * 0.8);
      floatingTechGroup.add(mesh);
    }

    scene.add(floatingTechGroup);
    window.threeFloatingGroup = floatingTechGroup;
  }

  function onMouseMove(event) {
    mouse.targetX = (event.clientX - windowHalfX) * 0.001;
    mouse.targetY = (event.clientY - windowHalfY) * 0.001;
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);

    // Smooth lerp mouse position
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Rotate 3D Glass Planet
    if (window.threePlanetGroup) {
      window.threePlanetGroup.rotation.y += 0.004;
      window.threePlanetGroup.rotation.x = mouse.y * 0.5;
      window.threePlanetGroup.rotation.z = mouse.x * 0.5;
    }

    if (planetCoreMesh) {
      planetCoreMesh.rotation.y -= 0.008;
    }

    if (planetRingMesh) {
      planetRingMesh.rotation.z += 0.003;
    }

    // Rotate Floating Objects
    if (floatingTechGroup) {
      floatingTechGroup.rotation.y += 0.002;
      floatingTechGroup.children.forEach((obj, idx) => {
        obj.rotation.x += 0.01 * (idx % 2 === 0 ? 1 : -1);
        obj.rotation.y += 0.01;
      });
    }

    // Slowly rotate particle field
    if (particleSystem) {
      particleSystem.rotation.y += 0.0008;
    }

    // Camera parallax follow
    camera.position.x += (mouse.x * 3 - camera.position.x) * 0.05;
    camera.position.y += (-mouse.y * 3 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  // Initialize WebGL scene on window DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeScene);
  } else {
    initThreeScene();
  }

  // Export scene camera refs globally for GSAP ScrollTrigger timeline controller
  window.threeScene = {
    getScene: () => scene,
    getCamera: () => camera,
    getPlanetGroup: () => window.threePlanetGroup,
    getParticleSystem: () => particleSystem,
    getParticlePositions: () => particlePositions,
    getOriginalParticlePositions: () => originalParticlePositions
  };

})();
