import React from 'react';
import { Package, Check } from 'lucide-react';

export default function ProductsView() {
  return (
    <section id="view-productos" className="view-page active" data-view="productos">
      <div className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">
              <Package size={15} aria-hidden="true" />
              Portafolio Ecocaff
            </span>
            <h1>Dos líneas diseñadas para la economía circular del café</h1>
            <p>Transformamos la pulpa y subproductos del beneficio del café en Algeciras en nutrición viva, estandarizada y fácil de transportar en ladera.</p>
          </div>

          <div className="products-grid">
            <article className="product-card">
              <div className="product-img">
                <img src="/assets/ecocaff-solido.jpg" alt="Bulto de 25 kg de Abono Orgánico Natural Ecocaff en papel kraft" width="1200" height="900" loading="lazy" />
              </div>
              <div className="product-body">
                <span className="product-tag">Presentación Sólida · Bulto 25 kg</span>
                <h2>Abono Orgánico Natural (Tipo Bocashi)</h2>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.94rem' }}>
                  Empaque ergonómico de 25 kg en papel kraft con ventana vertical transparente para verificar textura, color oscuro y humedad antes de abrir.
                </p>

                <ul className="spec-list">
                  <li>
                    <Check size={16} aria-hidden="true" />
                    <span><strong>Dosis en producción:</strong> 3 kg por árbol (1 bulto = ~8 árboles).</span>
                  </li>
                  <li>
                    <Check size={16} aria-hidden="true" />
                    <span><strong>Dosis en levante / zoca:</strong> 1 a 1.5 kg por árbol.</span>
                  </li>
                  <li>
                    <Check size={16} aria-hidden="true" />
                    <span><strong>Aporte agronómico:</strong> Mejora retención de humedad, estructura del suelo y aumenta rendimiento de forma rentable.</span>
                  </li>
                </ul>

                <div>
                  <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Composición transparente:</strong>
                  <div className="ingredients-chips">
                    <span className="chip">Pulpa/cáscara de café</span>
                    <span className="chip">Gallinaza</span>
                    <span className="chip">Tierra fértil</span>
                    <span className="chip">Carbón triturado</span>
                    <span className="chip">Salvado de arroz</span>
                    <span className="chip">Ceniza vegetal</span>
                    <span className="chip">Melaza / Panela</span>
                    <span className="chip">Microorganismos de montaña</span>
                  </div>
                </div>
              </div>
            </article>

            <article className="product-card">
              <div className="product-img">
                <img src="/assets/ecocaff-liquido.jpg" alt="Botella ergonómica de 1 litro de Bioestimulante Líquido Orgánico Ecocaff" width="1200" height="900" loading="lazy" />
              </div>
              <div className="product-body">
                <span className="product-tag">Presentación Líquida · Envase 1 L</span>
                <h2>Bioestimulante Líquido Orgánico (Biolixiviado)</h2>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.94rem' }}>
                  Envase beige mate ergonómico con tapa de seguridad marrón y ranura lateral graduada (200–800 ml) para medir con precisión en campo.
                </p>

                <ul className="spec-list">
                  <li>
                    <Check size={16} aria-hidden="true" />
                    <span><strong>Dilución recomendada:</strong> 1 a 2 litros por bomba de espalda de 20 L (mezcla al 5% – 10%).</span>
                  </li>
                  <li>
                    <Check size={16} aria-hidden="true" />
                    <span><strong>Modo de aplicación:</strong> Foliar sobre el follaje o en drench directo a la base del árbol.</span>
                  </li>
                  <li>
                    <Check size={16} aria-hidden="true" />
                    <span><strong>Complemento ideal:</strong> Refuerza la floración y el llenado de fruto junto al abono sólido.</span>
                  </li>
                </ul>

                <div>
                  <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Composición transparente:</strong>
                  <div className="ingredients-chips">
                    <span className="chip">Lixiviado de café fermentado</span>
                    <span className="chip">Microorganismos nativos</span>
                    <span className="chip">Melaza activadora</span>
                    <span className="chip">Nutrientes solubles naturales</span>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
