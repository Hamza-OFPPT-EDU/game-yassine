import { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronRight, Layers, MapPin } from 'lucide-react';
import { useMissions, useChallenges } from '../../hooks/useContent';
import { Modal, Field, Input, Textarea, Toggle, Toast, Confirm } from './CmsUI';

const MISSION_TYPES = [
  { value: 'challenge',  label: '⚔️ Challenge' },
  { value: 'dialogue',   label: '💬 Dialogue' },
  { value: 'minigame',   label: '🎮 Mini-jeu' },
  { value: 'scenario',   label: '🎭 Scénario' },
];

const EMPTY = {
  title_fr: '', title_ar: '', description_fr: '', description_ar: '',
  mission_type: 'challenge', xp_reward: 50, sort_order: 0, is_published: false,
  mentor_name: '', mentor_role: '', script_opening: '', script_closing: '',
  narration: { intro: { texte: '', consigne: '', objectif: '' } },
  soft_skill_dominant: '', bloom_level: '',
};

export default function MissionsManager({ challenge, onSelectMission, onBack }) {
  const { challenges } = useChallenges();
  const { missions, loading, save, remove } = useMissions(challenge?.id);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openNew = () => setModal({ ...EMPTY, challenge_id: challenge.id });
  const openEdit = (m) => setModal({ ...m });
  const closeModal = () => setModal(null);

  const handleSave = async () => {
    if (!modal.title_fr) { showToast('Le titre est obligatoire', 'error'); return; }
    setSaving(true);
    try {
      await save(modal);
      showToast(modal.id ? 'Mission mise à jour ✓' : 'Mission créée ✓');
      closeModal();
    } catch(e) {
      showToast('Erreur : ' + e.message, 'error');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    await remove(confirm.id);
    setConfirm(null);
    showToast('Mission supprimée');
  };

  const set = (key, val) => setModal(m => ({ ...m, [key]: val }));

  if (!challenge) return null;

  return (
    <div>
      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
      <Confirm
        open={!!confirm}
        message={`Supprimer la mission "${confirm?.title_fr}" ? Toutes les questions liées seront perdues.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
      />

      {/* Breadcrumb */}
      <div className="cms-breadcrumb">
        <button className="btn btn-ghost" onClick={onBack} style={{ padding:'6px 12px', fontSize:13 }}>
          ← Défis
        </button>
        <span className="crumb-sep">/</span>
        <span className="crumb-active" style={{ color: challenge.city_color }}>
          {challenge.city_name_fr} — Missions
        </span>
      </div>

      {/* Header */}
      <div className="cms-section-header">
        <div>
          <h2 className="cms-section-title">📋 Missions</h2>
          <p className="cms-section-sub">
            Missions du défi <strong style={{ color: challenge.city_color }}>{challenge.city_name_fr}</strong> · {missions.length} missions
          </p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Nouvelle mission
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="loading"><div className="spinner" /> Chargement...</div>
      ) : missions.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon"><Layers size={48} /></span>
          <h3>Aucune mission</h3>
          <p>Crée la première mission pour ce défi</p>
          <button className="btn btn-primary" style={{ marginTop:16 }} onClick={openNew}>
            <Plus size={16} /> Créer une mission
          </button>
        </div>
      ) : (
        <div className="mission-list">
          {missions.map((m, i) => (
            <div key={m.id} className="mission-row">
              <div className="mission-order">{i + 1}</div>
              <div className="mission-info">
                <div className="mission-title">{m.title_fr}</div>
                {m.description_fr && <div className="mission-desc">{m.description_fr.slice(0, 80)}…</div>}
              </div>
              <span className={`mission-type-chip type-${m.mission_type}`}>
                {MISSION_TYPES.find(t => t.value === m.mission_type)?.label || m.mission_type}
              </span>
              <span style={{ fontSize:12, color:'#fcd34d', fontWeight:600 }}>⚡ {m.xp_reward} XP</span>
              <span className={`pub-tag ${m.is_published ? 'pub' : 'draft'}`}>
                {m.is_published ? '✅ Publié' : '📝 Brouillon'}
              </span>
              <div style={{ display:'flex', gap:6, marginLeft:'auto' }}>
                <button className="icon-btn" title="Questions" onClick={() => onSelectMission(m)}>
                  <ChevronRight size={16} />
                </button>
                <button className="icon-btn" title="Modifier" onClick={() => openEdit(m)}>
                  <Edit2 size={16} />
                </button>
                <button className="icon-btn danger" title="Supprimer" onClick={() => setConfirm(m)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal open={!!modal} onClose={closeModal} title={modal?.id ? 'Modifier la mission' : 'Nouvelle mission'} wide>
        {modal && (
          <div className="modal-form">
            <div className="form-row-2">
              <Field label="Ville / Défi de rattachement">
                <div style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(124, 58, 237, 0.05)', padding:'8px 12px', borderRadius:8, border:'1px solid rgba(124, 58, 237, 0.1)' }}>
                  <MapPin size={16} color="var(--primary)" />
                  <select 
                    className="cms-select" 
                    value={modal.challenge_id || challenge.id} 
                    onChange={e => set('challenge_id', e.target.value)}
                    style={{ flex:1, border:'none', background:'none', padding:0 }}
                  >
                    {challenges.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.city_name_fr} ({c.city_id})
                      </option>
                    ))}
                  </select>
                </div>
              </Field>
              <Field label="Type de mission">
                <select className="cms-select" value={modal.mission_type} onChange={e => set('mission_type', e.target.value)}>
                  {MISSION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </Field>
            </div>

            <div className="form-row-2">
              <Field label="Titre (FR) *">
                <Input value={modal.title_fr} onChange={v => set('title_fr', v)} placeholder="Naviguer dans la médina" />
              </Field>
              <Field label="Titre (AR)">
                <Input value={modal.title_ar} onChange={v => set('title_ar', v)} placeholder="التنقل في المدينة القديمة" dir="rtl" />
              </Field>
            </div>

            <div className="form-row-2">
              <Field label="Mentor : Nom" hint="Ex: Amina, Grand-père Driss">
                <Input value={modal.mentor_name} onChange={v => set('mentor_name', v)} placeholder="Amina" />
              </Field>
              <Field label="Mentor : Rôle" hint="Ex: Guide Expert, Mentor Sagesse">
                <Input value={modal.mentor_role} onChange={v => set('mentor_role', v)} placeholder="Guide Expert" />
              </Field>
            </div>

            <div className="form-row-2">
              <Field label="Script d'ouverture (Story FR)">
                <Textarea value={modal.script_opening} onChange={v => set('script_opening', v)} placeholder="Bienvenue à..." rows={3} />
              </Field>
              <Field label="Narration (JSON)" hint="Structure : { intro: { texte, consigne, objectif } }">
                <Textarea 
                  value={typeof modal.narration === 'string' ? modal.narration : JSON.stringify(modal.narration, null, 2)} 
                  onChange={v => {
                    try { set('narration', JSON.parse(v)); } catch(e) { set('narration', v); }
                  }}
                  placeholder="{...}"
                  rows={5}
                />
              </Field>
            </div>

            <div className="form-row-2">
              <Field label="Description (FR)">
                <Textarea value={modal.description_fr} onChange={v => set('description_fr', v)} placeholder="La famille Ben Ali doit…" rows={3} />
              </Field>
              <Field label="Description (AR)">
                <Textarea value={modal.description_ar} onChange={v => set('description_ar', v)} placeholder="يجب على عائلة بن علي…" rows={3} dir="rtl" />
              </Field>
            </div>

            <div className="form-row-2">
              <Field label="Soft Skill Dominante" hint="Ex: Empathie, Négociation">
                <Input value={modal.soft_skill_dominant} onChange={v => set('soft_skill_dominant', v)} placeholder="Empathie" />
              </Field>
              <Field label="Niveau Bloom" hint="Ex: Application, Analyse">
                <Input value={modal.bloom_level} onChange={v => set('bloom_level', v)} placeholder="Application" />
              </Field>
            </div>

            <div className="form-row-2">
              <Field label="Récompense XP">
                <Input type="number" value={modal.xp_reward} onChange={v => set('xp_reward', parseInt(v))} min="0" max="500" />
              </Field>
              <Field label="Ordre d'affichage">
                <Input type="number" value={modal.sort_order} onChange={v => set('sort_order', parseInt(v))} min="0" />
              </Field>
            </div>

            <Toggle value={modal.is_published} onChange={v => set('is_published', v)} label="Mission publiée (visible dans le jeu)" />

            <div style={{ display:'flex', justifyContent:'flex-end', gap:12, marginTop:16 }}>
              <button className="btn btn-ghost" onClick={closeModal}>Annuler</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Enregistrement…' : (modal.id ? 'Mettre à jour' : 'Créer la mission')}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
