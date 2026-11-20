import React, { useState } from 'react';
import { Calculator, MessageCircle } from 'lucide-react';

const WHATSAPP_PHONE = '573132208657';

export default function CalculatorView() {
  const [countMode, setCountMode] = useState('trees');
  const [treesInput, setTreesInput] = useState('1000');
  const [hectaresInput, setHectaresInput] = useState('1');
  const [density, setDensity] = useState(5000);
  const [stage, setStage] = useState('produccion');
  const [product, setProduct] = useState('ambos');
  const [strategy, setStrategy] = useState('100');
  const [terrain, setTerrain] = useState('ladera');

  const trees = countMode === 'trees'
    ? Math.max(1, parseInt(treesInput, 10) || 0)
    : Math.round(Math.max(0.1, parseFloat(hectaresInput) || 0) * density);

  const factor = strategy === '100' ? 1 : 0.5;
  const kgPerTree = stage === 'produccion' ? 3 : 1.25;
  const totalKg = Math.round(trees * kgPerTree * factor);
  const sacks = Math.max(1, Math.ceil(totalKg / 25));

  const pumps = Math.max(1, Math.ceil((trees / 40) * factor));
  const litersMin = pumps * 1;
  const litersMax = pumps * 2;
  const litersSuggested = Math.ceil(pumps * 1.5);

  const stageLabel = stage === 'produccion' ? 'en producción' : 'en levante / zoca joven';
  const strategyLabel = strategy === '100' ? 'manejo 100% orgánico' : 'transición (50% Ecocaff + 50% tradicional)';

  const summaryParts = [];
  if (product === 'solido' || product === 'ambos') {
    summaryParts.push(`${sacks.toLocaleString('es-CO')} bultos de Ecocaff Sólido`);
  }
  if (product === 'liquido' || product === 'ambos') {
    summaryParts.push(`${litersSuggested.toLocaleString('es-CO')} L de Bioestimulante Líquido`);
  }

  const waText = encodeURIComponent(
    `Hola equipo Ecocaff, escaneé el código QR y calculé mi dosis para ${trees.toLocaleString('es-CO')} palos (${stageLabel}, terreno ${terrain}): necesito ${summaryParts.join(' y ')}. ¿Me ayudan con disponibilidad y precio en Algeciras?`
  );

  return (
    <section id="view-calculadora" className="view-page active" data-view="calculadora">
      <div className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">
              <Calculator size={15} aria-hidden="true" />
              Herramienta de Campo
            </span>
            <h1>Calcula cuántos bultos o litros necesita tu lote</h1>
            <p>Responde estas 5 preguntas rápidas con el lenguaje de tu finca para obtener la dosis exacta sin desperdiciar dinero.</p>
          </div>

          <div className="calc-wrapper">
            <div className="calc-form">
              <div className="q-block">
                <div className="q-label">
                  <span className="q-num">1</span>
                  <span>¿Cuántos palos (árboles) de café tiene el lote que vas a abonar?</span>
                </div>
                <div className="mode-tabs" role="tablist" aria-label="Método para ingresar cantidad de palos">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={countMode === 'trees'}
                    className={`mode-tab ${countMode === 'trees' ? 'active' : ''}`}
                    onClick={() => setCountMode('trees')}
                  >
                    Sé cuántos palos tengo
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={countMode === 'hectares'}
                    className={`mode-tab ${countMode === 'hectares' ? 'active' : ''}`}
                    onClick={() => setCountMode('hectares')}
                  >
                    Calcular por hectáreas
                  </button>
                </div>

                {countMode === 'trees' ? (
                  <div>
                    <label htmlFor="input-trees" className="sr-only">Cantidad de palos de café</label>
                    <input
                      type="number"
                      id="input-trees"
                      name="trees"
                      inputMode="numeric"
                      autoComplete="off"
                      className="field-input"
                      min="1"
                      step="10"
                      value={treesInput}
                      onChange={(e) => setTreesInput(e.target.value)}
                      placeholder="Ej. 1000…"
                    />
                    <p className="helper-note">Referencia: 1 bulto de 25 kg alcanza para ~8 árboles adultos (3 kg/árbol).</p>
                  </div>
                ) : (
                  <div>
                    <div className="input-row">
                      <div style={{ flex: '1 1 120px', minWidth: 0 }}>
                        <label htmlFor="input-hectares" className="sr-only">Número de hectáreas</label>
                        <input
                          type="number"
                          id="input-hectares"
                          name="hectares"
                          inputMode="decimal"
                          autoComplete="off"
                          className="field-input"
                          min="0.2"
                          step="0.5"
                          value={hectaresInput}
                          onChange={(e) => setHectaresInput(e.target.value)}
                          placeholder="Ej. 1.5…"
                        />
                      </div>
                      <div style={{ flex: '1.4 1 180px', minWidth: 0 }}>
                        <label htmlFor="select-density" className="sr-only">Densidad de siembra</label>
                        <select
                          id="select-density"
                          name="density"
                          className="field-select"
                          value={density}
                          onChange={(e) => setDensity(parseInt(e.target.value, 10))}
                        >
                          <option value={5000}>Cafetal tecnificado (~5.000 palos/ha)</option>
                          <option value={1100}>Cafetal tradicional (~1.100 palos/ha)</option>
                        </select>
                      </div>
                    </div>
                    <p className="helper-note">Equivale aproximadamente a {trees.toLocaleString('es-CO')} palos de café.</p>
                  </div>
                )}
              </div>

              <div className="q-block">
                <div className="q-label">
                  <span className="q-num">2</span>
                  <span>¿En qué etapa está el cafetal en este momento?</span>
                </div>
                <div className="option-grid cols-2">
                  <button type="button" aria-pressed={stage === 'produccion'} className={`choice-btn ${stage === 'produccion' ? 'active' : ''}`} onClick={() => setStage('produccion')}>
                    <strong>En producción</strong>
                    <span>Pre-floración o llenado (3 kg/árbol)</span>
                  </button>
                  <button type="button" aria-pressed={stage === 'levante'} className={`choice-btn ${stage === 'levante' ? 'active' : ''}`} onClick={() => setStage('levante')}>
                    <strong>Levante / Zoca joven</strong>
                    <span>Árboles en crecimiento (1–1.5 kg/árbol)</span>
                  </button>
                </div>
              </div>

              <div className="q-block">
                <div className="q-label">
                  <span className="q-num">3</span>
                  <span>¿Qué producto Ecocaff vas a aplicar?</span>
                </div>
                <div className="option-grid cols-3">
                  <button type="button" aria-pressed={product === 'ambos'} className={`choice-btn ${product === 'ambos' ? 'active' : ''}`} onClick={() => setProduct('ambos')}>
                    <strong>Paquete Completo</strong>
                    <span>Sólido + Líquido</span>
                  </button>
                  <button type="button" aria-pressed={product === 'solido'} className={`choice-btn ${product === 'solido' ? 'active' : ''}`} onClick={() => setProduct('solido')}>
                    <strong>Solo Sólido</strong>
                    <span>Bocashi 25 kg</span>
                  </button>
                  <button type="button" aria-pressed={product === 'liquido'} className={`choice-btn ${product === 'liquido' ? 'active' : ''}`} onClick={() => setProduct('liquido')}>
                    <strong>Solo Líquido</strong>
                    <span>Biolixiviado 1 L</span>
                  </button>
                </div>
              </div>

              <div className="q-block">
                <div className="q-label">
                  <span className="q-num">4</span>
                  <span>¿Cómo vas a manejar la fertilización?</span>
                </div>
                <div className="option-grid cols-2">
                  <button type="button" aria-pressed={strategy === '100'} className={`choice-btn ${strategy === '100' ? 'active' : ''}`} onClick={() => setStrategy('100')}>
                    <strong>100% Orgánico Ecocaff</strong>
                    <span>Nutrición biológica completa</span>
                  </button>
                  <button type="button" aria-pressed={strategy === '50'} className={`choice-btn ${strategy === '50' ? 'active' : ''}`} onClick={() => setStrategy('50')}>
                    <strong>Transición (Combinado)</strong>
                    <span>50% Ecocaff + 50% tradicional</span>
                  </button>
                </div>
              </div>

              <div className="q-block" style={{ marginBottom: 0 }}>
                <div className="q-label">
                  <span className="q-num">5</span>
                  <span>¿El lote es pendiente (ladera) o plano?</span>
                </div>
                <div className="option-grid cols-2">
                  <button type="button" aria-pressed={terrain === 'ladera'} className={`choice-btn ${terrain === 'ladera' ? 'active' : ''}`} onClick={() => setTerrain('ladera')}>
                    <strong>Ladera / Falda empinada</strong>
                    <span>Aplicación en media luna</span>
                  </button>
                  <button type="button" aria-pressed={terrain === 'plano'} className={`choice-btn ${terrain === 'plano' ? 'active' : ''}`} onClick={() => setTerrain('plano')}>
                    <strong>Plano o semiplano</strong>
                    <span>Aplicación en corona completa</span>
                  </button>
                </div>
              </div>
            </div>

            <aside className="calc-result" aria-live="polite">
              <div>
                <span className="result-badge">Resultado para tu finca</span>
                <p className="result-summary">
                  Para tus {trees.toLocaleString('es-CO')} palos {stageLabel} ({strategyLabel}), necesitas {summaryParts.join(' y ')}.
                </p>

                <div className="result-cards">
                  {(product === 'solido' || product === 'ambos') && (
                    <div className="metric-box">
                      <small>Ecocaff Sólido (Bultos 25 kg)</small>
                      <strong>{sacks.toLocaleString('es-CO')} bultos</strong>
                      <span>{totalKg.toLocaleString('es-CO')} kg totales (25 kg/bulto)</span>
                    </div>
                  )}
                  {(product === 'liquido' || product === 'ambos') && (
                    <div className="metric-box">
                      <small>Ecocaff Líquido (Biolixiviado)</small>
                      <strong>{litersSuggested.toLocaleString('es-CO')} litros</strong>
                      <span>{pumps.toLocaleString('es-CO')} bombas de 20 L (1–2 L c/u, rango {litersMin}–{litersMax} L)</span>
                    </div>
                  )}
                </div>

                <div className="advice-box">
                  {terrain === 'ladera' ? (
                    <><strong>Aplicación en ladera:</strong> Haz una zanja en <em>media luna</em> en la parte alta del palo, a 10–15 cm del tallo (zona de gotera), deposita la dosis y tapa con tierra u hojarasca para que la lluvia no lave el abono. El bulto de 25 kg facilita cargarlo en faldas empinadas.</>
                  ) : (
                    <><strong>Aplicación en terreno plano:</strong> Distribuye el abono en corona alrededor de la zona de gotera (10–15 cm retirado del tallo) e incorpóralo ligeramente al suelo para proteger los microorganismos benéficos del sol directo.</>
                  )}
                </div>

                <div className="advice-box">
                  <strong>Cuándo aplicar:</strong> Realiza de 2 a 3 aplicaciones al año (cosecha principal y traviesa). El mejor momento es <strong>5 a 15 días antes de la floración</strong> y al inicio del <strong>llenado del fruto</strong>, aprovechando humedad en el suelo.
                </div>
              </div>

              <a
                id="btn-whatsapp-order"
                href={`https://wa.me/${WHATSAPP_PHONE}?text=${waText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{ width: '100%' }}
              >
                <MessageCircle size={18} aria-hidden="true" />
                Solicitar esta dosis por WhatsApp
              </a>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
