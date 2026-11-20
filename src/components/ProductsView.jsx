import React from 'react';
import { Package, Check } from 'lucide-react';

export default function ProductsView({ catalog }) {
  const { solid, liquid } = catalog;
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
                <img src={solid.image} alt={solid.name} width="1200" height="900" loading="lazy" />
              </div>
              <div className="product-body">
                <span className="product-tag">{solid.tag}</span>
                <h2>{solid.name}</h2>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.94rem' }}>
                  {solid.description}
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
                    {String(solid.ingredients || '').split(',').filter((s) => s.trim()).map((item) => (
                      <span key={item} className="chip">{item.trim()}</span>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <article className="product-card">
              <div className="product-img">
                <img src={liquid.image} alt={liquid.name} width="1200" height="900" loading="lazy" />
              </div>
              <div className="product-body">
                <span className="product-tag">{liquid.tag}</span>
                <h2>{liquid.name}</h2>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.94rem' }}>
                  {liquid.description}
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
                    {String(liquid.ingredients || '').split(',').filter((s) => s.trim()).map((item) => (
                      <span key={item} className="chip">{item.trim()}</span>
                    ))}
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
