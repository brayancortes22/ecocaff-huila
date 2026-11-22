import React from 'react';
import { Package, Check, Rotate3d } from 'lucide-react';

export default function ProductsView({ catalog, onNavigate }) {
  const products = Array.isArray(catalog?.products) ? catalog.products : [];

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
            {onNavigate && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onNavigate('demo-3d')}
                style={{ marginTop: '16px' }}
              >
                <Rotate3d size={18} aria-hidden="true" />
                Ver comparativa en 3D (Modo A vs Modo B)
              </button>
            )}
          </div>

          <div className="products-grid">
            {products.map((item, idx) => (
              <article key={item.id || idx} className="product-card">
                <div className="product-img">
                  <img src={item.image} alt={item.name} width="1200" height="900" loading="lazy" />
                </div>
                <div className="product-body">
                  <span className="product-tag">{item.tag}</span>
                  <h2>{item.name}</h2>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.94rem' }}>
                    {item.description}
                  </p>

                  {Array.isArray(item.specs) && item.specs.length > 0 && (
                    <ul className="spec-list">
                      {item.specs.map((spec, sIdx) => (
                        <li key={sIdx}>
                          <Check size={16} aria-hidden="true" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {item.ingredients && (
                    <div>
                      <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Composición transparente:</strong>
                      <div className="ingredients-chips">
                        {String(item.ingredients).split(',').filter((s) => s.trim()).map((ing) => (
                          <span key={ing} className="chip">{ing.trim()}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
