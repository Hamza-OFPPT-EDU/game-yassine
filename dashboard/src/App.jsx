import { useState } from 'react';
import './index.css';
import Dashboard from './components/Dashboard';
import BadgesPage from './components/BadgesPage';
import ContentPage from './components/ContentPage';
import MediaLibrary from './components/MediaLibrary';
import DatabaseExplorer from './components/DatabaseExplorer';
import SettingsPage from './components/SettingsPage';
import MapEditorPage from './components/MapEditorPage';
import EngagementPage from './components/EngagementPage';
import CurriculumPreview from './components/cms/CurriculumPreview';
import ThemeToggle from './components/ThemeToggle';
import { useChallenges } from './hooks/useContent';
import PlayerPanel from './components/PlayerPanel';
import { usePlayers } from './hooks/useData';
import {
  LayoutDashboard, Users, Award, FileEdit, Image as ImageIcon, Database,
  Settings as SettingsIcon, Map as MapIcon, Activity
} from 'lucide-react';

const NAV = [
  {
    section: 'Analytique',
    items: [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
      { id: 'engagement', icon: Activity,         label: 'Engagement' },
      { id: 'players',   icon: Users,           label: 'Joueurs' },
      { id: 'badges',    icon: Award,           label: 'Badges' },
    ]
  },
  {
    section: 'Gestion de contenu',
    items: [
      { id: 'content',   icon: FileEdit,  label: 'Défis & Missions', badge: 'CMS' },
      { id: 'map',       icon: MapIcon,   label: 'Carte du Jeu' },
      { id: 'media',     icon: ImageIcon, label: 'Médiathèque' },
      { id: 'database',  icon: Database,  label: 'Base de données' },
      { id: 'settings',  icon: SettingsIcon, label: 'Paramètres' },
    ]
  }
];

const PAGE_TITLES = {
  dashboard: { title: 'Tableau de bord',          sub: 'Vue générale de l\'avancement des joueurs' },
  players:   { title: 'Joueurs',                  sub: 'Liste et profils détaillés des joueurs' },
  engagement:{ title: 'Engagement & Analytique',  sub: 'Analyse du temps passé et de l\'activité réelle' },
  badges:    { title: 'Badges & Récompenses',     sub: 'Analyse des badges obtenus par les joueurs' },
  content:   { title: 'Gestion de contenu',       sub: 'Créer et modifier les défis, missions et questions du jeu' },
  map:       { title: 'Carte du Jeu',             sub: 'Gérer l\'ordre des villes et la progression visuelle' },
  media:     { title: 'Médiathèque',              sub: 'Explorateur de ressources et téléchargement groupé' },
  database:  { title: 'Base de données',          sub: 'Exploration SQL et structure des tables publiques' },
  settings:  { title: 'Configuration Globale',    sub: 'Personnaliser les multiplicateurs d\'XP et niveaux Bloom' },
};

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const { challenges } = useChallenges();
  const { players, deleteUser, updateUser } = usePlayers();

  const handleCityClick = (challenge) => {
    setSelectedChallenge(challenge);
    setPage('curriculum');
  };

  const { title, sub } = page === 'curriculum' 
    ? { title: `Aperçu : ${selectedChallenge?.city_name_fr}`, sub: 'Découvrez le programme complet et les exercices' }
    : (PAGE_TITLES[page] || PAGE_TITLES.dashboard);

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">🧭</div>
            <div className="logo-text">
              <span className="logo-title">Voyage des Comp.</span>
              <span className="logo-subtitle">Admin Dashboard</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ section, items }) => (
            <div key={section}>
              <span className="nav-section-title">{section}</span>
              {items.map(({ id, icon: Icon, label, badge }) => (
                <div
                  key={id}
                  className={`nav-item ${page === id ? 'active' : ''}`}
                  onClick={() => setPage(id)}
                >
                  <Icon size={18} className="icon" />
                  {label}
                  {badge && <span className="nav-badge">{badge}</span>}
                </div>
              ))}
            </div>
          ))}

          <div className="divider" style={{ margin: '12px 0' }} />
          <span className="nav-section-title">Villes du jeu</span>
          {challenges.map(c => (
            <div 
              key={c.id} 
              className={`nav-item city-nav-item ${page === 'curriculum' && selectedChallenge?.id === c.id ? 'active' : ''}`} 
              onClick={() => handleCityClick(c)}
            >
              <span className="city-nav-icon">📍</span>
              {c.city_name_fr}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-status">
            <div className="status-dot" />
            Supabase connecté
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            <h1>{title}</h1>
            <span>{sub}</span>
          </div>
          
          <div className="topbar-actions">
            <ThemeToggle />
          </div>
        </header>

        <main className="page-content">
          {page === 'dashboard' && <Dashboard setPage={setPage} onPlayerClick={setSelectedPlayer} />}
          {page === 'engagement' && <EngagementPage onPlayerClick={setSelectedPlayer} players={players} />}
          {page === 'players'   && <Dashboard setPage={setPage} onPlayerClick={setSelectedPlayer} />}
          {page === 'badges'    && <BadgesPage onPlayerClick={setSelectedPlayer} players={players} />}
          {page === 'content'   && <ContentPage />}
          {page === 'map'       && <MapEditorPage onNavigate={(id, city) => { setPage(id); if(city) setSelectedChallenge(city); }} />}
          {page === 'media'     && <MediaLibrary />}
          {page === 'database'  && <DatabaseExplorer />}
          {page === 'settings'  && <SettingsPage />}
          {page === 'curriculum' && (
            <CurriculumPreview 
              challenge={selectedChallenge} 
              onBack={() => setPage('dashboard')} 
            />
          )}
        </main>
      </div>

      <PlayerPanel 
        player={selectedPlayer} 
        onClose={() => setSelectedPlayer(null)} 
        onDelete={deleteUser}
        onUpdate={updateUser}
      />
    </div>
  );
}
