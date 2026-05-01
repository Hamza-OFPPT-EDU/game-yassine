import { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronRight, Image, MapPin, Eye } from 'lucide-react';
import { useChallenges } from '../../hooks/useContent';
import { Modal, Field, Input, Textarea, Toggle, Toast, Confirm } from './CmsUI';
import ImageUploader from './ImageUploader';

const CITY_OPTIONS = [
  { value: 'rabat',       label: '🏛️ Rabat' },
  { value: 'chefchaouen', label: '🔵 Chefchaouen' },
  { value: 'fes',         label: '🕌 Fès' },
  { value: 'marrakech',   label: '🌿 Marrakech' },
  { value: 'laayoune',    label: '🌊 Laâyoune' },
  { value: 'dakhla',      label: '🏜️ Dakhla' },
];

const EMPTY = {
  city_id: 'rabat', city_name_fr: '', city_name_ar: '',
  city_color: '#735c00', icon_name: 'landmark', headline_fr: '', headline_ar: '',
  description_fr: '', description_ar: '', focus_fr: '',
  step_label: '', progress: 0.25, illustration_url: '',
  sort_order: 0, is_published: false,
  missions_title_fr: 'Missions :', missions_title_ar: 'المهمات :',
};

export default function ChallengesManager({ onSelectChallenge, onViewCurriculum }) {
  const { challenges, loading, save, remove } = useChallenges();
  const [modal, setModal] = useState(null); // null | object
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  const openNew = () => setModal({ ...EMPTY });
  const openEdit = (c) => setModal({ ...c });
  const closeModal = () => setModal(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!modal.city_name_fr || !modal.headline_fr || !modal.description_fr) {
      showToast('Remplis les champs obligatoires (*)','error');
      return;
    }
    setSaving(true);
    try {
      await save(modal);
      showToast(modal.id ? 'Défi mis à jour ✓' : 'Défi créé ✓');
      closeModal();
    } catch (e) {
      showToast('Erreur : ' + e.message, 'error');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    await remove(confirm.id);
    setConfirm(null);
    showToast('Défi supprimé');
  };

  const set = (key, val) => setModal(m => ({ ...m, [key]: val }));

  return (
    <div>
      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
      <Confirm
        open={!!confirm}
        message={`Supprimer le défi "${confirm?.city_name_fr}" ? Toutes les missions et questions liées seront perdues.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
      />

      {/* Header */}
      <div className="cms-section-header">
        <div>
          <h2 className="cms-section-title">🏙️ Défis par ville</h2>
          <p className="cms-section-sub">Page d'accueil du défi : illustration, titre, description par ville</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Nouveau défi
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="loading"><div className="spinner" /> Chargement...</div>
      ) : (
        <div className="challenge-grid">
          {challenges.map(c => (
            <div key={c.id} className="challenge-card">
              {/* Illustration preview */}
              <div
                className="challenge-card-img"
                style={{ background: `linear-gradient(135deg, ${c.city_color}44 0%, ${c.city_color}22 100%)` }}
              >
                {c.illustration_url ? (
                  <img src={c.illustration_url} alt={c.city_name_fr} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, opacity:0.5 }}>
                    <Image size={32} color={c.city_color} />
                    <span style={{ fontSize:11, color:'var(--text-muted)' }}>Pas d'illustration</span>
                  </div>
                )}
                <div className="challenge-card-badge" style={{ background: c.city_color }}>
                  <MapPin size={10} /> {c.step_label || c.city_id}
                </div>
                <div className={`challenge-pub-dot ${c.is_published ? 'pub' : 'draft'}`} title={c.is_published ? 'Publié' : 'Brouillon'} />
              </div>

              {/* Info */}
              <div className="challenge-card-body">
                <div className="challenge-card-city" style={{ color: c.city_color, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {CITY_OPTIONS.find(o => o.value === c.city_id)?.label || c.city_id}
                  <span style={{ fontSize: 12, opacity: 0.6 }}>({c.icon_name || 'no-icon'})</span>
                </div>
                <h3 className="challenge-card-title">{c.headline_fr}</h3>
                <p className="challenge-card-desc">{c.description_fr?.slice(0, 100)}…</p>
                {c.focus_fr && (
                  <span className="challenge-focus-chip">🎯 {c.focus_fr}</span>
                )}
              </div>

              {/* Actions */}
              <div className="challenge-card-actions">
                <button className="icon-btn" title="Aperçu complet (Curriculum)" onClick={() => onViewCurriculum(c)}>
                  <Eye size={16} />
                </button>
                <button className="icon-btn" title="Voir les missions" onClick={() => onSelectChallenge(c)}>
                  <ChevronRight size={16} />
                </button>
                <button className="icon-btn" title="Modifier" onClick={() => openEdit(c)}>
                  <Edit2 size={16} />
                </button>
                <button className="icon-btn danger" title="Supprimer" onClick={() => setConfirm(c)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          {/* New card shortcut */}
          <div className="challenge-card challenge-card-new" onClick={openNew}>
            <Plus size={28} color="var(--primary-light)" />
            <span style={{ fontSize:13, color:'var(--primary-light)', fontWeight:600 }}>Ajouter un défi</span>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal open={!!modal} onClose={closeModal} title={modal?.id ? 'Modifier le défi' : 'Nouveau défi'} wide>
        {modal && (
          <div className="modal-form">
            <div className="form-row-2">
              <Field label="Ville *">
                <select className="cms-select" value={modal.city_id} onChange={e => set('city_id', e.target.value)}>
                  {CITY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </Field>
              <Field label="Couleur de la ville">
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <input type="color" value={modal.city_color} onChange={e => set('city_color', e.target.value)} style={{ width:40, height:36, border:'none', borderRadius:8, cursor:'pointer' }} />
                  <Input value={modal.city_color} onChange={v => set('city_color', v)} placeholder="#hex" />
                </div>
              </Field>
              <Field label="Nom de l'icône (Lucide)" hint="Ex: landmark, castle, tent, waves, mountain, mosque">
                <Input value={modal.icon_name} onChange={v => set('icon_name', v)} placeholder="landmark" />
              </Field>
            </div>

            <div className="form-row-2">
              <Field label="Nom de la ville (FR) *">
                <Input value={modal.city_name_fr} onChange={v => set('city_name_fr', v)} placeholder="Rabat" />
              </Field>
              <Field label="Nom de la ville (AR)">
                <Input value={modal.city_name_ar} onChange={v => set('city_name_ar', v)} placeholder="الرباط" dir="rtl" />
              </Field>
            </div>

            <div className="form-row-2">
              <Field label="Titre accrocheur (FR) *">
                <Input value={modal.headline_fr} onChange={v => set('headline_fr', v)} placeholder="Le Cœur Institutionnel du Royaume" />
              </Field>
              <Field label="Titre accrocheur (AR)">
                <Input value={modal.headline_ar} onChange={v => set('headline_ar', v)} placeholder="قلب المملكة" dir="rtl" />
              </Field>
            </div>

            <div className="form-row-2">
              <Field label="Description (FR) *">
                <Textarea value={modal.description_fr} onChange={v => set('description_fr', v)} placeholder="Depuis la Kasbah des Oudayas…" rows={4} />
              </Field>
            <div className="form-row-2">
              <Field label="Description (AR)">
                <Textarea value={modal.description_ar} onChange={v => set('description_ar', v)} placeholder="من قصبة الأوداية…" rows={4} dir="rtl" />
              </Field>
              <Field label="Libellé bloc missions (FR)" hint="Titre au-dessus des jetons missions (ex: Missions :)">
                <Input value={modal.missions_title_fr} onChange={v => set('missions_title_fr', v)} placeholder="Missions :" />
              </Field>
            </div>

            <div className="form-row-2">
               <Field label="Libellé bloc missions (AR)">
                <Input value={modal.missions_title_ar} onChange={v => set('missions_title_ar', v)} placeholder="المهمات :" dir="rtl" />
              </Field>
              <Field label="Focus pédagogique">
                <Input value={modal.focus_fr} onChange={v => set('focus_fr', v)} placeholder="Gouvernance & Patrimoine" />
              </Field>
            </div>
              <Field label="Label d'étape">
                <Input value={modal.step_label} onChange={v => set('step_label', v)} placeholder="ÉTAPE 1 / 4" />
              </Field>
              <Field label="Progression (0–1)" hint="Ex: 0.25 = 25%">
                <Input type="number" value={modal.progress} onChange={v => set('progress', parseFloat(v))} min="0" max="1" step="0.05" />
              </Field>
            </div>

            <Field label="🖼️ Illustration du défi" hint="Glissez une image ou cliquez pour choisir — stockée dans Supabase Storage">
              <ImageUploader
                value={modal.illustration_url}
                onChange={v => set('illustration_url', v)}
                folder={modal.city_id || 'general'}
              />
            </Field>

            <div className="form-row-2">
              <Field label="Ordre d'affichage">
                <Input type="number" value={modal.sort_order} onChange={v => set('sort_order', parseInt(v))} min="0" />
              </Field>
              <Field label=" ">
                <Toggle value={modal.is_published} onChange={v => set('is_published', v)} label="Publié (visible dans le jeu)" />
              </Field>
            </div>

            <div style={{ display:'flex', justifyContent:'flex-end', gap:12, marginTop:8 }}>
              <button className="btn btn-ghost" onClick={closeModal}>Annuler</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Enregistrement…' : (modal.id ? 'Mettre à jour' : 'Créer le défi')}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
