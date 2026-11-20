import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Copy, Check, QrCode } from 'lucide-react';

const DEFAULT_QR_URL = 'https://ecocaff-huila.vercel.app';

export default function QrShareModal({ isOpen, onClose }) {
  const [url, setUrl] = useState(DEFAULT_QR_URL);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const closeBtnRef = useRef(null);
  const prevFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    QRCode.toDataURL(url || DEFAULT_QR_URL, {
      width: 320,
      margin: 2,
      color: {
        dark: '#231710',
        light: '#FFFFFF'
      }
    })
      .then((dataUrl) => {
        if (active) setQrDataUrl(dataUrl);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [url, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    prevFocusRef.current = document.activeElement;
    closeBtnRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      prevFocusRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="qr-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="qr-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeBtnRef} type="button" className="qr-modal-close" onClick={onClose} aria-label="Cerrar ventana QR">
          <X size={18} aria-hidden="true" />
        </button>

        <span className="eyebrow" style={{ justifyContent: 'center' }}>
          <QrCode size={15} aria-hidden="true" />
          Código QR para Empaques
        </span>
        <h2 id="qr-modal-title" style={{ fontFamily: 'var(--font-serif)', margin: '0 0 6px', fontSize: '1.35rem' }}>
          Comparte la guía oficial de Ecocaff
        </h2>
        <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Descarga este QR en alta resolución para imprimirlo en el bulto de 25 kg o en el envase de 1 L.
        </p>

        <div className="qr-canvas-box">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Código QR de Ecocaff" width="220" height="220" />
          ) : (
            <div style={{ width: 220, height: 220, display: 'grid', placeItems: 'center' }}>Generando QR…</div>
          )}
          <strong style={{ fontSize: '0.82rem', color: 'var(--green-forest)' }}>ESCANEA PARA TU GUÍA DE CULTIVO</strong>
        </div>

        <label htmlFor="qr-url-field" className="sr-only">Enlace del código QR</label>
        <input
          id="qr-url-field"
          name="qr-url"
          type="url"
          className="qr-url-input"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://ecocaff-huila.vercel.app…"
          autoComplete="off"
        />

        <div className="qr-actions">
          {qrDataUrl && (
            <a href={qrDataUrl} download="ecocaff-qr-empaque.png" className="btn btn-primary" style={{ minHeight: 44, padding: '0 18px', fontSize: '0.86rem' }}>
              <Download size={16} aria-hidden="true" />
              Descargar QR (PNG)
            </a>
          )}
          <button type="button" className="btn btn-secondary" onClick={handleCopy} style={{ minHeight: 44, padding: '0 18px', fontSize: '0.86rem' }}>
            {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            <span aria-live="polite">{copied ? '¡Enlace copiado!' : 'Copiar enlace'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
