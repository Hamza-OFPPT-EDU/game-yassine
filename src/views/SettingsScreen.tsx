import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Sun, Moon, Laptop, Save, Volume2, VolumeX, Music, Bell, Play, ZoomIn, Loader2, CheckCircle2 } from 'lucide-react';
import { useSettings, type FontSize, type DisplayMode, type Language } from '../contexts/SettingsContext';
import TopAppBar from '../components/TopAppBar';
import { cn } from '../lib/utils';
import { useAudio } from '../hooks/useAudio';
import { useSupabaseProfile, useAuth } from '../hooks/useSupabase';
import { DEFAULT_AVATAR_URL } from '../types';
import { optimizeSupabaseUrl } from '../lib/city-theme';

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const { session } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useSupabaseProfile(session?.user?.id);
  const { 
    fontSize, setFontSize, 
    freeExploration, setFreeExploration,
    displayMode: globalDisplayMode, setDisplayMode: setGlobalDisplayMode,
    language: globalLanguage, setLanguage: setGlobalLanguage
  } = useSettings();
  
  const [userName, setUserName] = useState('');
  const [displayMode, setDisplayMode] = useState<DisplayMode>(globalDisplayMode);
  const [language, setLanguage] = useState<Language>(globalLanguage);
  const { settings: audio, updateSettings: updateAudio, playSound, saveToCloud } = useAudio();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync local state with global/profile state on load
  useEffect(() => {
    if (profile) {
      setUserName(profile.display_name || profile.full_name || '');
    }
  }, [profile]);

  useEffect(() => {
    setDisplayMode(globalDisplayMode);
    setLanguage(globalLanguage);
  }, [globalDisplayMode, globalLanguage]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    playSound('click');
    
    try {
      // 1. Update Profile in Supabase
      if (session?.user?.id) {
        await updateProfile({
          display_name: userName,
        });
      }

      // 2. Update Audio Settings in Supabase
      await saveToCloud();

      // 3. Update Global Context (localStorage)
      setGlobalDisplayMode(displayMode);
      setGlobalLanguage(language);

      setSaveSuccess(true);
      playSound('success');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Erreur lors de la sauvegarde. Vérifiez votre connexion.');
    } finally {
      setIsSaving(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-voyage-sand">
        <Loader2 className="animate-spin text-voyage-primary" size={40} />
      </div>
    );
  }

  const stats = {
    xp: profile?.xp || 0,
    stars: profile?.stars || 0,
    level: profile?.level || 1
  };

  return (
    <div className="h-full w-full bg-voyage-sand flex flex-col overflow-hidden">
      <TopAppBar stats={stats} title="Réglages" onBack={onBack} showProgress={false} />
      
      <main className="flex-grow overflow-y-auto px-6 py-10 space-y-10 max-w-md mx-auto w-full relative scrollbar-hide">
        <div className="absolute inset-0 zellige-pattern pointer-events-none opacity-5" />

        {/* Profile Section */}
        <section className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2rem] overflow-hidden shadow-xl ring-4 ring-white bg-white">
              <img 
                alt="User Avatar" 
                className="w-full h-full object-cover" 
                src={optimizeSupabaseUrl(profile?.avatar_url || DEFAULT_AVATAR_URL, 256, 80)} 
                referrerPolicy="no-referrer"
              />
            </div>
            <button className="absolute -bottom-2 -right-2 bg-voyage-primary text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95">
              <User size={20} />
            </button>
          </div>
          <h2 className="mt-6 text-2xl font-headline font-black text-voyage-primary tracking-tight">Paramètres du profil</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">إعدادات الملف الشخصي</p>
        </section>

        {/* Username Entry */}
        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Nom d'utilisateur</label>
              <span className="text-[10px] font-bold text-voyage-accent opacity-60">اسم المستخدم</span>
            </div>
            <input 
              className="w-full bg-slate-50 border-none rounded-xl px-4 py-4 text-slate-800 focus:ring-2 focus:ring-voyage-primary/10 font-bold text-lg" 
              type="text" 
              placeholder="Ton pseudo..."
              value={userName} 
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
        </section>

        {/* Zoom du texte */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-1 rounded-full bg-duo-yellow" />
            <h3 className="text-lg font-headline font-black text-voyage-primary tracking-tight flex items-center gap-2">
              Taille du texte <span className="font-normal text-slate-300 text-xs">حجم النص</span>
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'small', label: 'Petit', ar: 'صغير', size: 16 },
              { id: 'medium', label: 'Moyen', ar: 'متوسط', size: 19 },
              { id: 'large', label: 'Grand', ar: 'كبير', size: 22 },
              { id: 'extra-large', label: 'Très Grand', ar: 'كبير جداً', size: 25 },
            ].map((size) => (
              <button
                key={size.id}
                onClick={() => {
                  setFontSize(size.id as FontSize);
                  playSound('click');
                }}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-2xl transition-all border-2 text-left",
                  fontSize === size.id 
                    ? "bg-voyage-primary text-white border-voyage-primary shadow-lg" 
                    : "bg-white text-slate-400 border-transparent hover:border-slate-100 shadow-sm"
                )}
              >
                <ZoomIn size={size.size} className={fontSize === size.id ? "text-white" : "text-slate-300"} />
                <div>
                  <div className="text-xs font-black uppercase tracking-widest leading-none">{size.label}</div>
                  <div className="text-[9px] opacity-60 font-bold mt-1 leading-none">{size.ar}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Display Settings */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-1 rounded-full bg-voyage-accent" />
            <h3 className="text-lg font-headline font-black text-voyage-primary tracking-tight flex items-center gap-2">
              Mode d'affichage <span className="font-normal text-slate-300 text-xs">وضع العرض</span>
            </h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', icon: Sun, label: 'Clair', ar: 'مضيء' },
              { id: 'dark', icon: Moon, label: 'Sombre', ar: 'مظلم' },
              { id: 'system', icon: Laptop, label: 'Système', ar: 'النظام' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  setDisplayMode(mode.id as DisplayMode);
                  playSound('click');
                }}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-5 rounded-2xl transition-all border-2",
                  displayMode === mode.id 
                    ? "bg-voyage-primary text-white border-voyage-primary shadow-lg ring-4 ring-voyage-primary/5" 
                    : "bg-white text-slate-400 border-transparent hover:border-slate-100"
                )}
              >
                <mode.icon size={24} />
                <div className="text-center">
                  <div className="text-xs font-black uppercase tracking-widest">{mode.label}</div>
                  <div className="text-[9px] opacity-60 font-bold mt-0.5">{mode.ar}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Language Settings */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-1 rounded-full bg-voyage-terracotta" />
            <h3 className="text-lg font-headline font-black text-voyage-primary tracking-tight flex items-center gap-2">
              Langue d'affichage <span className="font-normal text-slate-300 text-xs">لغة العرض</span>
            </h3>
          </div>
          
          <div className="bg-white rounded-2xl p-2 flex gap-1 shadow-sm border border-slate-50">
            <button 
              onClick={() => {
                setLanguage('fr');
                playSound('click');
              }}
              className={cn(
                "flex-1 py-4 px-6 rounded-xl font-black text-sm uppercase tracking-widest transition-all",
                language === 'fr' ? "bg-voyage-accent/10 text-voyage-accent" : "text-slate-400 hover:bg-slate-50"
              )}
            >
              Français
            </button>
            <button 
              onClick={() => {
                setLanguage('ar');
                playSound('click');
              }}
              className={cn(
                "flex-1 py-4 px-6 rounded-xl font-black text-sm uppercase tracking-widest transition-all",
                language === 'ar' ? "bg-voyage-accent/10 text-voyage-accent" : "text-slate-400 hover:bg-slate-50"
              )}
            >
              العربية
            </button>
          </div>
        </section>

        {/* Free Exploration Mode */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-1 rounded-full bg-duo-green" />
            <h3 className="text-lg font-headline font-black text-voyage-primary tracking-tight flex items-center gap-2">
              Mode Libre <span className="font-normal text-slate-300 text-xs">الوضع الحر</span>
            </h3>
          </div>
          
          <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-11 h-11 rounded-2xl flex items-center justify-center transition-colors",
                  freeExploration ? "bg-duo-green/10" : "bg-slate-100"
                )}>
                  <Play size={20} className={freeExploration ? "text-duo-green" : "text-slate-400"} />
                </div>
                <div>
                  <p className="font-black text-voyage-primary text-sm">Déverrouiller tout</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">فتح جميع المستويات</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setFreeExploration(!freeExploration);
                  playSound('click');
                }}
                className={cn(
                  "relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none border-b-4",
                  freeExploration
                    ? "bg-duo-green border-duo-green-dark"
                    : "bg-slate-200 border-slate-300"
                )}
              >
                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className={cn(
                    "absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md",
                    freeExploration ? "left-[calc(100%-1.75rem)]" : "left-0.5"
                  )}
                />
              </button>
            </div>
            <div className="px-6 pb-6 pt-0">
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">
                Activez ce mode pour accéder à toutes les villes et missions sans restriction de progression.
              </p>
            </div>
          </div>
        </section>

        {/* ── Audio & Effets Sonores ── */}
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-1 rounded-full bg-voyage-accent" />
            <h3 className="text-lg font-headline font-black text-voyage-primary tracking-tight flex items-center gap-2">
              Audio &amp; Effets Sonores
              <span className="font-normal text-slate-300 text-xs">الصوت والمؤثرات</span>
            </h3>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">

            {/* Toggle – Effets sonores */}
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-11 h-11 rounded-2xl flex items-center justify-center transition-colors",
                  audio.soundEffectsEnabled ? "bg-voyage-accent/10" : "bg-slate-100"
                )}>
                  <Bell size={20} className={audio.soundEffectsEnabled ? "text-voyage-accent" : "text-slate-400"} />
                </div>
                <div>
                  <p className="font-black text-voyage-primary text-sm">Effets Sonores</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">مؤثرات صوتية</p>
                </div>
              </div>
              <button
                onClick={() => updateAudio({ soundEffectsEnabled: !audio.soundEffectsEnabled })}
                className={cn(
                  "relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none border-b-4",
                  audio.soundEffectsEnabled
                    ? "bg-voyage-accent border-voyage-accent/60"
                    : "bg-slate-200 border-slate-300"
                )}
              >
                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className={cn(
                    "absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md",
                    audio.soundEffectsEnabled ? "left-[calc(100%-1.75rem)]" : "left-0.5"
                  )}
                />
              </button>
            </div>

            {/* Slider – Volume des effets */}
            <AnimatePresence>
              {audio.soundEffectsEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 pt-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                        <VolumeX size={14} />
                        <span>Volume des effets</span>
                      </div>
                      <span className="text-xs font-black text-voyage-accent">{audio.effectsVolume}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range" min={0} max={100}
                        value={audio.effectsVolume}
                        onChange={e => updateAudio({ effectsVolume: Number(e.target.value) })}
                        onMouseUp={() => playSound('correct')}
                        onTouchEnd={() => playSound('correct')}
                        className="flex-1 accent-voyage-accent h-2 cursor-pointer"
                      />
                      <Volume2 size={16} className="text-voyage-accent shrink-0" />
                    </div>
                    {/* Aperçu sons */}
                    <div className="flex gap-2 pt-1 flex-wrap">
                      {([
                        { type: 'correct' as const, label: '✓ Correct',  color: 'bg-voyage-primary/10  text-voyage-primary  border-voyage-primary/20'  },
                        { type: 'wrong'   as const, label: '✗ Erreur',   color: 'bg-voyage-terracotta/10 text-voyage-terracotta border-voyage-terracotta/20' },
                        { type: 'match'   as const, label: '🔗 Match',   color: 'bg-voyage-accent/10   text-voyage-accent   border-voyage-accent/20'   },
                        { type: 'success' as const, label: '🏆 Succès',  color: 'bg-voyage-accent/20 text-voyage-primary border-voyage-accent/30' },
                        { type: 'whoosh'  as const, label: '💨 Whoosh',  color: 'bg-slate-50     text-slate-400 border-slate-100'    },
                        { type: 'click'   as const, label: '🖱 Clic',    color: 'bg-slate-50      text-slate-400  border-slate-100'     },
                      ]).map(s => (
                        <button
                          key={s.type}
                          onClick={() => playSound(s.type)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black border-2 border-b-4 uppercase tracking-widest active:border-b-0 active:translate-y-[2px] transition-all",
                            s.color
                          )}
                        >
                          <Play size={10} />
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle – Musique de fond */}
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-11 h-11 rounded-2xl flex items-center justify-center transition-colors",
                  audio.musicEnabled ? "bg-voyage-primary/10" : "bg-slate-100"
                )}>
                  <Music size={20} className={audio.musicEnabled ? "text-voyage-primary" : "text-slate-400"} />
                </div>
                <div>
                  <p className="font-black text-voyage-primary text-sm">Musique de fond</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">موسيقى الخلفية</p>
                </div>
              </div>
              <button
                onClick={() => updateAudio({ musicEnabled: !audio.musicEnabled })}
                className={cn(
                  "relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none border-b-4",
                  audio.musicEnabled
                    ? "bg-voyage-primary border-voyage-primary/60"
                    : "bg-slate-200 border-slate-300"
                )}
              >
                <motion.span
                  layout
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className={cn(
                    "absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md",
                    audio.musicEnabled ? "left-[calc(100%-1.75rem)]" : "left-0.5"
                  )}
                />
              </button>
            </div>

            {/* Slider – Volume musique */}
            <AnimatePresence>
              {audio.musicEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 pt-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                        <VolumeX size={14} />
                        <span>Volume de la musique</span>
                      </div>
                      <span className="text-xs font-black text-voyage-primary">{audio.musicVolume}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range" min={0} max={100}
                        value={audio.musicVolume}
                        onChange={e => updateAudio({ musicVolume: Number(e.target.value) })}
                        className="flex-1 accent-voyage-primary h-2 cursor-pointer"
                      />
                      <Volume2 size={16} className="text-voyage-primary shrink-0" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </section>

        {/* Save Button */}
        <div className="pt-6 pb-20">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "w-full py-5 rounded-2xl font-headline font-black text-lg shadow-xl flex items-center justify-center gap-4 group transition-all relative overflow-hidden",
              isSaving 
                ? "bg-slate-200 text-slate-400 cursor-wait" 
                : saveSuccess
                  ? "bg-emerald-500 text-white"
                  : "bg-voyage-primary text-white shadow-voyage-primary/20 hover:brightness-110"
            )}
          >
            <AnimatePresence mode="wait">
              {saveSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 size={24} />
                  <div className="flex flex-col items-center leading-none">
                    <span className="tracking-tight">SAUVEGARDÉ !</span>
                    <span className="text-xs opacity-60 font-bold mt-1 tracking-widest">تم الحفظ !</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="idle"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex flex-col items-center leading-none">
                    <span className="tracking-tight">{isSaving ? 'SAUVEGARDE...' : 'ENREGISTRER LES MODIFICATIONS'}</span>
                    <span className="text-xs opacity-60 font-bold mt-1 tracking-widest">{isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                  </div>
                  {isSaving ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save size={24} className="group-hover:rotate-12 transition-transform" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={async () => {
              playSound('click');
              const { error } = await import('../lib/supabase').then(m => m.supabase.auth.signOut());
              if (!error) {
                window.location.reload(); 
              }
            }}
            className="w-full mt-6 py-4 rounded-2xl font-headline font-black text-slate-400 border-2 border-slate-100 hover:bg-slate-50 transition-all flex flex-col items-center leading-none"
          >
            <span className="tracking-tight">SE DÉCONNECTER</span>
            <span className="text-[10px] opacity-60 font-bold mt-1 tracking-widest">تسجيل الخروج</span>
          </motion.button>
        </div>
      </main>
    </div>
  );
}
