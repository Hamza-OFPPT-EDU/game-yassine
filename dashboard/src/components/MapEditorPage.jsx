import { useState } from 'react';
import { useChallenges } from '../hooks/useContent';
import { 
  Plus, Map as MapIcon, ChevronUp, ChevronDown, 
  Trash2, Eye, EyeOff, Palette, Save, RefreshCw,
  Landmark, ImageIcon
} from 'lucide-react';
import ImageUploader from './cms/ImageUploader';


const ICON_OPTIONS = [
  // Landmarks (Local PNGs on Mobile)
  { value: 'rabat', label: 'Tour Hassan', emoji: '🕌', type: 'landmark' },
  { value: 'marrakech', label: 'Koutoubia', emoji: '🕌', type: 'landmark' },
  { value: 'fes', label: 'Bou Inania', emoji: '🏛️', type: 'landmark' },
  { value: 'chefchaouen', label: 'Outa el Hammam', emoji: '🏙️', type: 'landmark' },
  { value: 'laayoune', label: 'Grand Palais', emoji: '🏛️', type: 'landmark' },
  { value: 'dakhla', label: 'Phare', emoji: '🗼', type: 'landmark' },
  
  // Services (Material Icons on Mobile)
  { value: 'material:hospital-building', label: 'Hôpital', emoji: '🏥', type: 'service' },
  { value: 'material:school', label: 'École', emoji: '🏫', type: 'service' },
  { value: 'material:gavel', label: 'Tribunal', emoji: '⚖️', type: 'service' },
  { value: 'material:restaurant', label: 'Restaurant', emoji: '🍴', type: 'service' },
  
  // Emojis (Direct Emojis on Mobile)
  { value: 'emoji:🎨', label: 'Art', emoji: '🎨', type: 'emoji' },
  { value: 'emoji:⚽', label: 'Sport', emoji: '⚽', type: 'emoji' },
  { value: 'emoji:🌴', label: 'Oasis', emoji: '🌴', type: 'emoji' },
  { value: 'emoji:👜', label: 'Artisanat', emoji: '👜', type: 'emoji' },
];

export default function MapEditorPage() {
  const { challenges, loading, save, remove, refresh } = useChallenges();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  const handleMove = async (index, direction) => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= challenges.length) return;

    const list = [...challenges];
    const temp = list[index].sort_order;
    
    // Swap sort_orders
    list[index].sort_order = list[newIdx].sort_order;
    list[newIdx].sort_order = temp;

    await Promise.all([save(list[index]), save(list[newIdx])]);
    refresh();
  };

  const handleEdit = (city) => {
    setEditingId(city.id);
    setFormData(city);
  };

  const handleSave = async () => {
    await save(formData);
    setEditingId(null);
    refresh();
  };

  if (loading) return (
    <div className="loading-state">
      <div className="spinner" />
      <p>Chargement de la carte...</p>
    </div>
  );

  return (
    <div className="map-editor fade-in">
      <div className="cms-section-header">
        <div>
          <h2 className="cms-section-title">🗺️ Éditeur de Carte</h2>
          <p className="cms-section-sub">Gérez les villes, leur ordre d'apparition et leurs caractéristiques visuelles</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-ghost" onClick={refresh}>
            <RefreshCw size={16} />
          </button>
          <button className="btn btn-primary" onClick={() => handleEdit({ city_name_fr: 'Nouvelle Ville', sort_order: challenges.length })}>
            <Plus size={16} /> Ajouter une ville
          </button>
        </div>
      </div>

      <div className="map-grid">
        {challenges.sort((a,b) => a.sort_order - b.sort_order).map((city, idx) => (
          <div key={city.id} className={`map-city-card ${editingId === city.id ? 'editing' : ''}`}>
            <div className="card-drag-handle">
              <button disabled={idx === 0} onClick={() => handleMove(idx, 'up')}><ChevronUp size={18} /></button>
              <span className="order-badge">{city.sort_order}</span>
              <button disabled={idx === challenges.length-1} onClick={() => handleMove(idx, 'down')}><ChevronDown size={18} /></button>
            </div>

            <div className="city-visual">
              <div 
                className="city-color-preview" 
                style={{ backgroundColor: city.city_color || '#735c00' }} 
              />
              <div className="city-main-info">
                {editingId === city.id ? (
                  <input 
                    className="edit-input-title"
                    value={formData.city_name_fr}
                    onChange={e => setFormData({...formData, city_name_fr: e.target.value})}
                  />
                ) : (
                  <h3>{city.city_name_fr} <span className="city-id-tag">{city.city_id}</span></h3>
                )}
                <p className="city-headline">{city.headline_fr}</p>
              </div>
            </div>

            <div className="city-actions">
              {editingId === city.id ? (
                <>
                  <div className="edit-fields">
                    <div className="field">
                      <label>ID Technique</label>
                      <input value={formData.city_id} onChange={e => setFormData({...formData, city_id: e.target.value})} />
                    </div>
                    <div className="field full-field">
                      <label>Sélectionner l'icône de la ville</label>
                      <div className="icon-selection-tabs">
                        <div className="icon-grid">
                          <div 
                            className={`icon-option ${!formData.icon_name ? 'selected' : ''}`}
                            onClick={() => setFormData({...formData, icon_name: null})}
                          >
                            <div className="icon-preview-circle empty">
                              <MapIcon size={20} />
                            </div>
                            <span>Défaut</span>
                          </div>
                          {ICON_OPTIONS.map(opt => (
                            <div 
                              key={opt.value}
                              className={`icon-option ${formData.icon_name === opt.value ? 'selected' : ''}`}
                              onClick={() => setFormData({...formData, icon_name: opt.value})}
                            >
                              <div className="icon-preview-circle">
                                <span className="emoji-icon">{opt.emoji}</span>
                              </div>
                              <span>{opt.label}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="custom-upload-section">
                           <label className="sub-label">Ou téléverser un logo personnalisé</label>
                           <ImageUploader 
                             value={formData.icon_name?.startsWith('http') ? formData.icon_name : ''} 
                             onChange={(url) => setFormData({...formData, icon_name: url})}
                             folder={`city-icons/${formData.city_id || 'new'}`}
                           />
                        </div>
                      </div>
                    </div>

                    <div className="field">
                      <label>Aperçu du Node</label>
                      <div className="node-preview-container">
                        <div className="node-preview-glow" style={{ backgroundColor: (formData.city_color || '#735c00') + '40' }} />
                        <div className="node-preview-main" style={{ backgroundColor: formData.city_color || '#735c00' }}>
                           <span className="preview-icon">
                             {formData.icon_name?.startsWith('http') ? (
                               <img src={formData.icon_name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="icon" />
                             ) : formData.icon_name ? (
                               ICON_OPTIONS.find(o => o.value === formData.icon_name)?.emoji || '📍'
                             ) : '📍'}
                           </span>
                        </div>
                        <div className="preview-label">{formData.city_name_fr}</div>
                      </div>
                    </div>

                    <div className="field">
                      <label>Couleur (Hex)</label>
                      <div className="color-input-group">
                        <input type="color" value={formData.city_color || '#735c00'} onChange={e => setFormData({...formData, city_color: e.target.value})} />
                        <input value={formData.city_color} onChange={e => setFormData({...formData, city_color: e.target.value})} />
                      </div>
                    </div>
                  </div>
                  <div className="edit-buttons">
                    <button className="btn btn-primary btn-sm" onClick={handleSave}><Save size={14} /> Enregistrer</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>Annuler</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="status-icons">
                    {city.is_published ? <Eye size={16} className="published" /> : <EyeOff size={16} className="draft" />}
                    <span className="mission-count">{(city.missions || []).length} missions</span>
                    {city.icon_name && <span className="icon-badge">📍 {city.icon_name}</span>}
                  </div>
                  <div className="card-btns">
                    <button className="btn-icon" onClick={() => handleEdit(city)}><Palette size={16} /></button>
                    <button className="btn-icon text-error" onClick={() => remove(city.id)}><Trash2 size={16} /></button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .map-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 24px;
        }

        .map-city-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 24px;
          transition: all 0.2s ease;
        }

        .map-city-card:hover {
          border-color: var(--primary);
          transform: translateX(4px);
        }

        .map-city-card.editing {
          border-color: var(--primary);
          background: var(--background);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        .card-drag-handle {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px;
          background: var(--background);
          border-radius: 12px;
          border: 1px solid var(--border);
        }

        .card-drag-handle button {
          background: none;
          border: none;
          color: var(--on-surface-variant);
          cursor: pointer;
          opacity: 0.5;
        }

        .card-drag-handle button:hover:not(:disabled) {
          opacity: 1;
          color: var(--primary);
        }

        .order-badge {
          font-weight: 800;
          font-size: 1.1rem;
          color: var(--primary);
        }

        .city-visual {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .city-color-preview {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .city-main-info h3 {
          font-weight: 700;
          margin-bottom: 4px;
        }

        .city-id-tag {
          font-size: 0.75rem;
          opacity: 0.4;
          font-family: monospace;
          margin-left: 8px;
        }

        .city-headline {
          font-size: 0.9rem;
          color: var(--on-surface-variant);
        }

        .city-actions {
          display: flex;
          align-items: center;
          gap: 24px;
          padding-left: 24px;
          border-left: 1px solid var(--border);
        }

        .status-icons {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .published { color: #10b981; }
        .draft { color: #6b7280; }

        .mission-count, .icon-badge {
          background: var(--background);
          padding: 4px 10px;
          border-radius: 20px;
          opacity: 0.7;
          font-size: 0.75rem;
        }

        .icon-badge {
          border: 1px solid var(--primary);
          color: var(--primary);
          opacity: 1;
        }

        .card-btns {
          display: flex;
          gap: 8px;
        }

        .edit-fields {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: 10px;
        }
        
        .full-field { width: 100%; }

        .icon-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 12px;
          margin-top: 8px;
          padding: 12px;
          background: var(--bg-elevated);
          border-radius: 12px;
          border: 1px solid var(--border-light);
        }

        .icon-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          transition: var(--transition);
          opacity: 0.7;
        }

        .icon-option:hover {
          background: var(--bg-hover);
          opacity: 1;
        }

        .icon-option.selected {
          background: var(--primary);
          color: white;
          opacity: 1;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
        }

        .icon-preview-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--bg-surface);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          border: 1px solid var(--border-light);
        }

        .icon-option.selected .icon-preview-circle {
          background: white;
          border-color: transparent;
        }

        .icon-option span {
          font-size: 0.65rem;
          font-weight: 700;
          text-align: center;
        }

        /* Node Preview */
        .node-preview-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 20px;
          background: var(--bg-elevated);
          border-radius: 16px;
          border: 1px dashed var(--border);
          position: relative;
          min-width: 140px;
        }

        .node-preview-main {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          border: 2px solid white;
        }

        .node-preview-glow {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          filter: blur(15px);
          z-index: 1;
          top: 7px;
        }

        .preview-icon { font-size: 24px; }
        .preview-label {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .field label {
          display: block;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          margin-bottom: 8px;
          color: var(--primary-light);
        }

        .field input {
          width: 160px;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid var(--border-light);
          background: var(--bg-surface);
          color: var(--text-primary);
          font-size: 0.85rem;
        }

        .color-input-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .color-input-group input[type="color"] {
          width: 40px;
          height: 40px;
          padding: 0;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
        }

        .edit-buttons {
          padding: 20px 0;
          display: flex;
          gap: 12px;
          width: 100%;
          justify-content: flex-end;
          border-top: 1px solid var(--border-light);
          margin-top: 20px;
        }
        
        .icon-selection-tabs {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
        }

        .custom-upload-section {
          background: var(--bg-elevated);
          padding: 16px;
          border-radius: 12px;
          border: 1px dashed var(--border);
        }

        .sub-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 700;
          margin-bottom: 12px;
          opacity: 0.6;
        }

        .preview-icon img {
          width: 32px;
          height: 32px;
          border-radius: 4px;
        }

        .edit-input-title {

          font-size: 1.5rem;
          font-weight: 800;
          border: none;
          border-bottom: 2px solid var(--primary);
          background: none;
          color: var(--text-primary);
          width: 100%;
          padding-bottom: 8px;
          margin-bottom: 12px;
        }

        .text-error { color: var(--danger); }

      `}</style>
    </div>
  );
}
