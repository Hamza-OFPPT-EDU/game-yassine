import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Timer, Send, Instagram, ChevronRight, CheckCircle2, AlertCircle, Loader2, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAudio } from '../contexts/AudioContext';
import { supabase } from '../lib/supabase';
import { AVATAR_MALE_URL, AVATAR_FEMALE_URL } from '../types';

interface Question {
  id: string;
  situation: string;
  options: { id: string; text: string; isCorrect: boolean }[];
}

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
  const [team1Score, setTeam1Score] = useState(2);
  const [team2Score, setTeam2Score] = useState(3);
  const [timer, setTimer] = useState(120);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [allExercises, setAllExercises] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(MOCK_QUESTIONS[0]);
  const [opponentProfile, setOpponentProfile] = useState<any>(null);

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
          .select('id')
          .or('id.eq.rabat,name_fr.ilike.Rabat')
          .single();

        if (cityError) console.warn("City lookup error:", cityError);
        const rabatId = cityData?.id || 'rabat';

        // 2. Fetch missions for Rabat
        const { data: missions, error: missionsError } = await supabase
          .from('missions')
          .select('id')
          .eq('city_id', rabatId);

        if (missionsError) console.warn("Missions lookup error:", missionsError);

        if (missions && missions.length > 0) {
          const missionIds = missions.map(m => m.id);

          // 3. Fetch questions for these missions
          // Try selecting all columns first to avoid mismatch errors if we're not sure about the schema
          const { data, error } = await supabase
            .from('questions')
            .select('*') 
            .in('mission_id', missionIds)
            .limit(30);

          if (!error && data && data.length > 0) {
            const mapped: Question[] = data.map(q => ({
              id: q.id,
              situation: q.question_fr || q.text || q.title || "Défi Soft Skills",
              options: (q.options || []).map((o: any) => ({
                id: o.id || Math.random().toString(),
                text: o.text || '',
                isCorrect: !!o.isCorrect || !!o.correct
              }))
            })).filter(q => q.options.length > 0);
            
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
  }, []);

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
  const ropePosition = (team2Score - team1Score) * 30;

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] relative overflow-hidden font-sans">
      {/* Players Avatars Floaters */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-30 pointer-events-none">
        {/* Current User */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-3 bg-white/90 backdrop-blur-md p-1.5 pr-4 rounded-full border border-blue-100 shadow-lg pointer-events-auto"
        >
          <div className="w-10 h-10 rounded-full border-2 border-blue-500 overflow-hidden bg-blue-50">
            <img 
              src={userProfile?.avatar_url || (userProfile?.gender === 'F' ? AVATAR_FEMALE_URL : AVATAR_MALE_URL)} 
              alt="Moi" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-blue-600 uppercase tracking-tighter">Équipe 1</span>
            <span className="text-[10px] font-black text-slate-800 truncate max-w-[80px]">{userProfile?.full_name?.split(' ')[0] || 'Moi'}</span>
          </div>
        </motion.div>

        {/* VS Badge */}
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-8 h-8 bg-voyage-primary rounded-lg flex items-center justify-center border-2 border-white shadow-md rotate-45"
        >
          <span className="text-white font-black text-[10px] -rotate-45">VS</span>
        </motion.div>

        {/* Opponent */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center flex-row-reverse gap-3 bg-white/90 backdrop-blur-md p-1.5 pl-4 rounded-full border border-red-100 shadow-lg pointer-events-auto"
        >
          <div className="w-10 h-10 rounded-full border-2 border-red-500 overflow-hidden bg-red-50">
            <img 
              src={opponentProfile?.avatar_url || (opponentProfile?.gender === 'F' ? AVATAR_FEMALE_URL : AVATAR_MALE_URL)} 
              alt="Adversaire" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-red-600 uppercase tracking-tighter">Équipe 2</span>
            <span className="text-[10px] font-black text-slate-800 truncate max-w-[80px]">{opponentProfile?.full_name?.split(' ')[0] || 'Adversaire'}</span>
          </div>
        </motion.div>
      </div>

      {/* Top Header */}
      <header className="px-6 pt-24 pb-4 flex items-center justify-between z-20">
        <button 
          onClick={onHome}
          className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-100 shadow-sm text-voyage-primary font-black text-[10px] uppercase tracking-widest"
        >
          <Home size={14} />
          <span>Home</span>
        </button>
        
        <div className="text-center">
          <h1 className="text-[10px] font-black text-voyage-primary uppercase tracking-widest">Duel en direct ⚔️</h1>
          <p className="text-[8px] font-bold text-voyage-accent uppercase tracking-tighter">Que le meilleur gagne !</p>
        </div>

        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-blue-500 uppercase">{team1Score}</span>
          </div>
          <div className="w-[1px] h-4 bg-slate-200 mx-1" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-red-500 uppercase">{team2Score}</span>
          </div>
        </div>
      </header>

      {/* Main Content Area (Scrollable) */}
      <main className="flex-grow overflow-y-auto px-6 pb-32 space-y-4">
        
        {/* Team Headers */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="h-8 bg-blue-600 rounded-xl relative flex items-center px-4 overflow-hidden shadow-lg shadow-blue-600/20">
            <span className="text-white font-black text-[10px] uppercase tracking-widest z-10">Team 1</span>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-black text-[10px]">{team1Score}</span>
            </div>
            <motion.div 
              className="absolute inset-0 bg-blue-500/50"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          <div className="h-8 bg-red-600 rounded-xl relative flex items-center justify-end px-4 overflow-hidden shadow-lg shadow-red-600/20">
            <span className="text-white font-black text-[10px] uppercase tracking-widest z-10">Team 2</span>
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
              <span className="text-red-600 font-black text-[10px]">{team2Score}</span>
            </div>
            <motion.div 
              className="absolute inset-0 bg-red-500/50"
              animate={{ x: ['100%', '-100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>

        {/* Tug of War Visual Area */}
        <div className="bg-white rounded-[32px] border-2 border-slate-100 overflow-hidden relative shadow-sm aspect-[4/3] flex items-center justify-center">
          {/* Background Split */}
          <div className="absolute inset-0 flex">
            <div className="flex-1 bg-blue-50/30" />
            <div className="flex-1 bg-red-50/30" />
          </div>
          
          {/* Center Line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-[1px] border-l-2 border-dashed border-slate-200 -translate-x-1/2" />
          
          {/* Timer Overlay */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-2 rounded-2xl border border-slate-100 shadow-xl z-20 flex items-center gap-2">
            <Timer size={18} className={cn("text-voyage-primary", timer < 5 && "text-red-500 animate-pulse")} />
            <span className={cn("font-black text-xl tabular-nums", timer < 5 ? "text-red-500" : "text-voyage-primary")}>
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
        <div className="bg-white rounded-[24px] p-6 border-2 border-slate-100 shadow-sm space-y-3">
          <h3 className="font-black text-[#4E2510] text-sm leading-relaxed">
            {currentQuestion.situation}
          </h3>
        </div>

        {/* Answer Options Grid */}
        <div className="grid grid-cols-2 gap-3 pb-10">
          {currentQuestion.options.map((option) => (
            <motion.button
              key={option.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleToggleAnswer(option.id)}
              className={cn(
                "p-4 rounded-[20px] text-left border-2 transition-all min-h-[80px] flex flex-col justify-center gap-2 relative overflow-hidden",
                selectedAnswers.includes(option.id)
                  ? "bg-white border-voyage-accent shadow-lg shadow-voyage-accent/10"
                  : "bg-white border-slate-100 text-slate-500"
              )}
            >
              <span className="text-[10px] font-bold leading-tight z-10">{option.text}</span>
              {selectedAnswers.includes(option.id) && (
                <CheckCircle2 size={16} className="text-voyage-accent absolute top-2 right-2" />
              )}
            </motion.button>
          ))}
        </div>

        {/* Exercises Selection List */}
        <div className="space-y-4 pb-24">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Défis de Rabat</h2>
            <div className="bg-voyage-accent/10 text-voyage-accent text-[8px] font-black px-2 py-0.5 rounded-full uppercase">{allExercises.length} Missions</div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin text-slate-300" size={24} />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {allExercises.map((ex) => (
                <motion.button
                  key={ex.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCurrentQuestion(ex);
                    setSelectedAnswers([]);
                    setIsComplete(false);
                    setTimer(120);
                    playSound('click');
                    // Scroll to top to focus on the new question
                    document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={cn(
                    "p-4 rounded-2xl border-2 transition-all text-left flex items-center gap-4",
                    currentQuestion.id === ex.id 
                      ? "bg-voyage-accent/5 border-voyage-accent shadow-md shadow-voyage-accent/10" 
                      : "bg-white border-slate-100 hover:border-slate-200"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    currentQuestion.id === ex.id ? "bg-voyage-accent text-white" : "bg-slate-50 text-slate-400"
                  )}>
                    <Trophy size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-tight truncate",
                      currentQuestion.id === ex.id ? "text-voyage-accent" : "text-voyage-primary"
                    )}>
                      {ex.situation}
                    </p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                      {ex.options.length} Choix • 15 points
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer Navigation & Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-6 pb-12 bg-gradient-to-t from-white via-white to-white/80 backdrop-blur-md border-t border-slate-100 z-30">
        <div className="max-w-md mx-auto space-y-4">
          
          <div className="flex items-center justify-between px-4">
            <div className="flex gap-4">
               <button className="text-slate-300 hover:text-voyage-accent transition-colors"><Instagram size={20} /></button>
               <button className="text-slate-300 hover:text-voyage-accent transition-colors"><Send size={20} /></button>
            </div>
            <div className="flex gap-2">
               <div className="w-8 h-8 rounded-lg border border-slate-100 flex items-center justify-center text-slate-400">
                  <ChevronRight size={16} />
               </div>
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={selectedAnswers.length === 0 || isVerifying || isComplete}
            className={cn(
              "w-full py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl",
              selectedAnswers.length === 0 || isVerifying || isComplete
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 text-white shadow-blue-600/30 active:scale-95"
            )}
          >
            {isVerifying ? (
              <Loader2 className="animate-spin" size={20} />
            ) : isComplete ? (
              <>
                <CheckCircle2 size={20} />
                <span>Analyse Terminée</span>
              </>
            ) : (
              <span>VÉRIFIER MES RÉPONSES</span>
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
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[40px] w-full max-w-xs overflow-hidden shadow-2xl text-center p-8 space-y-6"
            >
              <div className={cn(
                "w-20 h-20 rounded-3xl flex items-center justify-center mx-auto",
                team1Score > team2Score ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"
              )}>
                {team1Score > team2Score ? <Trophy size={40} /> : <AlertCircle size={40} />}
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-voyage-primary">
                  {team1Score > team2Score ? "Victoire !" : "Défaite !"}
                </h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Score Final : {team1Score} - {team2Score}
                </p>
              </div>

              <button 
                onClick={onBack}
                className="w-full py-4 bg-voyage-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-voyage-primary/20"
              >
                Continuer l'aventure
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
