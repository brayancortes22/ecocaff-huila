import React from 'react';
import { MapPin, MessageCircle, QrCode, Calculator } from 'lucide-react';

export default function OriginView({ onNavigate, onOpenQr }) {
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
              <h1>Del corazón de Algeciras, Huila, con rostro campesino</h1>
              <p style={{ color: 'rgba(251, 248, 243, 0.82)', marginBottom: '16px' }}>
                <strong>Ecocaff</strong> nace para resolver dos dolores reales del caficultor huilense: el alto costo de los fertilizantes sintéticos importados y la pérdida ambiental de la pulpa de café durante el beneficio.
              </p>
              <p style={{ color: 'rgba(251, 248, 243, 0.82)', margin: 0 }}>
                Respaldado por el trabajo de <strong>Hoyden Espinosa</strong> en la <strong>Finca Buenos Aires</strong> (Vereda El Vergel), garantizamos trazabilidad de origen y un peso ergonómico de 25 kg adaptado a nuestras montañas.
              </p>
            </div>

            <div className="trace-card">
              <div className="trace-row">
                <span>Productor</span>
                <strong>Hoyden Espinosa · Finca Buenos Aires</strong>
              </div>
              <div className="trace-row">
                <span>Ubicación</span>
                <strong>Vereda El Vergel, Algeciras (Huila)</strong>
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
            <details className="faq-item" open>
              <summary>¿Puedo combinar Ecocaff con mi fertilización tradicional?</summary>
              <p>Sí. Puedes usar Ecocaff como reemplazo 100% orgánico o en manejo integrado (transición), combinando la dosis orgánica con una fracción reducida de fertilizante químico mientras el suelo recupera su actividad biológica.</p>
            </details>
            <details className="faq-item">
              <summary>¿Sirve para otros cultivos además del café?</summary>
              <p>Sí, aunque la dosificación principal está calibrada para café en Algeciras, su base de Bocashi y biolixiviado también beneficia frutales y cultivos de pancoger de la región. Para cultivos distintos al café se recomienda ajustar según análisis de suelo.</p>
            </details>
            <details className="faq-item">
              <summary>¿Por qué la presentación sólida viene en bultos de 25 kg?</summary>
              <p>Porque 25 kg es un peso ergonómico diseñado pensando en la salud del trabajador rural y en el transporte por caminos y laderas empinadas, rindiendo exactamente para unos 8 árboles adultos.</p>
            </details>
            <details className="faq-item">
              <summary>¿Cómo puedo ser punto de venta o aliado comercial en Algeciras?</summary>
              <p>Si tienes un almacén de insumos agrícolas o deseas hacer un pedido directo para tu finca o vereda, escríbenos por WhatsApp para coordinar precios de distribuidor, entregas y muestras demostrativas.</p>
            </details>
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
              ¿Listo para probar Ecocaff en tu lote?
            </h3>
            <p style={{ color: 'var(--text-muted)', margin: '0 0 22px' }}>
              Escríbenos al <strong>+57 313 2208657</strong> para cotizar bultos de 25 kg, bioestimulante líquido de 1 L o alianzas comerciales.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
              <a
                href="https://wa.me/573132208657?text=Hola%20Ecocaff%2C%20quiero%20informaci%C3%B3n%20sobre%20pedidos%20y%20precios%20en%20Algeciras."
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
