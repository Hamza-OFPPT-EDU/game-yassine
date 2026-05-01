import { usePlayerDetail } from '../hooks/useData';
import { X, MapPin, Star, Award, Zap, Key, User, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

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

export default function PlayerPanel({ player, onClose, onDelete }) {
  const { detail, loading } = usePlayerDetail(player?.id);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const open = !!player;

  const handleDelete = async () => {
    if (onDelete && player) {
      await onDelete(player.id);
      onClose();
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
                <div className="panel-name">{player.display_name || 'Joueur'}</div>
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
              <button className="panel-close" onClick={onClose}>
                <X size={16} />
              </button>
            </div>

            <div className="panel-body">
              {/* Credentials Section */}
              <div className="panel-section credentials-section">
                <h4><Key size={12} style={{display:'inline', marginRight:4}} />Identifiants d'accès</h4>
                <div className="credential-grid">
                  <div className="credential-item">
                    <span className="credential-label">Utilisateur</span>
                    <span className="credential-value">{player.username || '—'}</span>
                  </div>
                  <div className="credential-item">
                    <span className="credential-label">Mot de passe</span>
                    <span className="credential-value">{player.password || '—'}</span>
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

                  {/* City Journey */}
                  <div className="panel-section">
                    <h4><MapPin size={12} style={{display:'inline', marginRight:4}} />Voyage par ville</h4>
                    {detail?.cities?.length === 0 ? (
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Aucune ville commencée</p>
                    ) : (
                      <div className="city-journey">
                        {detail?.cities?.map(city => (
                          <div key={city.id} className="city-item">
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

                  {/* Actions Section */}
                  <div className="panel-section" style={{ borderTop: '1px solid var(--border-light)', paddingTop: 16 }}>
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
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
