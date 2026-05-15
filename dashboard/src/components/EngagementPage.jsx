import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Clock, Activity, Users, TrendingUp, Calendar } from 'lucide-react';
import { useGlobalAnalytics } from '../hooks/useData';

const COLORS = ['#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

export default function EngagementPage() {
  const { data, loading } = useGlobalAnalytics();

  if (loading) return <div className="loading"><div className="spinner" /> Analyse des données...</div>;

  return (
    <div className="fade-in space-y-6">
      {/* Overview Cards */}
      <div className="stats-grid">
        <div className="stat-card violet">
          <div className="stat-icon violet"><Clock size={20} /></div>
          <div className="stat-value">{data.timeByActivity.reduce((acc, curr) => acc + curr.value, 0)}m</div>
          <div className="stat-label">Temps total (Minutes)</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green"><Activity size={20} /></div>
          <div className="stat-value">{data.topPlayersByTime.length}</div>
          <div className="stat-label">Joueurs suivis</div>
        </div>
      </div>

      <div className="dashboard-grid col-2">
        {/* Time by Activity Type */}
        <div className="card">
          <div className="card-header">
            <h3 className="flex items-center gap-2">
              <Clock className="text-primary-light" size={18} />
              Répartition du temps par activité
            </h3>
          </div>
          <div className="card-body" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.timeByActivity}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}m`}
                >
                  {data.timeByActivity.map((entry) => (
                    <Cell key={entry.name} fill={COLORS[data.timeByActivity.indexOf(entry) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Players by Engagement */}
        <div className="card">
          <div className="card-header">
            <h3 className="flex items-center gap-2">
              <TrendingUp className="text-amber-light" size={18} />
              Top 10 - Engagement (Minutes)
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {data.topPlayersByTime.map((player, i) => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-bg-surface border border-border-light rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-light/10 flex items-center justify-center text-primary-light font-bold">
                      {i + 1}
                    </div>
                    <span className="font-semibold text-text-primary">{player.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary-light">{player.minutes} min</span>
                    <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-light" 
                        style={{ width: `${(player.minutes / data.topPlayersByTime[0].minutes) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Time by Group */}
      <div className="card">
        <div className="card-header">
          <h3 className="flex items-center gap-2">
            <Users className="text-cyan-light" size={18} />
            Heures totales par site / ville
          </h3>
        </div>
        <div className="card-body" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.timeByGroup}>
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} />
              <YAxis stroke="var(--text-muted)" fontSize={12} />
              <Tooltip 
                contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-light)' }}
                itemStyle={{ color: 'var(--primary-light)' }}
              />
              <Bar dataKey="value" fill="var(--primary-light)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
