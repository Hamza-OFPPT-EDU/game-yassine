/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { supabase } from './lib/supabase';
import { useSupabaseProfile, saveMissionResult, useSupabaseBadges } from './hooks/useSupabase';
import { useActivityTracker } from './hooks/useActivityTracker';
import { useLeagues } from './hooks/useLeagues';
import { motion, AnimatePresence } from 'motion/react';
import { Screen, type City, type Mission, type MissionCompletionSummary, AVATAR_MALE_URL, AVATAR_FEMALE_URL } from './types';

import { useAudio } from './contexts/AudioContext';
import BottomNavBar from './components/BottomNavBar';
import { Loader2 } from 'lucide-react';
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
import RegisterScreen from './views/RegisterScreen';
import LoginScreen from './views/LoginScreen';
import DuelCompetitionScreen from './views/DuelCompetitionScreen';
import FullscreenPrompt from './components/FullscreenPrompt';
import { useAuth } from './hooks/useSupabase';
import { fetchDynamicAssets, fetchCityMissionAssets, getCoreAssets, getAllAssets } from './lib/assets';
import { useAssetPreloader, type Asset } from './hooks/useAssetPreloader';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Splash);
  const [selectedCity, setSelectedCity] = useState<City | null>(null); 
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [completedCities, setCompletedCities] = useState<string[]>([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [editingLeagueId, setEditingLeagueId] = useState<string | null>(null);
  const [loadingMissions, setLoadingMissions] = useState(false);
  const [missionSummary, setMissionSummary] = useState<MissionCompletionSummary | null>(null);
  const [redoQuestionIds, setRedoQuestionIds] = useState<string[] | undefined>(undefined);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
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
  const { earnedBadges } = useSupabaseBadges(session?.user?.id);
  
  // Track user activities and time spent
  useActivityTracker(session?.user?.id, currentScreen, selectedCity?.id || null);

  const [dynamicAssets, setDynamicAssets] = useState<Asset[]>([]);
  const [loadedCities, setLoadedCities] = useState<string[]>([]);
  const [loadingCityAssets, setLoadingCityAssets] = useState<string | null>(null);
  const [isCoreLoaded, setIsCoreLoaded] = useState(false);

  // Global preloader
  const allAssets = useMemo(() => getAllAssets(dynamicAssets), [dynamicAssets]);
  const { progress, isComplete } = useAssetPreloader(allAssets);

  const [splashComplete, setSplashComplete] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashComplete(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // 30% -> Fullscreen Prompt (kept for utility)
    if (progress >= 30 && !fullscreenShownOnce && !showFullscreenPrompt) {
      if (!document.fullscreenElement && localStorage.getItem('prefer-fullscreen') !== 'false') {
        setShowFullscreenPrompt(true);
      }
    }

    // Switch to Welcome Screen only after 5s splash is complete
    if (splashComplete && currentScreen === Screen.Splash) {
      if (session) {
        setCurrentScreen(Screen.Map);
      } else {
        setCurrentScreen(Screen.Welcome);
      }
    }
  }, [splashComplete, currentScreen, session]);

  /**
   * Robust synchronization of auth user metadata with app_users and player_profiles tables.
   * This ensures that any logged-in user is correctly registered as a player.
   */
  const syncUserProfile = async (user: any) => {
    if (!user) return;
    
    const meta = user.user_metadata || {};
    const fullName = meta.full_name || `${meta.first_name || ''} ${meta.last_name || ''}`.trim() || 'Explorateur';
    const avatarUrl = meta.avatar_url || (meta.gender === 'F' ? AVATAR_FEMALE_URL : AVATAR_MALE_URL);
    
    console.log("Syncing user profile for:", user.id, fullName);

    try {
      // 1. Sync app_users (The main game data table)
      await supabase.from('app_users').upsert({
        id: user.id,
        username: meta.username || user.email?.split('@')[0] || 'voyageur',
        full_name: fullName,
        first_name: meta.first_name || '',
        last_name: meta.last_name || '',
        gender: meta.gender || 'H',
        avatar_url: avatarUrl,
        group_name: meta.group_name || 'Général',
        birth_date: meta.birth_date || null,
        // Don't overwrite existing stats if record exists
      }, { onConflict: 'id', ignoreDuplicates: true });

      // 2. Sync player_profiles (The dashboard/social table)
      await supabase.from('player_profiles').upsert({
        id: user.id,
        display_name: fullName,
        profile_type: 'Le Stratège',
        // Don't overwrite existing stats if record exists
      }, { onConflict: 'id', ignoreDuplicates: true });

      // Trigger profile reload in useSupabaseProfile hook if needed
      // (The hook already listens to userId changes)
    } catch (error) {
      console.error("Profile sync failed:", error);
    }
  };

  // Auto-sync effect whenever session changes
  useEffect(() => {
    if (session?.user) {
      syncUserProfile(session.user);
    }
  }, [session?.user?.id]);
  
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
    async function loadResourcesSequentially() {
      try {
        // 1. Load Core Assets (Logo, Sounds, Video) - Priority
        const coreAssets = getCoreAssets();
        setDynamicAssets(coreAssets);
        setIsCoreLoaded(true); 
        
        // Give time for SplashScreen to finish transition before starting background heavy loads
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 2. Load Rabat Assets in background
        const rabatAssets = await fetchDynamicAssets('Rabat');
        setDynamicAssets(prev => {
          const existingUrls = new Set(prev.map(a => a.url));
          const uniqueRabat = rabatAssets.filter(a => !existingUrls.has(a.url));
          return [...prev, ...uniqueRabat];
        });
        setLoadedCities(prev => [...prev, 'Rabat']);

        // 3. Load other cities successively in background
        const otherCities = ['Chefchaouen', 'Fès', 'Marrakech', 'Laâyoune', 'Dakhla'];
        for (const city of otherCities) {
          await new Promise(resolve => setTimeout(resolve, 3000));
          const cityAssets = await fetchDynamicAssets(city);
          setDynamicAssets(prev => {
            const existingUrls = new Set(prev.map(a => a.url));
            const uniqueCity = cityAssets.filter(a => !existingUrls.has(a.url));
            return [...prev, ...uniqueCity];
          });
          setLoadedCities(prev => [...prev, city]);
        }
      } catch (err) {
        console.error('Error in sequential asset loading:', err);
      }
    }
    loadResourcesSequentially();
  }, []);

  const preloadCityResources = async (cityId: string) => {
    if (loadedCities.includes(cityId) || loadingCityAssets === cityId) return;
    // (Existing logic can stay as a fallback if needed, but the sequential loop will handle most)
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

  const introAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize and handle Global Background Music (intro_music)
  useEffect(() => {
    if (!introAudioRef.current) {
      introAudioRef.current = new Audio('/audio/intro_music.mp3');
      introAudioRef.current.loop = true;
      
      const playAudio = () => {
        introAudioRef.current?.play().catch(() => {
          window.addEventListener('click', playAudio, { once: true });
        });
      };
      playAudio();
    }

    return () => {
      if (introAudioRef.current) {
        introAudioRef.current.pause();
        introAudioRef.current.src = "";
        introAudioRef.current = null;
      }
    };
  }, []);

  const { settings } = useAudio();
  
  // Sync volume based on screen changes without restarting
  useEffect(() => {
    if (introAudioRef.current) {
      const isIntroScreen = [Screen.Splash, Screen.Welcome, Screen.Login, Screen.Register].includes(currentScreen);
      const baseVolume = isIntroScreen ? 0.6 : 0.05;
      
      if (settings.musicEnabled) {
        introAudioRef.current.volume = baseVolume * (settings.musicVolume / 100) * (settings.masterVolume / 100);
        // Play if it was paused but should be playing
        if (introAudioRef.current.paused) {
          introAudioRef.current.play().catch(() => {});
        }
      } else {
        introAudioRef.current.volume = 0;
        introAudioRef.current.pause();
      }
    }
  }, [currentScreen, settings.musicVolume, settings.musicEnabled]);

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
      const nextXp = userStats.xp + summary.totalXp;
      // Level calculation: 1 level every 1000 XP
      const nextLevel = Math.floor(nextXp / 1000) + 1;
      
      const newStats = {
        xp: nextXp,
        stars: userStats.stars + summary.totalStars,
        level: nextLevel
      };
      
      setCompletedMissions((prev) => [...prev, summary.missionId]);
      setUserStats(newStats);

      // Persist to Supabase (updates both app_users and player_profiles via useSupabaseProfile)
      updateProfile({
        xp: newStats.xp,
        stars: newStats.stars,
        level: newStats.level
      });

      // Log detailed history to act_results and update player_city_progress
      if (session?.user?.id) {
        saveMissionResult(summary, session.user.id, !!redoQuestionIds);
      }
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




  const renderScreen = () => {
    const screenContent = () => {

    if (authLoading) {
      if (currentScreen === Screen.Splash) {
        return <SplashScreen />;
      }
      return <div className="h-full w-full flex items-center justify-center bg-[#0a0f1e]"><Loader2 className="animate-spin text-white" size={40} /></div>; 
    }

    switch (currentScreen) {
      case Screen.Splash:
        return <SplashScreen />;
      case Screen.Welcome:
        return <WelcomeScreen 
          onLogin={() => setCurrentScreen(Screen.Login)}
          onRegister={() => setCurrentScreen(Screen.Register)}
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
            userStats={{
              ...userStats,
              cities: completedCities.length,
              badges: earnedBadges.length
            }}
            onSelectLeague={(id) => {
              setSelectedLeagueId(id);
              setCurrentScreen(Screen.LeagueDetail);
            }}
            onCreateLeague={() => {
              setEditingLeagueId(null);
              setCurrentScreen(Screen.LeagueCreate);
            }}
            onEditLeague={(id) => {
              setEditingLeagueId(id);
              setCurrentScreen(Screen.LeagueCreate);
            }}
            onEnterDuel={() => setCurrentScreen(Screen.Duel)}
            onBack={() => setCurrentScreen(Screen.Map)} 
          />
        );
      case Screen.LeagueCreate:
        return (
          <LeagueCreateScreen 
            userStats={{
              ...userStats,
              cities: completedCities.length,
              badges: earnedBadges.length
            }}
            leagueId={editingLeagueId || undefined}
            onBack={() => setCurrentScreen(Screen.League)} 
            onCreated={() => setCurrentScreen(Screen.League)} 
          />
        );
      case Screen.LeagueDetail:
        return (
          <LeagueDetailScreen 
            leagueId={selectedLeagueId || 'bronze'} 
            onBack={() => setCurrentScreen(Screen.League)} 
            onShowBadges={() => setCurrentScreen(Screen.Badges)}
            onContinueAdventure={() => setCurrentScreen(Screen.Map)}
          />
        );
      case Screen.VocabularyMatch:
        return <VocabularyMatchScreen onBack={() => setCurrentScreen(Screen.Map)} />;
      case Screen.Profile:
        return (
          <ProfileScreen 
            onBack={() => setCurrentScreen(Screen.Map)}
            onSettings={() => setCurrentScreen(Screen.Settings)}
            onShowBadges={() => setCurrentScreen(Screen.Badges)}
            onLogout={() => {
              setCurrentScreen(Screen.Welcome);
            }}
            completedMissions={completedMissions}
          />
        );
      case Screen.Badges:
        return <BadgesScreen onBack={() => setCurrentScreen(Screen.Profile)} />;
      case Screen.Duel:
        return (
          <DuelCompetitionScreen 
            onBack={() => setCurrentScreen(Screen.League)} 
            onHome={() => setCurrentScreen(Screen.Map)} 
          />
        );
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
        return null;
      }
    };
    return (
      <div className="relative h-full w-full">
        {screenContent()}
      </div>
    );
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
    <div className="relative h-screen w-full bg-slate-50 overflow-hidden flex flex-col font-sans select-none touch-none">
        <div className="grow overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={showFullscreenPrompt ? 'prompt' : currentScreen}
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

        {/* Global Overlays */}
        {showFullscreenPrompt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
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
              progress={progress}
              extraAssets={dynamicAssets}
            />
          </div>
        )}


      </div>
  );
}
