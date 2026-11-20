import React, { useState } from 'react';
import { BookOpen, Package, Droplets, Check, X } from 'lucide-react';

export default function GuideView({ guide }) {
  const [tab, setTab] = useState('solido');
  const g = guide || {};
  const solidSteps = Array.isArray(g.solidSteps) ? g.solidSteps : [];
  const liquidSteps = Array.isArray(g.liquidSteps) ? g.liquidSteps : [];
  const checklist = Array.isArray(g.checklist) ? g.checklist : [];
  const currentSteps = tab === 'solido' ? solidSteps : liquidSteps;

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
              aria-controls="panel-guide-steps"
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
              aria-controls="panel-guide-steps"
              onClick={() => setTab('liquido')}
            >
              <Droplets size={16} aria-hidden="true" />
              Bioestimulante Líquido (1 L)
            </button>
          </div>

          <div
            id="panel-guide-steps"
            role="tabpanel"
            aria-labelledby={tab === 'solido' ? 'tab-guide-solido' : 'tab-guide-liquido'}
            className="steps-grid"
          >
            {currentSteps.map((step, idx) => (
              <article key={idx} className="step-card">
                <div className="step-icon" aria-hidden="true">
                  <strong style={{ fontSize: '0.95rem' }}>{idx + 1}</strong>
                </div>
                <h3>{idx + 1}. {step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>

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
                {checklist.map((item, idx) => (
                  <li key={idx}>
                    {item.type === 'ok' ? (
                      <span className="badge-ok" aria-hidden="true"><Check size={16} strokeWidth={2.5} /></span>
                    ) : (
                      <span className="badge-no" aria-hidden="true"><X size={16} strokeWidth={2.5} /></span>
                    )}
                    <span><strong>{item.type === 'ok' ? 'SÍ:' : 'NO:'}</strong> {item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
