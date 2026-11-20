import React, { useState } from 'react';
import { Settings, Upload, RotateCcw, Save, Globe, CheckCircle2, AlertCircle } from 'lucide-react';

function compressImageFile(file, maxWidth = 900) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.84));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminView({ catalog, onSaveLocal, onResetLocal, onNavigate }) {
  const [draft, setDraft] = useState(catalog);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [ghToken, setGhToken] = useState(() => localStorage.getItem('ecocaff_gh_token') || '');
  const [publishing, setPublishing] = useState(false);

  const handleFieldChange = (key, field, value) => {
    setDraft((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  const handleFileUpload = async (key, e, targetField = 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');
    try {
      const dataUrl = await compressImageFile(file);
      handleFieldChange(key, targetField, dataUrl);
      setStatusMsg('Foto cargada. Pulsa “Guardar vista previa” o “Publicar en la web”.');
    } catch {
      setErrorMsg('No se pudo procesar esa imagen. Prueba con otro archivo JPG o PNG.');
    }
  };

  const handleSavePreview = () => {
    setErrorMsg('');
    onSaveLocal(draft);
    setStatusMsg('Cambios guardados en este dispositivo. Puedes verlos en la pestaña Productos.');
  };

  const handleReset = () => {
    setErrorMsg('');
    onResetLocal();
    setStatusMsg('Se restauraron las fotos y textos originales.');
  };

  const handlePublishGitHub = async () => {
    if (!ghToken.trim()) {
      setErrorMsg('Ingresa un token de GitHub con permiso de repositorio para publicar para todos.');
      return;
    }
    setErrorMsg('');
    setPublishing(true);
    setStatusMsg('Publicando cambios en GitHub y Vercel…');
    try {
      localStorage.setItem('ecocaff_gh_token', ghToken.trim());
      const apiBase = 'https://api.github.com/repos/brayancortes22/ecocaff-huila/contents/public/catalog.json';
      const headers = {
        Authorization: `Bearer ${ghToken.trim()}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      };

      const getRes = await fetch(apiBase, { headers });
      if (!getRes.ok) {
        throw new Error('No se pudo leer public/catalog.json en GitHub. Verifica el token.');
      }
      const fileData = await getRes.json();
      const jsonText = JSON.stringify(draft, null, 2);
      const encodedContent = btoa(unescape(encodeURIComponent(jsonText)));

      const putRes = await fetch(apiBase, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          message: 'chore(cms): update product photos and info from admin panel',
          content: encodedContent,
          sha: fileData.sha,
          branch: 'main'
        })
      });

      if (!putRes.ok) {
        throw new Error('No se pudo guardar en GitHub. Revisa permisos del token.');
      }

      onSaveLocal(draft);
      setStatusMsg('¡Publicado! Vercel actualizará la web oficial en unos 20–30 segundos.');
    } catch (err) {
      setErrorMsg(err.message || 'Error al publicar en GitHub.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <section id="view-admin" className="view-page active" data-view="admin">
      <div className="section">
        <div className="container" style={{ maxWidth: '920px' }}>
          <div className="section-header">
            <span className="eyebrow">
              <Settings size={15} aria-hidden="true" />
              Panel de Administración · CRM Básico
            </span>
            <h1>Editar fotos y textos de productos</h1>
            <p>Cambia las imágenes de los productos desde tu celular o computador, previsualiza al instante y publícalas en la web oficial.</p>
          </div>

          {statusMsg && (
            <div className="admin-alert success" role="status" aria-live="polite">
              <CheckCircle2 size={18} aria-hidden="true" />
              <span>{statusMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="admin-alert error" role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="admin-grid">
            {[
              { key: 'solid', label: 'Producto 1 · Abono Sólido (25 kg)' },
              { key: 'liquid', label: 'Producto 2 · Bioestimulante Líquido (1 L)' }
            ].map(({ key, label }) => (
              <article key={key} className="admin-card">
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.22rem', margin: '0 0 14px' }}>{label}</h2>

                <div className="admin-preview-img">
                  <img src={draft[key].image} alt={draft[key].name} width="300" height="400" />
                </div>

                <label className="admin-upload-btn">
                  <Upload size={16} aria-hidden="true" />
                  <span>Subir nueva foto desde dispositivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => handleFileUpload(key, e)}
                  />
                </label>

                <label htmlFor={`img-url-${key}`} className="admin-label">O pega una URL de imagen:</label>
                <input
                  id={`img-url-${key}`}
                  name={`img-url-${key}`}
                  type="text"
                  className="field-input"
                  value={draft[key].image}
                  onChange={(e) => handleFieldChange(key, 'image', e.target.value)}
                  autoComplete="off"
                />

                <label htmlFor={`name-${key}`} className="admin-label">Nombre del producto:</label>
                <input
                  id={`name-${key}`}
                  name={`name-${key}`}
                  type="text"
                  className="field-input"
                  value={draft[key].name}
                  onChange={(e) => handleFieldChange(key, 'name', e.target.value)}
                />

                <label htmlFor={`desc-${key}`} className="admin-label">Descripción corta:</label>
                <textarea
                  id={`desc-${key}`}
                  name={`desc-${key}`}
                  rows={3}
                  className="field-input admin-textarea"
                  value={draft[key].description}
                  onChange={(e) => handleFieldChange(key, 'description', e.target.value)}
                />
              </article>
            ))}
          </div>

          <div className="admin-card" style={{ marginTop: '20px' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.22rem', margin: '0 0 14px' }}>
              Información general de la web
            </h2>

            <div className="admin-grid">
              <div>
                <label className="admin-label" style={{ marginTop: 0 }}>Logo oficial:</label>
                <div className="admin-preview-img" style={{ aspectRatio: '16 / 9' }}>
                  <img src={draft.site.logoImage} alt="Logo Ecocaff" width="240" height="135" />
                </div>
                <label className="admin-upload-btn">
                  <Upload size={16} aria-hidden="true" />
                  <span>Cambiar logo</span>
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleFileUpload('site', e, 'logoImage')} />
                </label>
              </div>

              <div>
                <label className="admin-label" style={{ marginTop: 0 }}>Foto principal de portada:</label>
                <div className="admin-preview-img" style={{ aspectRatio: '16 / 9' }}>
                  <img src={draft.site.heroImage} alt="Portada Ecocaff" width="240" height="135" />
                </div>
                <label className="admin-upload-btn">
                  <Upload size={16} aria-hidden="true" />
                  <span>Cambiar foto de portada</span>
                  <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleFileUpload('site', e, 'heroImage')} />
                </label>
              </div>
            </div>

            <div className="admin-grid" style={{ marginTop: '14px' }}>
              <div>
                <label htmlFor="site-farm" className="admin-label">Nombre de la finca:</label>
                <input id="site-farm" name="site-farm" type="text" className="field-input" value={draft.site.farmName} onChange={(e) => handleFieldChange('site', 'farmName', e.target.value)} />
              </div>
              <div>
                <label htmlFor="site-producer" className="admin-label">Nombre del productor / dueño:</label>
                <input id="site-producer" name="site-producer" type="text" className="field-input" value={draft.site.producerName} onChange={(e) => handleFieldChange('site', 'producerName', e.target.value)} />
              </div>
              <div>
                <label htmlFor="site-location" className="admin-label">Ubicación / Vereda:</label>
                <input id="site-location" name="site-location" type="text" className="field-input" value={draft.site.location} onChange={(e) => handleFieldChange('site', 'location', e.target.value)} />
              </div>
              <div>
                <label htmlFor="site-wa" className="admin-label">WhatsApp (solo números con indicativo 57):</label>
                <input id="site-wa" name="site-wa" type="text" inputMode="numeric" className="field-input" value={draft.site.whatsapp} onChange={(e) => handleFieldChange('site', 'whatsapp', e.target.value)} />
              </div>
            </div>

            <label htmlFor="site-lead" className="admin-label">Texto de bienvenida en portada:</label>
            <textarea id="site-lead" name="site-lead" rows={2} className="field-input admin-textarea" value={draft.site.heroLead} onChange={(e) => handleFieldChange('site', 'heroLead', e.target.value)} />
          </div>

          <div className="admin-actions-bar">
            <button type="button" className="btn btn-primary" onClick={handleSavePreview}>
              <Save size={18} aria-hidden="true" />
              Guardar vista previa
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => onNavigate('productos')}>
              Ver en Productos
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              <RotateCcw size={18} aria-hidden="true" />
              Restaurar originales
            </button>
          </div>

          <div className="admin-publish-box">
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', margin: '0 0 6px' }}>
              Publicar cambios para todos los clientes (Opcional)
            </h2>
            <p style={{ margin: '0 0 12px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Para que las fotos nuevas las vea cualquier caficultor que escanee el QR desde otro celular, ingresa un token de GitHub del repositorio <code>brayancortes22/ecocaff-huila</code> y pulsa publicar.
            </p>
            <div className="input-row">
              <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                <label htmlFor="gh-token-input" className="sr-only">Token de GitHub</label>
                <input
                  id="gh-token-input"
                  name="gh-token"
                  type="password"
                  className="field-input"
                  value={ghToken}
                  onChange={(e) => setGhToken(e.target.value)}
                  placeholder="Token de GitHub (ghp_…)…"
                  autoComplete="off"
                />
              </div>
              <button type="button" className="btn btn-whatsapp" onClick={handlePublishGitHub} disabled={publishing}>
                <Globe size={18} aria-hidden="true" />
                {publishing ? 'Publicando…' : 'Publicar en la web oficial'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
