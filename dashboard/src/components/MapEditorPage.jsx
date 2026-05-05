import { useState } from 'react';
import { useChallenges } from '../hooks/useContent';
import { 
  Plus, Map as MapIcon, ChevronUp, ChevronDown, 
  Trash2, Eye, EyeOff, Palette, Save, RefreshCw,
  Landmark, ImageIcon, List
} from 'lucide-react';
import ImageUploader from './cms/ImageUploader';

const ICON_OPTIONS = [
  { value: 'rabat', label: 'Tour Hassan', emoji: '🕌', type: 'landmark' },
  { value: 'marrakech', label: 'Koutoubia', emoji: '🕌', type: 'landmark' },
  { value: 'fes', label: 'Bou Inania', emoji: '🏛️', type: 'landmark' },
  { value: 'chefchaouen', label: 'Outa el Hammam', emoji: '🏙️', type: 'landmark' },
  { value: 'laayoune', label: 'Grand Palais', emoji: '🏛️', type: 'landmark' },
  { value: 'dakhla', label: 'Phare', emoji: '🗼', type: 'landmark' },
  { value: 'material:hospital-building', label: 'Hôpital', emoji: '🏥', type: 'service' },
  { value: 'material:school', label: 'École', emoji: '🏫', type: 'service' },
  { value: 'material:gavel', label: 'Tribunal', emoji: '⚖️', type: 'service' },
  { value: 'material:restaurant', label: 'Restaurant', emoji: '🍴', type: 'service' },
  { value: 'emoji:🎨', label: 'Art', emoji: '🎨', type: 'emoji' },
  { value: 'emoji:⚽', label: 'Sport', emoji: '⚽', type: 'emoji' },
  { value: 'emoji:🌴', label: 'Oasis', emoji: '🌴', type: 'emoji' },
  { value: 'emoji:👜', label: 'Artisanat', emoji: '👜', type: 'emoji' },
];

export default function MapEditorPage() {
  const { challenges, loading, save, remove, refresh } = useChallenges();
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [viewMode, setViewMode] = useState('list');
  const [draggingId, setDraggingId] = useState(null);
  const [mapBg, setMapBg] = useState(localStorage.getItem('map_editor_bg') || '');
  const [showGrid, setShowGrid] = useState(true);

  const handleMove = async (index, direction) => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= challenges.length) return;
    const list = [...challenges];
    const temp = list[index].sort_order;
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
    setDraggingId(null);
    refresh();
  };

  const handleCanvasMouseDown = (e, city) => {
    if (viewMode !== 'visual') return;
    setDraggingId(city.id);
    setFormData(city);
    e.stopPropagation();
  };

  const handleCanvasMouseMove = (e) => {
    if (!draggingId) return;
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const centerX = rect.width / 2;
    const newX = ((mouseX - centerX) / rect.width) * 100;
    const newY = e.clientY - rect.top + canvas.scrollTop;
    setFormData(prev => ({
      ...prev,
      map_x: Math.max(-50, Math.min(50, parseFloat(newX.toFixed(1)))),
      map_y: Math.max(0, Math.min(5000, Math.round(newY)))
    }));
  };

  const handleCanvasMouseUp = async () => {
    if (draggingId) {
      await save(formData);
      setDraggingId(null);
      refresh();
    }
  };

  if (loading) return (
    <div className="loading-state">
      <div className="spinner" />
      <p>Chargement de la carte...</p>
    </div>
  );

  const maxMapY = Math.max(...challenges.map(c => c.map_y || 0), 1000);

  return (
    <div className="map-editor fade-in" onMouseUp={handleCanvasMouseUp}>
      <div className="cms-section-header">
        <div>
          <h2 className="cms-section-title">🗺️ Éditeur de Carte Pro</h2>
          <p className="cms-section-sub">Positionnez vos villes par glisser-déposer et personnalisez l'univers visuel</p>
          <div className="map-view-toggle">
            <button className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><List size={16} /> Liste</button>
            <button className={`toggle-btn ${viewMode === 'visual' ? 'active' : ''}`} onClick={() => setViewMode('visual')}><MapIcon size={16} /> Aperçu Visuel</button>
          </div>
        </div>
        <div className="header-actions">
           {viewMode === 'visual' && (
             <div className="visual-toolbar">
               <button className={`btn btn-sm ${showGrid ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setShowGrid(!showGrid)}><Landmark size={14} /> Grille</button>
               <div className="bg-selector">
                 <ImageIcon size={14} />
                 <input 
                   placeholder="URL Image Fond" 
                   value={mapBg} 
                   onChange={e => { setMapBg(e.target.value); localStorage.setItem('map_editor_bg', e.target.value); }} 
                 />
               </div>
             </div>
           )}
          <button className="btn btn-ghost" onClick={refresh}><RefreshCw size={16} /></button>
          <button className="btn btn-primary" onClick={() => handleEdit({ city_name_fr: 'Nouvelle Ville', sort_order: challenges.length })}><Plus size={16} /> Ajouter une ville</button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="map-grid">
          {[...challenges].sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)).map((city, idx) => (
            <div key={city.id} className={`map-city-card ${editingId === city.id ? 'editing' : ''}`}>
              <div className="card-drag-handle">
                <button disabled={idx === 0} onClick={() => handleMove(idx, 'up')}><ChevronUp size={18} /></button>
                <span className="order-badge">{city.sort_order}</span>
                <button disabled={idx === challenges.length-1} onClick={() => handleMove(idx, 'down')}><ChevronDown size={18} /></button>
              </div>
              <div className="city-visual">
                <div className="city-color-preview" style={{ backgroundColor: city.city_color || '#735c00' }} />
                <div className="city-main-info">
                  {editingId === city.id ? (
                    <input className="edit-input-title" value={formData.city_name_fr} onChange={e => setFormData({...formData, city_name_fr: e.target.value})} />
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
                      <div className="field"><label>ID Technique</label><input value={formData.city_id} onChange={e => setFormData({...formData, city_id: e.target.value})} /></div>
                      <div className="field full-field"><label>Icône</label>
                        <div className="icon-grid">
                          {ICON_OPTIONS.map(opt => (
                            <div key={opt.value} className={`icon-option ${formData.icon_name === opt.value ? 'selected' : ''}`} onClick={() => setFormData({...formData, icon_name: opt.value})}>
                              <div className="icon-preview-circle"><span className="emoji-icon">{opt.emoji}</span></div>
                              <span>{opt.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="field"><label>Couleur</label><input type="color" value={formData.city_color || '#735c00'} onChange={e => setFormData({...formData, city_color: e.target.value})} /></div>
                      <div className="field"><label>X (%)</label><input type="number" value={formData.map_x || 0} onChange={e => setFormData({...formData, map_x: parseFloat(e.target.value)})} step="0.1" /></div>
                      <div className="field"><label>Y (px)</label><input type="number" value={formData.map_y || 0} onChange={e => setFormData({...formData, map_y: parseFloat(e.target.value)})} step="1" /></div>
                      <div className="field"><label>Taille</label><input type="number" value={formData.map_size || 1} onChange={e => setFormData({...formData, map_size: parseFloat(e.target.value)})} step="0.1" /></div>
                    </div>
                    <div className="edit-buttons">
                      <button className="btn btn-primary btn-sm" onClick={handleSave}><Save size={14} /> Enregistrer</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>Annuler</button>
                    </div>
                  </>
                ) : (
                  <div className="card-btns">
                    <button className="btn-icon" onClick={() => handleEdit(city)}><Palette size={16} /></button>
                    <button className="btn-icon text-error" onClick={() => remove(city.id)}><Trash2 size={16} /></button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="map-visual-container">
          <div 
            className={`map-canvas ${showGrid ? 'show-grid' : ''}`}
            onMouseMove={handleCanvasMouseMove}
            style={{ backgroundImage: mapBg ? `url(${mapBg})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <svg className="map-svg-path" viewBox={`0 0 100 ${maxMapY + 200}`} preserveAspectRatio="none" style={{ height: `${maxMapY + 200}px` }}>
              <polyline 
                points={[...challenges].sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)).map(c => {
                  const x = 50 + ((c.id === draggingId ? formData.map_x : c.map_x) || 0);
                  const y = ((c.id === draggingId ? formData.map_y : c.map_y) || 0);
                  return `${x},${y}`;
                }).join(' ')}
                fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" strokeDasharray="1,1"
              />
            </svg>
            {challenges.map(city => (
              <div 
                key={city.id}
                className={`visual-node ${editingId === city.id || draggingId === city.id ? 'active' : ''} ${draggingId === city.id ? 'dragging' : ''}`}
                style={{
                  left: `calc(50% + ${(draggingId === city.id || editingId === city.id ? formData.map_x : city.map_x) || 0}%)`,
                  top: `${(draggingId === city.id || editingId === city.id ? formData.map_y : city.map_y) || 0}px`,
                  transform: `translate(-50%, -50%) scale(${(draggingId === city.id || editingId === city.id ? formData.map_size : city.map_size) || 1})`,
                  backgroundColor: (draggingId === city.id || editingId === city.id ? formData.city_color : city.city_color) || '#735c00'
                }}
                onMouseDown={(e) => handleCanvasMouseDown(e, city)}
                onClick={() => handleEdit(city)}
              >
                <span className="node-icon">
                  {(draggingId === city.id || editingId === city.id ? formData.icon_name : city.icon_name)?.startsWith('http') ? (
                     <img src={(draggingId === city.id || editingId === city.id ? formData.icon_name : city.icon_name)} alt="" />
                  ) : (draggingId === city.id || editingId === city.id ? formData.icon_name : city.icon_name) ? (
                     ICON_OPTIONS.find(o => o.value === (draggingId === city.id || editingId === city.id ? formData.icon_name : city.icon_name))?.emoji || '📍'
                  ) : '📍'}
                </span>
                <div className="node-label">{city.city_name_fr}</div>
              </div>
            ))}
          </div>
          {(editingId || draggingId) && (
            <div className="visual-edit-sidebar fade-in">
               <h3>{draggingId ? 'Déplacement...' : `Modification : ${formData.city_name_fr}`}</h3>
               <div className="field"><label>X (%)</label><input type="range" min="-50" max="50" step="0.5" value={formData.map_x || 0} onChange={e => setFormData({...formData, map_x: parseFloat(e.target.value)})} /><span className="val">{formData.map_x || 0}%</span></div>
               <div className="field"><label>Y (px)</label><input type="range" min="0" max="3000" step="5" value={formData.map_y || 0} onChange={e => setFormData({...formData, map_y: parseFloat(e.target.value)})} /><span className="val">{formData.map_y || 0}px</span></div>
               <div className="field"><label>Taille</label><input type="range" min="0.5" max="3" step="0.1" value={formData.map_size || 1} onChange={e => setFormData({...formData, map_size: parseFloat(e.target.value)})} /><span className="val">{formData.map_size || 1}x</span></div>
               <div className="visual-edit-actions">
                  <button className="btn btn-primary" onClick={handleSave} disabled={draggingId}><Save size={14} /> {draggingId ? 'Relâcher pour sauver' : 'Enregistrer'}</button>
                  {!draggingId && <button className="btn btn-ghost" onClick={() => setEditingId(null)}>Fermer</button>}
               </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .visual-toolbar { display: flex; align-items: center; gap: 12px; background: var(--bg-elevated); padding: 4px 12px; border-radius: 12px; border: 1px solid var(--border-light); margin-right: 12px; }
        .bg-selector { display: flex; align-items: center; gap: 8px; border-left: 1px solid var(--border-light); padding-left: 12px; }
        .bg-selector input { background: transparent; border: none; font-size: 11px; color: var(--text-muted); width: 120px; outline: none; }
        .map-canvas.show-grid { background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 50px 50px; }
        .visual-node { user-select: none; cursor: grab; position: absolute; width: 60px; height: 60px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 15px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10; transition: transform 0.2s; }
        .visual-node.dragging { cursor: grabbing; opacity: 0.8; z-index: 100; scale: 1.2; box-shadow: 0 0 30px var(--primary); }
        .map-canvas { flex: 1; background: #0d0d12; border-radius: 20px; border: 2px solid var(--border); position: relative; overflow: auto; display: flex; justify-content: center; min-height: 500px; }
        .map-svg-path { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; }
        .node-label { position: absolute; top: 100%; left: 50%; transform: translateX(-50%); margin-top: 8px; background: rgba(0,0,0,0.8); color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; white-space: nowrap; pointer-events: none; }
        .visual-edit-sidebar { width: 300px; background: var(--bg-elevated); border-radius: 16px; padding: 20px; border: 1px solid var(--border); display: flex; flex-direction: column; gap: 20px; }
        .visual-edit-actions { margin-top: auto; display: flex; gap: 12px; }
        .map-grid { display: flex; flex-direction: column; gap: 16px; margin-top: 24px; }
        .map-city-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 16px; display: flex; align-items: center; gap: 24px; }
        .icon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 12px; }
        .icon-option { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 8px; border-radius: 8px; cursor: pointer; }
        .icon-option.selected { background: var(--primary); color: white; }
        .icon-preview-circle { width: 50px; height: 50px; border-radius: 50%; background: var(--bg-surface); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
      `}</style>
    </div>
  );
}
