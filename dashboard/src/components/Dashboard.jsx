import { useState, useEffect } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  LineChart, Line, CartesianGrid,
} from 'recharts';
import { Users, Award, Zap, TrendingUp, Search, RefreshCw, ChevronRight, Plus, X } from 'lucide-react';
import { useStats, usePlayers, useSkillDistribution, useCityStats } from '../hooks/useData';
import PlayerPanel from './PlayerPanel';
import ThemeToggle from './ThemeToggle';

function getInitials(name) {
  return (name || 'J').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getLevelClass(level) {
  return `lvl-${Math.min(level || 1, 5)}`;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p>{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="tooltip-value" style={{ color: p.color || 'var(--primary-light)' }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

function NewUserModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    username: '', password: '', fullName: '', site: '', schoolLevel: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error(err);
      if (err.code === 'DUPLICATE_USERNAME') {
        alert(err.message);
      } else {
        alert('Erreur lors de la création de l\'utilisateur.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay z-[1000] fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="modal-content bg-bg-surface border-border-light rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl animate-slideUp">
        <button className="absolute top-4 right-4 text-text-muted hover:text-text-primary" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="p-6 border-b border-border-light">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Users size={20} className="text-primary-light" />
            Ajouter un joueur
          </h2>
          <p className="text-sm text-text-secondary">Créez un nouvel accès pour l'application.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold text-text-muted uppercase">Login (nom_prenom)</label>
              <input 
                required
                className="cms-input" 
                placeholder="ex: yacine_b"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold text-text-muted uppercase">Mot de passe</label>
              <input 
                required
                className="cms-input" 
                placeholder="ex: yac.b@2010"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-text-muted uppercase">Nom complet</label>
            <input 
              className="cms-input" 
              placeholder="Yacine B."
              value={formData.fullName}
              onChange={e => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold text-white/50 uppercase">Site / Ville</label>
              <input 
                className="cms-input" 
                placeholder="Rabat"
                value={formData.site}
                onChange={e => setFormData({...formData, site: e.target.value})}
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold text-white/50 uppercase">Niveau scolaire</label>
              <input 
                className="cms-input" 
                placeholder="3ème AC"
                value={formData.schoolLevel}
                onChange={e => setFormData({...formData, schoolLevel: e.target.value})}
              />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-end gap-3">
            <button type="button" className="btn-ghost" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Création...' : 'Créer l\'utilisateur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Dashboard({ setPage }) {
  const { stats, loading: statsLoading } = useStats();
  const { players, loading: playersLoading, createUser, deleteUser } = usePlayers();
  const { data: skillData } = useSkillDistribution();
  const { data: cityData } = useCityStats();

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filtered = players.filter(p => {
    const s = search.toLowerCase();
    return (
      (p.display_name || '').toLowerCase().includes(s) ||
      (p.username || '').toLowerCase().includes(s) ||
      (p.site || '').toLowerCase().includes(s) ||
      (p.school_level || '').toLowerCase().includes(s) ||
      (p.profile_type || '').toLowerCase().includes(s)
    );
  });

  // Calculate pagination
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlayers = filtered.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const radarData = skillData.map(s => ({ subject: s.skill, A: s.avg }));

  return (
    <>
      <NewUserModal 
        isOpen={showNewUserModal} 
        onClose={() => setShowNewUserModal(false)}
        onSubmit={createUser}
      />
      <PlayerPanel 
        player={selectedPlayer} 
        onClose={() => setSelectedPlayer(null)} 
        onDelete={deleteUser}
      />

      {/* Stats Grid */}
      <div className="stats-grid fade-in">
        <div className="stat-card violet fade-in fade-in-delay-1">
          <div className="stat-icon violet"><Users size={22} color="#a78bfa" /></div>
          <div className="stat-value violet">{statsLoading ? '—' : stats.totalPlayers}</div>
          <div className="stat-label">Joueurs inscrits</div>
          <span className="stat-trend up">Total</span>
        </div>
        <div className="stat-card cyan fade-in fade-in-delay-2">
          <div className="stat-icon cyan"><TrendingUp size={22} color="#67e8f9" /></div>
          <div className="stat-value cyan">{statsLoading ? '—' : stats.activePlayers}</div>
          <div className="stat-label">Joueurs actifs (streak)</div>
          <span className="stat-trend up">🔥 Streak</span>
        </div>
        <div className="stat-card amber fade-in fade-in-delay-3">
          <div className="stat-icon amber"><Award size={22} color="#fcd34d" /></div>
          <div className="stat-value amber">{statsLoading ? '—' : stats.totalBadges}</div>
          <div className="stat-label">Badges obtenus</div>
          <span className="stat-trend up">🏅 Total</span>
        </div>
        <div className="stat-card green fade-in fade-in-delay-4">
          <div className="stat-icon green"><Zap size={22} color="#34d399" /></div>
          <div className="stat-value green">{statsLoading ? '—' : stats.avgXP.toLocaleString()}</div>
          <div className="stat-label">XP moyen par joueur</div>
          <span className="stat-trend up">✨ Moy.</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="dashboard-grid col-3">
        {/* Radar Skills */}
        <div className="card fade-in">
          <div className="card-header">
            <div className="card-title">
              <div className="card-icon">⚡</div>
              <h3>Compétences moyennes</h3>
            </div>
          </div>
          <div className="card-body">
            {skillData.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📊</span>
                <h3>Pas de données</h3>
                <p>Les scores de compétences apparaîtront ici</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border-light)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} />
                  <Radar name="Score" dataKey="A" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* City Bar */}
        <div className="card fade-in">
          <div className="card-header">
            <div className="card-title">
              <div className="card-icon">MAP</div>
              <h3>Avancement par ville</h3>
            </div>
          </div>
          <div className="card-body">
            {cityData.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🏙️</span>
                <h3>Pas de données</h3>
                <p>Les progressions par ville apparaîtront ici</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={cityData} barSize={10} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                  <XAxis dataKey="city" tick={{ fill: 'var(--text-muted)', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="done" name="Terminé" fill="#10b981" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Badges Collection Card */}
        <div className="card fade-in">
          <div className="card-header">
            <div className="card-title">
              <div className="card-icon">🏅</div>
              <h3>Référentiel Badges</h3>
            </div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', textAlign: 'center' }}>
            <Award size={64} color="#f59e0b" style={{ marginBottom: 16, opacity: 0.8 }} />
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>
              {statsLoading ? '—' : 18} Badges
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
              Collection complète définie
            </div>
            <button className="btn-ghost" onClick={() => setPage('badges')} style={{ width: '100%' }}>
              Voir la collection
            </button>
          </div>
        </div>
      </div>

      {/* Players Table */}
      <div className="card fade-in">
        <div className="card-header">
          <div className="card-title">
            <div className="card-icon">👤</div>
            <h3>Joueurs & Progression</h3>
          </div>
          <div className="topbar-actions">
            <div className="search-bar">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher un joueur..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="btn-primary" onClick={() => setShowNewUserModal(true)}>
              <Plus size={16} /> Nouveau
            </button>
          </div>
        </div>

        <div className="table-wrapper">
          {playersLoading ? (
            <div className="loading"><div className="spinner" /> Chargement des joueurs...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <h3>Aucun joueur trouvé</h3>
              <p>Aucun résultat pour « {search} »</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Joueur</th>
                  <th>Identifiants</th>
                  <th>Niveau</th>
                  <th>XP</th>
                  <th>Streak</th>
                  <th>Type de profil</th>
                  <th>Inscrit le</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginatedPlayers.map((player, i) => {
                  const xpProgress = player.xp % 100;
                  const joinDate = new Date(player.created_at).toLocaleDateString('fr-FR', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  });

                  return (
                    <tr key={player.id} onClick={() => setSelectedPlayer(player)} style={{ animationDelay: `${i * 0.04}s` }}>
                      <td>
                        <div className="player-info">
                          <div className="player-avatar">{getInitials(player.display_name)}</div>
                          <div>
                            <div className="player-name">{player.display_name || 'Joueur'}</div>
                            <div className="player-type">ID: {player.id.slice(0, 8)}…</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{player.username || '—'}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{player.password || '—'}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`level-badge ${getLevelClass(player.level)}`}>
                          ⭐ Niveau {player.level}
                        </span>
                      </td>
                      <td>
                        <div className="progress-wrap">
                          <div className="progress-bar">
                            <div className="progress-fill violet" style={{ width: `${xpProgress}%` }} />
                          </div>
                          <span className="progress-text">{player.xp?.toLocaleString()}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ color: player.streak_days > 0 ? '#fcd34d' : 'var(--text-muted)', fontWeight: 600 }}>
                          {player.streak_days > 0 ? `🔥 ${player.streak_days}j` : '—'}
                        </span>
                      </td>
                      <td>
                        <span className="skill-chip decision">{player.profile_type || 'Le Stratège'}</span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{joinDate}</td>
                      <td>
                        <ChevronRight size={16} color="var(--text-muted)" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-wrap">
            <div className="pagination-info">
              Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, totalItems)} sur {totalItems} joueurs
            </div>
            <div className="pagination-controls">
              <button 
                className="page-btn" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                Précédent
              </button>
              
              <div className="page-numbers">
                {[...Array(totalPages)].map((_, i) => {
                  const p = i + 1;
                  // Show current page, first, last, and neighbours
                  if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                    return (
                      <button 
                        key={p} 
                        className={`page-btn ${currentPage === p ? 'active' : ''}`}
                        onClick={() => setCurrentPage(p)}
                      >
                        {p}
                      </button>
                    );
                  }
                  if (p === currentPage - 2 || p === currentPage + 2) {
                    return <span key={p} className="page-dots">...</span>;
                  }
                  return null;
                })}
              </div>

              <button 
                className="page-btn" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
