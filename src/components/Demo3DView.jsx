import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Box, Rotate3d, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

function ThreeCanvas({ modelType, imageUrl, backImageUrl }) {
  const mountRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = 340;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F2E9DC');

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 4.1);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.minDistance = 2.0;
    controls.maxDistance = 6.5;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.4;
    controlsRef.current = controls;

    const ambient = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff5e4, 1.15);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.85);
    backLight.position.set(-3, 3, -4);
    scene.add(backLight);

    const loader = new THREE.TextureLoader();
    const frontTex = loader.load(imageUrl);
    frontTex.colorSpace = THREE.SRGBColorSpace;
    const backTex = loader.load(backImageUrl || imageUrl);
    backTex.colorSpace = THREE.SRGBColorSpace;

    const group = new THREE.Group();
    scene.add(group);

    if (modelType === 'sack') {
      // Saco Kraft 3D con frente (+Z) y reverso (-Z)
      const bagGeo = new THREE.BoxGeometry(1.5, 2.1, 0.62, 12, 16, 6);
      const pos = bagGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        const z = pos.getZ(i);
        const belly = 1 - Math.pow(y / 1.15, 2) * 0.25;
        const roundX = 1 - Math.pow(x / 0.9, 2) * 0.12;
        pos.setZ(i, z * belly * roundX * 1.15);
      }
      bagGeo.computeVertexNormals();

      const kraftMat = new THREE.MeshStandardMaterial({ color: 0xc59b6d, roughness: 0.85 });
      const frontLabelMat = new THREE.MeshStandardMaterial({ map: frontTex, roughness: 0.65 });
      const backLabelMat = new THREE.MeshStandardMaterial({ map: backTex, roughness: 0.65 });
      const bag = new THREE.Mesh(bagGeo, [kraftMat, kraftMat, kraftMat, kraftMat, frontLabelMat, backLabelMat]);
      group.add(bag);

      const foldGeo = new THREE.BoxGeometry(1.54, 0.14, 0.18);
      const foldMat = new THREE.MeshStandardMaterial({ color: 0xa67c52, roughness: 0.85 });
      const fold = new THREE.Mesh(foldGeo, foldMat);
      fold.position.y = 1.08;
      group.add(fold);
    } else {
      // Modo B: Bidón ergonómico 1 L (forma exacta de la foto: cuerpo rectangular redondeado, asa superior integrada, tapa marrón izquierda y visor de nivel)
      const beigeMat = new THREE.MeshStandardMaterial({ color: 0xe6cdb2, roughness: 0.45, metalness: 0.04 });

      const jShape = new THREE.Shape();
      const r = 0.14;
      jShape.moveTo(-0.72 + r, -1.0);
      jShape.lineTo(0.72 - r, -1.0);
      jShape.quadraticCurveTo(0.72, -1.0, 0.72, -1.0 + r);
      jShape.lineTo(0.72, 0.86);
      jShape.quadraticCurveTo(0.72, 1.04, 0.52, 1.04);
      jShape.lineTo(0.16, 1.04);
      jShape.quadraticCurveTo(0.02, 1.04, -0.06, 0.90);
      jShape.lineTo(-0.56, 0.90);
      jShape.quadraticCurveTo(-0.72, 0.90, -0.72, 0.74);
      jShape.lineTo(-0.72, -1.0 + r);
      jShape.quadraticCurveTo(-0.72, -1.0, -0.72 + r, -1.0);

      // Hueco ergonómico del asa integrada en la esquina superior derecha
      const handleHole = new THREE.Path();
      const hr = 0.09;
      handleHole.moveTo(0.18 + hr, 0.34);
      handleHole.lineTo(0.48 - hr, 0.34);
      handleHole.quadraticCurveTo(0.48, 0.34, 0.48, 0.34 + hr);
      handleHole.lineTo(0.48, 0.84 - hr);
      handleHole.quadraticCurveTo(0.48, 0.84, 0.48 - hr, 0.84);
      handleHole.lineTo(0.18 + hr, 0.84);
      handleHole.quadraticCurveTo(0.18, 0.84, 0.18, 0.84 - hr);
      handleHole.lineTo(0.18, 0.34 + hr);
      handleHole.quadraticCurveTo(0.18, 0.34, 0.18 + hr, 0.34);
      jShape.holes.push(handleHole);

      const extrudeGeo = new THREE.ExtrudeGeometry(jShape, {
        depth: 0.56,
        bevelEnabled: true,
        bevelThickness: 0.08,
        bevelSize: 0.07,
        bevelSegments: 5,
        curveSegments: 16
      });
      extrudeGeo.translate(0, 0, -0.28);
      const jugMesh = new THREE.Mesh(extrudeGeo, beigeMat);
      group.add(jugMesh);

      // Tapa rosca marrón oscura en la parte superior izquierda
      const capMat = new THREE.MeshStandardMaterial({ color: 0x3b2314, roughness: 0.42 });
      const neckGeo = new THREE.CylinderGeometry(0.15, 0.16, 0.1, 24);
      const neck = new THREE.Mesh(neckGeo, beigeMat);
      neck.position.set(-0.34, 0.97, 0);
      group.add(neck);

      const capGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.22, 24);
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(-0.34, 1.1, 0);
      group.add(cap);

      // Ranura vertical graduada de líquido ámbar en el borde derecho frontal
      const windowFrameGeo = new THREE.BoxGeometry(0.16, 1.05, 0.03);
      const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0xcab094, roughness: 0.35 });
      const windowFrame = new THREE.Mesh(windowFrameGeo, windowFrameMat);
      windowFrame.position.set(0.48, -0.34, 0.355);
      group.add(windowFrame);

      const liquidStripGeo = new THREE.BoxGeometry(0.11, 0.88, 0.035);
      const liquidStripMat = new THREE.MeshStandardMaterial({ color: 0x382419, roughness: 0.2, metalness: 0.1 });
      const liquidStrip = new THREE.Mesh(liquidStripGeo, liquidStripMat);
      liquidStrip.position.set(0.48, -0.40, 0.36);
      group.add(liquidStrip);

      // Etiqueta frontal plana (dejando espacio a la derecha para la ranura graduada)
      const frontLabelGeo = new THREE.PlaneGeometry(0.96, 1.42);
      const frontLabelMat = new THREE.MeshStandardMaterial({ map: frontTex, roughness: 0.55 });
      const frontLabel = new THREE.Mesh(frontLabelGeo, frontLabelMat);
      frontLabel.position.set(-0.14, -0.15, 0.366);
      group.add(frontLabel);

      // Etiqueta trasera plana
      const backLabelGeo = new THREE.PlaneGeometry(1.12, 1.48);
      const backLabelMat = new THREE.MeshStandardMaterial({ map: backTex, roughness: 0.55 });
      const backLabel = new THREE.Mesh(backLabelGeo, backLabelMat);
      backLabel.rotation.y = Math.PI;
      backLabel.position.set(0, -0.15, -0.366);
      group.add(backLabel);
    }

    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 360;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      frontTex.dispose();
      backTex.dispose();
      renderer.dispose();
    };
  }, [modelType, imageUrl, backImageUrl]);

  const handleZoom = (factor) => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    const dir = cam.position.clone().sub(ctrl.target);
    const nextDist = THREE.MathUtils.clamp(dir.length() * factor, 2.0, 6.5);
    dir.setLength(nextDist);
    cam.position.copy(ctrl.target).add(dir);
    ctrl.update();
  };

  const handleReset = () => {
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    if (!cam || !ctrl) return;
    cam.position.set(0, 0.35, 4.1);
    ctrl.target.set(0, 0, 0);
    ctrl.update();
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '420px',
          borderRadius: '14px',
          overflow: 'hidden',
          cursor: 'grab',
          border: '1px solid var(--border)'
        }}
        aria-label="Visor 3D interactivo 360 grados con zoom"
      />
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          display: 'flex',
          gap: '8px'
        }}
      >
        <button
          type="button"
          className="tour-btn"
          onClick={() => handleZoom(0.8)}
          aria-label="Acercar zoom 3D"
          style={{ minHeight: '44px', minWidth: '44px', padding: '0 12px' }}
        >
          <ZoomIn size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="tour-btn"
          onClick={() => handleZoom(1.25)}
          aria-label="Alejar zoom 3D"
          style={{ minHeight: '44px', minWidth: '44px', padding: '0 12px' }}
        >
          <ZoomOut size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="tour-btn"
          onClick={handleReset}
          aria-label="Reiniciar vista 3D"
          style={{ minHeight: '44px', minWidth: '44px', padding: '0 12px' }}
        >
          <RotateCcw size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default function Demo3DView({ catalog, onNavigate }) {
  const products = Array.isArray(catalog?.products) ? catalog.products : [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [useCleanDemo, setUseCleanDemo] = useState(false);
  const current = products[selectedIndex] || products[0] || {};
  const activeModel = current.modelType || (selectedIndex === 1 ? 'bottle' : 'sack');

  const demoFront = activeModel === 'bottle' ? '/assets/demo/bottle-front.jpg' : '/assets/demo/sack-front.jpg';
  const demoBack = activeModel === 'bottle' ? '/assets/demo/bottle-back.jpg' : '/assets/demo/sack-back.jpg';
  const activeFront = useCleanDemo ? demoFront : (current.image || demoFront);
  const activeBack = useCleanDemo ? demoBack : (current.backImage || current.image || demoBack);

  return (
    <section id="view-demo-3d" className="view-page active" data-view="demo-3d">
      <div className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">
              <Rotate3d size={15} aria-hidden="true" />
              Visor 3D 360° (Arrastra para girar)
            </span>
            <h1>Explora los empaques de Ecocaff en 3D</h1>
            <p>Gira el bulto de 25 kg o el bidón de 1 L para ver su diseño frontal y trasero con código QR.</p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '20px' }}>
            <div className="guide-tabs" role="tablist" aria-label="Elegir producto para ver en 3D" style={{ marginBottom: 0 }}>
              {products.map((p, idx) => (
                <button
                  key={p.id || idx}
                  type="button"
                  role="tab"
                  aria-selected={selectedIndex === idx}
                  className={`guide-tab-btn ${selectedIndex === idx ? 'active' : ''}`}
                  onClick={() => setSelectedIndex(idx)}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <button
              type="button"
              className={`btn ${!useCleanDemo ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setUseCleanDemo((v) => !v)}
              style={{ minHeight: '44px', padding: '0 16px', fontSize: '0.84rem' }}
            >
              {useCleanDemo ? 'Usando: Etiquetas de prueba (cambiar a catálogo)' : 'Usando: Fotos del catálogo / Admin'}
            </button>
          </div>

          <article className="product-card" style={{ maxWidth: '740px', margin: '0 auto' }}>
            <div className="product-body">
              <span className="product-tag">
                <Box size={14} aria-hidden="true" />
                {activeModel === 'sack' ? 'Empaque 3D · Saco / Bulto 25 kg' : 'Empaque 3D · Bidón / Botella 1 L'}
              </span>
              <h2>{current.name}</h2>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                Arrastra con el dedo o el mouse para rotar 360° y revisar la cara frontal y trasera.
              </p>
              <ThreeCanvas modelType={activeModel} imageUrl={activeFront} backImageUrl={activeBack} />
            </div>
          </article>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button type="button" className="btn btn-secondary" onClick={() => onNavigate('productos')}>
              Volver a Productos
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
