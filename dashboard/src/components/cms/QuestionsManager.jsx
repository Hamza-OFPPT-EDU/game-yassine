import { useState } from 'react';
import { Plus, Edit2, Trash2, HelpCircle } from 'lucide-react';
import { useQuestions } from '../../hooks/useContent';
import { Modal, Field, Input, Textarea, Toggle, Toast, Confirm } from './CmsUI';

const QUESTION_TYPES = [
  { value: 'qcm',               label: '🔘 QCM (choix multiple)' },
  { value: 'vrai_faux',         label: '✅ Vrai / Faux (Multiple)' },
  { value: 'fill_blanks',       label: '✏️ Compléter les blancs' },
  { value: 'matching',          label: '🔗 Relier / Appariement' },
  { value: 'ranking',           label: '📊 Classement / Ordre' },
  { value: 'short_answer',      label: '💬 Réponse courte' },
  { value: 'scenario_decision', label: '🎭 Décision scénario' },
  { value: 'puzzle_riddle',     label: '🧩 Énigme / Devinette' },
  { value: 'error_detection',   label: '🔍 Détection d\'erreurs' },
  { value: 'time_attack',       label: '⚡ Time Attack' },
  { value: 'scenario_cascade',  label: '🌊 Scénario en Cascade' },
  { value: 'team_roles',        label: '👥 Rôles d\'Équipe' },
  { value: 'scenario_dialogue', label: '💬 Dialogue Narratif' },
];

const EMPTY = {
  question_fr: '', question_ar: '', question_type: 'qcm',
  options: [], correct_answer: '',
  score_decision: 0, score_equipe: 0, score_stress: 0,
  xp_reward: 20, time_limit_sec: 30,
  hint_fr: '', hint_ar: '', explanation_fr: '', explanation_ar: '',
  presentation_fr: '', presentation_ar: '',
  feedback_positive_fr: '', feedback_negative_fr: '',
  feedback_positive_ar: '', feedback_negative_ar: '',
  sort_order: 0, is_published: false,
};

// ─── ÉDITEURS SPÉCIALISÉS ──────────────────────────────────────────

function QcmEditor({ options, correctAnswer, onChange, onSetCorrect }) {
  const opts = Array.isArray(options) ? options : [];
  const add = () => onChange([...opts, { id: `opt_${Date.now()}`, label_fr: '', label_ar: '' }]);
  const update = (idx, key, val) => onChange(opts.map((o, i) => i === idx ? { ...o, [key]: val } : o));
  const remove = (idx) => onChange(opts.filter((_, i) => i !== idx));

  return (
    <div className="specialized-editor">
      <div className="options-list">
        {opts.map((opt, i) => (
          <div key={opt.id || i} className={`option-row ${opt.id === correctAnswer ? 'is-correct' : ''}`}>
             <button 
              className={`correct-toggle ${opt.id === correctAnswer ? 'active' : ''}`}
              onClick={() => onSetCorrect(opt.id || '')}
              title="Cocher comme bonne réponse"
            >
              {opt.id === correctAnswer ? '✅' : '⚪️'}
            </button>
            <input className="cms-input" value={opt.label_fr} onChange={e => update(i, 'label_fr', e.target.value)} placeholder="Option (FR)" style={{ flex: 1 }} />
            <input className="cms-input" value={opt.label_ar} onChange={e => update(i, 'label_ar', e.target.value)} placeholder="Arabe" dir="rtl" style={{ flex: 1 }} />
            <button className="icon-btn danger" onClick={() => remove(i)}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
      <button className="btn btn-ghost" style={{ fontSize:12, marginTop:8 }} onClick={add}>
        <Plus size={13} /> Ajouter une option
      </button>
    </div>
  );
}

function MatchingEditor({ options, onChange }) {
  // Structure: options = { left: [{id, text}], right: [{id, text}] }
  // Mais on peut simplifier en stockant un tableau de paires: [{ id, left_fr, left_ar, right_fr, right_ar }]
  const items = Array.isArray(options) ? options : [];
  const add = () => onChange([...items, { id: `pair_${Date.now()}`, left_fr: '', left_ar: '', right_fr: '', right_ar: '' }]);
  const update = (idx, key, val) => onChange(items.map((o, i) => i === idx ? { ...o, [key]: val } : o));
  const remove = (idx) => onChange(items.filter((_, i) => i !== idx));

  return (
    <div className="specialized-editor">
      <div className="matching-list">
        {items.map((item, i) => (
          <div key={item.id || i} className="matching-row-v2">
            <div className="match-col">
              <input className="cms-input" value={item.left_fr} onChange={e => update(i, 'left_fr', e.target.value)} placeholder="Gauche (FR)" />
              <input className="cms-input" value={item.left_ar} onChange={e => update(i, 'left_ar', e.target.value)} placeholder="Gauche (AR)" dir="rtl" />
            </div>
            <div className="match-arrow">↔️</div>
            <div className="match-col">
              <input className="cms-input" value={item.right_fr} onChange={e => update(i, 'right_fr', e.target.value)} placeholder="Droite (FR)" />
              <input className="cms-input" value={item.right_ar} onChange={e => update(i, 'right_ar', e.target.value)} placeholder="Droite (AR)" dir="rtl" />
            </div>
            <button className="icon-btn danger" onClick={() => remove(i)}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
      <button className="btn btn-ghost" style={{ fontSize:12, marginTop:8 }} onClick={add}>
        <Plus size={13} /> Ajouter une paire
      </button>
    </div>
  );
}

function RankingEditor({ options, onChange }) {
  const items = Array.isArray(options) ? options : [];
  const add = () => onChange([...items, { id: `rank_${Date.now()}`, label_fr: '', label_ar: '' }]);
  const update = (idx, key, val) => onChange(items.map((o, i) => i === idx ? { ...o, [key]: val } : o));
  const remove = (idx) => onChange(items.filter((_, i) => i !== idx));
  const move = (idx, dir) => {
    const next = [...items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  return (
    <div className="specialized-editor">
      <p style={{ fontSize:11, color:'var(--text-muted)', marginBottom:8 }}>L'ordre défini ici sera l'ordre correct à trouver.</p>
      <div className="ranking-list">
        {items.map((item, i) => (
          <div key={item.id || i} className="ranking-row">
            <div className="rank-num">{i + 1}</div>
            <input className="cms-input" value={item.label_fr} onChange={e => update(i, 'label_fr', e.target.value)} placeholder="Étape (FR)" style={{ flex: 1 }} />
            <input className="cms-input" value={item.label_ar} onChange={e => update(i, 'label_ar', e.target.value)} placeholder="Arabe" dir="rtl" style={{ flex: 1 }} />
            <div className="rank-moves">
              <button type="button" className="rank-move-btn" onClick={() => move(i, -1)} disabled={i===0}>▲</button>
              <button type="button" className="rank-move-btn" onClick={() => move(i, 1)} disabled={i===items.length-1}>▼</button>
            </div>
            <button type="button" className="icon-btn danger" onClick={() => remove(i)}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-ghost" style={{ fontSize:12, marginTop:8 }} onClick={add}>
        <Plus size={13} /> Ajouter une étape
      </button>
    </div>
  );
}

function FillBlanksEditor({ options, correctAnswer, onChange, onSetCorrect }) {
  const opts = Array.isArray(options) ? options : [];
  const add = () => onChange([...opts, { id: `blank_${Date.now()}`, text: '', textAr: '' }]);
  const update = (idx, key, val) => {
    const next = opts.map((o, i) => i === idx ? { ...o, [key]: val } : o);
    onChange(next);
  };
  const remove = (idx) => onChange(opts.filter((_, i) => i !== idx));

  const answers = correctAnswer ? correctAnswer.split(',').map(s => s.trim()) : [];
  
  const toggleAnswer = (val) => {
    if (!val) return;
    if (answers.includes(val)) {
      onSetCorrect(answers.filter(a => a !== val).join(', '));
    } else {
      onSetCorrect([...answers, val].join(', '));
    }
  };

  const clearAnswers = () => onSetCorrect('');

  return (
    <div className="specialized-editor">
      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize:11, color:'var(--text-muted)' }}>
          1. Ajoutez les mots (puces) ci-dessous.<br/>
          2. Cliquez sur les puces dans l'<b>ordre d'apparition</b> pour définir la réponse.<br/>
          3. Pour corriger l'ordre, videz les réponses et recommencez.
        </p>
      </div>

      <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 8, marginBottom: 12, border: '1px dashed var(--border)' }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
          <span>Séquence de réponses :</span>
          <button type="button" onClick={clearAnswers} style={{ color: 'var(--danger)', background: 'none', border: 'none', fontSize: 10, cursor: 'pointer' }}>Vider l'ordre</button>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', minHeight: 24 }}>
          {answers.length > 0 ? answers.map((a, i) => (
            <span key={i} style={{ background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>
              {i + 1}. {a}
            </span>
          )) : <span style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text-muted)' }}>Aucune réponse sélectionnée</span>}
        </div>
      </div>

      <div className="options-list">
        {opts.map((opt, i) => {
          const isCorrect = answers.includes(opt.text) && opt.text;
          const orderIdx = answers.indexOf(opt.text);
          return (
            <div key={opt.id || i} className={`option-row ${isCorrect ? 'is-correct' : ''}`}>
               <button 
                type="button"
                className={`correct-toggle ${isCorrect ? 'active' : ''}`}
                onClick={() => toggleAnswer(opt.text)}
                disabled={!opt.text}
                title={isCorrect ? `Ordre: ${orderIdx + 1}` : "Ajouter à l'ordre"}
              >
                {isCorrect ? (orderIdx + 1) : '⚪️'}
              </button>
              <input className="cms-input" value={opt.text} onChange={e => update(i, 'text', e.target.value)} placeholder="Mot (FR)" style={{ flex: 1 }} />
              <input className="cms-input" value={opt.textAr} onChange={e => update(i, 'textAr', e.target.value)} placeholder="Arabe" dir="rtl" style={{ flex: 1 }} />
              <button type="button" className="icon-btn danger" onClick={() => remove(i)}><Trash2 size={14} /></button>
            </div>
          );
        })}
      </div>
      <button type="button" className="btn btn-ghost" style={{ fontSize:12, marginTop:8 }} onClick={add}>
        <Plus size={13} /> Ajouter une puce
      </button>
    </div>
  );
}

function ScenarioEditor({ options, onChange }) {
  const opts = Array.isArray(options) ? options : [];
  const add = () => onChange([...opts, { id: `choice_${Date.now()}`, label_fr: '', label_ar: '', impact_decision: 0, feedback_fr: '' }]);
  const update = (idx, key, val) => onChange(opts.map((o, i) => i === idx ? { ...o, [key]: val } : o));
  const remove = (idx) => onChange(opts.filter((_, i) => i !== idx));

  return (
    <div className="specialized-editor">
      <div className="options-list">
        {opts.map((opt, i) => (
          <div key={opt.id || i} className="scenario-choice-card" style={{ background:'var(--bg-elevated)', padding:12, borderRadius:8, marginBottom:10 }}>
            <div style={{ display:'flex', gap:8, marginBottom:8 }}>
              <input className="cms-input" value={opt.label_fr} onChange={e => update(i, 'label_fr', e.target.value)} placeholder="Choix (FR)" style={{ flex: 1 }} />
              <input className="cms-input" value={opt.label_ar} onChange={e => update(i, 'label_ar', e.target.value)} placeholder="Choix (AR)" dir="rtl" style={{ flex: 1 }} />
              <button type="button" className="icon-btn danger" onClick={() => remove(i)}><Trash2 size={14} /></button>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <input className="cms-input" type="number" value={opt.impact_decision} onChange={e => update(i, 'impact_decision', parseInt(e.target.value)||0)} placeholder="Impact Decision" style={{ width:120 }} title="Impact sur le score décision" />
              <input className="cms-input" value={opt.feedback_fr} onChange={e => update(i, 'feedback_fr', e.target.value)} placeholder="Feedback après choix (ex: Excellente décision !)" style={{ flex: 1 }} />
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-ghost" style={{ fontSize:12, marginTop:8 }} onClick={add}>
        <Plus size={13} /> Ajouter un choix scénario
      </button>
    </div>
  );
}

function ErrorDetectionEditor({ options, onChange }) {
  const items = Array.isArray(options) ? options : [];
  const add = () => onChange([...items, { id: `err_${Date.now()}`, text_fr: '', is_error: false, correction_fr: '' }]);
  const update = (idx, key, val) => onChange(items.map((o, i) => i === idx ? { ...o, [key]: val } : o));
  const remove = (idx) => onChange(items.filter((_, i) => i !== idx));

  return (
    <div className="specialized-editor">
      <p style={{ fontSize:11, color:'var(--text-muted)', marginBottom:10 }}>Divisez le texte en segments et cochez ceux qui contiennent une erreur.</p>
      <div className="options-list">
        {items.map((item, i) => (
          <div key={item.id || i} style={{ background:'var(--bg-elevated)', padding:10, borderRadius:8, marginBottom:8 }}>
            <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:6 }}>
               <Toggle value={item.is_error} onChange={v => update(i, 'is_error', v)} label="Contient une erreur" />
               <input className="cms-input" value={item.text_fr} onChange={e => update(i, 'text_fr', e.target.value)} placeholder="Texte du segment" style={{ flex: 1 }} />
               <button type="button" className="icon-btn danger" onClick={() => remove(i)}><Trash2 size={14} /></button>
            </div>
            {item.is_error && (
              <input className="cms-input" value={item.correction_fr} onChange={e => update(i, 'correction_fr', e.target.value)} placeholder="Correction suggérée" style={{ width:'100%' }} />
            )}
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-ghost" style={{ fontSize:12, marginTop:8 }} onClick={add}>
        <Plus size={13} /> Ajouter un segment
      </button>
    </div>
  );
}

export default function QuestionsManager({ mission, challenge, onBack }) {
  const { questions, loading, save, remove } = useQuestions(mission?.id);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openNew = () => setModal({ ...EMPTY });
  const openEdit = (q) => setModal({ ...q, options: Array.isArray(q.options) ? q.options : [] });
  const closeModal = () => setModal(null);

  const handleSave = async () => {
    if (!modal.question_fr) { showToast('La question est obligatoire', 'error'); return; }
    setSaving(true);
    try {
      await save(modal);
      showToast(modal.id ? 'Question mise à jour ✓' : 'Question créée ✓');
      closeModal();
    } catch(e) {
      showToast('Erreur : ' + e.message, 'error');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    await remove(confirm.id);
    setConfirm(null);
    showToast('Question supprimée');
  };

  const set = (key, val) => setModal(m => ({ ...m, [key]: val }));

  const needsOptions = [
    'qcm', 'vrai_faux', 'fill_blanks', 'matching', 'ranking',
    'scenario_decision', 'error_detection', 'scenario_cascade',
    'team_roles', 'scenario_dialogue', 'puzzle_riddle', 'short_answer'
  ].includes(modal?.question_type);

  if (!mission) return null;

  return (
    <div>
      <Toast message={toast?.msg} type={toast?.type} onClose={() => setToast(null)} />
      <Confirm
        open={!!confirm}
        message={`Supprimer cette question ?`}
        onConfirm={handleDelete}
        onCancel={() => setConfirm(null)}
      />

      {/* Breadcrumb */}
      <div className="cms-breadcrumb">
        <button className="btn btn-ghost" onClick={() => onBack('challenges')} style={{ padding:'6px 12px', fontSize:13 }}>← Défis</button>
        <span className="crumb-sep">/</span>
        <button className="btn btn-ghost" onClick={() => onBack('missions')} style={{ padding:'6px 12px', fontSize:13, color: challenge?.city_color }}>
          {challenge?.city_name_fr}
        </button>
        <span className="crumb-sep">/</span>
        <span className="crumb-active">Questions</span>
      </div>

      {/* Header */}
      <div className="cms-section-header">
        <div>
          <h2 className="cms-section-title">❓ Questions</h2>
          <p className="cms-section-sub">
            Mission : <strong>{mission.title_fr}</strong> · {questions.length} questions
          </p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Nouvelle question
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="loading"><div className="spinner" /> Chargement...</div>
      ) : questions.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon" style={{ fontSize:48, display:'block', marginBottom:8 }}>❓</span>
          <h3>Aucune question</h3>
          <p>Crée la première question pour cette mission</p>
          <button className="btn btn-primary" style={{ marginTop:16 }} onClick={openNew}>
            <Plus size={16} /> Ajouter une question
          </button>
        </div>
      ) : (
        <div className="question-list">
          {questions.map((q, i) => (
            <div key={q.id} className="question-row">
              <div className="question-num">Q{i + 1}</div>
              <div className="question-body">
                <div className="question-text">{q.question_fr}</div>
                <div style={{ display:'flex', gap:8, marginTop:6, flexWrap:'wrap' }}>
                  <span className="q-type-chip">
                    {QUESTION_TYPES.find(t => t.value === q.question_type)?.label || q.question_type}
                  </span>
                  <span style={{ fontSize:11, color:'#67e8f9' }}>⏱ {q.time_limit_sec}s</span>
                  <span style={{ fontSize:11, color:'#fcd34d' }}>⚡ {q.xp_reward} XP</span>
                  {q.score_decision > 0 && <span style={{ fontSize:11, color:'#a78bfa' }}>🧠 D:{q.score_decision}</span>}
                  {q.score_equipe > 0 && <span style={{ fontSize:11, color:'#67e8f9' }}>🤝 E:{q.score_equipe}</span>}
                  {q.score_stress > 0 && <span style={{ fontSize:11, color:'#fcd34d' }}>🌀 S:{q.score_stress}</span>}
                </div>
                {Array.isArray(q.options) && q.options.length > 0 && (
                  <div style={{ display:'flex', gap:6, marginTop:6, flexWrap:'wrap' }}>
                    {q.options.map((o, oi) => {
                      const isCorrect = q.question_type === 'multiple_choice' 
                        ? (o.id === q.correct_answer)
                        : (q.correct_answer || '').includes(o.text || o.label_fr || '');
                      
                      return (
                        <span key={oi} className={`q-option ${isCorrect ? 'correct' : ''}`}>
                          {o.label_fr || o.text || o.left_fr || '...'}
                          {isCorrect && ' ✓'}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <span className={`pub-tag ${q.is_published ? 'pub' : 'draft'}`}>
                  {q.is_published ? '✅' : '📝'}
                </span>
                <button className="icon-btn" onClick={() => openEdit(q)}><Edit2 size={15} /></button>
                <button className="icon-btn danger" onClick={() => setConfirm(q)}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal open={!!modal} onClose={closeModal} title={modal?.id ? 'Modifier la question' : 'Nouvelle question'} wide>
        {modal && (
          <div className="modal-form">
            <Field label="Type de question">
              <select className="cms-select" value={modal.question_type} onChange={e => set('question_type', e.target.value)}>
                {QUESTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>

            <div className="form-row-2">
              <Field label="Présentation / Contexte (FR)">
                <Textarea value={modal.presentation_fr} onChange={v => set('presentation_fr', v)} placeholder="Imaginez que vous êtes..." rows={2} />
              </Field>
              <Field label="Présentation / Contexte (AR)">
                <Textarea value={modal.presentation_ar} onChange={v => set('presentation_ar', v)} placeholder="تخيل أنك..." rows={2} dir="rtl" />
              </Field>
            </div>

            <div className="form-row-2">
              <Field label="Question (FR) *">
                <div className="textarea-tools">
                   <button type="button" className="tool-btn" onClick={() => set('question_fr', modal.question_fr + ' ________ ')}>
                     Insert Placeholder (________)
                   </button>
                </div>
                <Textarea value={modal.question_fr} onChange={v => set('question_fr', v)} placeholder="Quelle est la compétence principale de…" rows={3} />
              </Field>
              <Field label="Question (AR)">
                <div className="textarea-tools">
                   <button type="button" className="tool-btn" onClick={() => set('question_ar', (modal.question_ar || '') + ' ________ ')}>
                     إدراج مساحة (________)
                   </button>
                </div>
                <Textarea value={modal.question_ar} onChange={v => set('question_ar', v)} placeholder="ما هي الكفاءة الأساسية…" rows={3} dir="rtl" />
              </Field>
            </div>

            {modal.question_type === 'qcm' && (
              <Field label="Options du QCM" hint="Cochez le bouton de gauche pour la bonne réponse">
                <QcmEditor 
                  options={modal.options} 
                  correctAnswer={modal.correct_answer}
                  onChange={v => set('options', v)} 
                  onSetCorrect={id => set('correct_answer', id)}
                />
              </Field>
            )}

            {modal.question_type === 'vrai_faux' && (
              <Field label="Bonne réponse">
                <select className="cms-select" value={modal.correct_answer} onChange={e => set('correct_answer', e.target.value)}>
                  <option value="">— Choisir —</option>
                  <option value="vrai">✅ Vrai</option>
                  <option value="faux">❌ Faux</option>
                </select>
              </Field>
            )}

            {modal.question_type === 'puzzle_riddle' && (
              <Field label="Réponse attendue (exacte)" hint="La réponse à l'énigme (majuscules/minuscules ignorées dans le jeu)">
                <Input value={modal.correct_answer} onChange={v => set('correct_answer', v)} placeholder="Ex: MARS" />
              </Field>
            )}

            {modal.question_type === 'short_answer' && (
              <Field label="Réponse attendue">
                <Input value={modal.correct_answer} onChange={v => set('correct_answer', v)} placeholder="Ex: Négociation" />
              </Field>
            )}

            {modal.question_type === 'matching' && (
              <Field label="Paires à associer">
                <MatchingEditor options={modal.options} onChange={v => set('options', v)} />
              </Field>
            )}

            {modal.question_type === 'ranking' && (
              <Field label="Étapes à ordonner">
                <RankingEditor options={modal.options} onChange={v => set('options', v)} />
              </Field>
            )}

            {modal.question_type === 'fill_blanks' && (
              <Field label="Puces à remplir" hint="Ajoutez les mots qui seront affichés sous forme de puces cliquables">
                <FillBlanksEditor 
                  options={modal.options} 
                  correctAnswer={modal.correct_answer}
                  onChange={v => set('options', v)}
                  onSetCorrect={v => set('correct_answer', v)}
                />
              </Field>
            )}

            {modal.question_type === 'scenario_decision' && (
              <Field label="Scénario & Choix" hint="Définissez les options du scénario et leurs impacts">
                <ScenarioEditor options={modal.options} onChange={v => set('options', v)} />
              </Field>
            )}

            {modal.question_type === 'error_detection' && (
              <Field label="Segments de texte" hint="Définissez les parties du texte et celles contenant une erreur">
                <ErrorDetectionEditor options={modal.options} onChange={v => set('options', v)} />
              </Field>
            )}

            {['qcm', 'vrai_faux', 'fill_blanks', 'matching', 'ranking', 'scenario_decision', 'puzzle_riddle', 'error_detection', 'short_answer', 'time_attack', 'scenario_cascade', 'team_roles', 'scenario_dialogue'].includes(modal.question_type) && (
              <Field label="Options du défi" hint="Éditeur simplifié pour ce type de défi (JSON brut)">
                <Textarea 
                  value={typeof modal.options === 'string' ? modal.options : JSON.stringify(modal.options, null, 2)} 
                  onChange={v => {
                    try { set('options', JSON.parse(v)); } catch(e) { set('options', v); }
                  }}
                  placeholder="[{...}]"
                  rows={10}
                />
              </Field>
            )}

            {/* Scores compétences */}
            <div className="skill-scores-section">
              <p className="field-label">🎯 Impact sur les compétences (0–100)</p>
              <div className="form-row-3">
                <Field label="🧠 Décision">
                  <Input type="number" value={modal.score_decision} onChange={v => set('score_decision', parseInt(v)||0)} min="0" max="100" />
                </Field>
                <Field label="🤝 Équipe">
                  <Input type="number" value={modal.score_equipe} onChange={v => set('score_equipe', parseInt(v)||0)} min="0" max="100" />
                </Field>
                <Field label="🌀 Stress">
                  <Input type="number" value={modal.score_stress} onChange={v => set('score_stress', parseInt(v)||0)} min="0" max="100" />
                </Field>
              </div>
            </div>

            <div className="form-row-3">
              <Field label="⚡ XP accordés">
                <Input type="number" value={modal.xp_reward} onChange={v => set('xp_reward', parseInt(v)||0)} min="0" />
              </Field>
              <Field label="⏱ Limite de temps (sec)">
                <Input type="number" value={modal.time_limit_sec} onChange={v => set('time_limit_sec', parseInt(v)||30)} min="10" max="300" />
              </Field>
              <Field label="Ordre">
                <Input type="number" value={modal.sort_order} onChange={v => set('sort_order', parseInt(v)||0)} min="0" />
              </Field>
            </div>

            <div className="form-row-2">
              <Field label="Feedback Réussite (FR)">
                <Input value={modal.feedback_positive_fr} onChange={v => set('feedback_positive_fr', v)} placeholder="Excellent !" />
              </Field>
              <Field label="Feedback Réussite (AR)">
                <Input value={modal.feedback_positive_ar} onChange={v => set('feedback_positive_ar', v)} placeholder="ممتاز !" dir="rtl" />
              </Field>
            </div>

            <div className="form-row-2">
              <Field label="Feedback Échec (FR)">
                <Input value={modal.feedback_negative_fr} onChange={v => set('feedback_negative_fr', v)} placeholder="Pas tout à fait..." />
              </Field>
              <Field label="Feedback Échec (AR)">
                <Input value={modal.feedback_negative_ar} onChange={v => set('feedback_negative_ar', v)} placeholder="ليس تماما..." dir="rtl" />
              </Field>
            </div>

            <div className="form-row-2">
              <Field label="💡 Indice (FR)">
                <Input value={modal.hint_fr} onChange={v => set('hint_fr', v)} placeholder="Pense à…" />
              </Field>
              <Field label="💡 Indice (AR)">
                <Input value={modal.hint_ar} onChange={v => set('hint_ar', v)} placeholder="فكر في…" dir="rtl" />
              </Field>
            </div>

            <div className="form-row-2">
              <Field label="📖 Explication (FR)">
                <Textarea value={modal.explanation_fr} onChange={v => set('explanation_fr', v)} placeholder="La bonne réponse est… parce que…" rows={2} />
              </Field>
              <Field label="📖 Explication (AR)">
                <Textarea value={modal.explanation_ar} onChange={v => set('explanation_ar', v)} placeholder="الجواب الصحيح هو…" rows={2} dir="rtl" />
              </Field>
            </div>

            <Toggle value={modal.is_published} onChange={v => set('is_published', v)} label="Question publiée (active dans le jeu)" />

            <div style={{ display:'flex', justifyContent:'flex-end', gap:12, marginTop:16 }}>
              <button className="btn btn-ghost" onClick={closeModal}>Annuler</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Enregistrement…' : (modal.id ? 'Mettre à jour' : 'Créer la question')}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
