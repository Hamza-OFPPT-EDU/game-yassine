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
import { lazy, Suspense } from 'react';
import { useSettings } from './contexts/SettingsContext';
import { cn } from './lib/utils';
const SplashScreen = lazy(() => import('./views/SplashScreen'));
const WelcomeScreen = lazy(() => import('./views/WelcomeScreen'));
const MapJourneyScreen = lazy(() => import('./views/MapJourneyScreen'));
const StoryScreen = lazy(() => import('./views/StoryScreen'));
const ChallengeScreen = lazy(() => import('./views/ChallengeScreen'));
const ProfileScreen = lazy(() => import('./views/ProfileScreen'));
const SettingsScreen = lazy(() => import('./views/SettingsScreen'));
const CinematicIntroScreen = lazy(() => import('./views/CinematicIntroScreen'));
const BadgesScreen = lazy(() => import('./views/BadgesScreen'));
const LeagueScreen = lazy(() => import('./views/LeagueScreen'));
const LeagueDetailScreen = lazy(() => import('./views/LeagueDetailScreen'));
const LeagueCreateScreen = lazy(() => import('./views/LeagueCreateScreen'));
const RegisterScreen = lazy(() => import('./views/RegisterScreen'));
const LoginScreen = lazy(() => import('./views/LoginScreen'));
const DuelCompetitionScreen = lazy(() => import('./views/DuelCompetitionScreen'));
const LevelCompleteModal = lazy(() => import('./components/LevelCompleteModal'));
import FullscreenPrompt from './components/FullscreenPrompt';
import { useAuth } from './hooks/useSupabase';
import { fetchDynamicAssets, getAssetsByPriority } from './lib/assets';
import { useResourceCache, getCachedAssetList, setCachedAssetList } from './hooks/useResourceCache';
import { type Asset } from './hooks/useAssetPreloader';
import LoadingModal from './components/LoadingModal';

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

  const { language } = useSettings();
  const { session, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useSupabaseProfile(session?.user?.id);
  const { earnedBadges } = useSupabaseBadges(session?.user?.id);
  
  // Track user activities and time spent
  useActivityTracker(session?.user?.id, currentScreen, selectedCity?.id || null);

  const [dynamicAssets, setDynamicAssets] = useState<Asset[]>([]);
  const [loadedCities, setLoadedCities] = useState<string[]>([]);
  const [isCoreLoaded, setIsCoreLoaded] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);

  // Priority groups for the resource cache
  const priorityGroups = useMemo(() => getAssetsByPriority(dynamicAssets), [dynamicAssets]);

  // NEW: unified cache-aware preloader
  const cacheState = useResourceCache(priorityGroups);
  const { progress, isComplete: assetsComplete } = cacheState;

  const [splashStarted, setSplashStarted] = useState(false);
  const [splashComplete, setSplashComplete] = useState(false);
  
  const splashTimerRef = useRef<boolean>(false);

  useEffect(() => {
    // Only start splash timer once fullscreen prompt is handled
    if (fullscreenShownOnce && !splashTimerRef.current) {
      splashTimerRef.current = true;
      setSplashStarted(true);
      // Fixed 4-second splash duration
      const timer = setTimeout(() => {
        setSplashComplete(true);
      }, 4000);
      return () => { clearTimeout(timer); };
    }
  }, [fullscreenShownOnce]);

  // Fullscreen Prompt Logic
  useEffect(() => {
    if (!fullscreenShownOnce && !showFullscreenPrompt) {
      const isPreferFalse = localStorage.getItem('prefer-fullscreen') === 'false';
      const isFullscreen = !!document.fullscreenElement;
      
      if (!isFullscreen && !isPreferFalse) {
        setShowFullscreenPrompt(true);
      } else {
        // Fullscreen is already active or user declined previously, proceed to splash
        setFullscreenShownOnce(true);
      }
    }
  }, [fullscreenShownOnce, showFullscreenPrompt]);

  // Screen Switching Logic
  useEffect(() => {
    if (splashComplete) {
      if (currentScreen === Screen.Splash) {
        setCurrentScreen(Screen.Welcome);
        // Show loading modal after splash — assets continue loading in background
        if (!assetsComplete) {
          setShowLoadingModal(true);
        }
      }
    }
    
    if (session && [Screen.Welcome, Screen.Login, Screen.Register].includes(currentScreen)) {
      const timer = setTimeout(() => {
        setCurrentScreen(Screen.Map);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [splashComplete, currentScreen, session, authLoading, assetsComplete]);

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
    async function loadResourcesPrioritized() {
      try {
        // Try localStorage cache first to avoid DB round-trip
        const cached = getCachedAssetList();
        if (cached) {
          setDynamicAssets(cached.flat());
          setIsCoreLoaded(true);
          return;
        }
        // Fetch from DB
        const allDynamic = await fetchDynamicAssets();
        setDynamicAssets(allDynamic);
        setIsCoreLoaded(true);
        // Cache the result
        setCachedAssetList(getAssetsByPriority(allDynamic));
      } catch (err) {
        console.error('Error in prioritized asset loading:', err);
      }
    }
    loadResourcesPrioritized();
  }, []);

  const preloadCityResources = async (cityId: string) => {
    if (loadedCities.includes(cityId)) return;
    // Assets handled by the priority cache system
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

  const handleCorrectAnswer = (xpReward: number, starsReward: number) => {
    if (!selectedMission || completedMissions.includes(selectedMission.id)) return;

    const nextXp = userStats.xp + xpReward;
    const nextLevel = Math.floor(nextXp / 1000) + 1;

    const newStats = {
      xp: nextXp,
      stars: userStats.stars + starsReward,
      level: nextLevel
    };

    setUserStats(newStats);

    // Mise à jour temps réel dans Supabase
    updateProfile({
      xp: newStats.xp,
      stars: newStats.stars,
      level: newStats.level
    });
  };

  const handleMissionComplete = (summary: MissionCompletionSummary) => {
    setMissionSummary(summary);

    const wasAlreadyCompleted = completedMissions.includes(summary.missionId);
    if (!wasAlreadyCompleted) {
      setCompletedMissions((prev) => [...prev, summary.missionId]);

      // Log detailed history to act_results and update player_city_progress
      if (session?.user?.id) {
        saveMissionResult(summary, session.user.id, !!redoQuestionIds, true);
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

  const showNavBar = [Screen.Map, Screen.Profile, Screen.Settings, Screen.League, Screen.LeagueDetail, Screen.LeagueCreate].includes(currentScreen);




  const renderScreen = () => {
    const screenContent = () => {
      const isInitialScreen = [Screen.Splash, Screen.Welcome, Screen.Login, Screen.Register].includes(currentScreen);
      if (authLoading && !isInitialScreen) {
        return (
          <div className="h-full w-full flex items-center justify-center bg-voyage-sand" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-voyage-primary" size={40} />
              <p className={cn("text-[10px] font-black text-voyage-primary uppercase tracking-widest animate-pulse", language === 'ar' && "arabic-font")}>
                {language === 'ar' ? 'جاري التحقق من الجلسة...' : 'Vérification de session...'}
              </p>
            </div>
          </div>
        );
      }

      switch (currentScreen) {
      case Screen.Splash:
        return <SplashScreen progress={progress} extraAssets={dynamicAssets} logs={cacheState.logs} />;
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
            profile={profile}
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
            onCorrectAnswer={handleCorrectAnswer}
          />
        );
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
            userStats={{
              ...userStats,
              cities: completedCities.length,
              badges: earnedBadges.length
            }}
            onBack={() => setCurrentScreen(Screen.League)} 
            onShowBadges={() => setCurrentScreen(Screen.Badges)}
            onContinueAdventure={() => setCurrentScreen(Screen.Map)}
          />
        );
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
            completedCities={completedCities}
          />
        );
      case Screen.Badges:
        return <BadgesScreen onBack={() => setCurrentScreen(Screen.Profile)} />;
      case Screen.Duel:
        return (
          <DuelCompetitionScreen 
            userProfile={profile}
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
      case Screen.League:
      case Screen.LeagueDetail:
      case Screen.LeagueCreate: return 'league';
      default: return 'journey';
    }
  };

  return (
    <div 
      className={cn(
        "relative h-screen w-full bg-white overflow-hidden flex flex-col font-sans select-none touch-none",
        language === 'ar' && "arabic-font"
      )}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
        <div className="grow overflow-hidden relative">
          <AnimatePresence>
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Suspense fallback={
                <div className="h-full w-full flex items-center justify-center bg-voyage-sand" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-voyage-primary" size={32} />
                    <p className={cn("text-[10px] font-black text-voyage-primary uppercase tracking-widest animate-pulse", language === 'ar' && "arabic-font")}>
                      {language === 'ar' ? 'جاري التحميل...' : 'Initialisation...'}
                    </p>
                  </div>
                </div>
              }>
                {renderScreen()}
              </Suspense>
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
                  case 'league': setCurrentScreen(Screen.League); break;
                }
              }} 
            />
          </div>
        )}

        {/* Global Overlays */}
        <AnimatePresence>
          {showFullscreenPrompt && (
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
          )}
        </AnimatePresence>

        {/* Loading Modal — shown after splash while secondary assets load */}
        <LoadingModal
          visible={showLoadingModal}
          onDismiss={() => setShowLoadingModal(false)}
          {...cacheState}
        />

      </div>
  );
}
