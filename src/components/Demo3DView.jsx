import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Box, Layers, Rotate3d } from 'lucide-react';

function ThreeCanvas({ mode, productType, imageUrl, backImageUrl }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = 340;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F2E9DC');

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.35, 4.1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.4;

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

    if (mode === 'A') {
      // Modo A: Placa 3D con frente y reverso
      const cardGeo = new THREE.BoxGeometry(1.75, 2.32, 0.12);
      const sideMat = new THREE.MeshStandardMaterial({ color: 0x362419, roughness: 0.55, metalness: 0.1 });
      const frontMat = new THREE.MeshStandardMaterial({ map: frontTex, roughness: 0.35, metalness: 0.05 });
      const backMat = new THREE.MeshStandardMaterial({ map: backTex, roughness: 0.35, metalness: 0.05 });
      const card = new THREE.Mesh(cardGeo, [sideMat, sideMat, sideMat, sideMat, frontMat, backMat]);
      group.add(card);
    } else if (productType === 'solido') {
      // Modo B: Saco Kraft 25 kg 3D con frente (+Z) y reverso (-Z)
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

      // Doblez superior cosido
      const foldGeo = new THREE.BoxGeometry(1.54, 0.14, 0.18);
      const foldMat = new THREE.MeshStandardMaterial({ color: 0xa67c52, roughness: 0.85 });
      const fold = new THREE.Mesh(foldGeo, foldMat);
      fold.position.y = 1.08;
      group.add(fold);
    } else {
      // Modo B: Envase Beige 1 L 3D con etiqueta frontal y trasera
      const bodyGeo = new THREE.CylinderGeometry(0.68, 0.72, 1.85, 32);
      const beigeMat = new THREE.MeshStandardMaterial({ color: 0xe6d2b8, roughness: 0.45 });
      const body = new THREE.Mesh(bodyGeo, beigeMat);
      body.scale.set(1.05, 1, 0.68);
      group.add(body);

      // Etiqueta frontal curva
      const frontLabelGeo = new THREE.CylinderGeometry(0.695, 0.735, 1.25, 32, 1, true, -Math.PI * 0.35, Math.PI * 0.7);
      const frontLabelMat = new THREE.MeshStandardMaterial({ map: frontTex, roughness: 0.5, side: THREE.DoubleSide });
      const frontLabel = new THREE.Mesh(frontLabelGeo, frontLabelMat);
      frontLabel.scale.set(1.05, 1, 0.68);
      group.add(frontLabel);

      // Etiqueta trasera curva
      const backLabelGeo = new THREE.CylinderGeometry(0.695, 0.735, 1.25, 32, 1, true, Math.PI * 0.65, Math.PI * 0.7);
      const backLabelMat = new THREE.MeshStandardMaterial({ map: backTex, roughness: 0.5, side: THREE.DoubleSide });
      const backLabel = new THREE.Mesh(backLabelGeo, backLabelMat);
      backLabel.scale.set(1.05, 1, 0.68);
      group.add(backLabel);

      // Cuello y tapa marrón
      const capGeo = new THREE.CylinderGeometry(0.24, 0.25, 0.28, 24);
      const capMat = new THREE.MeshStandardMaterial({ color: 0x3b2314, roughness: 0.4 });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(-0.22, 1.05, 0);
      group.add(cap);

      // Asa lateral
      const handleGeo = new THREE.TorusGeometry(0.28, 0.08, 12, 24, Math.PI);
      const handle = new THREE.Mesh(handleGeo, beigeMat);
      handle.rotation.z = -Math.PI / 2;
      handle.position.set(0.56, 0.32, 0);
      group.add(handle);
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
  }, [mode, productType, imageUrl, backImageUrl]);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '340px',
        borderRadius: '14px',
        overflow: 'hidden',
        cursor: 'grab',
        border: '1px solid var(--border)'
      }}
      aria-label={`Visor 3D interactivo Modo ${mode}`}
    />
  );
}

export default function Demo3DView({ catalog, onNavigate }) {
  const [selected, setSelected] = useState('solido');
  const solidFront = catalog?.products?.[0]?.image || '/assets/ecocaff-solido.jpg';
  const solidBack = catalog?.products?.[0]?.backImage || solidFront;
  const liquidFront = catalog?.products?.[1]?.image || '/assets/ecocaff-liquido.jpg';
  const liquidBack = catalog?.products?.[1]?.backImage || liquidFront;
  const activeFront = selected === 'solido' ? solidFront : liquidFront;
  const activeBack = selected === 'solido' ? solidBack : liquidBack;

  return (
    <section id="view-demo-3d" className="view-page active" data-view="demo-3d">
      <div className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">
              <Rotate3d size={15} aria-hidden="true" />
              Comparativa Interactiva 3D (Arrastra para girar)
            </span>
            <h1>Elige cómo quieres mostrar tus productos en 3D</h1>
            <p>Prueba ambos modos directamente con el dedo o el mouse usando las fotos reales de Ecocaff. Ninguno requiere pagar APIs externas.</p>
          </div>

          <div className="guide-tabs" role="tablist" aria-label="Elegir producto para comparar 3D">
            <button
              type="button"
              role="tab"
              aria-selected={selected === 'solido'}
              className={`guide-tab-btn ${selected === 'solido' ? 'active' : ''}`}
              onClick={() => setSelected('solido')}
            >
              Abono Sólido (Bulto 25 kg)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={selected === 'liquido'}
              className={`guide-tab-btn ${selected === 'liquido' ? 'active' : ''}`}
              onClick={() => setSelected('liquido')}
            >
              Bioestimulante Líquido (1 L)
            </button>
          </div>

          <div className="products-grid">
            <article className="product-card">
              <div className="product-body">
                <span className="product-tag">
                  <Layers size={14} aria-hidden="true" />
                  Modo A · Placa / Relieve 3D
                </span>
                <h2>Tarjeta 3D con iluminación</h2>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                  Sirve para <strong>cualquier producto nuevo</strong> que suba Yulitza en `#admin` sin importar su forma. Muestra la foto completa con grosor, luz y rotación 3D.
                </p>
                <ThreeCanvas mode="A" productType={selected} imageUrl={activeFront} backImageUrl={activeBack} />
              </div>
            </article>

            <article className="product-card">
              <div className="product-body">
                <span className="product-tag">
                  <Box size={14} aria-hidden="true" />
                  Modo B · Empaque 3D Real 360°
                </span>
                <h2>Modelo 3D de Bulto / Botella</h2>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                  Proyecta la foto frontal y trasera (sin fondo) sobre un <strong>empaque 3D real</strong> (saco kraft de 25 kg o botella beige de 1 L).
                </p>
                <ThreeCanvas mode="B" productType={selected} imageUrl={activeFront} backImageUrl={activeBack} />
              </div>
            </article>
          </div>

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
