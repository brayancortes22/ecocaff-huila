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

export default function GuideView() {
  const [tab, setTab] = useState('solido');

  return (
    <section id="view-guia" className="view-page active" data-view="guia">
      <div className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">
              <BookOpen size={15} aria-hidden="true" />
              Guía de Uso Paso a Paso
            </span>
            <h1>¿Cómo se usa Ecocaff en tu cafetal?</h1>
            <p>Elige el producto que tienes en la mano para ver las instrucciones exactas de preparación, aplicación y cuidado en campo.</p>
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
                <p>Aplica de <strong>2 a 3 veces al año</strong> (cosecha principal y traviesa), idealmente <strong>5 a 15 días antes de floración</strong> y al inicio del llenado de grano, con el suelo húmedo.</p>
              </article>
              <article className="step-card">
                <div className="step-icon" aria-hidden="true">
                  <Scale size={20} />
                </div>
                <h3>2. Mide la dosis por árbol</h3>
                <p>Aplica <strong>3 kg por árbol en producción</strong> (1 bulto de 25 kg alcanza para ~8 palos). En árboles jóvenes o zoca en levante usa <strong>1 a 1.5 kg por postura</strong>.</p>
              </article>
              <article className="step-card">
                <div className="step-icon" aria-hidden="true">
                  <Mountain size={20} />
                </div>
                <h3>3. Media luna en zona de gotera</h3>
                <p>Retira <strong>10 a 15 cm del tallo</strong> (donde cae el agua de las hojas). En ladera, haz una zanja en <strong>media luna en la parte alta</strong>, deposita el abono y tapa con tierra u hojarasca.</p>
              </article>
              <article className="step-card">
                <div className="step-icon" aria-hidden="true">
                  <ShieldCheck size={20} />
                </div>
                <h3>4. Guarda el bulto bajo techo</h3>
                <p>Mantén los sacos en lugar seco, ventilado y a la sombra para proteger los microorganismos benéficos. Usa guantes al manipular a granel.</p>
              </article>
            </div>
          ) : (
            <div id="panel-guide-liquido" role="tabpanel" aria-labelledby="tab-guide-liquido" className="steps-grid">
              <article className="step-card">
                <div className="step-icon" aria-hidden="true">
                  <FlaskConical size={20} />
                </div>
                <h3>1. Agita y mide en la ranura</h3>
                <p>Agita suavemente el envase beige antes de usar y mide la cantidad exacta usando la <strong>ranura lateral graduada (200–800 ml)</strong> sin desperdiciar producto.</p>
              </article>
              <article className="step-card">
                <div className="step-icon" aria-hidden="true">
                  <Droplets size={20} />
                </div>
                <h3>2. Diluye en bomba de 20 L</h3>
                <p>Mezcla de <strong>1 a 2 litros de Ecocaff Líquido</strong> en una bomba de espalda de <strong>20 litros de agua limpia</strong> (dilución al 5% – 10%).</p>
              </article>
              <article className="step-card">
                <div className="step-icon" aria-hidden="true">
                  <Sprout size={20} />
                </div>
                <h3>3. Aplica foliar o en drench</h3>
                <p>Aplica en <strong>foliar</strong> sobre las hojas (mañana temprano o al caer la tarde) o en <strong>drench</strong> directo a la zona de gotera de la raíz.</p>
              </article>
              <article className="step-card">
                <div className="step-icon" aria-hidden="true">
                  <Sun size={20} />
                </div>
                <h3>4. Cierra bien y protege del sol</h3>
                <p>Asegura la tapa marrón después de medir y conserva el envase en un lugar fresco y a la sombra. Complementa con el sólido en pre-floración.</p>
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
                  src="/assets/esquema-media-luna.jpg"
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
