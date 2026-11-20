import React, { useEffect, useState } from 'react';
import {
  Home,
  Calculator,
  Package,
  BookOpen,
  MapPin,
  QrCode,
  Play,
  ShieldCheck,
  Phone,
  X
} from 'lucide-react';
import CalculatorView from './components/CalculatorView';
import ProductsView from './components/ProductsView';
import GuideView from './components/GuideView';
import OriginView from './components/OriginView';
import QrShareModal from './components/QrShareModal';

const VALID_VIEWS = ['inicio', 'calculadora', 'productos', 'guia', 'origen'];

const TOUR_STEPS = [
  {
    view: 'inicio',
    selector: '.hero',
    title: '1. Bienvenida desde el Código QR',
    desc: 'Al escanear el QR del bulto o botella, el caficultor llega a esta portada limpia para ir directo a la vista que necesita.'
  },
  {
    view: 'calculadora',
    selector: '#view-calculadora .calc-wrapper',
    title: '2. Vista de Calculadora de Dosis',
    desc: 'En esta vista dedicada respondes 5 preguntas rápidas y obtienes al instante bultos de 25 kg, litros y envío directo a WhatsApp.'
  },
  {
    view: 'productos',
    selector: '#view-productos .products-grid',
    title: '3. Vista de Productos y Composición',
    desc: 'Fichas técnicas del Abono Sólido Bocashi (25 kg) y Bioestimulante Líquido (1 L) con sus ingredientes 100% transparentes.'
  },
  {
    view: 'guia',
    selector: '#view-guia .container',
    title: '4. Vista de Guía de Uso en Campo',
    desc: 'Instrucciones separadas para sólido y líquido, con el esquema visual de media luna en ladera a 10–15 cm del tallo.'
  },
  {
    view: 'origen',
    selector: '#contacto-card',
    title: '5. Origen, QR y WhatsApp',
    desc: 'Trazabilidad de Hoyden Espinosa (Finca Buenos Aires) en Algeciras (Huila), descarga del código QR y contacto al +57 313 2208657.'
  }
];

function getViewFromHash() {
  const hash = window.location.hash.replace('#', '');
  return VALID_VIEWS.includes(hash) ? hash : 'inicio';
}

export default function App() {
  const [view, setView] = useState(getViewFromHash);
  const [qrOpen, setQrOpen] = useState(false);
  const [tourIndex, setTourIndex] = useState(-1);

  const navigateTo = (targetView, updateHash = true) => {
    const next = VALID_VIEWS.includes(targetView) ? targetView : 'inicio';
    setView(next);
    if (updateHash && window.location.hash !== `#${next}`) {
      window.history.pushState(null, '', `#${next}`);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  useEffect(() => {
    const onHashChange = () => setView(getViewFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.querySelectorAll('.tour-highlight').forEach((el) => el.classList.remove('tour-highlight'));
    if (tourIndex < 0 || tourIndex >= TOUR_STEPS.length) return;

    const step = TOUR_STEPS[tourIndex];
    if (view !== step.view) {
      setView(step.view);
      if (window.location.hash !== `#${step.view}`) {
        window.history.pushState(null, '', `#${step.view}`);
      }
    }

    const timer = setTimeout(() => {
      const targetEl = document.querySelector(step.selector);
      if (targetEl) {
        targetEl.classList.add('tour-highlight');
        const useStart = targetEl.offsetHeight > window.innerHeight * 0.6;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        targetEl.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: useStart ? 'start' : 'center' });
      }
    }, 60);

    return () => {
      clearTimeout(timer);
      document.querySelectorAll('.tour-highlight').forEach((el) => el.classList.remove('tour-highlight'));
    };
  }, [tourIndex, view]);

  useEffect(() => {
    if (tourIndex === -1) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setTourIndex(-1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [tourIndex]);

  const activeStep = tourIndex >= 0 ? TOUR_STEPS[tourIndex] : null;

  return (
    <>
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>

      <div className="qr-banner">
        <span>Guía QR Oficial · Ecocaff Algeciras, Huila</span> — Información técnica rápida para tu finca cafetera
      </div>

      <header className="navbar">
        <div className="container nav-inner">
          <a
            href="#inicio"
            className="brand"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('inicio');
            }}
            aria-label="Inicio Ecocaff"
          >
            <img src="/assets/ecocaff-logo.jpg" alt="Logo oficial de Ecocaff" className="brand-logo-img" width="44" height="44" />
            <span className="brand-text">
              <span className="brand-name">Ecocaff</span>
              <span className="brand-sub">El ciclo que revive tu tierra</span>
            </span>
          </a>

          <nav className="nav-links" aria-label="Navegación principal">
            <a href="#inicio" aria-current={view === 'inicio' ? 'page' : undefined} className={`nav-link ${view === 'inicio' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigateTo('inicio'); }}>
              <Home size={16} aria-hidden="true" />
              <span>Inicio</span>
            </a>
            <a href="#calculadora" aria-current={view === 'calculadora' ? 'page' : undefined} className={`nav-link ${view === 'calculadora' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigateTo('calculadora'); }}>
              <Calculator size={16} aria-hidden="true" />
              <span>Calculadora</span>
            </a>
            <a href="#productos" aria-current={view === 'productos' ? 'page' : undefined} className={`nav-link ${view === 'productos' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigateTo('productos'); }}>
              <Package size={16} aria-hidden="true" />
              <span>Productos</span>
            </a>
            <a href="#guia" aria-current={view === 'guia' ? 'page' : undefined} className={`nav-link ${view === 'guia' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigateTo('guia'); }}>
              <BookOpen size={16} aria-hidden="true" />
              <span>Guía de Uso</span>
            </a>
            <a href="#origen" aria-current={view === 'origen' ? 'page' : undefined} className={`nav-link ${view === 'origen' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigateTo('origen'); }}>
              <MapPin size={16} aria-hidden="true" />
              <span>Origen y Contacto</span>
            </a>
          </nav>

          <div className="nav-actions">
            <button type="button" className="nav-qr-btn" onClick={() => setQrOpen(true)} aria-label="Compartir web con código QR">
              <QrCode size={16} aria-hidden="true" />
              <span>QR</span>
            </button>
            <a
              href="#calculadora"
              className="nav-cta"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('calculadora');
              }}
            >
              <Calculator size={16} aria-hidden="true" />
              <span>Calcular Dosis</span>
            </a>
          </div>
        </div>

        <nav className="mobile-view-tabs" aria-label="Vistas rápidas en móvil">
          <a href="#inicio" aria-current={view === 'inicio' ? 'page' : undefined} className={`nav-link ${view === 'inicio' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigateTo('inicio'); }}>Inicio</a>
          <a href="#calculadora" aria-current={view === 'calculadora' ? 'page' : undefined} className={`nav-link ${view === 'calculadora' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigateTo('calculadora'); }}>Calculadora</a>
          <a href="#productos" aria-current={view === 'productos' ? 'page' : undefined} className={`nav-link ${view === 'productos' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigateTo('productos'); }}>Productos</a>
          <a href="#guia" aria-current={view === 'guia' ? 'page' : undefined} className={`nav-link ${view === 'guia' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigateTo('guia'); }}>Guía de Uso</a>
          <a href="#origen" aria-current={view === 'origen' ? 'page' : undefined} className={`nav-link ${view === 'origen' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); navigateTo('origen'); }}>Origen y Contacto</a>
        </nav>
      </header>

      <main id="main-content">
        {view === 'inicio' && (
          <section id="view-inicio" className="view-page active" data-view="inicio">
            <div className="hero">
              <div className="container hero-grid">
                <div>
                  <span className="badge-pill">
                    <ShieldCheck size={16} aria-hidden="true" />
                    Bioeconomía Circular · Vereda El Vergel, Huila
                  </span>
                  <h1>De la pulpa del café a la <em>nutrición viva</em> de tu cafetal.</h1>
                  <p className="hero-lead">
                    Bienvenido a la guía oficial de <strong>Ecocaff</strong>. Si escaneaste el código QR de tu bulto o botella, elige la sección que necesitas para calcular tu dosis, revisar la composición o ver cómo aplicarlo en ladera.
                  </p>

                  <div className="hero-actions">
                    <a
                      href="#calculadora"
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('calculadora');
                      }}
                    >
                      <Calculator size={18} aria-hidden="true" />
                      Calcular mi dosis
                    </a>
                    <button type="button" id="btn-start-tour" className="tour-trigger-btn" onClick={() => setTourIndex(0)}>
                      <Play size={16} aria-hidden="true" />
                      Recorrido guiado
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setQrOpen(true)}>
                      <QrCode size={18} aria-hidden="true" />
                      Compartir QR
                    </button>
                  </div>

                  <div className="hero-stats">
                    <div className="stat-item">
                      <strong>3 kg / árbol</strong>
                      <span>Dosis óptima en producción</span>
                    </div>
                    <div className="stat-item">
                      <strong>1 bulto = 8</strong>
                      <span>Cafetos adultos (25 kg)</span>
                    </div>
                    <div className="stat-item">
                      <strong>+38.8%</strong>
                      <span>Potencial de rendimiento rentable</span>
                    </div>
                  </div>
                </div>

                <div className="hero-media">
                  <div className="hero-image-wrap">
                    <img src="/assets/hero-cafetal.jpg" alt="Cafetal en las montañas de Algeciras, Huila al amanecer" width="1200" height="900" fetchPriority="high" />
                  </div>
                  <div className="hero-float-card">
                    <div className="float-icon" aria-hidden="true">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <strong>Finca Buenos Aires · Algeciras, Huila</strong>
                      <small>Productor: Hoyden Espinosa · Vereda El Vergel</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="quick-strip">
              <div className="container">
                <div className="quick-grid">
                  <a href="#calculadora" className="quick-card" onClick={(e) => { e.preventDefault(); navigateTo('calculadora'); }}>
                    <span className="quick-dot" aria-hidden="true"><Calculator size={20} /></span>
                    <span>
                      <strong>Calculadora de Dosis</strong>
                      <small>Calcula bultos de 25 kg y litros según tus palos.</small>
                    </span>
                  </a>

                  <a href="#productos" className="quick-card" onClick={(e) => { e.preventDefault(); navigateTo('productos'); }}>
                    <span className="quick-dot" aria-hidden="true"><Package size={20} /></span>
                    <span>
                      <strong>Productos y Composición</strong>
                      <small>Fichas técnicas del Bocashi sólido y biolixiviado.</small>
                    </span>
                  </a>

                  <a href="#guia" className="quick-card" onClick={(e) => { e.preventDefault(); navigateTo('guia'); }}>
                    <span className="quick-dot" aria-hidden="true"><BookOpen size={20} /></span>
                    <span>
                      <strong>Guía de Uso en Campo</strong>
                      <small>Paso a paso en ladera, media luna y cuidados.</small>
                    </span>
                  </a>

                  <a href="#origen" className="quick-card" onClick={(e) => { e.preventDefault(); navigateTo('origen'); }}>
                    <span className="quick-dot" aria-hidden="true"><Phone size={20} /></span>
                    <span>
                      <strong>Origen y Pedidos</strong>
                      <small>Trazabilidad Huila, dudas frecuentes y WhatsApp.</small>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {view === 'calculadora' && <CalculatorView />}
        {view === 'productos' && <ProductsView />}
        {view === 'guia' && <GuideView />}
        {view === 'origen' && <OriginView onNavigate={navigateTo} onOpenQr={() => setQrOpen(true)} />}
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/assets/ecocaff-logo.jpg" alt="" className="brand-logo-img" width="40" height="40" aria-hidden="true" />
            <div>
              <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#fff' }}>Ecocaff</strong>
              <span style={{ display: 'block', opacity: 0.78 }}>El ciclo que revive tu tierra · Vereda El Vergel, Algeciras, Huila</span>
            </div>
          </div>
          <div>
            <span>Bioeconomía circular cafetera · Finca Buenos Aires · WhatsApp +57 313 2208657</span>
          </div>
        </div>
      </footer>

      <div className="mobile-bar">
        <a href="#calculadora" className="btn btn-primary" onClick={(e) => { e.preventDefault(); navigateTo('calculadora'); }}>
          Calcular Dosis
        </a>
        <a
          href="https://wa.me/573132208657?text=Hola%20Ecocaff%2C%20necesito%20asesor%C3%ADa%20sobre%20el%20abono."
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-whatsapp"
        >
          WhatsApp
        </a>
      </div>

      <QrShareModal isOpen={qrOpen} onClose={() => setQrOpen(false)} />

      {activeStep && (
        <div id="tour-popover" className="tour-popover active" role="dialog" aria-modal="false" aria-labelledby="tour-title">
          <div className="tour-top">
            <span id="tour-step-badge" className="tour-step-badge">Paso {tourIndex + 1} de {TOUR_STEPS.length}</span>
            <button type="button" id="tour-close" className="tour-close" onClick={() => setTourIndex(-1)} aria-label="Cerrar recorrido">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <h3 id="tour-title">{activeStep.title}</h3>
          <p id="tour-desc">{activeStep.desc}</p>
          <div className="tour-actions">
            <button
              type="button"
              id="tour-prev"
              className="tour-btn"
              style={{ visibility: tourIndex === 0 ? 'hidden' : 'visible' }}
              onClick={() => setTourIndex((i) => Math.max(0, i - 1))}
            >
              Anterior
            </button>
            <button
              type="button"
              id="tour-next"
              className="tour-btn tour-btn-next"
              onClick={() => setTourIndex((i) => (i >= TOUR_STEPS.length - 1 ? -1 : i + 1))}
            >
              {tourIndex === TOUR_STEPS.length - 1 ? 'Finalizar ✓' : 'Siguiente →'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
