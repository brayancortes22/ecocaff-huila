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
  MapPin,
  Eye,
  EyeOff,
  Plus,
  Trash2
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
        const keepAlpha = file.type === 'image/png' || file.type === 'image/webp';
        resolve(canvas.toDataURL(keepAlpha ? 'image/webp' : 'image/jpeg', keepAlpha ? 0.9 : 0.84));
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
  { id: 'origen', label: '5. Origen y FAQ', Icon: MapPin }
];

export default function AdminView({ catalog, onSaveLocal, onResetLocal, onNavigate }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        body: JSON.stringify({ action: 'login', password: password.trim() })
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

  const handleFileUpload = async (onDataUrl, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg('');
    try {
      const dataUrl = await compressImageFile(file);
      onDataUrl(dataUrl);
      setStatusMsg('Imagen cargada. Pulsa “Guardar vista previa” o “Publicar para todos”.');
    } catch {
      setErrorMsg('No se pudo procesar la imagen. Intenta con otro JPG o PNG.');
    }
  };

  // Product list helpers
  const updateProduct = (index, field, value) => {
    setDraft((prev) => {
      const next = [...prev.products];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, products: next };
    });
  };

  const addProduct = () => {
    setDraft((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          id: `prod-${Date.now()}`,
          modelType: 'bottle',
          tag: 'Nuevo Producto',
          name: 'Nombre del nuevo producto',
          description: 'Descripción corta del producto y su beneficio principal.',
          image: '/assets/ecocaff-solido.jpg',
          specs: ['Dosis recomendada: Por definir.', 'Modo de aplicación: En campo.'],
          ingredients: 'Pulpa de café, Microorganismos nativos'
        }
      ]
    }));
    setStatusMsg('Nuevo producto agregado al final de la lista.');
  };

  const removeProduct = (index) => {
    setDraft((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  // Guide step helpers
  const updateStep = (listKey, index, field, value) => {
    setDraft((prev) => {
      const next = [...prev.guide[listKey]];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, guide: { ...prev.guide, [listKey]: next } };
    });
  };

  const addStep = (listKey) => {
    setDraft((prev) => ({
      ...prev,
      guide: {
        ...prev.guide,
        [listKey]: [...prev.guide[listKey], { title: 'Nuevo paso', text: 'Explica este paso de aplicación de forma clara.' }]
      }
    }));
  };

  const removeStep = (listKey, index) => {
    setDraft((prev) => ({
      ...prev,
      guide: {
        ...prev.guide,
        [listKey]: prev.guide[listKey].filter((_, i) => i !== index)
      }
    }));
  };

  // Checklist helpers
  const updateChecklist = (index, field, value) => {
    setDraft((prev) => {
      const next = [...prev.guide.checklist];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, guide: { ...prev.guide, checklist: next } };
    });
  };

  const addChecklist = () => {
    setDraft((prev) => ({
      ...prev,
      guide: {
        ...prev.guide,
        checklist: [...prev.guide.checklist, { type: 'ok', text: 'Nueva recomendación para la finca.' }]
      }
    }));
  };

  const removeChecklist = (index) => {
    setDraft((prev) => ({
      ...prev,
      guide: {
        ...prev.guide,
        checklist: prev.guide.checklist.filter((_, i) => i !== index)
      }
    }));
  };

  // FAQ helpers
  const updateFaq = (index, field, value) => {
    setDraft((prev) => {
      const next = [...prev.origin.faqs];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, origin: { ...prev.origin, faqs: next } };
    });
  };

  const addFaq = () => {
    setDraft((prev) => ({
      ...prev,
      origin: {
        ...prev.origin,
        faqs: [...prev.origin.faqs, { q: '¿Nueva pregunta frecuente?', a: 'Respuesta clara para el caficultor.' }]
      }
    }));
  };

  const removeFaq = (index) => {
    setDraft((prev) => ({
      ...prev,
      origin: {
        ...prev.origin,
        faqs: prev.origin.faqs.filter((_, i) => i !== index)
      }
    }));
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
        body: JSON.stringify({ action: 'publish', password: password.trim(), catalog: draft })
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
                Ingresa la contraseña de Ecocaff para editar textos, agregar productos, cambiar pasos y publicar en la web oficial.
              </p>

              {errorMsg && (
                <div className="admin-alert error" role="alert" style={{ textAlign: 'left' }}>
                  <AlertCircle size={18} aria-hidden="true" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleLogin}>
                <label htmlFor="admin-pass" className="sr-only">Contraseña de administrador</label>
                <div style={{ position: 'relative', marginBottom: '14px' }}>
                  <input
                    id="admin-pass"
                    name="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    className="field-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña de administrador…"
                    autoComplete="current-password"
                    required
                    style={{ paddingRight: '48px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    style={{
                      position: 'absolute',
                      right: '4px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '40px',
                      height: '40px',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'grid',
                      placeItems: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                  </button>
                </div>
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
        <div className="container" style={{ maxWidth: '1020px' }}>
          <div className="section-header" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '14px', maxWidth: '100%' }}>
            <div>
              <span className="eyebrow">
                <Settings size={15} aria-hidden="true" />
                CRM Ecocaff · Editor por Vistas
              </span>
              <h1>Administrar toda la web</h1>
              <p>Edita textos, fotos o agrega nuevos productos, pasos de guía y preguntas frecuentes.</p>
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
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleFileUpload((url) => handleField('site', 'logoImage', url), e)} />
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
                    <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleFileUpload((url) => handleField('site', 'heroImage', url), e)} />
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

          {/* TAB 3: PRODUCTOS (DINAMICO) */}
          {activeTab === 'productos' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', margin: 0 }}>
                  Productos ({draft.products.length})
                </h2>
                <button type="button" className="btn btn-primary" onClick={addProduct} style={{ minHeight: '44px', padding: '0 16px' }}>
                  <Plus size={18} aria-hidden="true" />
                  Agregar nuevo producto
                </button>
              </div>

              <div className="admin-grid">
                {draft.products.map((prod, idx) => (
                  <article key={prod.id || idx} className="admin-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <strong style={{ fontSize: '1rem' }}>Producto #{idx + 1}</strong>
                      {draft.products.length > 1 && (
                        <button type="button" className="tour-close" onClick={() => removeProduct(idx)} aria-label={`Eliminar producto ${idx + 1}`} style={{ color: 'var(--cherry)' }}>
                          <Trash2 size={18} aria-hidden="true" />
                        </button>
                      )}
                    </div>

                    <div className="admin-preview-img">
                      <img src={prod.image} alt={prod.name} width="300" height="400" />
                    </div>
                    <label className="admin-upload-btn">
                      <Upload size={16} aria-hidden="true" />
                      <span>Subir foto frontal (sin fondo para 3D)</span>
                      <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleFileUpload((url) => updateProduct(idx, 'image', url), e)} />
                    </label>
                    <label className="admin-upload-btn" style={{ background: 'var(--bg-sand)', color: 'var(--bg-espresso)', borderColor: 'rgba(35,23,16,0.25)' }}>
                      <Upload size={16} aria-hidden="true" />
                      <span>Subir foto trasera (para 3D 360°)</span>
                      <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleFileUpload((url) => updateProduct(idx, 'backImage', url), e)} />
                    </label>

                    <label htmlFor={`p-model-${idx}`} className="admin-label">Forma del empaque en 3D:</label>
                    <select
                      id={`p-model-${idx}`}
                      className="field-select"
                      value={prod.modelType || (idx === 1 ? 'bottle' : 'sack')}
                      onChange={(e) => updateProduct(idx, 'modelType', e.target.value)}
                    >
                      <option value="sack">Saco / Bulto (ej. 25 kg)</option>
                      <option value="bottle">Botella / Bidón con asa (ej. 1 L)</option>
                    </select>

                    <label htmlFor={`p-tag-${idx}`} className="admin-label">Etiqueta:</label>
                    <input id={`p-tag-${idx}`} className="field-input" value={prod.tag} onChange={(e) => updateProduct(idx, 'tag', e.target.value)} />

                    <label htmlFor={`p-name-${idx}`} className="admin-label">Nombre:</label>
                    <input id={`p-name-${idx}`} className="field-input" value={prod.name} onChange={(e) => updateProduct(idx, 'name', e.target.value)} />

                    <label htmlFor={`p-desc-${idx}`} className="admin-label">Descripción:</label>
                    <textarea id={`p-desc-${idx}`} rows={3} className="field-input admin-textarea" value={prod.description} onChange={(e) => updateProduct(idx, 'description', e.target.value)} />

                    <label htmlFor={`p-specs-${idx}`} className="admin-label">Especificaciones (una por línea):</label>
                    <textarea
                      id={`p-specs-${idx}`}
                      rows={3}
                      className="field-input admin-textarea"
                      value={(prod.specs || []).join('\n')}
                      onChange={(e) => updateProduct(idx, 'specs', e.target.value.split('\n'))}
                    />

                    <label htmlFor={`p-ing-${idx}`} className="admin-label">Ingredientes (separados por coma):</label>
                    <textarea id={`p-ing-${idx}`} rows={2} className="field-input admin-textarea" value={prod.ingredients || ''} onChange={(e) => updateProduct(idx, 'ingredients', e.target.value)} />
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GUIA DE USO (DINAMICA) */}
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
                <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleFileUpload((url) => handleField('guide', 'diagramImage', url), e)} />
              </label>

              <div className="admin-grid" style={{ marginTop: '18px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong>Pasos Abono Sólido ({draft.guide.solidSteps.length})</strong>
                    <button type="button" className="tour-btn" onClick={() => addStep('solidSteps')}><Plus size={14} /> Agregar paso</button>
                  </div>
                  {draft.guide.solidSteps.map((st, i) => (
                    <div key={i} style={{ background: 'var(--bg-cream)', padding: '12px', borderRadius: '10px', marginBottom: '10px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <small style={{ fontWeight: 700 }}>Paso {i + 1}</small>
                        <button type="button" className="tour-close" onClick={() => removeStep('solidSteps', i)} aria-label="Eliminar paso" style={{ color: 'var(--cherry)' }}><Trash2 size={15} /></button>
                      </div>
                      <input className="field-input" style={{ marginBottom: '6px' }} value={st.title} onChange={(e) => updateStep('solidSteps', i, 'title', e.target.value)} />
                      <textarea rows={2} className="field-input admin-textarea" value={st.text} onChange={(e) => updateStep('solidSteps', i, 'text', e.target.value)} />
                    </div>
                  ))}
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong>Pasos Bioestimulante Líquido ({draft.guide.liquidSteps.length})</strong>
                    <button type="button" className="tour-btn" onClick={() => addStep('liquidSteps')}><Plus size={14} /> Agregar paso</button>
                  </div>
                  {draft.guide.liquidSteps.map((st, i) => (
                    <div key={i} style={{ background: 'var(--bg-cream)', padding: '12px', borderRadius: '10px', marginBottom: '10px', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <small style={{ fontWeight: 700 }}>Paso {i + 1}</small>
                        <button type="button" className="tour-close" onClick={() => removeStep('liquidSteps', i)} aria-label="Eliminar paso" style={{ color: 'var(--cherry)' }}><Trash2 size={15} /></button>
                      </div>
                      <input className="field-input" style={{ marginBottom: '6px' }} value={st.title} onChange={(e) => updateStep('liquidSteps', i, 'title', e.target.value)} />
                      <textarea rows={2} className="field-input admin-textarea" value={st.text} onChange={(e) => updateStep('liquidSteps', i, 'text', e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <strong>Recomendaciones SÍ / NO ({draft.guide.checklist.length})</strong>
                  <button type="button" className="tour-btn" onClick={addChecklist}><Plus size={14} /> Agregar recomendación</button>
                </div>
                {draft.guide.checklist.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                    <select className="field-select" style={{ width: '90px', flexShrink: 0 }} value={c.type} onChange={(e) => updateChecklist(i, 'type', e.target.value)}>
                      <option value="ok">SÍ</option>
                      <option value="no">NO</option>
                    </select>
                    <input className="field-input" value={c.text} onChange={(e) => updateChecklist(i, 'text', e.target.value)} />
                    <button type="button" className="tour-close" onClick={() => removeChecklist(i)} aria-label="Eliminar recomendación" style={{ color: 'var(--cherry)' }}><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ORIGEN Y FAQ (DINAMICO) */}
          {activeTab === 'origen' && (
            <div className="admin-card">
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', margin: '0 0 14px' }}>Vista: Origen, Finca y Preguntas</h2>
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

              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <strong>Preguntas Frecuentes ({draft.origin.faqs.length})</strong>
                  <button type="button" className="tour-btn" onClick={addFaq}><Plus size={14} /> Agregar pregunta</button>
                </div>
                {draft.origin.faqs.map((f, i) => (
                  <div key={i} style={{ background: 'var(--bg-cream)', padding: '12px', borderRadius: '10px', marginBottom: '10px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <small style={{ fontWeight: 700 }}>Pregunta {i + 1}</small>
                      <button type="button" className="tour-close" onClick={() => removeFaq(i)} aria-label="Eliminar pregunta" style={{ color: 'var(--cherry)' }}><Trash2 size={15} /></button>
                    </div>
                    <input className="field-input" style={{ marginBottom: '6px' }} value={f.q} onChange={(e) => updateFaq(i, 'q', e.target.value)} />
                    <textarea rows={2} className="field-input admin-textarea" value={f.a} onChange={(e) => updateFaq(i, 'a', e.target.value)} />
                  </div>
                ))}
              </div>
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
