import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ChevronLeft, BookOpen, HelpCircle, CheckCircle, List, Clock, Zap } from 'lucide-react';

const QUESTION_TYPE_LABELS = {
  qcm: '🔘 QCM',
  vrai_faux: '✅ Vrai/Faux',
  fill_blanks: '✏️ Texte à trous',
  matching: '🔗 Appariement',
  ranking: '📊 Classement',
  short_answer: '💬 Réponse courte',
  scenario_decision: '🎭 Décision',
  puzzle_riddle: '🧩 Énigme',
  error_detection: '🔍 Détection d\'erreurs',
  time_attack: '⚡ Time Attack',
  scenario_cascade: '🌊 Cascade',
  team_roles: '👥 Rôles d\'équipe',
  scenario_dialogue: '💬 Dialogue'
};

export default function CurriculumPreview({ challenge, onBack }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFullData() {
      setLoading(true);
      try {
        // Fetch all missions
        const { data: missions, error: mErr } = await supabase
          .from('missions')
          .select('*')
          .eq('challenge_id', challenge.id)
          .order('sort_order');

        if (mErr) throw mErr;

        // Fetch all questions for these missions
        const missionIds = missions.map(m => m.id);
        const { data: questions, error: qErr } = await supabase
          .from('questions')
          .select('*')
          .in('mission_id', missionIds)
          .order('sort_order');

        if (qErr) throw qErr;

        // Group questions by mission
        const grouped = missions.map(m => ({
          ...m,
          questions: questions.filter(q => q.mission_id === m.id)
        }));

        setData(grouped);
      } catch (e) {
        console.error('Error fetching curriculum:', e);
      } finally {
        setLoading(false);
      }
    }

    console.log('CurriculumPreview for challenge:', challenge);
    if (challenge?.id) {
      fetchFullData();
    } else {
      console.warn('No challenge ID provided to CurriculumPreview');
      setLoading(false);
    }
  }, [challenge]);

  if (loading) return <div className="loading"><div className="spinner" /> Chargement du curriculum...</div>;

  return (
    <div className="curriculum-preview fade-in">
      {/* Header */}
      <div className="cms-breadcrumb">
        <button className="btn btn-ghost" onClick={onBack} style={{ padding:'6px 12px', fontSize:13 }}>← Retour aux villes</button>
        <span className="crumb-sep">/</span>
        <span className="crumb-active">{challenge.city_name_fr} - Aperçu Complet</span>
      </div>

      <div className="cms-section-header">
        <div>
          <h2 className="cms-section-title">📖 Curriculum : {challenge.city_name_fr}</h2>
          <p className="cms-section-sub">Vue d'ensemble de toutes les missions et exercices du défi.</p>
        </div>
      </div>

      <div className="curriculum-container">
        {data.length === 0 ? (
          <div className="empty-state">
            <h3>Aucune mission trouvée</h3>
            <p>Commencez par ajouter des missions à cette ville.</p>
          </div>
        ) : (
          data.map((mission, idx) => (
            <div key={mission.id} className="curriculum-mission-card">
              <div className="mission-preview-header" style={{ borderLeft: `4px solid ${challenge.city_color}` }}>
                <div className="mission-num">M{mission.sort_order || idx + 1}</div>
                <div className="mission-info">
                  <h3 className="mission-title">
                    {mission.metadata?.emoji || '🗺️'} {mission.title_fr}
                  </h3>
                  <div className="mission-meta-tags">
                    <span className="meta-tag"><Zap size={10} /> {mission.metadata?.soft_skill_dominante || 'Transverse'}</span>
                    <span className="meta-tag"><Clock size={10} /> {mission.metadata?.duree_estimee || '25 min'}</span>
                    <span className="meta-tag"><Award size={10} /> {mission.metadata?.badge_possible?.nom || 'Badge'}</span>
                  </div>
                </div>
              </div>

              <div className="questions-preview-list">
                {mission.questions.length === 0 ? (
                  <p className="no-questions-text">Aucun exercice pour le moment.</p>
                ) : (
                  mission.questions.map((q, qIdx) => (
                    <div key={q.id} className="question-preview-row">
                      <div className="q-preview-num">{qIdx + 1}</div>
                      <div className="q-preview-body">
                        <div className="q-preview-text">{q.question_fr}</div>
                        <div className="q-preview-footer">
                          <span className="q-type-label">{QUESTION_TYPE_LABELS[q.question_type] || q.question_type}</span>
                          <span className="q-stat">+{q.xp_reward} XP</span>
                          {q.is_published ? (
                            <span className="status-badge pub">Publiée</span>
                          ) : (
                            <span className="status-badge draft">Brouillon</span>
                          )}
                        </div>

                        {q.correct_answer && (
                          <div className="q-preview-answer">
                            <CheckCircle size={12} className="text-green-500" />
                            <span><strong>Réponse :</strong> {q.correct_answer}</span>
                          </div>
                        )}
                        
                        {(q.hint_fr || q.explanation_fr) && (
                          <div className="q-preview-details">
                            {q.hint_fr && (
                              <div className="q-detail hint">
                                <HelpCircle size={12} />
                                <span><strong>Indice :</strong> {q.hint_fr}</span>
                              </div>
                            )}
                            {q.explanation_fr && (
                              <div className="q-detail explanation">
                                <BookOpen size={12} />
                                <span><strong>Explication :</strong> {q.explanation_fr}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
