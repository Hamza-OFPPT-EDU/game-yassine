import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Volume2, SkipForward, MapPin, Sparkles } from 'lucide-react';
import { type City, type Mission } from '../types';
import { useAudio } from '../hooks/useAudio';
import { getCityTheme, optimizeSupabaseUrl, resolveAssetUrl } from '../lib/city-theme';

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

  // Default GIF if none provided
  const cinematicGif = optimizeSupabaseUrl(resolveAssetUrl(mission.cinematic_gif_url, "https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/Guide%20de%20voayage.gif"), 500, 70);
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
    <div className="h-screen w-full bg-slate-950 text-white overflow-hidden flex flex-col relative font-sans">
      {/* Background Ambience with subtle parallax-like scale */}
      <motion.div 
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1.05, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <img 
          src={optimizeSupabaseUrl(city.image, 1080, 60)} 
          className="w-full h-full object-cover opacity-30 blur-[2px]" 
          alt="" 
        />
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/90 via-slate-950/40 to-slate-950" />
      </motion.div>

      {/* Header - Fixed */}
      <header className="relative z-20 p-6 flex flex-col gap-4 items-center shrink-0">
        <div className="w-full flex justify-between items-center">
          <motion.button 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={() => { playSound('click'); onClose(); }}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all backdrop-blur-xl border border-white/10 shadow-lg"
          >
            <X size={22} />
          </motion.button>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="h-[15vh] max-h-[120px]"
          >
            <img 
              src={optimizeSupabaseUrl(PANEAU_URL, 800)} 
              alt="Logo" 
              className="h-full object-contain drop-shadow-lg" 
            />
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            {mission.cinematic_audio_url ? (
              <button 
                onClick={toggleAudio}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all backdrop-blur-xl border border-white/10 shadow-lg"
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
           <div className="flex items-center gap-2 px-4 py-1 bg-white/10 rounded-full backdrop-blur-xl border border-white/20 shadow-inner">
              <MapPin size={12} style={{ color: theme.color }} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{city.name}</span>
           </div>
        </motion.div>
      </header>

      {/* Main Content - Scrollable area */}
      <main className="grow relative z-10 flex flex-col items-center overflow-y-auto custom-scrollbar pt-4 pb-12 px-6">
        <div className="w-full max-w-lg flex flex-col items-center">
          
          {/* GIF Character with floating animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: [0, -10, 0] 
            }}
            transition={{ 
              scale: { duration: 0.8, ease: "easeOut" },
              opacity: { duration: 0.8 },
              y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
            }}
            className="relative mb-10 shrink-0"
          >
            <div className="absolute inset-0 bg-white/10 rounded-full blur-[60px] opacity-40 animate-pulse" />
            <img 
              src={cinematicGif} 
              alt="Guide" 
              className="w-56 h-56 object-contain relative z-10 drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]" 
            />
          </motion.div>

          {/* Narrative Content Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="w-full space-y-8 flex flex-col items-center"
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
              
              <h1 className="text-3xl sm:text-4xl font-headline font-black tracking-tight leading-tight italic bg-clip-text text-transparent bg-linear-to-b from-white to-white/60 mb-2">
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
                <div className="max-h-[45vh] overflow-y-auto px-4 custom-scrollbar text-center">
                  <p className="text-base sm:text-lg font-medium leading-[1.8] text-slate-100/90 tracking-wide drop-shadow-sm">
                    {cinematicText}
                  </p>
                </div>
                
                {/* Scroll Indicator (only visible if content is scrollable) */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-30 animate-bounce">
                  <SkipForward size={14} className="rotate-90 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer / CTA - Fixed */}
      <footer className="relative z-20 p-8 flex flex-col items-center gap-6 shrink-0 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent">
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(255,255,255,0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { playSound('click'); onNext(); }}
          className="group relative px-12 py-5 bg-white text-slate-950 rounded-2xl font-black text-xl uppercase tracking-wider flex items-center gap-4 shadow-[0_15px_35px_rgba(255,255,255,0.25)] transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-slate-950/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <span className="relative z-10">C'est parti</span>
          <Play size={24} className="relative z-10 group-hover:translate-x-1 transition-transform fill-current" />
        </motion.button>

        <div className="flex items-center gap-3 text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
          <div className="h-px w-8 bg-white/10" />
          <Sparkles size={12} className="text-voyage-accent" />
          <span>Le Voyage Commence</span>
          <div className="h-px w-8 bg-white/10" />
        </div>
      </footer>

      {/* Particle Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-white rounded-full blur-[1px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full blur-[1px] animate-pulse delay-300" />
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-white rounded-full blur-[2px] animate-pulse delay-700" />
        <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-white rounded-full blur-[1px] animate-pulse delay-1000" />
      </div>
    </div>
  );
}
