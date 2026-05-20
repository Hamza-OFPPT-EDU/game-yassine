import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import BadgesManager from './cms/BadgesManager';
import { LayoutGrid, PieChart as ChartIcon, List, Award, TrendingUp, Users } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid,
  PieChart, Pie, Legend,
} from 'recharts';

const RARITY_COLORS = { 
  common: '#94a3b8', 
  uncommon: '#22c55e', 
  rare: '#3b82f6', 
  legendary: '#eab308' 
};

const CATEGORY_COLORS = {
  cultural: '#a78bfa',
  achievement: '#34d399',
  challenge: '#fcd34d',
  multiplayer: '#67e8f9'
};

export default function BadgesPage({ onPlayerClick, players = [] }) {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'manager'
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      // On récupère les badges gagnés avec les détails de la définition
      const { data } = await supabase
        .from('player_earned_badges')
        .select(`
          *,
          badge:badge_definitions(*)
        `)
        .order('earned_at', { ascending: false });
      
      setEarnedBadges(data || []);
      setLoading(false);
    }
    fetch();
  }, []);

  // Stats par Rareté
  const byRarity = Object.entries(RARITY_COLORS).map(([rarity, color]) => ({
    name: rarity.charAt(0).toUpperCase() + rarity.slice(1),
    value: earnedBadges.filter(b => b.badge?.rarity === rarity).length,
    color,
  }));

  // Stats par Catégorie
  const byCategory = Object.entries(CATEGORY_COLORS).map(([cat, color]) => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: earnedBadges.filter(b => b.badge?.category === cat).length,
    color,
  })).filter(s => s.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="custom-tooltip">
        <div className="tooltip-value" style={{ color: payload[0].color }}>{payload[0].name}: {payload[0].value}</div>
      </div>
    );
  };

  return (
    <div className="fade-in">
      <div className="page-tabs" style={{ marginBottom: 24, display: 'flex', gap: 12, borderBottom: '1px solid var(--border-light)', paddingBottom: 16 }}>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <ChartIcon size={16} /> Analytique
        </button>
        <button 
          className={`tab-btn ${activeTab === 'manager' ? 'active' : ''}`}
          onClick={() => setActiveTab('manager')}
        >
          <LayoutGrid size={16} /> Référentiel des Badges
        </button>
      </div>

      {activeTab === 'analytics' ? (
        <>
          <div className="stats-grid fade-in" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {byRarity.map((r, i) => (
              <div key={r.name} className="stat-card fade-in" style={{ '--delay': `${i * 0.1}s` }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>
                  {r.name === 'Common' ? '⚪' : r.name === 'Uncommon' ? '🟢' : r.name === 'Rare' ? '🔵' : '🟡'}
                </div>
                <div className="stat-value" style={{ color: r.color }}>{r.value}</div>
                <div className="stat-label">{r.name}</div>
              </div>
            ))}
          </div>

          <div className="dashboard-grid">
            <div className="card fade-in">
              <div className="card-header">
                <div className="card-title">
                  <div className="card-icon"><Award size={18} /></div>
                  <h3>Distribution par Catégorie</h3>
                </div>
              </div>
              <div className="card-body">
                {byCategory.length === 0 ? (
                  <div className="empty-state"><span className="empty-icon">🏅</span><h3>Aucun badge gagné</h3></div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie 
                        data={byCategory} 
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={80} 
                        innerRadius={50}
                        paddingAngle={5}
                        label={({name, value}) => `${name}: ${value}`}
                      >
                        {byCategory.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="card fade-in">
              <div className="card-header">
                <div className="card-title">
                  <div className="card-icon"><TrendingUp size={18} /></div>
                  <h3>Badges par Rareté</h3>
                </div>
              </div>
              <div className="card-body">
                {earnedBadges.length === 0 ? (
                  <div className="empty-state"><span className="empty-icon">📈</span><h3>Aucune donnée</h3></div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={byRarity} barSize={30}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" name="Nombre" radius={[6,6,0,0]}>
                        {byRarity.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          <div className="card fade-in">
            <div className="card-header">
              <div className="card-title">
                <div className="card-icon"><Users size={18} /></div>
                <h3>Dernières acquisitions de joueurs</h3>
              </div>
            </div>
            <div className="table-wrapper">
              {loading ? (
                <div className="loading"><div className="spinner" /> Chargement...</div>
              ) : earnedBadges.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">🏅</span>
                  <h3>Aucun badge encore</h3>
                  <p>Les badges apparaîtront quand les joueurs progresseront</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Joueur (ID)</th>
                      <th>Badge</th>
                      <th>Catégorie</th>
                      <th>Rareté</th>
                      <th>Date d'obtention</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earnedBadges.slice(0, 15).map(b => {
                      const fullPlayer = players.find(p => p.id === b.player_id);
                      const displayName = fullPlayer?.display_name || `Joueur (${b.player_id.substring(0, 8)})`;
                      const initials = (displayName || 'J').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

                      return (
                        <tr 
                          key={b.id}
                          className="clickable-row"
                          onClick={() => {
                            if (fullPlayer) {
                              onPlayerClick?.(fullPlayer);
                            } else {
                              onPlayerClick?.({ id: b.player_id, display_name: displayName });
                            }
                          }}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div className="user-avatar-sm">{initials}</div>
                              <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>{displayName}</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span style={{ fontSize: 20 }}>{b.badge?.icon_url || '🏅'}</span>
                              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{b.badge?.badge_name}</span>
                            </div>
                          </td>
                          <td>
                            <span className="badge-category-chip" style={{ color: CATEGORY_COLORS[b.badge?.category] || '#7c3aed' }}>
                              {b.badge?.category}
                            </span>
                          </td>
                          <td>
                            <span className="rarity-tag" style={{ backgroundColor: RARITY_COLORS[b.badge?.rarity] }}>
                              {b.badge?.rarity}
                            </span>
                          </td>
                          <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                            {new Date(b.earned_at).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      ) : (
        <BadgesManager />
      )}

      <style>{`
        .tab-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .clickable-row:hover {
          background-color: rgba(255, 255, 255, 0.03) !important;
        }
        .tab-btn:hover {
          color: var(--text-primary);
          background: var(--bg-card);
        }
        .tab-btn.active {
          color: var(--primary-main);
          background: rgba(124, 58, 237, 0.1);
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
        }
        .user-avatar-sm {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: var(--bg-main);
          border: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 800;
          color: var(--primary-light);
        }
        .rarity-tag {
          font-size: 10px;
          font-weight: 800;
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          text-transform: uppercase;
        }
        .badge-category-chip {
          font-size: 11px;
          font-weight: 700;
          text-transform: capitalize;
        }
      `}</style>
    </div>
  );
}
