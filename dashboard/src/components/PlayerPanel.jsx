import { usePlayerDetail, usePlayerHistory, usePlayerActivity, usePlayerDailyStats } from '../hooks/useData';
import { X, MapPin, Star, Award, Zap, Key, User, Trash2, AlertTriangle, Edit2, Save, RotateCcw, CheckCircle2, Circle, Clock, History, ChevronDown, ChevronUp, RefreshCw, BarChart3, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';

const CITY_EMOJIS = {
  rabat: '🏛️', chefchaouen: '🔵', fes: '🕌', marrakech: '🌿', laayoune: '🌊', dakhla: '🏜️',
};

const SKILL_COLORS = {
  decision: '#a78bfa',
  equipe: '#67e8f9',
  stress: '#fcd34d',
  excellence: '#34d399',
};

function getInitials(name) {
  return (name || 'J').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getLevelClass(level) {
  const lvl = Math.min(level, 5);
  return `lvl-${lvl}`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

export default function PlayerPanel({ player, onClose, onDelete, onUpdate }) {
  const { detail, loading } = usePlayerDetail(player?.id);
  const { history, loading: historyLoading } = usePlayerHistory(player?.id);
  const { activity, loading: activityLoading } = usePlayerActivity(player?.id);
  const { stats: dailyStats, loading: dailyLoading } = usePlayerDailyStats(player?.id);
  const [expandedHistory, setExpandedHistory] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '', fullName: '', site: '', schoolLevel: '', password: ''
  });
  const [saveLoading, setSaveLoading] = useState(false);
  
  const open = !!player;

  useEffect(() => {
    if (player) {
      setEditForm({
        username: player.username || '',
        fullName: player.display_name || '',
        site: player.site || '',
        schoolLevel: player.school_level || '',
        password: player.password || ''
      });
      setIsEditing(false);
      setShowConfirmDelete(false);
    }
  }, [player]);

  const handleDelete = async () => {
    if (onDelete && player) {
      await onDelete(player.id);
      onClose();
    }
  };

  const handleUpdate = async () => {
    if (onUpdate && player) {
      setSaveLoading(true);
      try {
        await onUpdate(player.id, editForm);
        setIsEditing(false);
      } catch (err) {
        alert("Erreur lors de la mise à jour : " + (err.message || "Erreur inconnue"));
      } finally {
        setSaveLoading(false);
      }
    }
  };

  return (
    <>
      <div className={`panel-backdrop ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`player-panel ${open ? 'open' : ''}`}>
        {player && (
          <>
            <div className="panel-header">
              <div className="panel-avatar">{getInitials(player.display_name)}</div>
              <div className="panel-info">
                {isEditing ? (
                  <input 
                    className="cms-input-minimal" 
                    value={editForm.fullName}
                    onChange={e => setEditForm({...editForm, fullName: e.target.value})}
                    placeholder="Nom complet"
                    autoFocus
                  />
                ) : (
                  <div className="panel-name">{player.display_name || 'Joueur'}</div>
                )}
                <div className="panel-type">{player.profile_type || 'Le Stratège'}</div>
                <div className="panel-meta">
                  <div className="panel-meta-item">
                    <span className="panel-meta-value">{player.xp?.toLocaleString()}</span>
                    <span className="panel-meta-label">XP Total</span>
                  </div>
                  <div className="panel-meta-item">
                    <span className="panel-meta-value">Lvl {player.level}</span>
                    <span className="panel-meta-label">Niveau</span>
                  </div>
                  <div className="panel-meta-item">
                    <span className="panel-meta-value">{player.streak_days}j</span>
                    <span className="panel-meta-label">Streak 🔥</span>
                  </div>
                </div>
              </div>
              <div className="panel-actions-top">
                {!isEditing ? (
                  <button className="btn-icon" onClick={() => setIsEditing(true)} title="Modifier le compte">
                    <Edit2 size={14} />
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-icon text-danger" onClick={() => setIsEditing(false)}>
                      <RotateCcw size={14} />
                    </button>
                    <button className="btn-icon text-success" onClick={handleUpdate} disabled={saveLoading}>
                      <Save size={14} />
                    </button>
                  </div>
                )}
                <button className="panel-close" onClick={onClose}>
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="panel-body">
              {/* Credentials Section */}
              <div className="panel-section credentials-section">
                <h4><Key size={12} style={{display:'inline', marginRight:4}} />Identifiants d'accès</h4>
                <div className="credential-grid">
                  <div className="credential-item">
                    <span className="credential-label">Utilisateur</span>
                    {isEditing ? (
                      <input 
                        className="cms-input-minimal" 
                        value={editForm.username}
                        onChange={e => setEditForm({...editForm, username: e.target.value})}
                      />
                    ) : (
                      <span className="credential-value">{player.username || '—'}</span>
                    )}
                  </div>
                  <div className="credential-item">
                    <span className="credential-label">Mot de passe</span>
                    {isEditing ? (
                      <input 
                        className="cms-input-minimal" 
                        value={editForm.password}
                        onChange={e => setEditForm({...editForm, password: e.target.value})}
                      />
                    ) : (
                      <span className="credential-value">{player.password || '—'}</span>
                    )}
                  </div>
                  <div className="credential-item">
                    <span className="credential-label">Site / Ville</span>
                    {isEditing ? (
                      <input 
                        className="cms-input-minimal" 
                        value={editForm.site}
                        onChange={e => setEditForm({...editForm, site: e.target.value})}
                      />
                    ) : (
                      <span className="credential-value">{player.site || '—'}</span>
                    )}
                  </div>
                  <div className="credential-item">
                    <span className="credential-label">Niveau scolaire</span>
                    {isEditing ? (
                      <input 
                        className="cms-input-minimal" 
                        value={editForm.schoolLevel}
                        onChange={e => setEditForm({...editForm, schoolLevel: e.target.value})}
                      />
                    ) : (
                      <span className="credential-value">{player.school_level || '—'}</span>
                    )}
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="loading"><div className="spinner" /> Chargement...</div>
              ) : (
                <>
                  {/* XP Progress */}
                  <div className="panel-section">
                    <h4><Zap size={12} style={{display:'inline', marginRight:4}} />Progression XP</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Vers niveau {player.level + 1}</span>
                      <span style={{ fontSize: 12, color: 'var(--primary-light)', fontWeight: 600 }}>
                        {player.xp % 100}/100 XP
                      </span>
                    </div>
                    <div className="xp-bar-wrap">
                      <div className="xp-bar-fill" style={{ width: `${player.xp % 100}%` }} />
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div className="panel-section">
                    <h4><Clock size={12} style={{display:'inline', marginRight:4}} />Suivi du temps</h4>
                    <div className="engagement-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                      <div className="engagement-card" style={{ padding: 10 }}>
                        <div className="eng-label" style={{ fontSize: 10 }}>Total Jeu</div>
                        <div className="eng-value" style={{ fontSize: 16 }}>
                          {Math.floor((dailyStats?.reduce((acc, s) => acc + (s.game_time_seconds || 0), 0) || 0) / 60)}m
                        </div>
                      </div>
                      <div className="engagement-card" style={{ padding: 10 }}>
                        <div className="eng-label" style={{ fontSize: 10 }}>Villes</div>
                        <div className="eng-value" style={{ fontSize: 16 }}>
                          {Math.floor((dailyStats?.reduce((acc, s) => acc + (s.city_time_seconds || 0), 0) || 0) / 60)}m
                        </div>
                      </div>
                      <div className="engagement-card" style={{ padding: 10 }}>
                        <div className="eng-label" style={{ fontSize: 10 }}>Exercices</div>
                        <div className="eng-value" style={{ fontSize: 16 }}>
                          {Math.floor((dailyStats?.reduce((acc, s) => acc + (s.exercise_time_seconds || 0), 0) || 0) / 60)}m
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Daily Log */}
                  <div className="panel-section">
                    <h4><Activity size={12} style={{display:'inline', marginRight:4}} />Journal quotidien</h4>
                    <div className="daily-log-list" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {dailyStats?.length === 0 ? (
                        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Aucune donnée quotidienne</p>
                      ) : (
                        dailyStats.slice(0, 7).map(day => (
                          <div key={day.date} className="daily-log-item" style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            padding: '8px 12px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-light)',
                            borderRadius: 8,
                            fontSize: 12
                          }}>
                            <div style={{ fontWeight: 600 }}>{formatDate(day.date)}</div>
                            <div style={{ display: 'flex', gap: 12 }}>
                              <span title="Temps de jeu">🎮 {Math.round(day.game_time_seconds / 60)}m</span>
                              <span title="Temps exercices">✏️ {Math.round(day.exercise_time_seconds / 60)}m</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* City Journey */}
                  <div className="panel-section">
                    <h4><MapPin size={12} style={{display:'inline', marginRight:4}} />Schéma d'avancement</h4>
                    {detail?.cities?.length === 0 ? (
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Aucune ville commencée</p>
                    ) : (
                      <div className="city-journey">
                        {detail?.cities?.map(city => (
                          <div key={city.id} className="city-progress-container">
                            <div className="city-item">
                              <div className={`city-icon ${city.status}`}>
                                {CITY_EMOJIS[city.city_id] || '🏙️'}
                              </div>
                              <div className="city-info">
                                <div className="city-name">{city.city_name_fr}</div>
                                <div className="city-missions">
                                  {city.missions_completed}/{city.missions_total} missions · {city.xp_earned} XP
                                </div>
                              </div>
                              <span className={`city-status ${city.status}`}>
                                <span className={`city-dot ${city.status}`} />
                                {city.status === 'done' ? 'Terminé' : city.status === 'current' ? 'En cours' : 'Verrouillé'}
                              </span>
                            </div>
                            
                            <div className="mission-schema-list">
                              {[...Array(city.missions_total)].map((_, i) => {
                                const isMissionDone = i < city.missions_completed;
                                const isCurrent = i === city.missions_completed && city.status === 'current';
                                return (
                                  <div key={`mission-${city.id}-${i}`} className={`mission-schema-item ${isMissionDone ? 'done' : isCurrent ? 'active' : 'locked'}`}>
                                    {isMissionDone ? <CheckCircle2 size={12} /> : <Circle size={12} />}
                                    <span>Mission {i + 1}</span>
                                    {isMissionDone && <span className="m-badge">100%</span>}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  {detail?.skills?.length > 0 && (
                    <div className="panel-section">
                      <h4><Star size={12} style={{display:'inline', marginRight:4}} />Compétences</h4>
                      <div className="skill-bars">
                        {detail.skills.map(skill => {
                          const color = SKILL_COLORS[skill.skill_id] || skill.color || '#a78bfa';
                          return (
                            <div key={skill.id} className="skill-bar-item">
                              <div className="skill-bar-header">
                                <span className="skill-bar-name">{skill.skill_label || skill.skill_id}</span>
                                <span className="skill-bar-score" style={{ color }}>{skill.score}/100</span>
                              </div>
                              <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${skill.score}%`, background: `linear-gradient(90deg, ${color}aa, ${color})` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="panel-section">
                    <h4><Award size={12} style={{display:'inline', marginRight:4}} />Badges gagnés ({detail?.badges?.length || 0})</h4>
                    {detail?.badges?.length === 0 ? (
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Aucun badge encore</p>
                    ) : (
                      <div className="badge-list">
                        {detail.badges.map(badge => (
                          <div key={badge.id} className="badge-item">
                            <span className="badge-emoji">{badge.badge_emoji}</span>
                            <div className="badge-info">
                              <div className="badge-name">{badge.badge_name_fr}</div>
                              <div className="badge-meta">{badge.city || '—'} · {formatDate(badge.earned_at)}</div>
                            </div>
                            {badge.rank && (
                              <span className={`rank-tag ${badge.rank}`}>{badge.rank}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* History Section */}
                  <div className="panel-section">
                    <h4><History size={12} style={{display:'inline', marginRight:4}} />Historique d'activité ({history?.length || 0})</h4>
                    {historyLoading ? (
                      <div className="loading-small">Chargement de l'historique...</div>
                    ) : history?.length === 0 ? (
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Aucun historique disponible</p>
                    ) : (
                      <div className="history-list">
                        {history.map(item => (
                          <div key={item.id} className="history-item-wrapper">
                            <div 
                              className={`history-item ${expandedHistory === item.id ? 'expanded' : ''}`}
                              onClick={() => setExpandedHistory(expandedHistory === item.id ? null : item.id)}
                            >
                              <div className="history-main">
                                <div className="history-icon">
                                  {item.success_rate >= 80 ? '🎯' : item.success_rate >= 50 ? '📈' : '⚠️'}
                                </div>
                                <div className="history-info">
                                  <div className="history-title">
                                    {item.mission_title}
                                    {item.is_correction && <span className="correction-tag">Correction</span>}
                                  </div>
                                  <div className="history-meta">
                                    {formatDate(item.created_at)} · {Math.round(item.time_spent / 60)} min · {item.xp_earned} XP
                                  </div>
                                </div>
                                <div className="history-score">
                                  {item.correct_count}/{item.total_questions}
                                  {expandedHistory === item.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </div>
                              </div>
                              
                              {expandedHistory === item.id && (
                                <div className="history-details">
                                  <div className="history-stats-mini">
                                    <div className="h-stat">
                                      <span>Précision</span>
                                      <strong style={{ color: item.success_rate >= 80 ? 'var(--success)' : 'var(--warning)' }}>
                                        {Math.round(item.success_rate)}%
                                      </strong>
                                    </div>
                                    <div className="h-stat">
                                      <span>Vitesse</span>
                                      <strong>{Math.round(item.time_spent / (item.total_questions || 1))}s / q</strong>
                                    </div>
                                  </div>
                                  
                                  <div className="history-log">
                                    {(item.details || []).map((q, idx) => {
                                      const qKey = q.question_id || `q-${item.id}-${idx}`;
                                      return (
                                        <div key={qKey} className={`log-row ${q.isCorrect ? 'correct' : 'incorrect'}`}>
                                          <div className="log-q">Q{idx + 1}: {q.question}</div>
                                          <div className="log-a">
                                            <span>Réponse: <strong>{q.givenAnswer || '—'}</strong></span>
                                            {!q.isCorrect && (
                                              <span className="log-correct">Attendu: <strong>{q.correctAnswer}</strong></span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Statistics Summary */}
                  <div className="panel-section">
                    <h4><Clock size={12} style={{display:'inline', marginRight:4}} />Statistiques d'engagement</h4>
                    <div className="engagement-grid">
                      <div className="engagement-card">
                        <div className="eng-label">Temps total</div>
                        <div className="eng-value">
                          {Math.floor((history?.reduce((acc, h) => acc + (h.time_spent || 0), 0) || 0) / 60)} min
                        </div>
                      </div>
                      <div className="engagement-card">
                        <div className="eng-label">Réussite moy.</div>
                        <div className="eng-value">
                          {history?.length > 0 
                            ? Math.round(history.reduce((acc, h) => acc + (h.success_rate || 0), 0) / history.length)
                            : 0}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="panel-section" style={{ borderTop: '1px solid var(--border-light)', paddingTop: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <button 
                        className="btn-ghost" 
                        style={{ width: '100%', justifyContent: 'center', color: 'var(--warning)' }}
                        onClick={async () => {
                          if (confirm("Réinitialiser toute la progression du joueur ?")) {
                            await supabase.from('player_city_progress').delete().eq('player_id', player.id);
                            await supabase.from('act_results').delete().eq('player_id', player.id);
                            await supabase.from('player_profiles').update({ xp: 0, level: 1, streak_days: 0 }).eq('id', player.id);
                            await supabase.from('app_users').update({ xp: 0, level: 1 }).eq('id', player.id);
                            window.location.reload();
                          }
                        }}
                      >
                        <RefreshCw size={14} /> Réinitialiser la progression
                      </button>

                      {!showConfirmDelete ? (
                        <button 
                          className="btn-danger-outline" 
                          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                          onClick={() => setShowConfirmDelete(true)}
                        >
                          <Trash2 size={16} /> Supprimer le joueur
                        </button>
                      ) : (
                        <div className="delete-confirmation">
                          <div style={{ color: 'var(--danger)', fontSize: 12, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <AlertTriangle size={14} /> Êtes-vous sûr ? Cette action est irréversible.
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowConfirmDelete(false)}>Annuler</button>
                            <button className="btn-danger" style={{ flex: 1 }} onClick={handleDelete}>Confirmer</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
