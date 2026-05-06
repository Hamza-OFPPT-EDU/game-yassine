/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ArrowRight, MapPin, RotateCcw, Star, Clock, SkipForward, ChevronDown, Trophy, Users, PartyPopper } from 'lucide-react';
import { type MissionCompletionSummary } from '../types';
import { cn } from '../lib/utils';
import { useSupabaseProfile } from '../hooks/useSupabase';
import { useAudio } from '../hooks/useAudio';
import MissionLeaderboard from './MissionLeaderboard';

interface LevelCompleteModalProps {
  summary: MissionCompletionSummary | null;
  onReplayMission: () => void;
  onBackToCity: () => void;
  onRedoIncorrect: (questionIds: string[]) => void;
  onContinue?: () => void;
}

export default function LevelCompleteModal({ summary, onReplayMission, onBackToCity, onRedoIncorrect, onContinue }: LevelCompleteModalProps) {
  const { profile } = useSupabaseProfile();
  const { playSound } = useAudio();
  const [currentView, setCurrentView] = useState<'results' | 'leaderboard'>('results');
  
  const totalXp = summary?.totalXp ?? 0;
  const totalStars = summary?.totalStars ?? 0;
  const successRate = summary?.successRate ?? 0;
  const isPerfect = successRate === 100;

  const [countedXp, setCountedXp] = useState(0);
  const [countedStars, setCountedStars] = useState(0);
  const [countedRate, setCountedRate] = useState(0);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

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
      {/* Confettis si 100% ou Leaderboard */}
      <AnimatePresence>
        {(isPerfect || currentView === 'leaderboard') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[101]"
          >
            {[...Array(50)].map((_, i) => (
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
                  delay: Math.random() * 0.5,
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
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative w-full max-w-5xl h-[92vh] overflow-hidden rounded-[2.25rem] border border-white/18 bg-[linear-gradient(180deg,rgba(255,248,240,0.92),rgba(246,239,229,0.84))] shadow-[0_30px_120px_rgba(14,9,4,0.45)] flex flex-col"
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.8),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(196,152,93,0.14),transparent_34%)]" />
        
        {/* Navigation Tabs */}
        <div className="relative z-10 px-6 pt-6 flex justify-between items-center">
          <div className="flex bg-[#E5D5B8]/20 p-1 rounded-2xl border border-[#E5D5B8]/30 backdrop-blur-md">
            <button
              onClick={() => { playSound('click'); setCurrentView('results'); }}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                currentView === 'results' ? "bg-white text-[#7B3F1A] shadow-sm" : "text-[#7B3F1A]/60 hover:text-[#7B3F1A]"
              )}
            >
              <Award size={14} />
              Résultats
            </button>
            <button
              onClick={() => { playSound('click'); setCurrentView('leaderboard'); }}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                currentView === 'leaderboard' ? "bg-white text-[#7B3F1A] shadow-sm" : "text-[#7B3F1A]/60 hover:text-[#7B3F1A]"
              )}
            >
              <Trophy size={14} />
              Classement
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 bg-voyage-primary text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg shadow-voyage-primary/20"
          >
            <PartyPopper size={14} />
            Mission Accomplie !
          </motion.div>
        </div>

        <div className="relative flex-grow overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="wait">
            {currentView === 'results' ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="px-6 pb-28 pt-8 sm:px-8 lg:px-10"
              >
                <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start mb-10">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#A08363]">Mission terminée</p>
                      <h2 className="max-w-2xl text-[27px] sm:text-[32px] lg:text-[43px] font-black tracking-tight text-[#24160D]">
                        {summary?.missionTitle || 'Mission terminée'}
                      </h2>
                      <div className="flex flex-wrap items-center gap-3 text-base font-semibold text-[#6A5543]">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 border border-white/70 shadow-sm backdrop-blur-md">
                          <MapPin size={12} className="text-[#A77C55]" />
                          {summary?.cityName || 'Ville'}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-[#F4EADF]/80 px-3 py-1.5 border border-[#E8D9C8] shadow-sm">
                          <Star size={12} className="fill-[#B58B60] text-[#B58B60]" />
                          {summary?.correctCount ?? 0}/{summary?.totalQuestions ?? 0} réponses correctes
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <StatTile label="Score final" value={countedXp} suffix="XP" accent="from-[#B58B60] to-[#8A6A49]" />
                      <StatTile label="Étoiles gagnées" value={countedStars} suffix="★" accent="from-[#8F6B47] to-[#C9A475]" />
                      <StatTile label="Réussite" value={countedRate} suffix="%" accent="from-[#A87D52] to-[#D1B08C]" />
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.08 }}
                    className="rounded-[2rem] border border-white/70 bg-white/55 p-5 shadow-[0_18px_40px_rgba(69,49,33,0.08)] backdrop-blur-xl overflow-hidden relative"
                  >
                    {isPerfect && (
                      <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
                      />
                    )}

                    <div className="relative flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#A08363]">Taux de réussite</p>
                        <p className="mt-1 text-[20px] font-bold text-[#27170E]">{countedRate}% des réponses validées</p>
                      </div>
                      <div className="relative h-[151px] w-[151px] shrink-0">
                        <svg viewBox={`0 0 ${ringSize} ${ringSize}`} className="h-full w-full -rotate-90">
                          <circle
                            cx={ringSize / 2}
                            cy={ringSize / 2}
                            r={ringRadius}
                            fill="none"
                            stroke="rgba(184,160,131,0.18)"
                            strokeWidth={ringStroke}
                          />
                          <motion.circle
                            cx={ringSize / 2}
                            cy={ringSize / 2}
                            r={ringRadius}
                            fill="none"
                            stroke="url(#successRing)"
                            strokeWidth={ringStroke}
                            strokeLinecap="round"
                            strokeDasharray={ringCircumference}
                            strokeDashoffset={ringOffset}
                            animate={isPerfect ? { filter: ['drop-shadow(0 0 0px #D1B08C)', 'drop-shadow(0 0 12px #D1B08C)', 'drop-shadow(0 0 0px #D1B08C)'] } : {}}
                            transition={isPerfect ? { duration: 2, repeat: Infinity } : {}}
                          />
                          <defs>
                            <linearGradient id="successRing" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#D1B08C" />
                              <stop offset="100%" stopColor="#8A6A49" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-[40px] font-black tracking-tight text-[#22140D]">{countedRate}</span>
                          <span className="text-[11px] font-black uppercase tracking-[0.28em] text-[#9B7B5D]">réussite</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#A08363]">Récapitulatif détaillé</p>
                    <h3 className="mt-2 text-[21px] font-black tracking-tight text-[#24160D]">Une carte par question</h3>
                  </div>
                  <p className="hidden sm:block text-base font-semibold text-[#6D5948]">
                    {summary?.questions.length ?? 0} éléments analysés
                  </p>
                </div>

                <div className="space-y-4">
                  {(summary?.questions || []).map((questionResult, index) => {
                    const isSkipped = questionResult.isSkipped;
                    const isTimedOut = questionResult.isTimedOut;
                    const statusColor = isSkipped || isTimedOut ? 'bg-blue-500/10 text-blue-700' : (questionResult.isCorrect ? 'bg-emerald-500/10 text-emerald-700' : 'bg-rose-500/10 text-rose-700');
                    const statusText = isSkipped ? 'Passée' : (isTimedOut ? 'Temps écoulé' : (questionResult.isCorrect ? 'Correct' : 'À revoir'));
                    const isExpanded = expandedQuestionId === questionResult.questionId;
                    
                    return (
                      <motion.article
                        key={questionResult.questionId}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 + index * 0.05 }}
                        className="rounded-[1.7rem] border border-white/75 bg-white/60 overflow-hidden backdrop-blur-xl transition-all group cursor-pointer"
                        onClick={() => setExpandedQuestionId(isExpanded ? null : questionResult.questionId)}
                      >
                        <div className="p-5">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.28em] text-[#9B7B5D]">
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F2E8DA] text-[#6C5036] font-black">
                                {index + 1}
                              </span>
                              <span>{questionResult.questionType.replace('-', ' ')}</span>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] ${statusColor} flex items-center gap-1.5`}>
                              {isTimedOut && <Clock size={12} />}
                              {isSkipped && <SkipForward size={12} />}
                              {statusText}
                            </span>
                          </div>

                          <h4 className="mt-4 text-[18px] font-semibold leading-relaxed text-[#23150D] sm:text-[19px]">
                            {questionResult.question}
                          </h4>

                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-3 text-base font-black text-[#6D5037]">
                              {!isSkipped && !isTimedOut && (
                                <>
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF8F0] px-3 py-1.5 border border-[#E6D8C8]">
                                    <Star size={12} className="fill-[#B58B60] text-[#B58B60]" />
                                    +{questionResult.starsEarned}
                                  </span>
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF8F0] px-3 py-1.5 border border-[#E6D8C8]">
                                    +{questionResult.xpEarned} XP
                                  </span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <ChevronDown size={16} className={cn("text-[#A08363] transition-transform", isExpanded && "rotate-180")} />
                            </div>
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mt-6 pt-6 border-t border-[#E9DDCF] space-y-4"
                              >
                                {!isSkipped && !isTimedOut && (
                                  <div className="grid gap-3 md:grid-cols-2">
                                    <AnswerPanel label="Votre réponse" value={questionResult.givenAnswer} muted />
                                    <AnswerPanel label="Réponse correcte" value={questionResult.correctAnswer} />
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="px-6 pb-28 pt-8 sm:px-8 lg:px-10 max-w-3xl mx-auto w-full"
              >
                <MissionLeaderboard 
                   missionId={summary?.missionId || ''} 
                   currentUserId={profile?.id} 
                 />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-white/40 bg-[linear-gradient(180deg,rgba(255,250,243,0.62),rgba(248,240,230,0.95))] px-6 py-4 backdrop-blur-2xl sm:px-8 lg:px-10 z-20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-base font-semibold text-[#6D5948]">
              <span className="font-black text-[#2A1A10]">{countedXp} XP</span> gagnés
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onReplayMission}
                className="inline-flex h-[50px] items-center justify-center gap-3 rounded-full border border-[#D7C4AD] bg-white/75 px-6 font-black text-[#2A1A10] shadow-sm backdrop-blur-md"
              >
                <RotateCcw size={16} className="text-[#A77C55]" />
                Rejouer
              </motion.button>

              {onContinue && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onContinue}
                  className="inline-flex h-[50px] items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#24160D] to-[#2A1A10] px-8 font-black text-white shadow-xl shadow-black/10"
                >
                  Continuer
                  <ArrowRight size={16} />
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onBackToCity}
                className={cn(
                  "inline-flex h-[50px] items-center justify-center gap-3 rounded-full px-6 font-black",
                  onContinue 
                    ? "bg-white border-2 border-[#D8C5AF] text-[#8A6A49]" 
                    : "bg-gradient-to-r from-[#24160D] to-[#2A1A10] text-white"
                )}
              >
                <MapPin size={16} />
                Quitter
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
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
