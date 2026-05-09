/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ArrowRight, MapPin, RotateCcw, Star, Clock, SkipForward, ChevronDown, Trophy, Users, PartyPopper, CheckCircle2, XCircle, User, Loader2, LogOut, AlertTriangle } from 'lucide-react';
import { type MissionCompletionSummary } from '../types';
import { cn } from '../lib/utils';
import { useSupabaseProfile, useSupabaseMissionLeaderboard } from '../hooks/useSupabase';
import { useAudio } from '../hooks/useAudio';

interface LevelCompleteModalProps {
  summary: MissionCompletionSummary | null;
  onReplayMission: () => void;
  onBackToCity: () => void;
  onRedoIncorrect: (questionIds: string[]) => void;
  onContinue?: () => void;
}

export default function LevelCompleteModal({ summary, onReplayMission, onBackToCity, onRedoIncorrect, onContinue }: LevelCompleteModalProps) {
  const { profile } = useSupabaseProfile();
  const { leaderboard, loading: loadingLeaderboard } = useSupabaseMissionLeaderboard(summary?.missionId || '');
  const { playSound } = useAudio();
  
  const totalXp = summary?.totalXp ?? 0;
  const totalStars = summary?.totalStars ?? 0;
  const successRate = summary?.successRate ?? 0;
  const isPerfect = successRate === 100;

  const [countedXp, setCountedXp] = useState(0);
  const [countedStars, setCountedStars] = useState(0);
  const [countedRate, setCountedRate] = useState(0);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const duration = 1100;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCountedXp(Math.round(totalXp * eased));
      setCountedStars(Math.round(totalStars * eased));
      setCountedRate(Math.round(successRate * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [totalXp, totalStars, successRate, summary?.missionId]);

  const ringSize = 151;
  const ringStroke = 9;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - countedRate / 100);

  useEffect(() => {
    if (summary) {
      playSound('success');
    }
  }, [summary?.missionId]);

  return (
    <div className="fixed inset-0 z-[100] bg-amber-50/60 backdrop-blur-md px-4 py-5 sm:px-6 flex items-center justify-center">
      {/* Celebration Confetti - Toujours affiché pour le classement */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-[101]"
        >
          {[...Array(isPerfect ? 60 : 30)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                y: -20, 
                x: Math.random() * window.innerWidth,
                rotate: 0,
                opacity: 1 
              }}
              animate={{
                y: window.innerHeight + 20,
                x: Math.random() * window.innerWidth + (Math.random() - 0.5) * 200,
                rotate: Math.random() * 720,
                opacity: 0
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 1.5,
                ease: 'easeOut'
              }}
              className="fixed text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: -20
              }}
            >
              {['⭐', '✨', '🎉', '💫', '🎊', '🟡', '🟠'][Math.floor(Math.random() * 7)]}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative w-full max-w-5xl h-[92vh] overflow-hidden rounded-[2.25rem] border border-white/18 bg-[linear-gradient(180deg,rgba(255,248,240,0.92),rgba(246,239,229,0.84))] shadow-[0_30px_120px_rgba(14,9,4,0.45)] flex flex-col"
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.8),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(196,152,93,0.14),transparent_34%)]" />
        
        {/* Navigation Tabs */}
        {/* Header Summary */}
        <div className="relative z-10 px-6 pt-8 pb-4 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-4 p-4 bg-voyage-primary/10 rounded-full border-2 border-voyage-primary/20"
          >
            <Trophy size={48} className="text-voyage-primary" />
          </motion.div>
          <h2 className="text-3xl font-black text-[#24160D] tracking-tight mb-2">
            Mission Accomplie !
          </h2>
          <p className="text-[#A08363] font-black uppercase tracking-[0.2em] text-[11px]">
            {summary?.missionTitle || 'Résultats du voyage'}
          </p>
        </div>

        <div className="relative flex-grow overflow-y-auto scrollbar-hide px-6 pb-40">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Score Section */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/60 backdrop-blur-xl border border-white/70 p-4 rounded-[1.5rem] shadow-sm text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#A08363] mb-1">Score</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-black text-voyage-primary">{countedXp}</span>
                  <span className="text-xs font-black text-voyage-primary/60">XP</span>
                </div>
              </div>
              
              <div className="bg-white/60 backdrop-blur-xl border border-white/70 p-4 rounded-[1.5rem] shadow-sm text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#A08363] mb-1">Précision</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-black text-amber-600">{countedRate}</span>
                  <span className="text-xs font-black text-amber-600/60">%</span>
                </div>
              </div>
            </div>

            {/* Ranking Section */}
            <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/60 shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E5D5B8]/30 bg-white/30">
                <h3 className="text-sm font-black text-[#24160D] uppercase tracking-widest flex items-center gap-2">
                  <Trophy size={16} className="text-amber-500" />
                  Top 5 - Classement Mondial
                </h3>
              </div>
              
              {loadingLeaderboard ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="animate-spin text-voyage-primary" />
                </div>
              ) : (
                <div className="divide-y divide-[#E5D5B8]/20">
                  <LeaderboardList 
                    players={leaderboard} 
                    currentUserId={profile?.id} 
                    missionXp={totalXp} 
                  />
                </div>
              )}
            </div>

            {/* Questions Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-black text-[#24160D] uppercase tracking-widest">Détail des questions</h3>
                <span className="text-[10px] font-black text-[#A08363] uppercase tracking-widest">{summary?.correctCount}/{summary?.totalQuestions} Correctes</span>
              </div>
              
              <div className="grid gap-3">
                {summary?.questions.map((q, idx) => (
                  <div 
                    key={q.questionId}
                    className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shadow-sm"
                  >
                    <div className={cn(
                      "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                      q.isCorrect ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                    )}>
                      {q.isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                    </div>
                    <div className="flex-grow">
                      <p className="text-[13px] font-bold text-[#24160D] leading-tight">
                        {q.question}
                      </p>
                    </div>
                    {!q.isCorrect && (
                      <button 
                        onClick={() => onRedoIncorrect([q.questionId])}
                        className="text-[9px] font-black uppercase tracking-widest text-voyage-primary bg-voyage-primary/10 px-3 py-1.5 rounded-lg hover:bg-voyage-primary/20 transition-colors"
                      >
                        Revoir
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-white/40 bg-[linear-gradient(180deg,rgba(255,250,243,0.62),rgba(248,240,230,0.95))] px-6 py-4 backdrop-blur-2xl sm:px-8 lg:px-10 z-20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#A08363]">Total gagné</span>
              <span className="text-xl font-black text-[#2A1A10]">{countedXp} XP</span>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: '#fff' }}
                whileTap={{ scale: 0.9 }}
                onClick={onReplayMission}
                className="w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-[#D7C4AD] bg-white/50 text-[#A77C55] shadow-sm backdrop-blur-md transition-colors hover:text-amber-600 hover:border-amber-400"
                title="Rejouer"
              >
                <RotateCcw size={22} strokeWidth={2.5} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowQuitConfirm(true)}
                className="w-12 h-12 flex items-center justify-center rounded-2xl border-2 border-[#D7C4AD] bg-white/50 text-[#A77C55] shadow-sm backdrop-blur-md transition-colors hover:text-rose-600 hover:border-rose-400"
                title="Quitter"
              >
                <LogOut size={22} strokeWidth={2.5} />
              </motion.button>

              {onContinue && (
                <motion.button
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onContinue}
                  className="h-12 px-8 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#24160D] to-[#2A1A10] text-white shadow-lg shadow-black/10"
                >
                  <span className="font-black text-xs uppercase tracking-widest">Suivant</span>
                  <ArrowRight size={20} strokeWidth={3} />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Quitter */}
      <AnimatePresence>
        {showQuitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center px-4 bg-[#1e1510]/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-[0_20px_70px_rgba(0,0,0,0.3)] text-center border-2 border-voyage-accent/10"
            >
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500 shadow-inner">
                <AlertTriangle size={40} />
              </div>
              
              <h3 className="text-2xl font-black text-[#2A1A10] mb-3">Vraiment partir ?</h3>
              <p className="text-slate-500 font-bold text-sm mb-8 leading-relaxed">
                Êtes-vous sûr de vouloir quitter le classement et retourner à la ville ?
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={onBackToCity}
                  className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-rose-500/20 active:scale-95"
                >
                  Oui, quitter
                </button>
                <button
                  onClick={() => setShowQuitConfirm(false)}
                  className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95"
                >
                  Non, rester ici
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatTile({ label, value, suffix, accent }: { label: string; value: number; suffix: string; accent: string }) {
  return (
    <motion.div 
      whileHover={{ y: -4, boxShadow: '0 20px 50px rgba(58,41,27,0.12)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="rounded-[1.5rem] border border-white/70 bg-white/60 p-3.5 shadow-[0_10px_30px_rgba(58,41,27,0.07)] backdrop-blur-xl overflow-hidden relative group"
    >
      {/* Glow effect au hover */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: 'none' }}
      />

      <motion.div
        className={`mb-3 h-1.5 w-16 rounded-full bg-gradient-to-r ${accent}`}
        animate={{ width: [64, 80, 64] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#A08363]">{label}</p>
      <div className="mt-2 flex items-baseline gap-1 text-[#24160D]">
        <motion.span 
          className="text-[33px] font-black tracking-tight"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          {value}
        </motion.span>
        <span className="text-base font-black uppercase tracking-[0.24em] text-[#7D634A]">{suffix}</span>
      </div>
    </motion.div>
  );
}

function AnswerPanel({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`rounded-[1.35rem] border p-3.5 overflow-hidden relative group ${muted ? 'border-[#E9DDCF] bg-white/65' : 'border-[#E6D8C8] bg-[#FBF6EF]'}`}
    >
      {/* Hover glow */}
      <motion.div 
        className={`absolute inset-0 ${muted ? 'bg-gradient-to-br from-white/10 to-transparent' : 'bg-gradient-to-br from-amber-100/10 to-transparent'} opacity-0 group-hover:opacity-100`}
        transition={{ duration: 0.3 }}
        style={{ pointerEvents: 'none' }}
      />

      <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#A08363] relative z-10">{label}</p>
      <p className="mt-2 whitespace-pre-line text-base font-semibold leading-relaxed text-[#4A3828] relative z-10">{value || '—'}</p>
    </motion.div>
  );
}

function LeaderboardList({ players, currentUserId, missionXp }: { players: any[]; currentUserId?: string; missionXp: number }) {
  const [displayPlayers, setDisplayPlayers] = useState<any[]>([]);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (players.length > 0) {
      // Initial state: user has their old score
      const initial = players.map(p => {
        if (p.id === currentUserId) {
          return { ...p, score: Math.max(0, p.score - missionXp) };
        }
        return p;
      }).sort((a, b) => b.score - a.score);
      
      setDisplayPlayers(initial);

      // Start animation after a short delay
      const timer = setTimeout(() => {
        let start = performance.now();
        const duration = 2500; // Slightly longer for loto effect

        const animate = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          setAnimationProgress(progress);

          const currentList = players.map(p => {
            if (p.id === currentUserId) {
              const baseScore = Math.max(0, p.score - missionXp);
              const animatedScore = baseScore + (missionXp * progress);
              return { ...p, score: Math.round(animatedScore) };
            }
            return p;
          }).sort((a, b) => b.score - a.score);

          setDisplayPlayers(currentList);

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [players, currentUserId, missionXp]);

  return (
    <div className="relative">
      {(() => {
        const topN = displayPlayers.slice(0, 10);
        const myIndex = displayPlayers.findIndex(p => p.id === currentUserId);
        const isUserInTopN = myIndex >= 0 && myIndex < 10;
        
        let finalDisplay = [...topN];
        if (!isUserInTopN && myIndex >= 0) {
          finalDisplay.push(displayPlayers[myIndex]);
        }

        return finalDisplay.map((player, idx) => {
          const isMe = player.id === currentUserId;
          const actualRank = isMe ? myIndex + 1 : (idx < 10 ? idx + 1 : myIndex + 1);
          const showSeparator = !isUserInTopN && isMe;

          return (
            <div key={player.id}>
              {showSeparator && (
                <div className="px-6 py-2 bg-[#F6EFE6] flex items-center justify-center gap-2">
                  <div className="h-px flex-grow bg-[#D7C4AD]" />
                  <span className="text-[9px] font-black text-[#A08363] uppercase tracking-[0.3em]">Ta Position</span>
                  <div className="h-px flex-grow bg-[#D7C4AD]" />
                </div>
              )}
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  layout: { 
                    type: 'spring', 
                    stiffness: 350, 
                    damping: 25,
                    mass: 1.5 
                  },
                  opacity: { duration: 0.3 }
                }}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 transition-all duration-700", 
                  isMe ? "bg-amber-100/40 border-y border-amber-200/50 shadow-inner z-10" : "bg-transparent"
                )}
              >
                <div className="w-8 flex flex-col items-center">
                   <motion.span 
                     key={actualRank}
                     initial={{ y: 10, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     className={cn("text-xs font-black", isMe ? "text-amber-600" : "text-[#7B3F1A]/40")}
                   >
                     #{actualRank}
                   </motion.span>
                   {isMe && animationProgress < 1 && (
                     <motion.div
                       animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                       transition={{ repeat: Infinity, duration: 0.6 }}
                       className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1"
                     />
                   )}
                </div>

                <div className="relative">
                  <motion.div
                    animate={isMe && animationProgress < 1 ? { 
                      rotate: [0, -5, 5, 0],
                      scale: [1, 1.1, 1] 
                    } : {}}
                    transition={{ repeat: Infinity, duration: 0.4 }}
                  >
                    <img src={player.avatar} className="w-11 h-11 rounded-2xl border-2 border-white shadow-sm" alt={player.name} />
                  </motion.div>
                  {isMe && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center" 
                    >
                       <Star size={8} className="text-white fill-current" />
                    </motion.div>
                  )}
                </div>

                <div className="flex-grow">
                  <p className={cn("text-[15px] font-black tracking-tight", isMe ? "text-amber-900" : "text-[#4E2510]")}>
                    {player.name} {isMe && "(Toi)"}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-[10px] font-bold text-[#A08363] uppercase tracking-widest">Niveau {player.level}</p>
                    {isMe && animationProgress < 1 && (
                       <motion.span 
                         animate={{ x: [0, 5, 0] }}
                         transition={{ repeat: Infinity, duration: 0.8 }}
                         className="text-[9px] font-black text-amber-600 uppercase tracking-tighter"
                       >
                         🚀 En pleine remontée !
                       </motion.span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className={cn("flex flex-col items-end", isMe ? "scale-110" : "scale-100")}>
                    <RollingNumber value={player.score} isMe={isMe} />
                    <span className={cn("text-[10px] font-black uppercase tracking-widest", isMe ? "text-amber-600/60" : "text-[#A08363]/40")}>XP</span>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        });
      })()}
    </div>
  );
}

function RollingNumber({ value, isMe }: { value: number; isMe: boolean }) {
  return (
    <motion.span 
      key={value}
      initial={{ y: 15, opacity: 0, filter: 'blur(4px)' }}
      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
      className={cn("text-lg font-black font-mono tracking-tighter", isMe ? "text-amber-700" : "text-[#24160D]")}
    >
      {value.toLocaleString()}
    </motion.span>
  );
}
