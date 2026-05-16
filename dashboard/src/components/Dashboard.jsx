import { useState, useEffect } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  LineChart, Line, CartesianGrid,
} from 'recharts';
import { Users, Award, Zap, TrendingUp, Search, RefreshCw, ChevronRight, Plus, X, Upload, ArrowUp, ArrowDown, Filter, Trash2 } from 'lucide-react';
import { useStats, usePlayers, useSkillDistribution, useCityStats } from '../hooks/useData';
import { useBadges } from '../hooks/useContent';
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
    username: '', password: '', fullName: '', site: '', schoolLevel: '', birthYear: ''
  });

  // Auto-generate password based on name@year
  useEffect(() => {
    if (formData.username && formData.birthYear) {
      const safeUsername = formData.username.trim().toLowerCase().replace(/\s+/g, '_');
      setFormData(prev => ({ 
        ...prev, 
        password: `${safeUsername}@${formData.birthYear}` 
      }));
    }
  }, [formData.username, formData.birthYear]);
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
        alert("Erreur lors de la création de l'utilisateur.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay z-1000 fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
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
              <label className="text-xs font-semibold text-text-muted uppercase">Année de naissance</label>
              <input 
                required
                type="number"
                min="2000"
                max={new Date().getFullYear()}
                className="cms-input" 
                placeholder="ex: 2010"
                value={formData.birthYear}
                onChange={e => setFormData({...formData, birthYear: e.target.value})}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-text-muted uppercase">Mot de passe (auto-généré)</label>
            <input 
              readOnly
              className="cms-input bg-white/5 opacity-70" 
              placeholder="Généré automatiquement: login@année"
              value={formData.password}
            />
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
              {loading ? 'Création...' : "Créer l'utilisateur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BulkImportModal({ isOpen, onClose, onSubmit }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      // Basic TSV/CSV parsing
      const rows = text.split('\n').map(r => r.split('\t').length > 1 ? r.split('\t') : r.split(','));
      
      const usersData = [];
      for (let row of rows) {
        // Expected format: Login, Année/Date Naissance, Nom complet, Site, Niveau
        let [username, birthInfo, fullName, site, schoolLevel] = row;
        
        username = username?.trim();
        if (!username) continue; // Skip invalid rows

        // Extract year from birthInfo (can be "2010" or "2010-05-15")
        let year = '';
        if (birthInfo) {
          const trimmed = birthInfo.trim();
          if (trimmed.length === 4 && !isNaN(trimmed)) {
            year = trimmed;
          } else {
            const d = new Date(trimmed);
            if (!isNaN(d.getFullYear())) {
              year = d.getFullYear().toString();
            }
          }
        }

        const password = year ? `${username.toLowerCase()}@${year}` : username.toLowerCase();
        
        usersData.push({
          username,
          password,
          fullName: fullName?.trim() || '',
          site: site?.trim() || '',
          schoolLevel: schoolLevel?.trim() || ''
        });
      }
      
      if (usersData.length === 0) {
        alert("Aucun joueur valide trouvé. Format attendu : Login, Année/Date Naissance, Nom complet, Site, Niveau");
        setLoading(false);
        return;
      }

      const res = await onSubmit(usersData);
      alert(`Import terminé : ${res.added} ajoutés, ${res.skipped} ignorés (déjà existants).`);
      onClose();
      setText('');
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'importation : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay z-1000 fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="modal-content bg-bg-surface border-border-light rounded-2xl w-full max-w-2xl overflow-hidden relative shadow-2xl animate-slideUp">
        <button className="absolute top-4 right-4 text-text-muted hover:text-text-primary" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="p-6 border-b border-border-light">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            <Upload size={20} className="text-primary-light" />
            Importation en masse
          </h2>
          <p className="text-sm text-text-secondary">Collez votre liste depuis Excel (ou séparé par des virgules/tabulations).<br/>Colonnes : <b>Login, Année Naissance, Nom complet, Site, Niveau</b></p>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <textarea 
            className="cms-input" 
            placeholder="yacine_b&#9;2010&#9;Yacine B.&#9;Rabat&#9;3ème AC&#10;sarah_k&#9;2011&#9;Sarah K.&#9;Casa&#9;2ème AC"
            rows={10}
            value={text}
            onChange={e => setText(e.target.value)}
            style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}
          />
          <div className="mt-4 flex justify-end gap-3">
            <button type="button" className="btn-ghost" onClick={onClose}>Annuler</button>
            <button type="button" className="btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Importation...' : 'Importer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ setPage }) {
  const { stats, loading: statsLoading } = useStats();
  const { players, loading: playersLoading, createUser, deleteUser, deleteUsersBulk, createUsersBulk, updateUser } = usePlayers();
  const { data: skillData } = useSkillDistribution();
  const { data: cityData } = useCityStats();
  const { badges, loading: badgesLoading } = useBadges();

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [filters, setFilters] = useState({ site: 'All', schoolLevel: 'All' });
  const itemsPerPage = 10;

  // Extract unique values for filters
  const sites = ['All', ...new Set(players.map(p => p.site).filter(Boolean))];
  const levels = ['All', ...new Set(players.map(p => p.school_level).filter(Boolean))];

  const filtered = players.filter(p => {
    const s = search.toLowerCase();
    const matchesSearch = (
      (p.display_name || '').toLowerCase().includes(s) ||
      (p.username || '').toLowerCase().includes(s) ||
      (p.site || '').toLowerCase().includes(s) ||
      (p.school_level || '').toLowerCase().includes(s) ||
      (p.profile_type || '').toLowerCase().includes(s)
    );

    const matchesSite = filters.site === 'All' || p.site === filters.site;
    const matchesLevel = filters.schoolLevel === 'All' || p.school_level === filters.schoolLevel;

    return matchesSearch && matchesSite && matchesLevel;
  });

  // Apply sorting
  const sorted = [...filtered].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aVal = a[sortConfig.key];
    let bVal = b[sortConfig.key];

    // Handle nested display_name if needed, but here they are flat in players list
    if (sortConfig.key === 'display_name') {
      aVal = (aVal || '').toLowerCase();
      bVal = (bVal || '').toLowerCase();
    }

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Calculate pagination
  const totalItems = sorted.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlayers = sorted.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when search or filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds(new Set()); 
  }, [search, filters]);

  const requestSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <RefreshCw size={12} style={{ opacity: 0.2 }} />;
    return sortConfig.direction === 'desc' ? <ArrowDown size={12} /> : <ArrowUp size={12} />;
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedPlayers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedPlayers.map(p => p.id)));
    }
  };

  const toggleSelect = (id, e) => {
    e.stopPropagation();
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIds.size} joueurs ? Cette action est irréversible.`)) {
      try {
        await deleteUsersBulk(Array.from(selectedIds));
        setSelectedIds(new Set());
      } catch (err) {
        alert("Erreur lors de la suppression groupée.");
      }
    }
  };

  const radarData = skillData.map(s => ({ subject: s.skill, A: s.avg }));

  return (
    <>
      <NewUserModal 
        isOpen={showNewUserModal} 
        onClose={() => setShowNewUserModal(false)}
        onSubmit={createUser}
      />
      <BulkImportModal
        isOpen={showBulkImportModal}
        onClose={() => setShowBulkImportModal(false)}
        onSubmit={createUsersBulk}
      />
      <PlayerPanel 
        player={selectedPlayer} 
        onClose={() => setSelectedPlayer(null)} 
        onDelete={deleteUser}
        onUpdate={updateUser}
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
            <div className="card-title" onClick={() => setPage('badges')} style={{ cursor: 'pointer' }}>
              <div className="card-icon">🏅</div>
              <h3>Référentiel Badges</h3>
            </div>
            <button className="btn-ghost sm" onClick={() => setPage('badges')}>Voir tout</button>
          </div>
          <div className="card-body" style={{ padding: '12px' }}>
            {badgesLoading ? (
              <div className="loading-sm" style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner-sm" />
              </div>
            ) : badges.length === 0 ? (
              <div className="empty-state" style={{ height: 200 }}>
                <Award size={48} opacity={0.2} />
                <p>Aucun badge défini</p>
              </div>
            ) : (
              <div className="badges-mini-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '8px',
                maxHeight: '200px',
                overflowY: 'auto',
                paddingRight: '4px'
              }}>
                {badges.map(badge => (
                  <div key={badge.id} className="badge-mini-item" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '10px 6px',
                    borderRadius: '12px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-light)',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }} onClick={() => setPage('badges')}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      marginBottom: '6px'
                    }}>
                      {badge.image_url ? (
                        <img src={badge.image_url} alt={badge.badge_name} style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain',
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                        }} />
                      ) : (
                        <span style={{ fontSize: '24px' }}>{badge.icon_url || '🏅'}</span>
                      )}
                    </div>
                    <span style={{ 
                      fontSize: '10px', 
                      fontWeight: 700, 
                      color: 'var(--text-primary)',
                      lineHeight: 1.1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      width: '100%'
                    }}>
                      {badge.badge_name}
                    </span>
                    {badge.rarity === 'legendary' && (
                      <div style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        height: '2px', 
                        background: 'linear-gradient(90deg, #eab308, #fef08a, #eab308)' 
                      }} />
                    )}
                  </div>
                ))}
              </div>
            )}
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
            <div className="filter-group">
              <div className="search-bar">
                <Search size={14} className="search-icon" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              
              <select 
                className="cms-select"
                value={filters.site}
                onChange={e => setFilters({...filters, site: e.target.value})}
              >
                <option value="All">Tous les sites</option>
                {sites.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <select 
                className="cms-select"
                value={filters.schoolLevel}
                onChange={e => setFilters({...filters, schoolLevel: e.target.value})}
              >
                <option value="All">Tous les niveaux</option>
                {levels.filter(l => l !== 'All').map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            
            {selectedIds.size > 0 && (
              <button className="btn-danger-outline" onClick={handleBulkDelete} style={{ gap: '6px', display: 'flex', alignItems: 'center' }}>
                <Trash2 size={16} /> Supprimer ({selectedIds.size})
              </button>
            )}

            <button className="btn-ghost" onClick={() => setShowBulkImportModal(true)} style={{ gap: '6px', display: 'flex', alignItems: 'center' }}>
              <Upload size={16} /> Importer
            </button>
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
                  <th style={{ width: '40px' }}>
                    <input 
                      type="checkbox" 
                      className="cms-checkbox"
                      checked={paginatedPlayers.length > 0 && selectedIds.size === paginatedPlayers.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>Joueur <button className="sort-btn" onClick={() => requestSort('display_name')}>{getSortIcon('display_name')}</button></th>
                  <th>Identifiants</th>
                  <th>Niveau <button className="sort-btn" onClick={() => requestSort('level')}>{getSortIcon('level')}</button></th>
                  <th>XP <button className="sort-btn" onClick={() => requestSort('xp')}>{getSortIcon('xp')}</button></th>
                  <th>Streak <button className="sort-btn" onClick={() => requestSort('streak_days')}>{getSortIcon('streak_days')}</button></th>
                  <th>Type de profil</th>
                  <th>Inscrit le <button className="sort-btn" onClick={() => requestSort('created_at')}>{getSortIcon('created_at')}</button></th>
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
                    <tr 
                      key={player.id} 
                      onClick={() => setSelectedPlayer(player)} 
                      style={{ animationDelay: `${i * 0.04}s` }}
                      className={selectedIds.has(player.id) ? 'selected' : ''}
                    >
                      <td onClick={e => e.stopPropagation()}>
                        <input 
                          type="checkbox" 
                          className="cms-checkbox"
                          checked={selectedIds.has(player.id)}
                          onChange={e => toggleSelect(player.id, e)}
                        />
                      </td>
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
