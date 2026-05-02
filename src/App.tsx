/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Screen, type City, type Mission, type MissionCompletionSummary } from './types';
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
import { preloadAssets, Asset } from './lib/preloader';

// Static assets to preload
const STATIC_ASSETS: Asset[] = [
  { url: 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/splash%20vedio.mp4', type: 'video' },
  { url: 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/intro_caracter.png', type: 'image' },
  { url: '/audio/correct.mp3', type: 'audio' },
  { url: '/audio/wrong.mp3', type: 'audio' },
  { url: '/audio/click.mp3', type: 'audio' },
  { url: '/audio/match.mp3', type: 'audio' },
  { url: '/audio/success.mp3', type: 'audio' },
  { url: '/audio/whoosh.mp3', type: 'audio' },
  { url: '/audio/rabat_intro_voice.mp3', type: 'audio' },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Splash);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedCity, setSelectedCity] = useState<City | null>(null); 
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [completedCities, setCompletedCities] = useState<string[]>([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [loadingMissions, setLoadingMissions] = useState(false);
  const [missionSummary, setMissionSummary] = useState<MissionCompletionSummary | null>(null);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
  const [fullscreenShownOnce, setFullscreenShownOnce] = useState(false);
  const [userStats, setUserStats] = useState({
    xp: 1450,
    stars: 120,
    level: 4,
  });

  /** Navigate to Challenge, showing the fullscreen prompt the first time. */
  const goToChallenge = () => {
    if (!fullscreenShownOnce) {
      setShowFullscreenPrompt(true);
    } else {
      setCurrentScreen(Screen.Challenge);
    }
  };

  useEffect(() => {
    async function startPreloading() {
      if (currentScreen !== Screen.Splash) return;

      try {
        // 1. Fetch cities to get dynamic assets
        const { data: cityData } = await supabase
          .from('challenges')
          .select('illustration_url, icon_name');

        const dynamicAssets: Asset[] = [];
        if (cityData) {
          cityData.forEach(city => {
            if (city.illustration_url) {
              dynamicAssets.push({ url: city.illustration_url, type: 'image' });
            }
            if (city.icon_name && city.icon_name.startsWith('http')) {
              dynamicAssets.push({ url: city.icon_name, type: 'image' });
            }
          });
        }

        const allAssets = [...STATIC_ASSETS, ...dynamicAssets];
        
        // 2. Start preloading
        await preloadAssets(allAssets, (p) => {
          setLoadingProgress(p);
        });

        // 3. Small delay for smooth transition
        setTimeout(() => {
          setCurrentScreen(Screen.Welcome);
        }, 500);
      } catch (error) {
        console.error('Preloading failed:', error);
        // Fallback: move to welcome after a delay
        setTimeout(() => setCurrentScreen(Screen.Welcome), 3000);
      }
    }

    startPreloading();
  }, [currentScreen]);

  useEffect(() => {
    async function fetchFirstMission() {
      if (selectedCity) {
        setLoadingMissions(true);
        console.log('🚀 Fetching first mission for city:', selectedCity.id, selectedCity.name);
        
        // Try fetching with city_id first
        let { data: missions, error } = await supabase
          .from('missions')
          .select('*')
          .eq('city_id', selectedCity.id)
          .order('sort_order', { ascending: true });
        
        // If no missions found, try with challenge_id
        if (!error && (!missions || missions.length === 0)) {
          console.log('⚠️ No missions with city_id, trying challenge_id...');
          const { data: challengeData, error: challengeError } = await supabase
            .from('missions')
            .select('*')
            .eq('challenge_id', selectedCity.id)
            .order('sort_order', { ascending: true });
          
          if (!challengeError) {
            missions = challengeData;
            console.log('✅ Found missions with challenge_id');
          } else {
            error = challengeError;
          }
        }
        
        console.log('📊 Query result:', { error, missionsCount: missions?.length || 0, missions });
        
        if (!error && missions && missions.length > 0) {
          // Find the first incomplete mission
          const nextMission = missions.find(m => !completedMissions.includes(m.id)) || missions[0];
          console.log('✅ Next mission selected:', nextMission.title_fr);
          setSelectedMission(nextMission);
        } else {
          // If no missions found, set to null
          console.warn('❌ No missions found for city:', selectedCity.id);
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
      setCompletedMissions((prev) => [...prev, summary.missionId]);
      setUserStats((prev) => ({
        ...prev,
        xp: prev.xp + summary.totalXp,
        stars: prev.stars + summary.totalStars,
      }));
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

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.Splash:
        return <SplashScreen progress={loadingProgress} />;
      case Screen.Welcome:
        return <WelcomeScreen onStart={() => setCurrentScreen(Screen.Map)} />;
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
        if (!selectedCity) return <MapJourneyScreen stats={userStats} completedCities={completedCities} completedMissions={completedMissions} onSelectCity={(city) => { setSelectedCity(city); setCurrentScreen(Screen.Story); }} />;
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
        if (!selectedCity || !selectedMission) {
          // If we somehow got here without a mission, go back to map
          setSelectedCity(null);
          setSelectedMission(null);
          return <MapJourneyScreen stats={userStats} completedCities={completedCities} completedMissions={completedMissions} onSelectCity={(city) => { setSelectedCity(city); setCurrentScreen(Screen.Story); }} />;
        }
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
        return <SplashScreen progress={loadingProgress} />;
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
    <div className="relative h-screen w-full bg-white overflow-hidden flex flex-col">
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

      {/* Fullscreen prompt — shown once before first challenge */}
      <FullscreenPrompt
        show={showFullscreenPrompt}
        onAccept={() => {
          setShowFullscreenPrompt(false);
          setFullscreenShownOnce(true);
          setCurrentScreen(Screen.Challenge);
        }}
        onDecline={() => {
          setShowFullscreenPrompt(false);
          setFullscreenShownOnce(true);
          setCurrentScreen(Screen.Challenge);
        }}
      />
    </div>
  );
}
