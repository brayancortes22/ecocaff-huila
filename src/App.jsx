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
import AdminView from './components/AdminView';

const VALID_VIEWS = ['inicio', 'calculadora', 'productos', 'guia', 'origen', 'admin'];

const DEFAULT_CATALOG = {
  site: {
    logoImage: '/assets/ecocaff-logo.jpg',
    heroBadge: 'Bioeconomía Circular · Vereda El Vergel, Huila',
    heroTitle: 'De la pulpa del café a la nutrición viva de tu cafetal.',
    heroImage: '/assets/hero-cafetal.jpg',
    heroLead: 'Bienvenido a la guía oficial de Ecocaff. Si escaneaste el código QR de tu bulto o botella, elige la sección que necesitas para calcular tu dosis, revisar la composición o ver cómo aplicarlo en ladera.',
    stat1Value: '3 kg / árbol',
    stat1Label: 'Dosis óptima en producción',
    stat2Value: '1 bulto = 8',
    stat2Label: 'Cafetos adultos (25 kg)',
    stat3Value: '+38.8%',
    stat3Label: 'Potencial de rendimiento rentable',
    farmName: 'Finca Buenos Aires',
    producerName: 'Hoyden Espinosa',
    location: 'Vereda El Vergel, Algeciras (Huila)',
    whatsapp: '573132208657'
  },
  calculator: {
    title: 'Calcula cuántos bultos o litros necesita tu lote',
    subtitle: 'Responde estas 5 preguntas rápidas con el lenguaje de tu finca para obtener la dosis exacta sin desperdiciar dinero.',
    kgProduccion: 3,
    kgLevante: 1.25,
    bultoKg: 25
  },
  products: [
    {
      id: 'solido',
      tag: 'Presentación Sólida · Bulto 25 kg',
      name: 'Abono Orgánico Natural (Tipo Bocashi)',
      description: 'Empaque ergonómico de 25 kg en papel kraft con ventana vertical transparente para verificar textura, color oscuro y humedad antes de abrir.',
      image: '/assets/ecocaff-solido.jpg',
      specs: [
        'Dosis en producción: 3 kg por árbol (1 bulto = ~8 árboles).',
        'Dosis en levante / zoca: 1 a 1.5 kg por árbol.',
        'Aporte agronómico: Mejora retención de humedad, estructura del suelo y aumenta rendimiento de forma rentable.'
      ],
      ingredients: 'Pulpa/cáscara de café, Gallinaza, Tierra fértil, Carbón triturado, Salvado de arroz, Ceniza vegetal, Melaza / Panela, Microorganismos de montaña'
    },
    {
      id: 'liquido',
      tag: 'Presentación Líquida · Envase 1 L',
      name: 'Bioestimulante Líquido Orgánico (Biolixiviado)',
      description: 'Envase beige mate ergonómico con tapa de seguridad marrón y ranura lateral graduada (200–800 ml) para medir con precisión en campo.',
      image: '/assets/ecocaff-liquido.jpg',
      specs: [
        'Dilución recomendada: 1 a 2 litros por bomba de espalda de 20 L (mezcla al 5% – 10%).',
        'Modo de aplicación: Foliar sobre el follaje o en drench directo a la base del árbol.',
        'Complemento ideal: Refuerza la floración y el llenado de fruto junto al abono sólido.'
      ],
      ingredients: 'Lixiviado de café fermentado, Microorganismos nativos, Melaza activadora, Nutrientes solubles naturales'
    }
  ],
  guide: {
    title: '¿Cómo se usa Ecocaff en tu cafetal?',
    subtitle: 'Elige el producto que tienes en la mano para ver las instrucciones exactas de preparación, aplicación y cuidado en campo.',
    diagramImage: '/assets/esquema-media-luna.jpg',
    solidSteps: [
      { title: 'Elige el momento clave', text: 'Aplica de 2 a 3 veces al año (cosecha principal y traviesa), idealmente 5 a 15 días antes de floración y al inicio del llenado de grano, con el suelo húmedo.' },
      { title: 'Mide la dosis por árbol', text: 'Aplica 3 kg por árbol en producción (1 bulto de 25 kg alcanza para ~8 palos). En árboles jóvenes o zoca en levante usa 1 a 1.5 kg por postura.' },
      { title: 'Media luna en zona de gotera', text: 'Retira 10 a 15 cm del tallo (donde cae el agua de las hojas). En ladera, haz una zanja en media luna en la parte alta, deposita el abono y tapa con tierra u hojarasca.' },
      { title: 'Guarda el bulto bajo techo', text: 'Mantén los sacos en lugar seco, ventilado y a la sombra para proteger los microorganismos benéficos. Usa guantes al manipular a granel.' }
    ],
    liquidSteps: [
      { title: 'Agita y mide en la ranura', text: 'Agita suavemente el envase beige antes de usar y mide la cantidad exacta usando la ranura lateral graduada (200–800 ml) sin desperdiciar producto.' },
      { title: 'Diluye en bomba de 20 L', text: 'Mezcla de 1 a 2 litros de Ecocaff Líquido en una bomba de espalda de 20 litros de agua limpia (dilución al 5% – 10%).' },
      { title: 'Aplica foliar o en drench', text: 'Aplica en foliar sobre las hojas (mañana temprano o al caer la tarde) o en drench directo a la zona de gotera de la raíz.' },
      { title: 'Cierra bien y protege del sol', text: 'Asegura la tapa marrón después de medir y conserva el envase en un lugar fresco y a la sombra. Complementa con el sólido en pre-floración.' }
    ],
    checklist: [
      { type: 'ok', text: 'Aplica cuando el suelo tenga buena humedad (inicio de lluvias) para activar la vida del suelo.' },
      { type: 'ok', text: 'Tapa ligeramente el abono sólido con tierra u hojarasca en laderas para evitar que el agua lo arrastre.' },
      { type: 'no', text: 'No pegues el abono directamente al tallo del cafeto; siempre respeta la zona de gotera (10–15 cm).' },
      { type: 'no', text: 'No apliques el bioestimulante foliar a pleno sol del mediodía; hazlo en horas frescas de la mañana o tarde.' }
    ]
  },
  origin: {
    headline: 'Del corazón de Algeciras, Huila, con rostro campesino',
    story1: 'Ecocaff nace para resolver dos dolores reales del caficultor huilense: el alto costo de los fertilizantes sintéticos importados y la pérdida ambiental de la pulpa de café durante el beneficio.',
    contactTitle: '¿Listo para probar Ecocaff en tu lote?',
    faqs: [
      { q: '¿Puedo combinar Ecocaff con mi fertilización tradicional?', a: 'Sí. Puedes usar Ecocaff como reemplazo 100% orgánico o en manejo integrado (transición), combinando la dosis orgánica con una fracción reducida de fertilizante químico mientras el suelo recupera su actividad biológica.' },
      { q: '¿Sirve para otros cultivos además del café?', a: 'Sí, aunque la dosificación principal está calibrada para café en Algeciras, su base de Bocashi y biolixiviado también beneficia frutales y cultivos de pancoger de la región. Para cultivos distintos al café se recomienda ajustar según análisis de suelo.' },
      { q: '¿Por qué la presentación sólida viene en bultos de 25 kg?', a: 'Porque 25 kg es un peso ergonómico diseñado pensando en la salud del trabajador rural y en el transporte por caminos y laderas empinadas, rindiendo exactamente para unos 8 árboles adultos.' },
      { q: '¿Cómo puedo ser punto de venta o aliado comercial en Algeciras?', a: 'Si tienes un almacén de insumos agrícolas o deseas hacer un pedido directo para tu finca o vereda, escríbenos por WhatsApp para coordinar precios de distribuidor, entregas y muestras demostrativas.' }
    ]
  }
};

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
  const [catalog, setCatalog] = useState(() => {
    try {
      const saved = localStorage.getItem('ecocaff_catalog_override');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed?.products) && Array.isArray(parsed?.guide?.solidSteps)) {
          return parsed;
        }
      }
      return DEFAULT_CATALOG;
    } catch {
      return DEFAULT_CATALOG;
    }
  });

  useEffect(() => {
    if (localStorage.getItem('ecocaff_catalog_override')) return;
    fetch('/catalog.json')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data?.products) && Array.isArray(data?.guide?.solidSteps) && data?.site) {
          setCatalog(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveCatalogLocal = (nextCatalog) => {
    setCatalog(nextCatalog);
    localStorage.setItem('ecocaff_catalog_override', JSON.stringify(nextCatalog));
  };

  const handleResetCatalogLocal = () => {
    localStorage.removeItem('ecocaff_catalog_override');
    setCatalog(DEFAULT_CATALOG);
  };

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
            <img src={catalog.site.logoImage} alt="Logo oficial de Ecocaff" className="brand-logo-img" width="54" height="44" />
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
                    {catalog.site.heroBadge}
                  </span>
                  <h1>{catalog.site.heroTitle}</h1>
                  <p className="hero-lead">{catalog.site.heroLead}</p>

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
                      <strong>{catalog.site.stat1Value}</strong>
                      <span>{catalog.site.stat1Label}</span>
                    </div>
                    <div className="stat-item">
                      <strong>{catalog.site.stat2Value}</strong>
                      <span>{catalog.site.stat2Label}</span>
                    </div>
                    <div className="stat-item">
                      <strong>{catalog.site.stat3Value}</strong>
                      <span>{catalog.site.stat3Label}</span>
                    </div>
                  </div>
                </div>

                <div className="hero-media">
                  <div className="hero-image-wrap">
                    <img src={catalog.site.heroImage} alt="Cafetal en las montañas de Algeciras, Huila al amanecer" width="1200" height="900" fetchPriority="high" />
                  </div>
                  <div className="hero-float-card">
                    <div className="float-icon" aria-hidden="true">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <strong>{catalog.site.farmName} · Algeciras, Huila</strong>
                      <small>Productor: {catalog.site.producerName} · {catalog.site.location}</small>
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

        {view === 'calculadora' && <CalculatorView whatsapp={catalog.site.whatsapp} config={catalog.calculator} />}
        {view === 'productos' && <ProductsView catalog={catalog} />}
        {view === 'guia' && <GuideView guide={catalog.guide} />}
        {view === 'origen' && <OriginView site={catalog.site} origin={catalog.origin} onNavigate={navigateTo} onOpenQr={() => setQrOpen(true)} />}
        {view === 'admin' && (
          <AdminView
            catalog={catalog}
            onSaveLocal={handleSaveCatalogLocal}
            onResetLocal={handleResetCatalogLocal}
            onNavigate={navigateTo}
          />
        )}
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={catalog.site.logoImage} alt="" className="brand-logo-img" width="54" height="44" aria-hidden="true" />
            <div>
              <strong style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#fff' }}>Ecocaff</strong>
              <span style={{ display: 'block', opacity: 0.78 }}>El ciclo que revive tu tierra · {catalog.site.location}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px' }}>
            <span>{catalog.site.farmName} · WhatsApp +{catalog.site.whatsapp}</span>
            <a
              href="#admin"
              style={{ textDecoration: 'underline', opacity: 0.85 }}
              onClick={(e) => {
                e.preventDefault();
                navigateTo('admin');
              }}
            >
              Administrar web
            </a>
          </div>
        </div>
      </footer>

      <div className="mobile-bar">
        <a href="#calculadora" className="btn btn-primary" onClick={(e) => { e.preventDefault(); navigateTo('calculadora'); }}>
          Calcular Dosis
        </a>
        <a
          href={`https://wa.me/${catalog.site.whatsapp}?text=Hola%20Ecocaff%2C%20necesito%20asesor%C3%ADa%20sobre%20el%20abono.`}
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
