import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Volume2, SkipForward, MapPin, Sparkles } from 'lucide-react';
import { type City, type Mission } from '../types';
import { useAudio } from '../hooks/useAudio';
import { getCityTheme, optimizeSupabaseUrl } from '../lib/city-theme';

interface CinematicIntroScreenProps {
  city: City;
  mission: Mission;
  onNext: () => void;
  onClose: () => void;
}

export default function CinematicIntroScreen({ city, mission, onNext, onClose }: CinematicIntroScreenProps) {
  const { playSound } = useAudio();
  const theme = getCityTheme(city);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  // Default GIF if none provided
  const cinematicGif = optimizeSupabaseUrl(mission.cinematic_gif_url || "/assets/intro_caracter.gif", 500, 70);
  const cinematicText = mission.cinematic_text || mission.description_fr || "Préparez-vous pour une nouvelle aventure passionnante !";

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
    <div className="h-screen w-full bg-slate-950 text-white overflow-hidden flex flex-col relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={optimizeSupabaseUrl(city.image, 1080, 60)} 
          className="w-full h-full object-cover opacity-20 blur-sm scale-110" 
          alt="" 
        />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/80 via-transparent to-slate-950" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center">
        <button 
          onClick={() => { playSound('click'); onClose(); }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center">
           <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/10">
              <MapPin size={12} style={{ color: theme.color }} />
              <span className="text-[10px] font-black uppercase tracking-widest">{city.name}</span>
           </div>
        </div>

        {mission.cinematic_audio_url ? (
          <button 
            onClick={toggleAudio}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
          >
            {isAudioPlaying ? <Volume2 size={24} className="text-voyage-accent" /> : <Volume2 size={24} className="opacity-40" />}
          </button>
        ) : <div className="w-10" />}
      </header>

      {/* Main Content */}
      <main className="grow relative z-10 flex flex-col items-center justify-center px-8 text-center">
        {/* GIF Character */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl" />
          <img 
            src={cinematicGif} 
            alt="Guide" 
            className="w-64 h-64 object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(255,255,255,0.2)]" 
          />
        </motion.div>

        {/* Narrative Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-lg space-y-6"
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-headline font-black tracking-tight leading-tight italic">
              {mission.title_fr}
            </h1>
            <div className="flex justify-center">
              <div className="h-1 w-16 bg-white/20 rounded-full" />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-white/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <p className="text-xl font-medium leading-relaxed text-slate-200">
              {cinematicText}
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer / CTA */}
      <footer className="relative z-10 p-10 flex flex-col items-center gap-6">
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { playSound('click'); onNext(); }}
          className="group relative px-10 py-5 bg-white text-slate-950 rounded-full font-black text-xl uppercase tracking-wider flex items-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.3)] hover:shadow-[0_20px_50px_rgba(255,255,255,0.4)] transition-all"
        >
          <span>Commencer la mission</span>
          <Play size={24} className="group-hover:translate-x-1 transition-transform fill-current" />
        </motion.button>

        <div className="flex items-center gap-2 text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
          <Sparkles size={12} />
          <span>Le Voyage Commence</span>
        </div>
      </footer>

      {/* Particle Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse" />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-700" />
        <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-1000" />
      </div>
    </div>
  );
}
