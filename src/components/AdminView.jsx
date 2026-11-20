import React, { useState } from 'react';
import {
  Settings,
  Lock,
  Upload,
  RotateCcw,
  Save,
  Globe,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Home,
  Calculator,
  Package,
  BookOpen,
  MapPin
} from 'lucide-react';

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

const ADMIN_TABS = [
  { id: 'inicio', label: '1. Inicio', Icon: Home },
  { id: 'calculadora', label: '2. Calculadora', Icon: Calculator },
  { id: 'productos', label: '3. Productos', Icon: Package },
  { id: 'guia', label: '4. Guía de Uso', Icon: BookOpen },
  { id: 'origen', label: '5. Origen y Contacto', Icon: MapPin }
];

export default function AdminView({ catalog, onSaveLocal, onResetLocal, onNavigate }) {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('productos');
  const [draft, setDraft] = useState(catalog);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [publishing, setPublishing] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setAuthLoading(true);
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Contraseña incorrecta.');
      }
      setUnlocked(true);
      setStatusMsg('Sesión iniciada. Elige la vista que deseas editar.');
    } catch (err) {
      setErrorMsg(err.message || 'No se pudo verificar la contraseña.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleField = (section, field, value) => {
    setDraft((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileUpload = async (section, field, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');
    try {
      const dataUrl = await compressImageFile(file);
      handleField(section, field, dataUrl);
      setStatusMsg('Imagen cargada. Pulsa “Guardar vista previa” o “Publicar para todos”.');
    } catch {
      setErrorMsg('No se pudo procesar la imagen. Intenta con otro JPG o PNG.');
    }
  };

  const handleSavePreview = () => {
    setErrorMsg('');
    onSaveLocal(draft);
    setStatusMsg('Vista previa guardada en este dispositivo.');
  };

  const handleReset = () => {
    setErrorMsg('');
    onResetLocal();
    setDraft(catalog);
    setStatusMsg('Se restauraron los valores publicados.');
  };

  const handlePublish = async () => {
    setErrorMsg('');
    setPublishing(true);
    setStatusMsg('Publicando cambios en la web oficial…');
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'publish', password, catalog: draft })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo publicar.');
      }
      onSaveLocal(draft);
      setStatusMsg(data.message || '¡Publicado! Vercel actualizará la web en ~25 segundos.');
    } catch (err) {
      setErrorMsg(err.message || 'Error al publicar en el servidor.');
    } finally {
      setPublishing(false);
    }
  };

  if (!unlocked) {
    return (
      <section id="view-admin" className="view-page active" data-view="admin">
        <div className="section">
          <div className="container" style={{ maxWidth: '480px' }}>
            <div className="admin-card" style={{ padding: '32px 26px', textAlign: 'center' }}>
              <div className="step-icon" style={{ margin: '0 auto 14px', width: '52px', height: '52px' }} aria-hidden="true">
                <Lock size={24} />
              </div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', margin: '0 0 8px' }}>
                Acceso Administrador
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '0 0 20px' }}>
                Ingresa la contraseña de Ecocaff para editar textos, dosis, fotos y publicar cambios en la web oficial.
              </p>

              {errorMsg && (
                <div className="admin-alert error" role="alert" style={{ textAlign: 'left' }}>
                  <AlertCircle size={18} aria-hidden="true" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleLogin}>
                <label htmlFor="admin-pass" className="sr-only">Contraseña de administrador</label>
                <input
                  id="admin-pass"
                  name="admin-password"
                  type="password"
                  className="field-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña de administrador…"
                  autoComplete="current-password"
                  required
                  style={{ marginBottom: '14px' }}
                />
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={authLoading}>
                  {authLoading ? 'Verificando…' : 'Entrar al panel'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="view-admin" className="view-page active" data-view="admin">
      <div className="section">
        <div className="container" style={{ maxWidth: '980px' }}>
          <div className="section-header" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px', maxWidth: '100%' }}>
            <div>
              <span className="eyebrow">
                <Settings size={15} aria-hidden="true" />
                CRM Ecocaff · Editor por Vistas
              </span>
              <h1>Administrar toda la web</h1>
              <p>Selecciona la vista que quieres editar, haz los cambios y pulsa <strong>Publicar para todos</strong>.</p>
            </div>
            <button type="button" className="btn btn-secondary" onClick={() => { setUnlocked(false); setPassword(''); }}>
              <LogOut size={16} aria-hidden="true" />
              Cerrar sesión
            </button>
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

          <div className="guide-tabs" role="tablist" aria-label="Vistas editables">
            {ADMIN_TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activeTab === id}
                className={`guide-tab-btn ${activeTab === id ? 'active' : ''}`}
                onClick={() => setActiveTab(id)}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          {/* TAB 1: INICIO */}
          {activeTab === 'inicio' && (
            <div className="admin-card">
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', margin: '0 0 14px' }}>Vista: Inicio y Portada</h2>
              <div className="admin-grid">
                <div>
                  <label className="admin-label" style={{ marginTop: 0 }}>Logo oficial:</label>
                  <div className="admin-preview-img" style={{ aspectRatio: '16 / 9' }}>
                    <img src={draft.site.logoImage} alt="Logo" width="240" height="135" />
                  </div>
                  <label className="admin-upload-btn">
                    <Upload size={16} aria-hidden="true" />
                    <span>Cambiar logo</span>
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleFileUpload('site', 'logoImage', e)} />
                  </label>
                </div>
                <div>
                  <label className="admin-label" style={{ marginTop: 0 }}>Foto principal del cafetal:</label>
                  <div className="admin-preview-img" style={{ aspectRatio: '16 / 9' }}>
                    <img src={draft.site.heroImage} alt="Portada" width="240" height="135" />
                  </div>
                  <label className="admin-upload-btn">
                    <Upload size={16} aria-hidden="true" />
                    <span>Cambiar foto de portada</span>
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleFileUpload('site', 'heroImage', e)} />
                  </label>
                </div>
              </div>

              <label htmlFor="s-badge" className="admin-label">Etiqueta superior:</label>
              <input id="s-badge" className="field-input" value={draft.site.heroBadge} onChange={(e) => handleField('site', 'heroBadge', e.target.value)} />

              <label htmlFor="s-title" className="admin-label">Título principal:</label>
              <input id="s-title" className="field-input" value={draft.site.heroTitle} onChange={(e) => handleField('site', 'heroTitle', e.target.value)} />

              <label htmlFor="s-lead" className="admin-label">Texto de bienvenida:</label>
              <textarea id="s-lead" rows={3} className="field-input admin-textarea" value={draft.site.heroLead} onChange={(e) => handleField('site', 'heroLead', e.target.value)} />

              <div className="admin-grid" style={{ marginTop: '10px' }}>
                <div>
                  <label htmlFor="s-st1v" className="admin-label">Cifra 1:</label>
                  <input id="s-st1v" className="field-input" value={draft.site.stat1Value} onChange={(e) => handleField('site', 'stat1Value', e.target.value)} />
                  <label htmlFor="s-st1l" className="admin-label">Texto 1:</label>
                  <input id="s-st1l" className="field-input" value={draft.site.stat1Label} onChange={(e) => handleField('site', 'stat1Label', e.target.value)} />
                </div>
                <div>
                  <label htmlFor="s-st2v" className="admin-label">Cifra 2:</label>
                  <input id="s-st2v" className="field-input" value={draft.site.stat2Value} onChange={(e) => handleField('site', 'stat2Value', e.target.value)} />
                  <label htmlFor="s-st2l" className="admin-label">Texto 2:</label>
                  <input id="s-st2l" className="field-input" value={draft.site.stat2Label} onChange={(e) => handleField('site', 'stat2Label', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CALCULADORA */}
          {activeTab === 'calculadora' && (
            <div className="admin-card">
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', margin: '0 0 14px' }}>Vista: Calculadora de Dosis</h2>
              <label htmlFor="c-title" className="admin-label">Título de la calculadora:</label>
              <input id="c-title" className="field-input" value={draft.calculator.title} onChange={(e) => handleField('calculator', 'title', e.target.value)} />

              <label htmlFor="c-sub" className="admin-label">Subtítulo:</label>
              <textarea id="c-sub" rows={2} className="field-input admin-textarea" value={draft.calculator.subtitle} onChange={(e) => handleField('calculator', 'subtitle', e.target.value)} />

              <div className="admin-grid" style={{ marginTop: '10px' }}>
                <div>
                  <label htmlFor="c-kgp" className="admin-label">Dosis producción (kg/árbol):</label>
                  <input id="c-kgp" type="number" step="0.1" className="field-input" value={draft.calculator.kgProduccion} onChange={(e) => handleField('calculator', 'kgProduccion', parseFloat(e.target.value) || 3)} />
                </div>
                <div>
                  <label htmlFor="c-kgl" className="admin-label">Dosis levante (kg/árbol):</label>
                  <input id="c-kgl" type="number" step="0.05" className="field-input" value={draft.calculator.kgLevante} onChange={(e) => handleField('calculator', 'kgLevante', parseFloat(e.target.value) || 1.25)} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTOS */}
          {activeTab === 'productos' && (
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
                    <span>Subir nueva foto</span>
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleFileUpload(key, 'image', e)} />
                  </label>
                  <label htmlFor={`p-tag-${key}`} className="admin-label">Etiqueta:</label>
                  <input id={`p-tag-${key}`} className="field-input" value={draft[key].tag} onChange={(e) => handleField(key, 'tag', e.target.value)} />
                  <label htmlFor={`p-name-${key}`} className="admin-label">Nombre:</label>
                  <input id={`p-name-${key}`} className="field-input" value={draft[key].name} onChange={(e) => handleField(key, 'name', e.target.value)} />
                  <label htmlFor={`p-desc-${key}`} className="admin-label">Descripción:</label>
                  <textarea id={`p-desc-${key}`} rows={3} className="field-input admin-textarea" value={draft[key].description} onChange={(e) => handleField(key, 'description', e.target.value)} />
                  <label htmlFor={`p-ing-${key}`} className="admin-label">Ingredientes (separados por coma):</label>
                  <textarea id={`p-ing-${key}`} rows={2} className="field-input admin-textarea" value={draft[key].ingredients} onChange={(e) => handleField(key, 'ingredients', e.target.value)} />
                </article>
              ))}
            </div>
          )}

          {/* TAB 4: GUIA DE USO */}
          {activeTab === 'guia' && (
            <div className="admin-card">
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', margin: '0 0 14px' }}>Vista: Guía de Uso</h2>
              <label htmlFor="g-title" className="admin-label">Título de la guía:</label>
              <input id="g-title" className="field-input" value={draft.guide.title} onChange={(e) => handleField('guide', 'title', e.target.value)} />
              <label htmlFor="g-sub" className="admin-label">Subtítulo:</label>
              <input id="g-sub" className="field-input" value={draft.guide.subtitle} onChange={(e) => handleField('guide', 'subtitle', e.target.value)} />

              <label className="admin-label">Ilustración de media luna en ladera:</label>
              <div className="admin-preview-img" style={{ aspectRatio: '16 / 9' }}>
                <img src={draft.guide.diagramImage} alt="Esquema media luna" width="320" height="180" />
              </div>
              <label className="admin-upload-btn">
                <Upload size={16} aria-hidden="true" />
                <span>Cambiar imagen de esquema</span>
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleFileUpload('guide', 'diagramImage', e)} />
              </label>

              <div className="admin-grid">
                <div>
                  <label htmlFor="gs1" className="admin-label">Sólido · Paso 1:</label>
                  <textarea id="gs1" rows={2} className="field-input admin-textarea" value={draft.guide.solidStep1} onChange={(e) => handleField('guide', 'solidStep1', e.target.value)} />
                  <label htmlFor="gs2" className="admin-label">Sólido · Paso 2:</label>
                  <textarea id="gs2" rows={2} className="field-input admin-textarea" value={draft.guide.solidStep2} onChange={(e) => handleField('guide', 'solidStep2', e.target.value)} />
                  <label htmlFor="gs3" className="admin-label">Sólido · Paso 3:</label>
                  <textarea id="gs3" rows={2} className="field-input admin-textarea" value={draft.guide.solidStep3} onChange={(e) => handleField('guide', 'solidStep3', e.target.value)} />
                  <label htmlFor="gs4" className="admin-label">Sólido · Paso 4:</label>
                  <textarea id="gs4" rows={2} className="field-input admin-textarea" value={draft.guide.solidStep4} onChange={(e) => handleField('guide', 'solidStep4', e.target.value)} />
                </div>
                <div>
                  <label htmlFor="gl1" className="admin-label">Líquido · Paso 1:</label>
                  <textarea id="gl1" rows={2} className="field-input admin-textarea" value={draft.guide.liquidStep1} onChange={(e) => handleField('guide', 'liquidStep1', e.target.value)} />
                  <label htmlFor="gl2" className="admin-label">Líquido · Paso 2:</label>
                  <textarea id="gl2" rows={2} className="field-input admin-textarea" value={draft.guide.liquidStep2} onChange={(e) => handleField('guide', 'liquidStep2', e.target.value)} />
                  <label htmlFor="gl3" className="admin-label">Líquido · Paso 3:</label>
                  <textarea id="gl3" rows={2} className="field-input admin-textarea" value={draft.guide.liquidStep3} onChange={(e) => handleField('guide', 'liquidStep3', e.target.value)} />
                  <label htmlFor="gl4" className="admin-label">Líquido · Paso 4:</label>
                  <textarea id="gl4" rows={2} className="field-input admin-textarea" value={draft.guide.liquidStep4} onChange={(e) => handleField('guide', 'liquidStep4', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ORIGEN Y CONTACTO */}
          {activeTab === 'origen' && (
            <div className="admin-card">
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', margin: '0 0 14px' }}>Vista: Origen, Finca y Contacto</h2>
              <div className="admin-grid">
                <div>
                  <label htmlFor="o-farm" className="admin-label">Nombre de la finca:</label>
                  <input id="o-farm" className="field-input" value={draft.site.farmName} onChange={(e) => handleField('site', 'farmName', e.target.value)} />
                </div>
                <div>
                  <label htmlFor="o-prod" className="admin-label">Productor / Dueño:</label>
                  <input id="o-prod" className="field-input" value={draft.site.producerName} onChange={(e) => handleField('site', 'producerName', e.target.value)} />
                </div>
                <div>
                  <label htmlFor="o-loc" className="admin-label">Ubicación:</label>
                  <input id="o-loc" className="field-input" value={draft.site.location} onChange={(e) => handleField('site', 'location', e.target.value)} />
                </div>
                <div>
                  <label htmlFor="o-wa" className="admin-label">WhatsApp (ej. 573132208657):</label>
                  <input id="o-wa" inputMode="numeric" className="field-input" value={draft.site.whatsapp} onChange={(e) => handleField('site', 'whatsapp', e.target.value)} />
                </div>
              </div>
              <label htmlFor="o-head" className="admin-label">Título de Origen:</label>
              <input id="o-head" className="field-input" value={draft.origin.headline} onChange={(e) => handleField('origin', 'headline', e.target.value)} />
              <label htmlFor="o-st1" className="admin-label">Historia / Propósito:</label>
              <textarea id="o-st1" rows={3} className="field-input admin-textarea" value={draft.origin.story1} onChange={(e) => handleField('origin', 'story1', e.target.value)} />
              <label htmlFor="o-ct" className="admin-label">Título tarjeta de contacto:</label>
              <input id="o-ct" className="field-input" value={draft.origin.contactTitle} onChange={(e) => handleField('origin', 'contactTitle', e.target.value)} />
            </div>
          )}

          <div className="admin-actions-bar">
            <button type="button" className="btn btn-whatsapp" onClick={handlePublish} disabled={publishing}>
              <Globe size={18} aria-hidden="true" />
              {publishing ? 'Publicando en la web…' : 'Publicar para todos'}
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSavePreview}>
              <Save size={18} aria-hidden="true" />
              Guardar vista previa
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => onNavigate(activeTab === 'origen' ? 'origen' : activeTab)}>
              Ver vista actual
            </button>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              <RotateCcw size={18} aria-hidden="true" />
              Restaurar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
