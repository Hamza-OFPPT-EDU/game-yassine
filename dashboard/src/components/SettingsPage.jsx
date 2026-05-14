import { useState } from 'react';
import { useSettings } from '../hooks/useContent';
import { Save, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const { settings, loading, save, refresh } = useSettings();
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleUpdateSetting = async (setting, newValue) => {
    try {
      setSaving(true);
      await save({ ...setting, value: newValue });
      setFeedback({ type: 'success', text: `Paramètre "${setting.key}" mis à jour.` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback({ type: 'error', text: "Erreur lors de la mise à jour." });
    } finally {
      setSaving(false);
    }
  };

  const renderValueEditor = (setting) => {
    const isArray = Array.isArray(setting.value);
    const isObject = typeof setting.value === 'object' && !isArray;

    if (isArray) {
      return (
        <div className="settings-list-editor">
          {setting.value.map((item, idx) => (
            <div key={idx} className="settings-list-item">
              <input 
                type="text" 
                value={item} 
                onChange={(e) => {
                  const newArr = [...setting.value];
                  newArr[idx] = e.target.value;
                  handleUpdateSetting(setting, newArr);
                }}
              />
            </div>
          ))}
          <button 
            className="btn btn-ghost btn-sm"
            onClick={() => handleUpdateSetting(setting, [...setting.value, "Nouveau"])}
          >
            + Ajouter un élément
          </button>
        </div>
      );
    }

    if (isObject) {
      return (
        <div className="settings-object-editor">
          {Object.entries(setting.value).map(([key, val]) => (
            <div key={key} className="settings-form-group">
              <label>{key}</label>
              <input 
                type={typeof val === 'number' ? 'number' : 'text'}
                value={val} 
                onChange={(e) => {
                  const newVal = typeof val === 'number' ? Number(e.target.value) : e.target.value;
                  handleUpdateSetting(setting, { ...setting.value, [key]: newVal });
                }}
              />
            </div>
          ))}
        </div>
      );
    }

    const isBoolean = typeof setting.value === 'boolean' || 
                      (typeof setting.value === 'string' && ['true', 'false'].includes(setting.value.trim().toLowerCase())) ||
                      setting.key === 'dev_show_quick_nav';

    if (isBoolean) {
      const boolValue = typeof setting.value === 'boolean' 
        ? setting.value 
        : (typeof setting.value === 'string' ? setting.value.trim().toLowerCase() === 'true' : !!setting.value);

      return (
        <div className="settings-checkbox-editor">
          <label className="checkbox-container">
            <input 
              type="checkbox" 
              checked={boolValue} 
              onChange={(e) => handleUpdateSetting(setting, e.target.checked)}
            />
            <span className="checkmark"></span>
            <span className="checkbox-label">{boolValue ? 'Activé' : 'Désactivé'}</span>
          </label>
        </div>
      );
    }

    return (
      <input 
        type="text" 
        className="form-input"
        value={setting.value} 
        onChange={(e) => handleUpdateSetting(setting, e.target.value)}
      />
    );
  };

  if (loading) return (
    <div className="loading-state">
      <div className="spinner" />
      <p>Chargement des réglages...</p>
    </div>
  );

  return (
    <div className="settings-page fade-in">
      <div className="cms-section-header">
        <div>
          <h2 className="cms-section-title">⚙️ Paramètres Généraux</h2>
          <p className="cms-section-sub">Personnalisez le contenu et le comportement global de l'application</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={refresh}>
            <RefreshCw size={16} /> Rafraîchir
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`alert alert-${feedback.type} slide-in`}>
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {feedback.text}
        </div>
      )}

      {/* Global Toggle Section */}
      <div className="global-controls-section mb-8">
        <div className="card-glass p-6 border-primary-light/20 bg-primary-light/5 rounded-2xl">
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-primary-light animate-pulse"></div>
                <h3 className="text-lg font-bold text-text-primary">Exploration Libre Globale</h3>
              </div>
              <p className="text-sm text-text-muted">
                Activez ce mode pour débloquer instantanément toutes les villes et missions pour <strong>tous les joueurs</strong>, sans condition de score.
              </p>
            </div>
            <div className="flex items-center gap-4 px-6 py-3 bg-white/5 rounded-xl border border-white/10">
              <span className={`text-sm font-bold ${settings.find(s => s.key === 'global_free_exploration')?.value === true ? 'text-green-400' : 'text-text-muted'}`}>
                {settings.find(s => s.key === 'global_free_exploration')?.value === true ? 'ACTIF' : 'INACTIF'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={settings.find(s => s.key === 'global_free_exploration')?.value === true}
                  onChange={async (e) => {
                    const existing = settings.find(s => s.key === 'global_free_exploration');
                    if (existing) {
                      await handleUpdateSetting(existing, e.target.checked);
                    } else {
                      // Create new setting
                      try {
                        setSaving(true);
                        await save({
                          key: 'global_free_exploration',
                          value: e.target.checked,
                          description: 'Débloque toutes les villes et missions pour tous les utilisateurs.'
                        });
                        setFeedback({ type: 'success', text: "Mode exploration globale initialisé." });
                        setTimeout(() => setFeedback(null), 3000);
                      } catch (err) {
                        setFeedback({ type: 'error', text: "Erreur d'initialisation (vérifiez les droits RLS)." });
                      } finally {
                        setSaving(false);
                      }
                    }
                  }}
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-light"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Screen Config Section */}
      <div className="welcome-config-section mb-8">
        <div className="card-glass p-8 border-primary-light/10 bg-white/5 rounded-[32px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-light/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-primary-light/10 rounded-2xl">
              <RefreshCw size={24} className="text-primary-light" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-text-primary tracking-tight">🎨 Personnalisation de l'Accueil</h3>
              <p className="text-sm text-text-muted">Modifiez les textes et styles de l'écran WelcomeScreen du jeu</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form Side */}
            <div className="space-y-8">
              {/* Title Config */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-primary-light/60">Titre Principal</label>
                <input 
                  type="text"
                  className="cms-input w-full"
                  placeholder="Bienvenue Voyageur"
                  value={settings.find(s => s.key === 'welcome_screen_content')?.value?.title || ''}
                  onChange={(e) => {
                    const existing = settings.find(s => s.key === 'welcome_screen_content');
                    const newValue = { 
                      ...(existing?.value || { title: '', subtitle: '', titleStyle: {}, subtitleStyle: {} }),
                      title: e.target.value 
                    };
                    if (existing) handleUpdateSetting(existing, newValue);
                    else save({ key: 'welcome_screen_content', value: newValue, description: 'Contenu et styles de WelcomeScreen' });
                  }}
                />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-text-muted mb-1 block">Couleur</label>
                    <input 
                      type="color"
                      className="w-full h-10 rounded-lg bg-transparent border border-white/10 cursor-pointer"
                      value={settings.find(s => s.key === 'welcome_screen_content')?.value?.titleStyle?.color || '#ffffff'}
                      onChange={(e) => {
                        const existing = settings.find(s => s.key === 'welcome_screen_content');
                        const newValue = { 
                          ...(existing?.value || {}),
                          titleStyle: { ...(existing?.value?.titleStyle || {}), color: e.target.value }
                        };
                        handleUpdateSetting(existing, newValue);
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-text-muted mb-1 block">Taille (rem)</label>
                    <input 
                      type="number" step="0.1"
                      className="cms-input w-full"
                      value={parseFloat(settings.find(s => s.key === 'welcome_screen_content')?.value?.titleStyle?.fontSize) || 1.1}
                      onChange={(e) => {
                        const existing = settings.find(s => s.key === 'welcome_screen_content');
                        const newValue = { 
                          ...(existing?.value || {}),
                          titleStyle: { ...(existing?.value?.titleStyle || {}), fontSize: `${e.target.value}rem` }
                        };
                        handleUpdateSetting(existing, newValue);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Subtitle Config */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-primary-light/60">Sous-titre (Description)</label>
                <textarea 
                  className="cms-input w-full h-24 resize-none"
                  placeholder="Développe ton potentiel..."
                  value={settings.find(s => s.key === 'welcome_screen_content')?.value?.subtitle || ''}
                  onChange={(e) => {
                    const existing = settings.find(s => s.key === 'welcome_screen_content');
                    const newValue = { 
                      ...(existing?.value || {}),
                      subtitle: e.target.value 
                    };
                    handleUpdateSetting(existing, newValue);
                  }}
                />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-text-muted mb-1 block">Couleur</label>
                    <input 
                      type="color"
                      className="w-full h-10 rounded-lg bg-transparent border border-white/10 cursor-pointer"
                      value={settings.find(s => s.key === 'welcome_screen_content')?.value?.subtitleStyle?.color || '#ffffffcc'}
                      onChange={(e) => {
                        const existing = settings.find(s => s.key === 'welcome_screen_content');
                        const newValue = { 
                          ...(existing?.value || {}),
                          subtitleStyle: { ...(existing?.value?.subtitleStyle || {}), color: e.target.value }
                        };
                        handleUpdateSetting(existing, newValue);
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-text-muted mb-1 block">Taille (rem)</label>
                    <input 
                      type="number" step="0.1"
                      className="cms-input w-full"
                      value={parseFloat(settings.find(s => s.key === 'welcome_screen_content')?.value?.subtitleStyle?.fontSize) || 0.9}
                      onChange={(e) => {
                        const existing = settings.find(s => s.key === 'welcome_screen_content');
                        const newValue = { 
                          ...(existing?.value || {}),
                          subtitleStyle: { ...(existing?.value?.subtitleStyle || {}), fontSize: `${e.target.value}rem` }
                        };
                        handleUpdateSetting(existing, newValue);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Side */}
            <div className="bg-black/40 rounded-[24px] border border-white/10 p-8 flex flex-col items-center justify-center relative min-h-[300px]">
              <div className="absolute top-4 left-4 flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
              </div>
              <span className="absolute top-4 right-6 text-[10px] font-bold text-white/20 uppercase tracking-widest">Aperçu direct</span>
              
              <div className="max-w-[280px] text-center space-y-4">
                <div className="w-16 h-16 bg-primary-light/20 rounded-2xl mx-auto flex items-center justify-center mb-6 border border-primary-light/30">
                  <span className="text-2xl">🧭</span>
                </div>
                <h4 style={{ 
                  color: settings.find(s => s.key === 'welcome_screen_content')?.value?.titleStyle?.color || 'white',
                  fontSize: settings.find(s => s.key === 'welcome_screen_content')?.value?.titleStyle?.fontSize || '1.125rem'
                }} className="font-black uppercase tracking-tight">
                  {settings.find(s => s.key === 'welcome_screen_content')?.value?.title || 'Bienvenue Voyageur'}
                </h4>
                <p style={{ 
                  color: settings.find(s => s.key === 'welcome_screen_content')?.value?.subtitleStyle?.color || 'rgba(255,255,255,0.8)',
                  fontSize: settings.find(s => s.key === 'welcome_screen_content')?.value?.subtitleStyle?.fontSize || '0.9375rem'
                }} className="font-bold leading-relaxed">
                  {settings.find(s => s.key === 'welcome_screen_content')?.value?.subtitle || 'Développe ton potentiel avec la famille Ben Ali...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Developer Info Section */}
      <div className="dev-info-config-section mb-8">
        <div className="card-glass p-8 border-primary-light/10 bg-white/5 rounded-[32px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-light/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-primary-light/10 rounded-2xl">
              <Users size={24} className="text-primary-light" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-text-primary tracking-tight">👨‍💻 Informations Développeur</h3>
              <p className="text-sm text-text-muted">Gérez les informations affichées dans le profil utilisateur</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form Side */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-primary-light/60">Nom du Développeur</label>
                <input 
                  type="text"
                  className="cms-input w-full"
                  value={settings.find(s => s.key === 'developer_info')?.value?.name || ''}
                  onChange={(e) => {
                    const existing = settings.find(s => s.key === 'developer_info');
                    const newValue = { ...(existing?.value || {}), name: e.target.value };
                    if (existing) handleUpdateSetting(existing, newValue);
                    else save({ key: 'developer_info', value: newValue, description: 'Infos développeur' });
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-primary-light/60">URL Photo (Avatar)</label>
                <input 
                  type="text"
                  className="cms-input w-full"
                  value={settings.find(s => s.key === 'developer_info')?.value?.photo_url || ''}
                  onChange={(e) => {
                    const existing = settings.find(s => s.key === 'developer_info');
                    const newValue = { ...(existing?.value || {}), photo_url: e.target.value };
                    handleUpdateSetting(existing, newValue);
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-primary-light/60">Lien LinkedIn</label>
                <input 
                  type="text"
                  className="cms-input w-full"
                  value={settings.find(s => s.key === 'developer_info')?.value?.linkedin_url || ''}
                  onChange={(e) => {
                    const existing = settings.find(s => s.key === 'developer_info');
                    const newValue = { ...(existing?.value || {}), linkedin_url: e.target.value };
                    handleUpdateSetting(existing, newValue);
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-primary-light/60">URL Photo QR Code (LinkedIn)</label>
                <input 
                  type="text"
                  className="cms-input w-full"
                  value={settings.find(s => s.key === 'developer_info')?.value?.qr_code_url || ''}
                  onChange={(e) => {
                    const existing = settings.find(s => s.key === 'developer_info');
                    const newValue = { ...(existing?.value || {}), qr_code_url: e.target.value };
                    handleUpdateSetting(existing, newValue);
                  }}
                />
              </div>
            </div>

            {/* Preview Side */}
            <div className="bg-black/40 rounded-[24px] border border-white/10 p-8 flex flex-col items-center justify-center relative min-h-[300px] text-center">
              <span className="absolute top-4 right-6 text-[10px] font-bold text-white/20 uppercase tracking-widest">Aperçu Profil</span>
              
              <div className="w-24 h-24 rounded-full border-4 border-primary-light/30 overflow-hidden mb-4">
                <img 
                  src={settings.find(s => s.key === 'developer_info')?.value?.photo_url || 'https://via.placeholder.com/150'} 
                  className="w-full h-full object-cover"
                  alt="Dev Preview"
                />
              </div>
              <h4 className="text-xl font-black text-white mb-2">
                {settings.find(s => s.key === 'developer_info')?.value?.name || 'Nom Développeur'}
              </h4>
              
              <div className="mt-4 p-2 bg-white rounded-xl">
                <img 
                  src={settings.find(s => s.key === 'developer_info')?.value?.qr_code_url || 'https://via.placeholder.com/100'} 
                  className="w-24 h-24 object-contain"
                  alt="QR Preview"
                />
              </div>
              <p className="text-[10px] font-bold text-white/40 mt-2 uppercase tracking-widest">QR Code LinkedIn</p>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-grid">
        {settings.filter(s => s.key !== 'global_free_exploration').map(s => (
          <div key={s.id} className="settings-card">
            <div className="settings-card-header">
              <h3 className="settings-key">{s.key.replace(/_/g, ' ')}</h3>
              <span className="settings-id">ID: {s.id.slice(0, 8)}</span>
            </div>
            <p className="settings-desc">{s.description}</p>
            <div className="settings-editor">
              {renderValueEditor(s)}
            </div>
            <div className="settings-card-footer">
              <span className="last-updated">Dernière modification : {new Date(s.updated_at).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 24px;
          margin-top: 24px;
        }

        .settings-card {
          background: var(--surface);
          border-radius: 16px;
          padding: 24px;
          border: 1px solid var(--border);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
        }

        .settings-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .settings-key {
          text-transform: capitalize;
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--primary);
        }

        .settings-id {
          font-family: monospace;
          font-size: 0.75rem;
          opacity: 0.5;
        }

        .settings-desc {
          font-size: 0.9rem;
          color: var(--on-surface-variant);
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .settings-editor {
          flex: 1;
        }

        .settings-form-group {
          margin-bottom: 12px;
        }

        .settings-form-group label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
          opacity: 0.7;
        }

        .settings-form-group input {
          width: 100%;
          padding: 10px 14px;
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 0.9rem;
          color: var(--on-surface);
        }

        .settings-list-item {
          margin-bottom: 8px;
        }

        .settings-list-item input {
          width: 100%;
          padding: 8px 12px;
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: 6px;
          font-size: 0.85rem;
        }

        .settings-card-footer {
          margin-top: 24px;
          padding-top: 12px;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .last-updated {
          font-size: 0.7rem;
          opacity: 0.4;
        }

        .alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          font-weight: 500;
        }

        .alert-success {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #10b981;
        }

        .alert-error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #ef4444;
        }

        /* Checkbox Container */
        .settings-checkbox-editor {
          margin: 12px 0;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          position: relative;
          padding-left: 35px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          user-select: none;
          color: var(--on-surface);
        }

        .checkbox-container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .checkmark {
          position: absolute;
          top: -2px;
          left: 0;
          height: 24px;
          width: 24px;
          background-color: var(--border);
          border-radius: 6px;
          transition: all 0.3s;
        }

        .checkbox-container:hover input ~ .checkmark {
          background-color: var(--primary-light);
        }

        .checkbox-container input:checked ~ .checkmark {
          background-color: var(--primary);
        }

        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }

        .checkbox-container input:checked ~ .checkmark:after {
          display: block;
        }

        .checkbox-container .checkmark:after {
          left: 9px;
          top: 5px;
          width: 6px;
          height: 12px;
          border: solid white;
          border-width: 0 3px 3px 0;
          transform: rotate(45deg);
        }

        .checkbox-label {
          margin-left: 4px;
        }
      `}</style>
    </div>
  );
}
