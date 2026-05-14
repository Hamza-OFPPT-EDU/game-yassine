import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Volume2, SkipForward, MapPin, Sparkles } from 'lucide-react';
import { type City, type Mission } from '../types';
import { useAudio } from '../hooks/useAudio';
import { getCityTheme, optimizeSupabaseUrl, resolveAssetUrl } from '../lib/city-theme';
import GameButton from '../components/GameButton';

interface CinematicIntroScreenProps {
  city: City;
  mission: Mission;
  onNext: () => void;
  onClose: () => void;
}

const PANEAU_URL = 'https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/paneau.png';

export default function CinematicIntroScreen({ city, mission, onNext, onClose }: CinematicIntroScreenProps) {
  const { playSound } = useAudio();
  const theme = getCityTheme(city);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  // Default GIF if none provided (checking multiple field names for robustness)
  // Priority: 1. Mission specific field from dashboard, 2. Resolve technical names, 3. City level fallback
  const rawGifUrl = mission.cinematic_gif_url || (mission as any).cinematic_gif || (mission as any).cinematic_character;
  const cinematicGif = resolveAssetUrl(rawGifUrl, city.cinematicCharacter || (city as any).cinematic_character || "/assets/intro_caracter.gif");
  const cinematicText = mission.cinematic_text || mission.description_fr || "Préparez-vous pour une nouvelle aventure passionnante !";

  useEffect(() => {
    console.log("🎬 CinematicIntroScreen mounted for mission:", mission.title_fr);
    console.log("🖼️ GIF URL resolved to:", cinematicGif);
  }, [mission.id, cinematicGif]);

  useEffect(() => {
    // Auto-play cinematic audio if provided
    if (mission.cinematic_audio_url) {
      const audio = new Audio(mission.cinematic_audio_url);
      audio.play().then(() => setIsAudioPlaying(true)).catch(e => console.log("Audio autoplay blocked:", e));
      setAudioObj(audio);
      return () => {
        audio.pause();
        audio.src = "";
      };
    }
  }, [mission.cinematic_audio_url]);

  const toggleAudio = () => {
    if (!audioObj) return;
    if (isAudioPlaying) {
      audioObj.pause();
    } else {
      audioObj.play();
    }
    setIsAudioPlaying(!isAudioPlaying);
  };

  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900 overflow-hidden flex flex-col relative font-sans">
      {/* Background Ambience with subtle parallax-like scale */}
      <motion.div
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1.05, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <img
          src={optimizeSupabaseUrl(city.image, 1080, 60)}
          className="w-full h-full object-cover opacity-10 blur-[2px]"
          alt=""
        />
        <div className="absolute inset-0 bg-linear-to-b from-white/90 via-white/40 to-slate-50" />
      </motion.div>

      {/* Header - Stays at top */}
      <header className="relative z-20 p-6 flex flex-col gap-4 items-center shrink-0">
        <div className="w-full flex justify-between items-center">
          <motion.button
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => { playSound('click'); onClose(); }}
            className="p-3 bg-white hover:bg-slate-50 rounded-2xl transition-all border border-slate-200 shadow-md text-slate-600"
          >
            <X size={22} />
          </motion.button>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            {mission.cinematic_audio_url ? (
              <button
                onClick={toggleAudio}
                className="p-3 bg-white hover:bg-slate-50 rounded-2xl transition-all border border-slate-200 shadow-md text-slate-600"
              >
                {isAudioPlaying ? (
                  <Volume2 size={22} className="text-voyage-accent animate-pulse" />
                ) : (
                  <Volume2 size={22} className="opacity-40" />
                )}
              </button>
            ) : <div className="w-12" />}
          </motion.div>
        </div>

        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-slate-200 shadow-sm">
            <MapPin size={12} style={{ color: theme.color }} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{city.name}</span>
          </div>
        </motion.div>
      </header>

      {/* Main Content - Scrollable area */}
      <main className="flex-grow relative z-10 overflow-y-auto px-8 custom-scrollbar">
        <div className="min-h-full flex flex-col items-center justify-center py-12">
          {/* GIF Character */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl" />
            <img
              key={mission.id}
              src={cinematicGif}
              alt="Guide"
              className="w-80 h-80 object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(212,164,62,0.15)]"
              referrerPolicy="no-referrer"
              onError={(e) => {
                console.warn("Cinematic GIF load failed, using fallback");
                e.currentTarget.src = "/assets/intro_caracter.gif";
              }}
            />
          </motion.div>

          {/* Narrative Content Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="w-full space-y-8 flex flex-col items-center max-w-2xl"
          >
            {/* Title Section */}
            <div className="text-center space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="inline-block px-3 py-1 bg-voyage-accent/20 border border-voyage-accent/30 rounded-md mb-2"
              >
                <span className="text-[10px] font-black text-voyage-accent uppercase tracking-[0.3em]">
                  Mission de l'Acte I
                </span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl font-headline font-black tracking-tight leading-tight italic bg-clip-text text-transparent bg-linear-to-b from-slate-900 to-slate-700 mb-2">
                {mission.title_fr}
              </h1>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="arabic-font text-2xl font-black text-voyage-accent/80 mb-4"
              >
                مهمة جديدة في انتظارك
              </motion.h2>

              <div className="flex justify-center">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 80 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="h-1 bg-voyage-accent rounded-full shadow-[0_0_15px_rgba(212,164,62,0.6)]"
                />
              </div>
            </div>


            {/* Scrollable Text Area */}
            <div className="relative w-full">
              <div className="absolute -inset-6 bg-white/[0.03] backdrop-blur-md rounded-[40px] border border-white/5 shadow-2xl" />

              <div className="relative px-2 py-4">
                <div className="px-4 text-center">
                  <p className="text-base sm:text-lg font-medium leading-[1.8] text-slate-600 tracking-wide">
                    {cinematicText}
                  </p>
                </div>

                {/* Scroll Indicator (visual only) */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-30 animate-bounce">
                  <SkipForward size={14} className="rotate-90 text-slate-400" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Spacer for bottom margin to account for fixed footer */}
          <div className="h-64 shrink-0" />
        </div>
      </main>

      {/* Footer / CTA - Fixed at bottom */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 p-8 pb-14 flex flex-col items-center gap-6 bg-linear-to-t from-slate-50 via-slate-50/90 to-transparent pointer-events-none">
        <GameButton
          variant="primary"
          size="lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          onClick={() => { playSound('click'); onNext(); }}
          className="pointer-events-auto px-12 group"
        >
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-slate-950/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative z-10">Lancer la mission</span>
          <Play size={24} className="relative z-10 group-hover:translate-x-1 transition-transform fill-current" />
        </GameButton>

        <div className="flex items-center gap-3 text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">
          <div className="h-px w-8 bg-slate-200" />
          <Sparkles size={12} className="text-voyage-accent" />
          <span>Le Voyage Continue</span>
          <div className="h-px w-8 bg-slate-200" />
        </div>
      </footer>

      {/* Particle Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-voyage-accent rounded-full blur-[1px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-voyage-accent rounded-full blur-[1px] animate-pulse delay-300" />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-voyage-accent rounded-full blur-[2px] animate-pulse delay-700" />
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-voyage-accent rounded-full blur-[1px] animate-pulse delay-1000" />
      </div>
    </div>
  );
}

