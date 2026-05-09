import { useState } from 'react';
import { Award, Search, Plus, Edit2, Trash2, Globe, Tag, Info, Layers, Zap } from 'lucide-react';
import { useBadges } from '../../hooks/useContent';
import { Modal, Field, Input, Textarea, Toast, Confirm } from './CmsUI';
import ImageUploader from './ImageUploader';

const CATEGORY_OPTIONS = [
  { value: 'cultural',    label: '🏛️ Culturel' },
  { value: 'achievement', label: '🏆 Accomplissement' },
  { value: 'challenge',   label: '🎯 Défi' },
  { value: 'multiplayer', label: '👥 Multijoueur' },
];

const RARITY_OPTIONS = [
  { value: 'common',    label: '⚪ Commun',    color: '#94a3b8' },
  { value: 'uncommon',  label: '🟢 Peu Commun', color: '#22c55e' },
  { value: 'rare',      label: '🔵 Rare',       color: '#3b82f6' },
  { value: 'legendary', label: '🟡 Légendaire', color: '#eab308' },
];

const EMPTY_BADGE = {
  badge_name: '',
  description_fr: '',
  description_ar: '',
  requirement: '',
  icon_url: '🏅',
  category: 'achievement',
  rarity: 'common',
  image_url: '',
};

export default function BadgesManager() {
  const { badges, loading, save, remove } = useBadges();
  const [searchTerm, setSearchTerm] = useState('');
  const [modal, setModal] = useState(null); // null | object
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openNew = () => setModal({ ...EMPTY_BADGE });
  const openEdit = (badge) => setModal({ ...badge });
  const closeModal = () => setModal(null);

  const handleSave = async () => {
    if (!modal.badge_name || !modal.description_fr) {
      showToast('Le nom et la description sont obligatoires', 'error');
      return;
    }
    
    setSaving(true);
    try {
      await save(modal);
      showToast(modal.id ? 'Badge mis à jour ✓' : 'Badge créé ✓');
      closeModal();
    } catch (e) {
      showToast('Erreur : ' + e.message, 'error');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    try {
      await remove(confirm.id);
      showToast('Badge supprimé');
      setConfirm(null);
    } catch (e) {
      showToast('Erreur : ' + e.message, 'error');
    }
  };

  const set = (key, val) => setModal(prev => ({ ...prev, [key]: val }));

  const filteredBadges = badges.filter(b => 
    b.badge_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.description_fr?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRarityColor = (rarity) => {
    return RARITY_OPTIONS.find(o => o.value === rarity)?.color || '#94a3b8';
  };

  return (
    <div className="badges-manager fade-in">
      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
      
      <Confirm
        open={!!confirm}
        message={`Supprimer le badge "${confirm?.badge_name}" ? Cette action est irréversible.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
      />

      <div className="cms-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un badge (nom, catégorie, description)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={18} /> Nouveau Badge
        </button>
      </div>

      <div className="badges-grid">
        {loading ? (
          <div className="loading"><div className="spinner" /> Chargement du référentiel...</div>
        ) : filteredBadges.length === 0 ? (
          <div className="empty-state">Aucun badge ne correspond à votre recherche.</div>
        ) : (
          filteredBadges.map((badge) => (
            <div key={badge.id} className="badge-definition-card">
              <div className="badge-image-container" style={{ 
                background: badge.rarity === 'legendary' ? 'linear-gradient(135deg, #713f12 0%, #422006 100%)' : 
                            badge.rarity === 'rare' ? 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)' :
                            badge.rarity === 'uncommon' ? 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)' :
                            'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
              }}>
                {badge.image_url ? (
                  <img src={badge.image_url} alt={badge.badge_name} className="badge-img" />
                ) : (
                  <div className="badge-placeholder">
                    <Award size={40} opacity={0.3} />
                    <span style={{ fontSize: 24 }}>{badge.icon_url || '🏅'}</span>
                  </div>
                )}
                <div className={`badge-rarity-tag`} style={{ backgroundColor: getRarityColor(badge.rarity) }}>
                  {badge.rarity?.toUpperCase()}
                </div>
              </div>

              <div className="badge-info">
                <div className="badge-header">
                  <h4>{badge.badge_name}</h4>
                  <span className="badge-category-chip">{badge.category}</span>
                </div>
                
                <div className="badge-languages">
                  <p className="badge-description fr">
                    <span className="lang-tag">FR</span> {badge.description_fr}
                  </p>
                  {badge.description_ar && (
                    <p className="badge-description ar" dir="rtl">
                      <span className="lang-tag">AR</span> {badge.description_ar}
                    </p>
                  )}
                </div>
                
                <div className="badge-condition">
                  <Zap size={14} />
                  <span><strong>Condition :</strong> {badge.requirement || "Non définie"}</span>
                </div>
              </div>

              <div className="badge-actions">
                <button className="icon-btn" title="Modifier" onClick={() => openEdit(badge)}><Edit2 size={16} /></button>
                <button className="icon-btn delete" title="Supprimer" onClick={() => setConfirm(badge)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit/New Modal */}
      <Modal open={!!modal} onClose={closeModal} title={modal?.id ? 'Modifier le badge' : 'Nouveau badge'} wide>
        {modal && (
          <div className="modal-form">
            <div className="form-row-2">
              <Field label="Nom du badge *">
                <Input value={modal.badge_name} onChange={v => set('badge_name', v)} placeholder="Expert en Logistique" />
              </Field>
              <Field label="Icône (Émoji)" hint="Utilisé si l'image est absente">
                <Input value={modal.icon_url} onChange={v => set('icon_url', v)} placeholder="🏅" />
              </Field>
            </div>

            <div className="form-row-2">
              <Field label="Description (FR) *">
                <Textarea value={modal.description_fr} onChange={v => set('description_fr', v)} placeholder="Description en français..." rows={2} />
              </Field>
              <Field label="Description (AR)">
                <Textarea value={modal.description_ar} onChange={v => set('description_ar', v)} placeholder="الوصف باللغة العربية..." rows={2} dir="rtl" />
              </Field>
            </div>

            <div className="form-row-2">
              <Field label="Catégorie">
                <select className="cms-select" value={modal.category} onChange={e => set('category', e.target.value)}>
                  {CATEGORY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>
              <Field label="Rareté">
                <select className="cms-select" value={modal.rarity} onChange={e => set('rarity', e.target.value)}>
                  {RARITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Condition d'obtention (Requirement)">
              <Input value={modal.requirement} onChange={v => set('requirement', v)} placeholder="Ex: Gagner 5 parties multijoueur..." />
            </Field>

            <Field label="🖼️ Image du badge" hint="Recommandé: PNG transparent 256x256">
              <ImageUploader
                value={modal.image_url}
                onChange={v => set('image_url', v)}
                folder="badges"
                bucket="badges"
              />
            </Field>

            <div style={{ display:'flex', justifyContent:'flex-end', gap:12, marginTop:24 }}>
              <button className="btn btn-ghost" onClick={closeModal}>Annuler</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Enregistrement…' : (modal.id ? 'Mettre à jour' : 'Créer le badge')}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <style>{`
        .badges-manager {
          padding-top: 10px;
        }
        .cms-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          gap: 16px;
        }
        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: 12px;
          padding: 0 16px;
          height: 48px;
        }
        .search-box input {
          background: transparent;
          border: none;
          color: var(--text-primary);
          padding: 8px 12px;
          width: 100%;
          outline: none;
        }
        .badges-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }
        .badge-definition-card {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .badge-definition-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          border-color: var(--primary-main);
        }
        .badge-image-container {
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .badge-img {
          height: 100px;
          object-fit: contain;
          filter: drop-shadow(0 0 15px rgba(0,0,0,0.5));
        }
        .badge-placeholder {
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .badge-rarity-tag {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 800;
          color: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .badge-info {
          padding: 18px;
          flex: 1;
        }
        .badge-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 14px;
          gap: 8px;
        }
        .badge-header h4 {
          margin: 0;
          font-size: 17px;
          color: var(--text-primary);
          line-height: 1.2;
        }
        .badge-category-chip {
          font-size: 10px;
          text-transform: uppercase;
          color: var(--primary-light);
          background: rgba(124, 58, 237, 0.1);
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 700;
          white-space: nowrap;
        }
        .badge-languages {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }
        .badge-description {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.4;
          margin: 0;
          display: flex;
          gap: 6px;
        }
        .badge-description.ar {
          text-align: right;
          color: var(--text-muted);
          font-family: 'Inter', sans-serif;
        }
        .lang-tag {
          font-size: 9px;
          font-weight: 800;
          background: var(--bg-main);
          color: var(--text-muted);
          padding: 1px 4px;
          border-radius: 3px;
          height: fit-content;
        }
        .badge-condition {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          padding: 12px;
          font-size: 12px;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid var(--border-light);
        }
        .badge-actions {
          padding: 12px;
          border-top: 1px solid var(--border-light);
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          background: rgba(0,0,0,0.02);
        }
        .icon-btn {
          background: transparent;
          border: 1px solid var(--border-light);
          color: var(--text-secondary);
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .icon-btn:hover {
          background: var(--bg-main);
          color: var(--primary-main);
          border-color: var(--primary-main);
        }
        .icon-btn.delete:hover {
          color: #ef4444;
          border-color: #ef4444;
          background: #fef2f2;
        }

        .modal-form { display: flex; flex-direction: column; gap: 20px; }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .cms-select {
          width: 100%;
          background: var(--bg-main);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 10px;
          color: var(--text-primary);
          outline: none;
        }
      `}</style>
    </div>
  );
}
