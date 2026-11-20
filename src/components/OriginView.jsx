import React from 'react';
import { MapPin, MessageCircle, QrCode, Calculator } from 'lucide-react';

export default function OriginView({ site, origin, onNavigate, onOpenQr }) {
  const o = origin || {};
  const faqs = Array.isArray(o.faqs) ? o.faqs : [];

  return (
    <section id="view-origen" className="view-page active" data-view="origen">
      <div className="section section-dark">
        <div className="container">
          <div className="origin-grid">
            <div>
              <span className="eyebrow">
                <MapPin size={15} aria-hidden="true" />
                Origen &amp; Trazabilidad
              </span>
              <h1>{o.headline || 'Del corazón de Algeciras, Huila, con rostro campesino'}</h1>
              <p style={{ color: 'rgba(251, 248, 243, 0.82)', marginBottom: '16px' }}>
                {o.story1}
              </p>
              <p style={{ color: 'rgba(251, 248, 243, 0.82)', margin: 0 }}>
                Respaldado por el trabajo de <strong>{site.producerName}</strong> en la <strong>{site.farmName}</strong> ({site.location}), garantizamos trazabilidad de origen y un peso ergonómico de 25 kg adaptado a nuestras montañas.
              </p>
            </div>

            <div className="trace-card">
              <div className="trace-row">
                <span>Productor</span>
                <strong>{site.producerName} · {site.farmName}</strong>
              </div>
              <div className="trace-row">
                <span>Ubicación</span>
                <strong>{site.location}</strong>
              </div>
              <div className="trace-row">
                <span>Trazabilidad</span>
                <strong>Origen Verificado · Proceso Controlado</strong>
              </div>
              <div className="trace-row">
                <span>Enfoque Productivo</span>
                <strong>100% Economía Circular Cafetera</strong>
              </div>
              <div className="trace-row">
                <span>Canales de Distribución</span>
                <strong>Venta directa en finca y almacenes agrícolas</strong>
              </div>
            </div>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <h2 style={{ fontSize: '1.05rem', margin: '0 0 8px', color: '#A3E6B9' }}>Para tu bolsillo</h2>
              <p>Reduce la dependencia y el gasto en fertilizantes químicos costosos, optimizando la rentabilidad con la dosis exacta de 3 kg por árbol.</p>
            </div>
            <div className="benefit-card">
              <h2 style={{ fontSize: '1.05rem', margin: '0 0 8px', color: '#A3E6B9' }}>Para tu suelo</h2>
              <p>Aporta materia orgánica viva, mejora la aireación y retiene humedad clave durante épocas de verano o variabilidad climática.</p>
            </div>
            <div className="benefit-card">
              <h2 style={{ fontSize: '1.05rem', margin: '0 0 8px', color: '#A3E6B9' }}>Para comercializadores</h2>
              <p>Producto estandarizado, con empaque limpio con ventana visible, guía QR automática y respaldo local para almacenes de insumos en Algeciras.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="section-header center">
            <span className="eyebrow">Dudas Rápidas y Contacto</span>
            <h2>Preguntas frecuentes y pedidos</h2>
            <p>Respuestas claras para caficultores, jornaleros y distribuidores de insumos agrícolas.</p>
          </div>

          <div className="faq-list" style={{ marginBottom: '40px' }}>
            {faqs.map((item, idx) => (
              <details key={idx} className="faq-item" open={idx === 0}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>

          <div
            id="contacto-card"
            style={{
              textAlign: 'center',
              maxWidth: '720px',
              margin: '0 auto',
              background: 'var(--bg-sand)',
              padding: '32px 24px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)'
            }}
          >
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: '0 0 10px' }}>
              {o.contactTitle || '¿Listo para probar Ecocaff en tu lote?'}
            </h3>
            <p style={{ color: 'var(--text-muted)', margin: '0 0 22px' }}>
              Escríbenos al <strong>+{site.whatsapp}</strong> para cotizar bultos de 25 kg, bioestimulante líquido de 1 L o alianzas comerciales.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
              <a
                href={`https://wa.me/${site.whatsapp}?text=Hola%20Ecocaff%2C%20quiero%20informaci%C3%B3n%20sobre%20pedidos%20y%20precios%20en%20Algeciras.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Escribir por WhatsApp
              </a>
              <button type="button" className="btn btn-primary" onClick={onOpenQr}>
                <QrCode size={18} aria-hidden="true" />
                Generar y descargar QR
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => onNavigate('calculadora')}>
                <Calculator size={18} aria-hidden="true" />
                Ir a la calculadora
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
