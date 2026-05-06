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
import CinematicIntroScreen from './views/CinematicIntroScreen';
import BadgesScreen from './views/BadgesScreen';
import GrammarQuestScreen from './views/GrammarQuestScreen';
import LeagueScreen from './views/LeagueScreen';
import LeagueDetailScreen from './views/LeagueDetailScreen';
import LeagueCreateScreen from './views/LeagueCreateScreen';
import VocabularyMatchScreen from './views/VocabularyMatchScreen';
import FullscreenPrompt from './components/FullscreenPrompt';
import LoginScreen from './views/LoginScreen';
import RegisterScreen from './views/RegisterScreen';
import { useAuth } from './hooks/useSupabase';
import { fetchDynamicAssets, fetchCityMissionAssets } from './lib/assets';
import { type Asset } from './hooks/useAssetPreloader';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Splash);
  const [selectedCity, setSelectedCity] = useState<City | null>(null); 
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [completedCities, setCompletedCities] = useState<string[]>([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [loadingMissions, setLoadingMissions] = useState(false);
  const [missionSummary, setMissionSummary] = useState<MissionCompletionSummary | null>(null);
  const [redoQuestionIds, setRedoQuestionIds] = useState<string[] | undefined>(undefined);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(true);
  const [fullscreenShownOnce, setFullscreenShownOnce] = useState(false);

  useEffect(() => {
    // Check if already in fullscreen or previously accepted
    if (document.fullscreenElement || localStorage.getItem('prefer-fullscreen') === 'true') {
      setShowFullscreenPrompt(false);
      setFullscreenShownOnce(true);
    }
  }, []);

  const { session, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useSupabaseProfile(session?.user?.id);
  const [dynamicAssets, setDynamicAssets] = useState<Asset[]>([]);
  const [loadedCities, setLoadedCities] = useState<string[]>([]);
  const [loadingCityAssets, setLoadingCityAssets] = useState<string | null>(null);
  
  const [userStats, setUserStats] = useState({
    xp: 0,
    stars: 0,
    level: 1,
  });

  useEffect(() => {
    const handleGlobalClick = () => {
      if (localStorage.getItem('prefer-fullscreen') === 'true' && !document.fullscreenElement) {
        const el = document.documentElement;
        if (el.requestFullscreen) {
          el.requestFullscreen().catch(() => {});
        } else if ((el as any).webkitRequestFullscreen) {
          (el as any).webkitRequestFullscreen();
        }
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  useEffect(() => {
    async function loadInitialAssets() {
      // Load core assets + all city icons + assets for the first city (Rabat)
      const firstCityId = 'Rabat'; 
      try {
        const allCitiesAssets = await fetchDynamicAssets(); // Fetches all city icons/illustrations
        const rabatMissionAssets = await fetchCityMissionAssets(firstCityId);
        
        setDynamicAssets([...allCitiesAssets, ...rabatMissionAssets]);
        setLoadedCities([firstCityId]);
      } catch (err) {
        console.error('Failed to load initial Rabat assets:', err);
      }
    }
    loadInitialAssets();
  }, []);

  const preloadCityResources = async (cityId: string) => {
    if (loadedCities.includes(cityId) || loadingCityAssets === cityId) return;

    setLoadingCityAssets(cityId);
    try {
      const cityAssets = await fetchDynamicAssets(cityId);
      const missionAssets = await fetchCityMissionAssets(cityId);
      
      const newAssets = [...cityAssets, ...missionAssets];
      
      // Actual preloading logic
      newAssets.forEach(asset => {
        if (asset.type === 'image') {
          const img = new Image();
          img.src = asset.url;
        } else if (asset.type === 'audio') {
          const audio = new Audio();
          audio.src = asset.url;
          audio.load();
        }
      });
      
      setDynamicAssets(prev => {
        const existingUrls = new Set(prev.map(a => a.url));
        const uniqueNewAssets = newAssets.filter(a => !existingUrls.has(a.url));
        return [...prev, ...uniqueNewAssets];
      });
      
      setLoadedCities(prev => [...prev, cityId]);
    } catch (err) {
      console.error(`Failed to preload assets for city ${cityId}:`, err);
    } finally {
      setLoadingCityAssets(null);
    }
  };

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
    setRedoQuestionIds(undefined);
    setCurrentScreen(Screen.Challenge);
  };

  /** Start the app journey from Welcome. */
  const handleStartApp = () => {
    setCurrentScreen(Screen.Map);
  };

  useEffect(() => {
    async function fetchFirstMission() {
      if (selectedCity) {
        // Avoid overwriting if we already have a valid selectedMission for this city
        if (selectedMission && (selectedMission.city_id === selectedCity.id || selectedMission.challenge_id === selectedCity.id)) {
          return;
        }

        setLoadingMissions(true);
        const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
        let queryCityId = selectedCity.id;

        if (!isUUID(queryCityId)) {
          const { data: cityData } = await supabase
            .from('challenges')
            .select('id')
            .or(`city_id.eq.${queryCityId},city_name_fr.ilike.${queryCityId}`)
            .single();
          
          if (cityData) {
            queryCityId = cityData.id;
          }
        }

        // Try fetching with city_id or challenge_id
        let { data: missions, error } = await supabase
          .from('missions')
          .select('*')
          .or(`city_id.eq.${queryCityId},challenge_id.eq.${queryCityId}`)
          .order('sort_order', { ascending: true });
        
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

  const handleGoToNextMission = async () => {
    if (!selectedCity) return;
    
    setLoadingMissions(true);
    const { data: missions } = await supabase
      .from('missions')
      .select('*')
      .eq('city_id', selectedCity.id)
      .order('sort_order', { ascending: true });
    
    if (missions && missions.length > 0) {
      const currentIndex = missions.findIndex(m => m.id === selectedMission?.id);
      const nextMission = missions[currentIndex + 1];
      
      if (nextMission) {
        setSelectedMission(nextMission);
        setCurrentScreen(Screen.Story);
      } else {
        // No more missions in this city, go back to map
        setSelectedMission(null);
        setCurrentScreen(Screen.Map);
      }
    } else {
      setSelectedMission(null);
      setCurrentScreen(Screen.Map);
    }
    setLoadingMissions(false);
  };

  const showNavBar = [Screen.Map, Screen.Profile, Screen.Settings, Screen.GrammarQuest, Screen.League, Screen.LeagueDetail, Screen.LeagueCreate].includes(currentScreen);



  /** Handle anonymous demo login. */
  const handleDemoLogin = async () => {
    try {
      // Try official anonymous sign-in
      const { error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.warn("Anonymous sign-in not available or failed:", error.message);
      }
    } catch (err) {
      console.error("Demo login error:", err);
    } finally {
      // Always allow starting the app even if auth fails for demo
      handleStartApp();
    }
  };

  const renderScreen = () => {
    if (authLoading || (session && profileLoading)) {
      if (currentScreen === Screen.Splash) {
        return <SplashScreen onComplete={() => setCurrentScreen(Screen.Welcome)} extraAssets={dynamicAssets} />;
      }
      return (
        <div className="h-screen w-full bg-[#0f172a] flex flex-col items-center justify-center gap-6">
          <div className="w-20 h-20 border-4 border-white/10 border-t-white rounded-full animate-spin" />
          <p className="text-white/40 font-black uppercase tracking-widest text-xs">Chargement du voyage...</p>
        </div>
      );
    }

    switch (currentScreen) {
      case Screen.Splash:
        return <SplashScreen onComplete={() => setCurrentScreen(Screen.Welcome)} extraAssets={dynamicAssets} />;
      case Screen.Welcome:
        return <WelcomeScreen 
          onStart={handleDemoLogin} 
        />;
      case Screen.Login:
        return <LoginScreen 
          onBack={() => setCurrentScreen(Screen.Welcome)} 
          onRegister={() => setCurrentScreen(Screen.Register)}
          onSuccess={() => setCurrentScreen(Screen.Map)} 
        />;
      case Screen.Register:
        return <RegisterScreen 
          onBack={() => setCurrentScreen(Screen.Welcome)} 
          onLogin={() => setCurrentScreen(Screen.Login)}
          onSuccess={() => setCurrentScreen(Screen.Map)} 
        />;
      case Screen.Map:
        return (
          <MapJourneyScreen 
            stats={userStats} 
            completedCities={completedCities}
            completedMissions={completedMissions}
            onSelectCity={(city, mission) => {
              setSelectedCity(city);
              if (mission) {
                setSelectedMission(mission);
              }
              // Preload resources for this city
              preloadCityResources(city.id);
              setCurrentScreen(Screen.Story);
            }}
          />
        );
      case Screen.CinematicIntro:
        if (!selectedCity || !selectedMission) return null;
        return (
          <CinematicIntroScreen
            city={selectedCity}
            mission={selectedMission}
            onNext={goToChallenge}
            onClose={() => { setSelectedMission(null); setCurrentScreen(Screen.Map); }}
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
            onStartChallenge={() => setCurrentScreen(Screen.CinematicIntro)}
          />
        );
      case Screen.Challenge:
        if (!selectedCity || !selectedMission) return null;
        return (
          <ChallengeScreen 
            city={selectedCity} 
            mission={selectedMission}
            onComplete={handleMissionComplete}
            onBack={() => setCurrentScreen(Screen.CinematicIntro)}
            redoQuestionIds={redoQuestionIds}
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
        return <ProfileScreen 
          onBack={() => setCurrentScreen(Screen.Map)} 
          onSettings={() => setCurrentScreen(Screen.Settings)} 
          onShowBadges={() => setCurrentScreen(Screen.Badges)}
        />;
      case Screen.Badges:
        return <BadgesScreen onBack={() => setCurrentScreen(Screen.Profile)} />;
      case Screen.Settings:
        return <SettingsScreen onBack={() => setCurrentScreen(Screen.Map)} />;
      case Screen.LevelComplete:
        return (
          <LevelCompleteModal
            summary={missionSummary}
            onReplayMission={() => {
              setRedoQuestionIds(undefined);
              setCurrentScreen(Screen.Challenge);
            }}
            onBackToCity={() => setCurrentScreen(Screen.Map)}
            onRedoIncorrect={(ids) => {
              setRedoQuestionIds(ids);
              setCurrentScreen(Screen.Challenge);
            }}
            onContinue={handleGoToNextMission}
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
      <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col font-sans select-none touch-none">
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
            localStorage.setItem('prefer-fullscreen', 'true');
          }}
          onDecline={() => {
            setShowFullscreenPrompt(false);
            setFullscreenShownOnce(true);
            localStorage.setItem('prefer-fullscreen', 'false');
          }}
          extraAssets={dynamicAssets}
        />
      </div>
    </AudioProvider>
  );
}
