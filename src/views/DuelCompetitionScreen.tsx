import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Timer, Send, Instagram, ChevronRight, CheckCircle2, AlertCircle, Loader2, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAudio } from '../contexts/AudioContext';
import { supabase } from '../lib/supabase';
import { AVATAR_MALE_URL, AVATAR_FEMALE_URL } from '../types';
import { useSettings } from '../contexts/SettingsContext';

interface Question {
  id: string;
  situation: string;
  options: { id: string; text: string; isCorrect: boolean }[];
}

const translations = {
  fr: {
    liveDuel: "Duel en direct ⚔️",
    mayBestWin: "Que le meilleur gagne !",
    team1: "Équipe 1",
    team2: "Équipe 2",
    moi: "Moi",
    adversaire: "Adversaire",
    home: "Accueil",
    defis: "Défis de",
    missions: "Missions",
    choix: "Choix",
    pts: "points",
    analyzing: "Vérification...",
    analysisDone: "Analyse Terminée",
    verifyAnswers: "VÉRIFIER MES RÉPONSES",
    victory: "Victoire !",
    defeat: "Défaite !",
    finalScore: "Score Final :",
    continueAdventure: "Continuer l'aventure",
    defaultSoftSkill: "Défi Soft Skills",
    loading: "Chargement..."
  },
  ar: {
    liveDuel: "مبارزة مباشرة ⚔️",
    mayBestWin: "فليكن الفوز للأفضل !",
    team1: "الفريق 1",
    team2: "الفريق 2",
    moi: "أنا",
    adversaire: "المنافس",
    home: "الرئيسية",
    defis: "تحديات",
    missions: "مهمات",
    choix: "خيارات",
    pts: "نقاط",
    analyzing: "جاري التحقق...",
    analysisDone: "تم التحليل",
    verifyAnswers: "التحقق من إجاباتي",
    victory: "انتصار !",
    defeat: "هزيمة !",
    finalScore: "النتيجة النهائية :",
    continueAdventure: "متابعة المغامرة",
    defaultSoftSkill: "تحدي المهارات الناعمة",
    loading: "جاري التحميل..."
  }
};

const MOCK_QUESTIONS: Question[] = [
  {
    id: '1',
    situation: "Situation: Le Dr. Rachid est débordé et fatigué. Son planning est intenable. Identifie les 5 erreurs majeures dans son planning.",
    options: [
      { id: 'a', text: "Aucune pause quotidienne (repas, détente)", isCorrect: true },
      { id: 'b', text: "Sommeil insuffisant (4-5h par nuit)", isCorrect: true },
      { id: 'c', text: "Aucun jour de repos complet", isCorrect: true },
      { id: 'd', text: "Pas de délégation de tâches simples", isCorrect: true },
      { id: 'e', text: "Nutrition catastrophique (8 cafés, pas de repas équilibré)", isCorrect: true },
      { id: 'f', text: "Priorisation des urgences uniquement", isCorrect: false },
    ]
  }
];

interface DuelCompetitionScreenProps {
  onBack: () => void;
  onHome: () => void;
  userProfile?: any;
}

export default function DuelCompetitionScreen({ onBack, onHome, userProfile }: DuelCompetitionScreenProps) {
  const { playSound } = useAudio();
  const { language } = useSettings();
  const t = translations[language] || translations.fr;

  const [team1Score, setTeam1Score] = useState(2);
  const [team2Score, setTeam2Score] = useState(3);
  const [timer, setTimer] = useState(110);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [allExercises, setAllExercises] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(MOCK_QUESTIONS[0]);
  const [opponentProfile, setOpponentProfile] = useState<any>(null);
  const [cityNameAr, setCityNameAr] = useState('الرباط');
  const [cityNameFr, setCityNameFr] = useState('Rabat');

  useEffect(() => {
    async function fetchOpponent() {
      try {
        const { data } = await supabase
          .from('app_users')
          .select('*')
          .neq('id', userProfile?.id || '')
          .limit(10);
        
        if (data && data.length > 0) {
          const randomIdx = Math.floor(Math.random() * data.length);
          setOpponentProfile(data[randomIdx]);
        }
      } catch (err) {
        console.warn("Failed to fetch opponent:", err);
      }
    }
    fetchOpponent();
  }, [userProfile?.id]);

  useEffect(() => {
    async function fetchExercises() {
      setLoading(true);
      try {
        // 1. Find Rabat's city UUID
        const { data: cityData, error: cityError } = await supabase
          .from('challenges')
          .select('id, city_name_fr, city_name_ar')
          .or('id.eq.rabat,name_fr.ilike.Rabat')
          .single();

        if (cityError) console.warn("City lookup error:", cityError);
        const rabatId = cityData?.id || 'rabat';
        if (cityData) {
          setCityNameAr(cityData.city_name_ar || 'الرباط');
          setCityNameFr(cityData.city_name_fr || 'Rabat');
        }

        // 2. Fetch missions for Rabat
        const { data: missions, error: missionsError } = await supabase
          .from('missions')
          .select('id')
          .eq('city_id', rabatId);

        if (missionsError) console.warn("Missions lookup error:", missionsError);

        if (missions && missions.length > 0) {
          const missionIds = missions.map(m => m.id);

          // 3. Fetch questions for these missions
          const { data, error } = await supabase
            .from('questions')
            .select('*') 
            .in('mission_id', missionIds)
            .limit(30);

          if (!error && data && data.length > 0) {
            const mapped: Question[] = data.map(q => {
              const situation = language === 'ar'
                ? (q.question_ar || q.question_fr || q.text || q.title || t.defaultSoftSkill)
                : (q.question_fr || q.text || q.title || t.defaultSoftSkill);

              const options = (q.options || []).map((o: any) => {
                const text = language === 'ar'
                  ? (o.text_ar || o.label_ar || o.text || o.label_fr || '')
                  : (o.text || o.label_fr || o.text_ar || '');
                return {
                  id: o.id || Math.random().toString(),
                  text,
                  isCorrect: !!o.isCorrect || !!o.correct
                };
              });

              return { id: q.id, situation, options };
            }).filter(q => q.options.length > 0);
            
            if (mapped.length > 0) {
              setAllExercises(mapped);
              setCurrentQuestion(mapped[0]);
            } else {
              console.warn("No valid questions found in data, using mocks.");
              setAllExercises(MOCK_QUESTIONS);
            }
          } else {
            if (error) console.error("Questions fetch error (400?):", error);
            setAllExercises(MOCK_QUESTIONS);
          }
        } else {
          console.warn("No missions found for Rabat, using mocks.");
          setAllExercises(MOCK_QUESTIONS);
        }
      } catch (err) {
        console.error("Critical error fetching exercises:", err);
        setAllExercises(MOCK_QUESTIONS);
      }
      setLoading(false);
    }
    fetchExercises();
  }, [language]);

  useEffect(() => {
    if (timer > 0 && !isComplete) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isComplete]);

  const handleToggleAnswer = (id: string) => {
    if (isComplete) return;
    playSound('click');
    setSelectedAnswers(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleVerify = () => {
    if (selectedAnswers.length === 0 || isComplete) return;
    setIsVerifying(true);
    playSound('click');
    
    setTimeout(() => {
      const correctSelected = selectedAnswers.filter(id => 
        currentQuestion.options.find(o => o.id === id)?.isCorrect
      );
      
      if (correctSelected.length >= 3) {
        setTeam1Score(prev => prev + 1);
        playSound('success');
      } else {
        setTeam2Score(prev => prev + 1);
        playSound('wrong');
      }
      
      setIsVerifying(false);
      setIsComplete(true);
    }, 1500);
  };

  // Tug of war movement logic
  // Rope center is 0. Team 1 pulling moves it negative (left), Team 2 moves it positive (right)
  const ropePosition = language === 'ar'
    ? (team1Score - team2Score) * 30
    : (team2Score - team1Score) * 30;

  return (
    <div className="flex flex-col h-full bg-radial from-amber-50/20 via-slate-50 to-blue-50/10 relative overflow-hidden font-sans" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Decorative Glowing Mesh Gradient Blobs */}
      <motion.div 
        animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.28, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-20%] w-[60%] aspect-square rounded-full bg-blue-400/10 blur-[130px] pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.22, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-10%] right-[-20%] w-[60%] aspect-square rounded-full bg-red-400/10 blur-[130px] pointer-events-none" 
      />

      {/* Players Avatars Floaters */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-30 pointer-events-none">
        {/* Current User */}
        <motion.div 
          initial={{ x: language === 'ar' ? 50 : -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={cn(
            "flex items-center gap-3 bg-white/80 backdrop-blur-xl p-1.5 rounded-full border border-white/60 shadow-[0_10px_35px_rgba(0,0,0,0.05)] pointer-events-auto",
            language === 'ar' ? 'pl-4 pr-1.5 flex-row-reverse' : 'pr-4 pl-1.5 flex-row'
          )}
        >
          <div className="w-10 h-10 rounded-full border-2 border-blue-400 overflow-hidden bg-blue-50 relative">
            <img 
              src={userProfile?.avatar_url || (userProfile?.gender === 'F' ? AVATAR_FEMALE_URL : AVATAR_MALE_URL)} 
              alt={t.moi} 
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full shadow-[0_0_8px_#10B981] animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">{t.team1}</span>
            <span className="text-[10px] font-black text-slate-800 truncate max-w-[80px]">{userProfile?.full_name?.split(' ')[0] || t.moi}</span>
          </div>
        </motion.div>

        {/* VS Badge */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-9 h-9 bg-linear-to-br from-voyage-primary to-slate-900 rounded-xl flex items-center justify-center border-2 border-white shadow-lg rotate-45"
        >
          <span className="text-white font-black text-[11px] -rotate-45">VS</span>
        </motion.div>

        {/* Opponent */}
        <motion.div 
          initial={{ x: language === 'ar' ? -50 : 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={cn(
            "flex items-center gap-3 bg-white/80 backdrop-blur-xl p-1.5 rounded-full border border-white/60 shadow-[0_10px_35px_rgba(0,0,0,0.05)] pointer-events-auto",
            language === 'ar' ? 'pr-4 pl-1.5 flex-row' : 'pl-4 pr-1.5 flex-row-reverse'
          )}
        >
          <div className="w-10 h-10 rounded-full border-2 border-red-400 overflow-hidden bg-red-50 relative">
            <img 
              src={opponentProfile?.avatar_url || (opponentProfile?.gender === 'F' ? AVATAR_FEMALE_URL : AVATAR_MALE_URL)} 
              alt={t.adversaire} 
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full shadow-[0_0_8px_#F43F5E] animate-pulse" />
          </div>
          <div className={cn("flex flex-col", language === 'ar' ? "items-start" : "items-end")}>
            <span className="text-[8px] font-black text-red-600 uppercase tracking-widest">{t.team2}</span>
            <span className="text-[10px] font-black text-slate-800 truncate max-w-[80px]">{opponentProfile?.full_name?.split(' ')[0] || t.adversaire}</span>
          </div>
        </motion.div>
      </div>

      {/* Top Header */}
      <header className="px-6 pt-24 pb-4 flex items-center justify-between z-20">
        <button 
          onClick={onHome}
          className="flex items-center gap-2 bg-white/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-100 shadow-sm text-voyage-primary hover:text-voyage-accent transition-colors font-black text-[10px] uppercase tracking-widest active:scale-95"
        >
          <Home size={14} />
          <span>{t.home}</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-[10px] font-black text-voyage-primary uppercase tracking-widest">{t.liveDuel}</h1>
          <p className="text-[8px] font-bold text-voyage-accent uppercase tracking-tighter">{t.mayBestWin}</p>
        </div>

        <div className="flex items-center gap-2 bg-white/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-blue-500 uppercase">{language === 'ar' ? team2Score : team1Score}</span>
          </div>
          <div className="w-px h-4 bg-slate-200 mx-1" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-red-500 uppercase">{language === 'ar' ? team1Score : team2Score}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area (Scrollable) */}
      <main className="grow overflow-y-auto px-6 pb-32 space-y-5">
        
        {/* Team Headers */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="h-10 bg-linear-to-r from-blue-500 to-indigo-600 rounded-2xl relative flex items-center px-4 overflow-hidden shadow-lg shadow-blue-500/20 border-b-4 border-blue-700">
            <span className="text-white font-black text-[10px] uppercase tracking-widest z-10">{t.team1}</span>
            <div className={cn(
              "absolute top-1/2 -translate-y-1/2 w-5.5 h-5.5 bg-white rounded-full flex items-center justify-center shadow-md",
              language === 'ar' ? "left-2.5" : "right-2.5"
            )}>
              <span className="text-blue-600 font-black text-[10px]">{team1Score}</span>
            </div>
            <motion.div 
              className="absolute inset-0 bg-blue-50/20"
              animate={{ x: language === 'ar' ? ['100%', '-100%'] : ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          <div className={cn(
            "h-10 bg-linear-to-l from-rose-550 to-red-600 rounded-2xl relative flex items-center px-4 overflow-hidden shadow-lg shadow-rose-500/20 border-b-4 border-red-800",
            language === 'ar' ? "justify-start" : "justify-end"
          )}>
            <span className="text-white font-black text-[10px] uppercase tracking-widest z-10">{t.team2}</span>
            <div className={cn(
              "absolute top-1/2 -translate-y-1/2 w-5.5 h-5.5 bg-white rounded-full flex items-center justify-center shadow-md",
              language === 'ar' ? "right-2.5" : "left-2.5"
            )}>
              <span className="text-red-600 font-black text-[10px]">{team2Score}</span>
            </div>
            <motion.div 
              className="absolute inset-0 bg-red-500/20"
              animate={{ x: language === 'ar' ? ['-100%', '100%'] : ['100%', '-100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>

        {/* Tug of War Visual Area */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[40px] border-2 border-white/60 overflow-hidden relative shadow-[0_20px_50px_rgba(31,38,135,0.04)] aspect-4/3 flex items-center justify-center">
          {/* Background Split & Grid */}
          <div className="absolute inset-0 flex">
            <div className="flex-1 bg-linear-to-br from-blue-50/20 via-blue-500/5 to-transparent" />
            <div className="flex-1 bg-linear-to-bl from-red-50/20 via-red-500/5 to-transparent" />
          </div>
          {/* Neon Field Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[3rem_3rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
          
          {/* Center Line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px border-l-2 border-dashed border-slate-200/60 -translate-x-1/2" />
          
          {/* Timer Overlay */}
          <div className={cn(
            "absolute top-4 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full border shadow-[0_8px_32px_rgba(0,0,0,0.06)] z-20 flex items-center gap-2.5 backdrop-blur-xl transition-all",
            timer < 10 
              ? "bg-rose-50/90 border-rose-200 text-rose-600 shadow-rose-100/50" 
              : "bg-white/90 border-white/60 text-voyage-primary"
          )}>
            <Timer size={16} className={cn(timer < 10 && "animate-bounce")} />
            <span className="font-black text-lg tabular-nums tracking-tight">
              {Math.floor(timer / 60).toString().padStart(2, '0')}:{(timer % 60).toString().padStart(2, '0')}
            </span>
          </div>

          {/* Tug of War Graphic (Animated) */}
          <motion.div 
            className="relative z-10 flex items-center justify-center w-full"
            animate={{ x: ropePosition }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          >
            {/* Using the generated image */}
            <img 
              src="/assets/tug_of_war.png" 
              alt="Tug of War"
              className="w-full h-auto max-h-[180px] object-contain drop-shadow-2xl"
              onError={(e) => {
                // Fallback to a styled SVG/Div if image fails
                (e.target as any).src = "https://rydmefudpczpxrresflx.supabase.co/storage/v1/object/public/app-assets/avatar-homme.png";
              }}
            />
            
            {/* Visual Rope Middle Marker */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-600 rounded-sm rotate-45 border-2 border-white shadow-lg" />
          </motion.div>
        </div>

        {/* Situation Description */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[32px] p-7 border-2 border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-voyage-primary/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-voyage-accent animate-ping" />
            <span className="text-[9px] font-black text-voyage-accent uppercase tracking-widest">
              {language === 'ar' ? 'موقف القرار المشترك' : 'CONFLIT DE DÉCISION'}
            </span>
          </div>
          <h3 className="font-bold text-slate-800 text-sm leading-relaxed" style={{ wordBreak: 'break-word' }}>
            {currentQuestion.situation}
          </h3>
        </div>

        {/* Answer Options Grid */}
        <div className="grid grid-cols-2 gap-4 pb-8">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswers.includes(option.id);
            return (
              <motion.button
                key={option.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleToggleAnswer(option.id)}
                className={cn(
                  "p-5 rounded-[28px] border-2 transition-all min-h-[96px] flex flex-col justify-center gap-2 relative overflow-hidden border-b-4 active:translate-y-0.5 active:border-b-0",
                  language === 'ar' ? 'text-right' : 'text-left',
                  isSelected
                    ? "bg-linear-to-br from-voyage-accent to-amber-600 text-white border-amber-600 shadow-[0_4px_20px_rgba(245,158,11,0.25),0_4px_0_0_#D97706]"
                    : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-md text-slate-600 border-b-slate-200"
                )}
              >
                <span className={cn(
                  "text-[10px] font-bold leading-relaxed z-10 transition-colors",
                  isSelected ? "text-white" : "text-slate-800"
                )}>
                  {option.text}
                </span>
                {isSelected && (
                  <CheckCircle2 size={16} className={cn("text-white absolute top-3 stroke-[3px]", language === 'ar' ? "left-3" : "right-3")} />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Exercises Selection List */}
        <div className="space-y-4 pb-24">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {language === 'ar' ? `${t.defis} ${cityNameAr}` : `${t.defis} ${cityNameFr}`}
            </h2>
            <div className="bg-voyage-accent/10 text-voyage-accent text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
              {allExercises.length} {t.missions}
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin text-slate-300" size={24} />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {allExercises.map((ex) => {
                const isActive = currentQuestion.id === ex.id;
                return (
                  <motion.button
                    key={ex.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setCurrentQuestion(ex);
                      setSelectedAnswers([]);
                      setIsComplete(false);
                      setTimer(110);
                      playSound('click');
                      // Scroll to top to focus on the new question
                      document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={cn(
                      "p-4 rounded-[24px] border-2 transition-all flex items-center gap-4 shadow-sm relative overflow-hidden border-b-4 active:translate-y-0.5 active:border-b-0",
                      language === 'ar' ? 'text-right' : 'text-left',
                      isActive 
                        ? "bg-white border-voyage-accent border-b-amber-500 shadow-md shadow-voyage-accent/5" 
                        : "bg-white border-slate-100 hover:border-slate-200 border-b-slate-200"
                    )}
                  >
                    {isActive && (
                      <div className={cn(
                        "absolute top-0 bottom-0 w-1 bg-voyage-accent",
                        language === 'ar' ? "right-0" : "left-0"
                      )} />
                    )}
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
                      isActive ? "bg-amber-100 text-voyage-accent" : "bg-slate-50 text-slate-400"
                    )}>
                      <Trophy size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn(
                        "text-[10px] font-black uppercase tracking-tight truncate transition-colors",
                        isActive ? "text-voyage-accent" : "text-voyage-primary"
                      )}>
                        {ex.situation}
                      </p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                        {ex.options.length} {t.choix} • 15 {t.pts}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer Navigation & Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-6 pb-12 bg-linear-to-t from-white via-white to-white/80 backdrop-blur-md border-t border-slate-100 z-30">
        <div className="max-w-md mx-auto space-y-4">
          
          <div className="flex items-center justify-between px-4">
            <div className="flex gap-4">
               <button className="text-slate-300 hover:text-voyage-accent transition-colors"><Instagram size={20} /></button>
               <button className="text-slate-300 hover:text-voyage-accent transition-colors"><Send size={20} /></button>
            </div>
            <div className="flex gap-2">
               <div className="w-8 h-8 rounded-lg border border-slate-100 flex items-center justify-center text-slate-400">
                  <ChevronRight size={16} className={cn(language === 'ar' && "rotate-180")} />
               </div>
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={selectedAnswers.length === 0 || isVerifying || isComplete}
            className={cn(
              "w-full py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl border-b-4",
              selectedAnswers.length === 0 || isVerifying || isComplete
                ? "bg-slate-100 text-slate-400 border-b-slate-200 cursor-not-allowed"
                : "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/20 active:translate-y-0.5 active:border-b-0 border-blue-800"
            )}
          >
            {isVerifying ? (
              <Loader2 className="animate-spin" size={20} />
            ) : isComplete ? (
              <>
                <CheckCircle2 size={20} />
                <span>{t.analysisDone}</span>
              </>
            ) : (
              <span>{t.verifyAnswers}</span>
            )}
          </button>
        </div>
      </div>

      {/* Victory/Defeat Overlay */}
      <AnimatePresence>
        {isComplete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-[48px] w-full max-w-sm overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] text-center p-8 space-y-8 border border-slate-100 relative"
            >
              {team1Score > team2Score && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[48px]">
                  <div className="absolute top-[-20%] left-[-20%] w-[140%] aspect-square bg-gradient-radial from-emerald-500/10 via-transparent to-transparent" />
                </div>
              )}

              <div className={cn(
                "w-24 h-24 rounded-[36px] flex items-center justify-center mx-auto shadow-lg transition-all",
                team1Score > team2Score 
                  ? "bg-emerald-500 text-white shadow-emerald-500/30 scale-110" 
                  : "bg-rose-500 text-white shadow-rose-500/30"
              )}>
                {team1Score > team2Score ? <Trophy size={48} className="animate-bounce" /> : <AlertCircle size={48} className="animate-pulse" />}
              </div>
              
              <div className="space-y-3">
                <h2 className="text-3xl font-black text-voyage-primary tracking-tight">
                  {team1Score > team2Score ? t.victory : t.defeat}
                </h2>
                <div className="inline-block bg-slate-50 border border-slate-100 px-5 py-2.5 rounded-2xl">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">
                    {t.finalScore}
                  </p>
                  <p className="text-2xl font-black text-slate-800 tracking-wider">
                    {language === 'ar' ? `${team2Score} - ${team1Score}` : `${team1Score} - ${team2Score}`}
                  </p>
                </div>
              </div>

              <button 
                onClick={onBack}
                className="w-full py-5 bg-voyage-primary text-white rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-voyage-primary/30 border-b-4 border-voyage-primary/70 active:translate-y-0.5 active:border-b-0 hover:bg-voyage-primary/95 transition-all"
              >
                {t.continueAdventure}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
