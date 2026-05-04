/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { useSupabaseProfile } from './hooks/useSupabase';
import { motion, AnimatePresence } from 'motion/react';
import { Screen, type City, type Mission, type MissionCompletionSummary } from './types';
import { AudioProvider } from './contexts/AudioContext';
import BottomNavBar from './components/BottomNavBar';
import SplashScreen from './views/SplashScreen';
import WelcomeScreen from './views/WelcomeScreen';
import MapJourneyScreen from './views/MapJourneyScreen';
import StoryScreen from './views/StoryScreen';
import ChallengeScreen from './views/ChallengeScreen';
import ProfileScreen from './views/ProfileScreen';
import LevelCompleteModal from './components/LevelCompleteModal';
import SettingsScreen from './views/SettingsScreen';
import GrammarQuestScreen from './views/GrammarQuestScreen';
import LeagueScreen from './views/LeagueScreen';
import LeagueDetailScreen from './views/LeagueDetailScreen';
import LeagueCreateScreen from './views/LeagueCreateScreen';
import VocabularyMatchScreen from './views/VocabularyMatchScreen';
import FullscreenPrompt from './components/FullscreenPrompt';
import LoginScreen from './views/LoginScreen';
import { useAuth } from './hooks/useSupabase';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Splash);
  const [selectedCity, setSelectedCity] = useState<City | null>(null); 
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [completedCities, setCompletedCities] = useState<string[]>([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [loadingMissions, setLoadingMissions] = useState(false);
  const [missionSummary, setMissionSummary] = useState<MissionCompletionSummary | null>(null);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(true);
  const [fullscreenShownOnce, setFullscreenShownOnce] = useState(false);
  
  const { session, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useSupabaseProfile(session?.user?.id);
  
  const [userStats, setUserStats] = useState({
    xp: 0,
    stars: 0,
    level: 1,
  });

  // Sync stats with profile once loaded
  useEffect(() => {
    if (profile) {
      setUserStats({
        xp: profile.xp || 0,
        stars: profile.stars || 0,
        level: profile.level || 1,
      });
    }
  }, [profile, profileLoading]);

  /** Navigate to Challenge. */
  const goToChallenge = () => {
    setCurrentScreen(Screen.Challenge);
  };

  /** Start the app journey from Welcome. */
  const handleStartApp = () => {
    setCurrentScreen(Screen.Map);
  };

  useEffect(() => {
    async function fetchFirstMission() {
      if (selectedCity) {
        setLoadingMissions(true);
        
        // Try fetching with city_id first
        let { data: missions, error } = await supabase
          .from('missions')
          .select('*')
          .eq('city_id', selectedCity.id)
          .order('sort_order', { ascending: true });
        
        // If no missions found, try with challenge_id
        if (!error && (!missions || missions.length === 0)) {
          const { data: challengeData, error: challengeError } = await supabase
            .from('missions')
            .select('*')
            .eq('challenge_id', selectedCity.id)
            .order('sort_order', { ascending: true });
          
          if (!challengeError) {
            missions = challengeData;
          } else {
            error = challengeError;
          }
        }
        
        if (!error && missions && missions.length > 0) {
          const nextMission = missions.find(m => !completedMissions.includes(m.id)) || missions[0];
          setSelectedMission(nextMission);
        } else {
          setSelectedMission(null);
        }
        setLoadingMissions(false);
      }
    }
    fetchFirstMission();
  }, [selectedCity, completedMissions]);

  const handleMissionComplete = (summary: MissionCompletionSummary) => {
    setMissionSummary(summary);

    const wasAlreadyCompleted = completedMissions.includes(summary.missionId);
    if (!wasAlreadyCompleted) {
      const newStats = {
        xp: userStats.xp + summary.totalXp,
        stars: userStats.stars + summary.totalStars,
        level: userStats.level 
      };
      
      setCompletedMissions((prev) => [...prev, summary.missionId]);
      setUserStats(prev => ({
        ...prev,
        xp: newStats.xp,
        stars: newStats.stars
      }));

      // Persist to Supabase
      updateProfile({
        xp: newStats.xp,
        stars: newStats.stars
      });
    }

    async function checkCityCompletion() {
      if (selectedCity) {
        const { data: missions } = await supabase
          .from('missions')
          .select('id')
          .eq('city_id', selectedCity.id)
          .order('sort_order', { ascending: true });

        const completedSet = new Set([...completedMissions, summary.missionId]);
        const isCityComplete = !!missions && missions.length > 0 && missions.every((mission) => completedSet.has(mission.id));

        if (isCityComplete) {
          setCompletedCities((prev) => (prev.includes(selectedCity.id) ? prev : [...prev, selectedCity.id]));
        }
      }

      setCurrentScreen(Screen.LevelComplete);
    }

    checkCityCompletion();
  };

  const showNavBar = [Screen.Map, Screen.Profile, Screen.Settings, Screen.GrammarQuest, Screen.League, Screen.LeagueDetail, Screen.LeagueCreate].includes(currentScreen);

  if (authLoading || (session && profileLoading)) {
    return (
      <div className="h-screen w-full bg-[#0f172a] flex flex-col items-center justify-center gap-6">
        <div className="w-20 h-20 border-4 border-white/10 border-t-white rounded-full animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-widest text-xs">Chargement du voyage...</p>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.Splash:
        if (!fullscreenShownOnce) return null;
        return <SplashScreen onComplete={() => setCurrentScreen(Screen.Welcome)} />;
      case Screen.Welcome:
        return <WelcomeScreen 
          onStart={() => {
            if (session) handleStartApp();
            else setCurrentScreen(Screen.Login);
          }} 
        />;
      case Screen.Login:
        return <LoginScreen 
          onBack={() => setCurrentScreen(Screen.Welcome)} 
          onSuccess={() => setCurrentScreen(Screen.Map)} 
        />;
      case Screen.Map:
        return (
          <MapJourneyScreen 
            stats={userStats} 
            completedCities={completedCities}
            completedMissions={completedMissions}
            onSelectCity={(city) => {
              setSelectedCity(city);
              setCurrentScreen(Screen.Story);
            }}
          />
        );
      case Screen.Story:
        if (!selectedCity) return null;
        return (
          <StoryScreen 
            city={selectedCity} 
            mission={selectedMission || undefined}
            loadingMission={loadingMissions}
            onClose={() => { setSelectedMission(null); setCurrentScreen(Screen.Map); }}
            onStartChallenge={goToChallenge}
          />
        );
      case Screen.Challenge:
        if (!selectedCity || !selectedMission) return null;
        return (
          <ChallengeScreen 
            city={selectedCity} 
            missionId={selectedMission.id}
            missionTitle={selectedMission.title_fr}
            onComplete={handleMissionComplete}
            onBack={() => setCurrentScreen(Screen.Story)}
          />
        );
      case Screen.GrammarQuest:
        return <GrammarQuestScreen onBack={() => setCurrentScreen(Screen.Map)} />;
      case Screen.League:
        return (
          <LeagueScreen 
            onSelectLeague={(id) => {
              setSelectedLeagueId(id);
              setCurrentScreen(Screen.LeagueDetail);
            }}
            onCreateLeague={() => setCurrentScreen(Screen.LeagueCreate)}
            onBack={() => setCurrentScreen(Screen.Map)} 
          />
        );
      case Screen.LeagueCreate:
        return <LeagueCreateScreen onBack={() => setCurrentScreen(Screen.League)} onCreated={() => setCurrentScreen(Screen.League)} />;
      case Screen.LeagueDetail:
        return (
          <LeagueDetailScreen 
            leagueId={selectedLeagueId || 'bronze'} 
            onBack={() => setCurrentScreen(Screen.League)} 
          />
        );
      case Screen.VocabularyMatch:
        return <VocabularyMatchScreen onBack={() => setCurrentScreen(Screen.Map)} />;
      case Screen.Profile:
        return <ProfileScreen onBack={() => setCurrentScreen(Screen.Map)} onSettings={() => setCurrentScreen(Screen.Settings)} />;
      case Screen.Settings:
        return <SettingsScreen onBack={() => setCurrentScreen(Screen.Map)} />;
      case Screen.LevelComplete:
        return (
          <LevelCompleteModal
            summary={missionSummary}
            onReplayMission={() => setCurrentScreen(Screen.Challenge)}
            onBackToCity={() => setCurrentScreen(Screen.Map)}
          />
        );
      default:
        return <SplashScreen onComplete={() => setCurrentScreen(Screen.Welcome)} />;
    }
  };

  const getActiveTab = () => {
    switch (currentScreen) {
      case Screen.Map: return 'journey';
      case Screen.Profile: return 'profile';
      case Screen.Settings: return 'settings';
      case Screen.GrammarQuest:
      case Screen.VocabularyMatch: return 'explore';
      case Screen.League:
      case Screen.LeagueDetail:
      case Screen.LeagueCreate: return 'league';
      default: return 'journey';
    }
  };

  return (
    <AudioProvider>
      <div className="relative h-screen w-full bg-white overflow-hidden flex flex-col font-sans select-none touch-none">
        <div className="grow overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="h-full w-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>

        {showNavBar && (
          <div className="shrink-0">
            <BottomNavBar 
              activeTab={getActiveTab()} 
              onTabChange={(tab) => {
                switch (tab) {
                  case 'journey': setCurrentScreen(Screen.Map); break;
                  case 'profile': setCurrentScreen(Screen.Profile); break;
                  case 'settings': setCurrentScreen(Screen.Settings); break;
                  case 'explore': setCurrentScreen(Screen.GrammarQuest); break;
                  case 'league': setCurrentScreen(Screen.League); break;
                }
              }} 
            />
          </div>
        )}

        <FullscreenPrompt
          show={showFullscreenPrompt}
          onAccept={() => {
            setShowFullscreenPrompt(false);
            setFullscreenShownOnce(true);
          }}
          onDecline={() => {
            setShowFullscreenPrompt(false);
            setFullscreenShownOnce(true);
          }}
        />
      </div>
    </AudioProvider>
  );
}
