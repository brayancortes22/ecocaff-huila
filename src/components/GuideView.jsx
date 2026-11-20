import React, { useState } from 'react';
import {
  BookOpen,
  Package,
  Droplets,
  Calendar,
  Scale,
  Mountain,
  ShieldCheck,
  FlaskConical,
  Sprout,
  Sun,
  Check,
  X
} from 'lucide-react';

export default function GuideView({ guide }) {
  const [tab, setTab] = useState('solido');
  const g = guide || {};

  return (
    <section id="view-guia" className="view-page active" data-view="guia">
      <div className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">
              <BookOpen size={15} aria-hidden="true" />
              Guía de Uso Paso a Paso
            </span>
            <h1>{g.title || '¿Cómo se usa Ecocaff en tu cafetal?'}</h1>
            <p>{g.subtitle || 'Elige el producto que tienes en la mano para ver las instrucciones exactas de preparación, aplicación y cuidado en campo.'}</p>
          </div>

          <div className="guide-tabs" role="tablist" aria-label="Guía de uso por producto">
            <button
              type="button"
              id="tab-guide-solido"
              className={`guide-tab-btn ${tab === 'solido' ? 'active' : ''}`}
              role="tab"
              aria-selected={tab === 'solido'}
              aria-controls="panel-guide-solido"
              onClick={() => setTab('solido')}
            >
              <Package size={16} aria-hidden="true" />
              Abono Sólido (Bulto 25 kg)
            </button>
            <button
              type="button"
              id="tab-guide-liquido"
              className={`guide-tab-btn ${tab === 'liquido' ? 'active' : ''}`}
              role="tab"
              aria-selected={tab === 'liquido'}
              aria-controls="panel-guide-liquido"
              onClick={() => setTab('liquido')}
            >
              <Droplets size={16} aria-hidden="true" />
              Bioestimulante Líquido (1 L)
            </button>
          </div>

          {tab === 'solido' ? (
            <div id="panel-guide-solido" role="tabpanel" aria-labelledby="tab-guide-solido" className="steps-grid">
              <article className="step-card">
                <div className="step-icon" aria-hidden="true">
                  <Calendar size={20} />
                </div>
                <h3>1. Elige el momento clave</h3>
                <p>{g.solidStep1}</p>
              </article>
              <article className="step-card">
                <div className="step-icon" aria-hidden="true">
                  <Scale size={20} />
                </div>
                <h3>2. Mide la dosis por árbol</h3>
                <p>{g.solidStep2}</p>
              </article>
              <article className="step-card">
                <div className="step-icon" aria-hidden="true">
                  <Mountain size={20} />
                </div>
                <h3>3. Media luna en zona de gotera</h3>
                <p>{g.solidStep3}</p>
              </article>
              <article className="step-card">
                <div className="step-icon" aria-hidden="true">
                  <ShieldCheck size={20} />
                </div>
                <h3>4. Guarda el bulto bajo techo</h3>
                <p>{g.solidStep4}</p>
              </article>
            </div>
          ) : (
            <div id="panel-guide-liquido" role="tabpanel" aria-labelledby="tab-guide-liquido" className="steps-grid">
              <article className="step-card">
                <div className="step-icon" aria-hidden="true">
                  <FlaskConical size={20} />
                </div>
                <h3>1. Agita y mide en la ranura</h3>
                <p>{g.liquidStep1}</p>
              </article>
              <article className="step-card">
                <div className="step-icon" aria-hidden="true">
                  <Droplets size={20} />
                </div>
                <h3>2. Diluye en bomba de 20 L</h3>
                <p>{g.liquidStep2}</p>
              </article>
              <article className="step-card">
                <div className="step-icon" aria-hidden="true">
                  <Sprout size={20} />
                </div>
                <h3>3. Aplica foliar o en drench</h3>
                <p>{g.liquidStep3}</p>
              </article>
              <article className="step-card">
                <div className="step-icon" aria-hidden="true">
                  <Sun size={20} />
                </div>
                <h3>4. Cierra bien y protege del sol</h3>
                <p>{g.liquidStep4}</p>
              </article>
            </div>
          )}

          <div className="guide-extra-grid">
            <div className="diagram-card">
              <h3>Esquema rápido: media luna en ladera</h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '0 0 12px' }}>
                Coloca el abono en la parte alta del terreno, a 10–15 cm del tallo, para que la lluvia lleve los nutrientes hacia las raíces y no cuesta abajo.
              </p>
              <div className="diagram-figure">
                <img
                  src={g.diagramImage || '/assets/esquema-media-luna.jpg'}
                  alt="Ilustración de aplicación en media luna en la parte alta de la pendiente a 10 a 15 centímetros del tallo en zona de gotera"
                  width="1280"
                  height="720"
                  loading="lazy"
                />
              </div>
              <div className="diagram-callouts">
                <span className="diagram-pill"><strong>1.</strong> Media luna en parte alta</span>
                <span className="diagram-pill"><strong>2.</strong> 10–15 cm del tallo (gotera)</span>
                <span className="diagram-pill"><strong>3.</strong> Tapar con tierra / hojarasca</span>
              </div>
            </div>

            <div className="checklist-card">
              <h3>Recomendaciones clave en finca</h3>
              <ul className="check-list">
                <li>
                  <span className="badge-ok" aria-hidden="true"><Check size={16} strokeWidth={2.5} /></span>
                  <span><strong>SÍ:</strong> Aplica cuando el suelo tenga buena humedad (inicio de lluvias) para activar la vida del suelo.</span>
                </li>
                <li>
                  <span className="badge-ok" aria-hidden="true"><Check size={16} strokeWidth={2.5} /></span>
                  <span><strong>SÍ:</strong> Tapa ligeramente el abono sólido con tierra u hojarasca en laderas para evitar que el agua lo arrastre.</span>
                </li>
                <li>
                  <span className="badge-no" aria-hidden="true"><X size={16} strokeWidth={2.5} /></span>
                  <span><strong>NO:</strong> No pegues el abono directamente al tallo del cafeto; siempre respeta la zona de gotera (10–15 cm).</span>
                </li>
                <li>
                  <span className="badge-no" aria-hidden="true"><X size={16} strokeWidth={2.5} /></span>
                  <span><strong>NO:</strong> No apliques el bioestimulante foliar a pleno sol del mediodía; hazlo en horas frescas de la mañana o tarde.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
