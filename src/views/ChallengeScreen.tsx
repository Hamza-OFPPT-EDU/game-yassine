import { useState, useEffect, useRef, useCallback, type FC, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  DragOverlay,
  closestCenter,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Lightbulb, TrendingUp, CheckCircle2, Loader2, X, Map as MapIcon, Info, PartyPopper, Compass, Trophy, User, Settings, LayoutGrid, Sparkles, MessageSquare, RotateCcw, SkipForward, Clapperboard, Check, Wind } from 'lucide-react';
import { type City, type Challenge, type MissionCompletionSummary, type MissionQuestionResult, type Mission } from '../types';
import { cn } from '../lib/utils';
import { useSupabaseQuestions } from '../hooks/useSupabase';
import { useAudio } from '../hooks/useAudio';
import { useTimer } from '../hooks/useTimer';
import { TimerBar } from '../components/TimerBar';

// Helper for dynamic theming based on exercise type
const getThemeConfig = (type: string) => {
  const t = type.toLowerCase();
  
  if (['scenario-decision', 'scenario-dialogue', 'scenario-cascade', 'decision', 'dialogue'].includes(t)) {
    return {
      category: 'Histoire',
      icon: <Clapperboard size={16} />,
      bgClass: 'bg-amber-50/50',
      accentColor: 'text-amber-600',
      borderColor: 'border-amber-200',
      gradient: 'from-amber-50 to-orange-50',
      layout: 'narrative',
      pattern: 'parchment'
    };
  }
  
  if (['zellige', 'puzzle-riddle', 'riddle', 'mosaic', 'glitch'].includes(t)) {
    return {
      category: 'Atelier',
      icon: <Sparkles size={16} />,
      bgClass: 'bg-teal-50/50',
      accentColor: 'text-teal-600',
      borderColor: 'border-teal-200',
      gradient: 'from-teal-50 to-emerald-50',
      layout: 'artistic',
      pattern: 'mosaic'
    };
  }
  
  if (['matching', 'ranking', 'team-roles', 'fill-in-blanks', 'sorting-challenge'].includes(t)) {
    return {
      category: 'Mise en Situation',
      icon: <LayoutGrid size={16} />,
      bgClass: 'bg-blue-50/50',
      accentColor: 'text-blue-600',
      borderColor: 'border-blue-200',
      gradient: 'from-blue-50 to-indigo-50',
      layout: 'technical',
      pattern: 'grid'
    };
  }
  
  return {
    category: 'Défi',
    icon: <Compass size={16} />,
    bgClass: 'bg-voyage-sand/10',
    accentColor: 'text-voyage-accent',
    borderColor: 'border-voyage-secondary/20',
    gradient: 'from-white to-voyage-sand/10',
    layout: 'standard',
    pattern: 'dots'
  };
};

interface ChallengeScreenProps {
  city: City;
  mission: Mission;
  onComplete: (summary: MissionCompletionSummary) => void;
  onBack: () => void;
  redoQuestionIds?: string[];
}

export default function ChallengeScreen({ city, mission, onComplete, onBack, redoQuestionIds }: ChallengeScreenProps) {
  const { playSound } = useAudio();
  const { questions: allQuestions, loading: loadingQuestions } = useSupabaseQuestions(mission.id);
  
  // Filter questions if redoQuestionIds is provided
  const questions = redoQuestionIds && redoQuestionIds.length > 0
    ? allQuestions.filter(q => redoQuestionIds.includes(q.id))
    : allQuestions;
  
  const [currentIdx, setCurrentIdx] = useState(redoQuestionIds ? 0 : 0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [selectedWordIdx, setSelectedWordIdx] = useState<number | null>(null);
  const [selectedRankIds, setSelectedRankIds] = useState<string[]>([]);
  const [matchingSelections, setMatchingSelections] = useState<{ [key: string]: string }>({});
  const [blanksValues, setBlanksValues] = useState<{ [key: string]: string }>({});
  const [teamRoleValues, setTeamRoleValues] = useState<{ [key: string]: string }>({});
  const [selectedMultiIds, setSelectedMultiIds] = useState<string[]>([]);
  
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showCinematic, setShowCinematic] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [hoverDropId, setHoverDropId] = useState<string | null>(null);
  const [questionResults, setQuestionResults] = useState<MissionQuestionResult[]>([]);
  const [shortAnswer, setShortAnswer] = useState('');
  const [startTime, setStartTime] = useState(Date.now());
  const [attempts, setAttempts] = useState(0);
  
  // Timer & Skip state
  const DEFAULT_QUESTION_TIME = 30; // seconds
  const timer = useTimer({
    initialSeconds: DEFAULT_QUESTION_TIME,
    enabled: !showFeedback,
    onTimeExpired: () => handleTimeExpired(),
  });
  
  const [timerStartTime, setTimerStartTime] = useState(Date.now());
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );
  const hoverFeedbackRef = useRef<string | null>(null);
  const currentQuestionResultRef = useRef<MissionQuestionResult | null>(null);
  const timeoutHandledRef = useRef(false);
  const autoNextTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const challenge = questions[currentIdx];
  
  // Options are now normalized in useSupabaseQuestions hook
  // Ensure options is always an array for safe .map() calls
  const normalizedOptions = Array.isArray(challenge?.options) ? challenge.options : [];
  
  const matchingOptions = normalizedOptions;
  const matchingTargets = Array.from(
    new Set(matchingOptions.map((option) => option.match).filter(Boolean)),
  ).sort();
  const rankingOptions = normalizedOptions;

  useEffect(() => {
    if (!hoverDropId || hoverFeedbackRef.current === hoverDropId) return;
    hoverFeedbackRef.current = hoverDropId;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(12);
    }
  }, [hoverDropId]);

  useEffect(() => {
    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }

    timeoutHandledRef.current = false;
    handleReset();
    timer.reset(DEFAULT_QUESTION_TIME);
    setShortAnswer('');
    setStartTime(Date.now());
    setAttempts(0);
    setCurrentStepIdx(0);
    setTimerStartTime(Date.now());
    setIsTimerPaused(false);
  }, [currentIdx]);

  useEffect(() => {
    return () => {
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
        autoNextTimeoutRef.current = null;
      }
    };
  }, []);

  const handleReset = () => {
    setSelectedOptionId(null);
    setSelectedWordIdx(null);
    setSelectedRankIds([]);
    setMatchingSelections({});
    setBlanksValues({});
    setTeamRoleValues({});
    setSelectedMultiIds([]);
    if (challenge?.type === 'zellige') {
      const initialRotations: { [key: string]: string } = {};
      for (let i = 0; i < 9; i++) {
        initialRotations[i] = String(Math.floor(Math.random() * 4) * 90);
      }
      setMatchingSelections(initialRotations);
    } else {
      setMatchingSelections({});
    }
    setShowFeedback(false);
    setShowHint(false);
    setActiveDragId(null);
    setHoverDropId(null);
    hoverFeedbackRef.current = null;
    currentQuestionResultRef.current = null;
  };

  const parseMatchingSource = (id: string) => id.startsWith('match-src-') ? Number(id.replace('match-src-', '')) : null;
  const parseMatchingTarget = (id: string) => id.startsWith('match-target-') ? Number(id.replace('match-target-', '')) : null;
  const parseRankOptionId = (id: string) => id.startsWith('rank-opt-') ? id.replace('rank-opt-', '') : null;
  const parseRankSlot = (id: string) => id.startsWith('rank-slot-') ? Number(id.replace('rank-slot-', '')) : null;

  const getActiveDragLabel = () => {
    if (!activeDragId) return null;

    if (activeDragId.startsWith('match-src-')) {
      const sourceIdx = parseMatchingSource(activeDragId);
      if (sourceIdx === null || Number.isNaN(sourceIdx)) return null;
      return matchingOptions[sourceIdx]?.text || null;
    }

    if (activeDragId.startsWith('rank-opt-')) {
      const optionId = parseRankOptionId(activeDragId);
      if (!optionId) return null;
      return rankingOptions.find((option) => option.id === optionId)?.text || null;
    }

    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
  };

  const handleDragOver = (event: DragOverEvent) => {
    setHoverDropId(event.over ? String(event.over.id) : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const activeId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : null;

    setActiveDragId(null);
    setHoverDropId(null);

    if (!challenge || showFeedback || !overId) return;

    if (challenge.type === 'matching') {
      const sourceIdx = parseMatchingSource(activeId);
      const targetIdx = parseMatchingTarget(overId);

      if (sourceIdx === null || targetIdx === null || Number.isNaN(sourceIdx) || Number.isNaN(targetIdx)) return;

      const targetLabel = matchingTargets[targetIdx];
      if (!targetLabel) return;

      setMatchingSelections((prev) => {
        return {
          ...prev,
          [String(sourceIdx)]: targetLabel,
        };
      });
      playSound('match');
      return;
    }

    if (challenge.type === 'ranking') {
      const optionId = parseRankOptionId(activeId);
      if (!optionId) return;

      if (overId === 'rank-pool') {
        setSelectedRankIds((prev) => prev.filter((id) => id !== optionId));
        playSound('click');
        return;
      }

      let slotIndex = parseRankSlot(overId);
      if ((slotIndex === null || Number.isNaN(slotIndex)) && overId.startsWith('rank-opt-')) {
        const overOptionId = parseRankOptionId(overId);
        if (overOptionId) {
          const existingIndex = selectedRankIds.indexOf(overOptionId);
          if (existingIndex >= 0) slotIndex = existingIndex;
        }
      }

      if (slotIndex === null || Number.isNaN(slotIndex)) return;

      setSelectedRankIds((prev) => {
        const without = prev.filter((id) => id !== optionId);
        const insertAt = Math.max(0, Math.min(slotIndex, rankingOptions.length - 1));
        without.splice(insertAt, 0, optionId);
        return without;
      });
      playSound('click');
    }
  };

  const handleConfirm = () => {
    if (canConfirm()) {
      timeoutHandledRef.current = true;
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
        autoNextTimeoutRef.current = null;
      }

      const result = buildQuestionResult();
      if (result) {
        currentQuestionResultRef.current = result;
        setQuestionResults((prev) => [...prev, result]);
      }
      setShowFeedback(true);
      if (isCorrect()) {
        playSound('correct');
      } else {
        playSound('wrong');
      }
    }
  };

  const handleSkip = () => {
    timeoutHandledRef.current = true;
    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }

    playSound('click');
    const timeSpent = (Date.now() - timerStartTime) / 1000;
    const skipResult: MissionQuestionResult = {
      questionId: challenge?.id || '',
      questionType: challenge?.type || 'multiple-choice',
      question: challenge?.question || '',
      givenAnswer: '(Passée)',
      correctAnswer: challenge?.correctOptionId || '—',
      isCorrect: false,
      xpEarned: 0,
      starsEarned: 0,
      isSkipped: true,
      timeSpent,
    };
    currentQuestionResultRef.current = skipResult;
    setQuestionResults((prev) => [...prev, skipResult]);
    handleNext();
  };

  const handleTimeExpired = () => {
    if (timeoutHandledRef.current || showFeedback) return;

    timeoutHandledRef.current = true;
    playSound('wrong');
    setShowFeedback(true);

    const timeSpent = (Date.now() - timerStartTime) / 1000;
    const timedOutResult: MissionQuestionResult = {
      questionId: challenge?.id || '',
      questionType: challenge?.type || 'multiple-choice',
      question: challenge?.question || '',
      givenAnswer: '—',
      correctAnswer: challenge?.correctOptionId || '—',
      isCorrect: false,
      xpEarned: 0,
      starsEarned: 0,
      isTimedOut: true,
      timeSpent,
    };

    currentQuestionResultRef.current = timedOutResult;
    setQuestionResults((prev) => [...prev, timedOutResult]);

    autoNextTimeoutRef.current = setTimeout(() => {
      handleNext();
    }, 1500);
  };
  const canConfirm = () => {
    if (!challenge) return false;
    const type = challenge.type;
    if (['multiple-choice', 'true-false', 'scenario-decision', 'scenario-dialogue', 'scenario-cascade', 'short-answer', 'puzzle-riddle', 'time-attack'].includes(type)) return !!selectedOptionId;
    if (type === 'glitch') return selectedWordIdx !== null;
    if (type === 'ranking') return selectedRankIds.length === (challenge.options?.length || 0);
    if (type === 'fill-in-blanks') return Object.keys(blanksValues).length > 0;
    if (type === 'matching') return Object.keys(matchingSelections).length === matchingOptions.length;
    if (type === 'team-roles') return Object.keys(teamRoleValues).length > 0;
    if (type === 'error-detection') return selectedMultiIds.length > 0;
    if (type === 'zellige') return true; 
    return false;
  };

  const isCorrect = () => {
    if (!challenge) return false;
    const type = challenge.type;
    if (type === 'error-detection') {
      const errorIds = normalizedOptions.filter(o => o.isError).map(o => o.id);
      if (errorIds.length === 0) return true; // No errors to find
      return errorIds.every(id => selectedMultiIds.includes(id)) && selectedMultiIds.length === errorIds.length;
    }
    if (type === 'glitch') return selectedWordIdx === parseInt(challenge.correctOptionId || '0');
    if (type === 'ranking') return selectedRankIds.join(',') === challenge.correctOptionId;
    if (type === 'fill-in-blanks') {
      const sorted = Object.keys(blanksValues).sort().map(k => blanksValues[k]);
      const correct = challenge.correctOptionId?.split(/[|,,]/).map(s => s.trim()) || [];
      return sorted.join('|') === correct.join('|');
    }
    if (type === 'matching') {
      return matchingOptions.every((opt, idx) => matchingSelections[String(idx)] === opt.match);
    }
    if (type === 'team-roles') return true; 
    if (type === 'zellige') {
      return Object.values(matchingSelections).every(angle => parseInt(angle as string) % 360 === 0);
    }
    return selectedOptionId === challenge.correctOptionId;
  };

  const handleNext = useCallback(() => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      const finalResults = mergeResults(questionResults, currentQuestionResultRef.current);
      playSound('success');
      onComplete(buildMissionSummary(finalResults));
    }
  }, [currentIdx, questions.length, questionResults, playSound, onComplete]);

  const mergeResults = (
    results: MissionQuestionResult[],
    currentResult: MissionQuestionResult | null,
  ) => {
    if (!currentResult) return results;
    const filtered = results.filter(r => r.questionId !== currentResult.questionId);
    return [...filtered, currentResult];
  };

  const buildMissionSummary = (results: MissionQuestionResult[]): MissionCompletionSummary => {
    const totalXp = results.reduce((sum, r) => sum + (r.xpEarned || 0), 0);
    const totalStars = results.reduce((sum, r) => sum + (r.starsEarned || 0), 0);
    const correctCount = results.filter((r) => r.isCorrect).length;
    const totalQuestions = results.length;

    return {
      missionId: mission.id,
      missionTitle: mission.title_fr,
      cityId: city.id,
      cityName: city.name,
      questions: results,
      totalXp,
      totalStars,
      correctCount,
      totalQuestions,
      successRate: totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0,
    };
  };

  // Skip button handler

  const buildQuestionResult = (): MissionQuestionResult | null => {
    if (!challenge) return null;

    const xpReward = challenge.xp_reward ?? 20;
    const correct = isCorrect();
    const starsEarned = correct ? 1 : 0;
    const timeSpent = (Date.now() - timerStartTime) / 1000;

    const getOptionText = (optionId: string | null | undefined, options: any[]) => {
      if (!optionId) return '—';
      return options.find((option) => option.id === optionId)?.text || optionId;
    };

    const getSelectedRankTexts = () => selectedRankIds
      .map((optionId) => rankingOptions.find((option) => option.id === optionId)?.text || optionId)
      .join(' → ');

    const getCorrectRankTexts = () => (challenge.correctOptionId || '')
      .split(',')
      .map((optionId) => optionId.trim())
      .filter(Boolean)
      .map((optionId) => rankingOptions.find((option) => option.id === optionId)?.text || optionId)
      .join(' → ');

    const getMatchingAnswer = (sourceMap: Record<string, string>) => matchingOptions
      .map((option, index) => `${option.text} → ${sourceMap[String(index)] || '—'}`)
      .join('\n');

    const result: MissionQuestionResult = {
      questionId: challenge.id,
      questionType: challenge.type,
      question: challenge.question,
      givenAnswer: '—',
      correctAnswer: '—',
      isCorrect: correct,
      xpEarned: correct ? xpReward : 0,
      starsEarned,
      timeSpent,
    };

    if (['multiple-choice', 'true-false', 'scenario-decision', 'scenario-dialogue', 'scenario-cascade', 'puzzle-riddle', 'time-attack', 'error-detection'].includes(challenge.type)) {
      if (challenge.type === 'error-detection') {
        const selectedTexts = selectedMultiIds.map(id => normalizedOptions.find(o => o.id === id)?.text).filter(Boolean);
        const correctTexts = normalizedOptions.filter(o => o.isError).map(o => o.text);
        result.givenAnswer = selectedTexts.join(', ') || '—';
        result.correctAnswer = correctTexts.join(', ') || '—';
      } else {
        result.givenAnswer = getOptionText(selectedOptionId, challenge.options || []);
        result.correctAnswer = getOptionText(challenge.correctOptionId, challenge.options || []);
      }
      return result;
    }

    if (challenge.type === 'short-answer') {
      result.givenAnswer = selectedOptionId || '—';
      result.correctAnswer = challenge.correctOptionId || 'Réponse attendue par l’équipe pédagogique';
      return result;
    }

    if (challenge.type === 'fill-in-blanks') {
      const orderedGiven = Object.keys(blanksValues)
        .sort((a, b) => Number(a) - Number(b))
        .map((key) => blanksValues[key])
        .filter(Boolean);
      const orderedCorrect = (challenge.correctOptionId || '')
        .split(/[|,]/)
        .map((part) => part.trim())
        .filter(Boolean);
      result.givenAnswer = orderedGiven.join(' | ') || '—';
      result.correctAnswer = orderedCorrect.join(' | ') || '—';
      return result;
    }

    if (challenge.type === 'matching') {
      result.givenAnswer = getMatchingAnswer(matchingSelections);
      result.correctAnswer = getMatchingAnswer(
        Object.fromEntries((challenge.options as any[]).map((option, index) => [String(index), option.match || '—'])),
      );
      return result;
    }

    if (challenge.type === 'ranking') {
      result.givenAnswer = getSelectedRankTexts() || '—';
      result.correctAnswer = getCorrectRankTexts() || '—';
      return result;
    }

    if (challenge.type === 'zellige') {
      result.givenAnswer = `${Object.values(matchingSelections).filter(Boolean).length} carreaux orientés`;
      result.correctAnswer = 'Tous les carreaux orientés correctement';
      return result;
    }

    if (challenge.type === 'team-roles') {
      result.givenAnswer = Object.entries(teamRoleValues)
        .map(([role, value]) => `${role}: ${value}`)
        .join('\n') || '—';
      result.correctAnswer = 'Réponses à compléter selon le scénario';
      return result;
    }

    return result;
  };

  if (loadingQuestions) {
    return (
      <div className="h-full w-full bg-white flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-voyage-accent" size={48} />
        <p className="mt-4 font-headline font-black text-voyage-accent uppercase tracking-widest text-xs">Chargement du défi...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="h-full w-full bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-32 h-32 bg-duo-orange/10 rounded-full flex items-center justify-center mb-6">
           <MapIcon size={64} className="text-duo-orange" />
        </div>
        <h2 className="font-headline font-black text-2xl text-duo-eel mb-2">Oups !</h2>
        <p className="font-bold text-duo-wolf mb-8">Nous n'avons pas trouvé de questions pour cette mission.</p>
        <button onClick={onBack} className="btn-voyage-accent px-12 py-4 uppercase font-black tracking-tight">Retour</button>
      </div>
    );
  }

  // Handle case where challenge data might be incomplete
  if (challenge && (!challenge.options || (Array.isArray(challenge.options) && challenge.options.length === 0))) {
    const typeNoOptions = ['short-answer', 'puzzle-riddle', 'glitch', 'scenario-cascade'];
    if (!typeNoOptions.includes(challenge.type)) {
       return (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 px-8 bg-white">
          <div className="w-24 h-24 bg-duo-swan/20 rounded-full flex items-center justify-center border-2 border-duo-swan">
             <LayoutGrid className="text-duo-wolf opacity-40" size={48} />
          </div>
          <div className="space-y-2">
             <h2 className="text-2xl font-black text-duo-eel tracking-tight">Oups ! Données manquantes</h2>
             <p className="text-duo-wolf font-bold">Cet exercice n'est pas encore prêt. Ne t'inquiète pas, tu peux le passer !</p>
          </div>
          <button 
             onClick={() => setCurrentIdx(prev => prev + 1)}
             className="btn-voyage-accent w-full max-w-xs"
          >
             Passer cet exercice
          </button>
          <button 
             onClick={onBack}
             className="text-voyage-accent font-black uppercase tracking-widest text-xs hover:underline"
          >
             Retour à la mission
          </button>
        </div>
       );
    }
  }

  if (!challenge) return null;


  const progress = ((currentIdx + 1) / questions.length) * 100;
  const theme = getThemeConfig(challenge?.type || 'multiple-choice');

  return (
    <div className={cn("h-full w-full flex flex-col relative overflow-hidden transition-colors duration-500", theme.bgClass)}>
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        {theme.pattern === 'grid' && (
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        )}
        {theme.pattern === 'mosaic' && (
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20zm20-20h20v20H20V0z\' fill=\'%23000\' fill-opacity=\'1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")', backgroundSize: '40px 40px' }} />
        )}
        {theme.pattern === 'parchment' && (
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#8B4513 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />
        )}
        {theme.pattern === 'dots' && (
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        )}
      </div>
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b-[3px] border-duo-swan px-6 py-4 flex items-center gap-6">
        <button onClick={() => { playSound('click'); onBack(); }} className="p-2 hover:bg-duo-swan rounded-xl transition-colors">
          <X size={24} className="text-duo-wolf" />
        </button>

        <button 
          onClick={() => { playSound('click'); setShowCinematic(true); }}
          className="p-2 hover:bg-duo-swan rounded-xl transition-colors shrink-0"
          title="Contexte de la mission"
        >
          <Clapperboard size={22} className="text-voyage-primary" />
        </button>
        
        <div className="grow">
          <div className="h-6 w-full bg-duo-swan rounded-full overflow-hidden border-2 border-duo-swan relative shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-voyage-primary rounded-full shadow-[0_0_15px_rgba(45,106,79,0.4)] relative"
            >
               <div className="absolute top-0.5 left-1 right-1 h-1.5 bg-white/40 rounded-full" />
            </motion.div>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-duo-orange/10 flex items-center justify-center">
              <TrendingUp size={16} className="text-duo-orange" />
           </div>
           <span className="font-black text-duo-orange text-sm">{currentIdx + 1}/{questions.length}</span>
        </div>
      </header>
      
      {/* Timer Bar */}
      <div className="fixed top-20 left-0 right-0 z-40">
        <TimerBar
          percentRemaining={timer.percentRemaining}
          secondsRemaining={timer.remaining}
          isWarning={timer.isWarning}
          isCritical={timer.isCritical}
          isPaused={isTimerPaused}
        />
      </div>
      
      <main className={cn(
        "grow pt-40 pb-32 px-6 max-w-2xl mx-auto w-full relative z-10 overflow-y-auto scrollbar-hide",
        theme.layout === 'artistic' && "flex flex-col justify-center pt-32"
      )}>
        <div className="mb-8 space-y-4">
          <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full border transition-all", theme.bgClass, theme.borderColor)}>
             <span className={cn("shrink-0", theme.accentColor)}>{theme.icon}</span>
             <span className={cn("text-[10px] font-black uppercase tracking-widest", theme.accentColor)}>
               {theme.category}
             </span>
          </div>
          
          {challenge.content && challenge.content[0] && challenge.type !== 'fill-in-blanks' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-voyage-accent/10 p-6 rounded-[32px] border-2 border-voyage-accent/20 mb-6 shadow-md"
            >
              <p className="text-xl font-bold text-voyage-primary/95 leading-relaxed italic">
                {challenge.content[0]}
              </p>
            </motion.div>
          )}

          {/* Guide de respiration pour la technique 4-7-8 */}
          {(challenge.question?.includes('4-7-8') || challenge.presentation_fr?.includes('4-7-8')) && (
            <div className="flex flex-col items-center justify-center py-6 bg-white/50 rounded-3xl border-2 border-dashed border-voyage-accent/30 mb-6">
              <motion.div
                animate={{
                  scale: [1, 1.4, 1.4, 1],
                }}
                transition={{
                  duration: 19,
                  times: [0, 4/19, 11/19, 1],
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-24 h-24 rounded-full bg-voyage-accent/20 border-4 border-voyage-accent flex items-center justify-center"
              >
                <Wind size={32} className="text-voyage-accent" />
              </motion.div>
              <div className="mt-4 flex gap-3">
                <span className="text-[10px] font-black text-voyage-accent uppercase tracking-tighter bg-voyage-accent/10 px-2 py-1 rounded-md">Inspire (4s)</span>
                <span className="text-[10px] font-black text-voyage-accent uppercase tracking-tighter bg-voyage-accent/10 px-2 py-1 rounded-md">Bloque (7s)</span>
                <span className="text-[10px] font-black text-voyage-accent uppercase tracking-tighter bg-voyage-accent/10 px-2 py-1 rounded-md">Expire (8s)</span>
              </div>
            </div>
          )}
          {challenge.illustration_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl bg-white/50"
            >
              <img 
                src={challenge.illustration_url} 
                alt="Illustration" 
                className="w-full h-auto max-h-[300px] object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </motion.div>
          )}

          <div className="space-y-4 text-center mb-10">
            <h2 className="text-3xl font-black text-duo-eel leading-tight tracking-tight px-4">
              {challenge.type === 'scenario-cascade' && challenge.steps && challenge.steps[currentStepIdx] 
                ? challenge.steps[currentStepIdx].question 
                : challenge.question}
            </h2>
            {challenge.arabicQuestion && (
              <h3 className="text-4xl font-bold text-voyage-accent leading-tight arabic-font" dir="rtl">
                {challenge.arabicQuestion}
              </h3>
            )}
          </div>
        </div>

        <motion.div 
          key={challenge?.id || 'empty'}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="space-y-6"
        >
          {challenge && ['multiple-choice', 'true-false', 'scenario-decision', 'scenario-cascade', 'decision', 'dialogue', 'time-attack'].includes(challenge.type) && (
            <div className="space-y-3">
              {normalizedOptions.map((opt) => {
                const isCorrect = challenge && opt.id === challenge.correctOptionId;
                const isSelected = selectedOptionId === opt.id;
                const showSuccess = showFeedback && isCorrect;
                const showWrong = showFeedback && isSelected && !isCorrect;
                
                // Truncate long labels
                const displayLabel = opt.label && opt.label.length <= 2 ? opt.label : String.fromCharCode(65 + normalizedOptions.indexOf(opt));

                return (
                  <button
                    key={opt.id}
                    disabled={showFeedback}
                    onClick={() => {
                      playSound('click');
                      setSelectedOptionId(opt.id);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 p-5 text-left rounded-2xl border-2 transition-all duration-100 group relative",
                      isSelected 
                        ? "bg-voyage-primary/5 border-voyage-primary shadow-[0_4px_0_0_#8B4513] -translate-y-0.5"
                        : showSuccess
                          ? "bg-emerald-50 border-emerald-400 border-b-4 hover:bg-emerald-100/50 active:translate-y-0.5 active:border-b-0 ring-4 ring-emerald-400/20 shadow-emerald-200/50 shadow-lg"
                          : showWrong
                            ? "bg-red-50 border-red-400 border-b-4"
                            : "bg-white border-voyage-secondary/30 hover:bg-voyage-secondary/10 border-b-4 active:translate-y-0.5 active:border-b-0"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border-2 transition-colors",
                      isSelected 
                        ? "bg-voyage-primary border-voyage-primary text-white" 
                        : showSuccess
                          ? "bg-emerald-500 border-emerald-600 text-white shadow-emerald-200 shadow-sm"
                          : "bg-white border-voyage-secondary/30 text-voyage-secondary group-hover:border-voyage-primary/30"
                    )}>
                      {displayLabel}
                    </div>
                    <span className={cn(
                      "font-bold text-xl",
                      isSelected 
                        ? "text-voyage-primary" 
                        : showSuccess
                          ? "text-emerald-700"
                          : "text-duo-eel"
                    )}>{opt.text}</span>

                    {showSuccess && (
                      <div className="ml-auto bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight border-2 border-emerald-600 flex items-center gap-1.5 shadow-md animate-pulse-slow">
                        <CheckCircle2 size={12} className="stroke-[3px]" />
                        Réponse Correcte
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {challenge.type === 'scenario-dialogue' && (
            <div className="space-y-8 py-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0 border-2 border-amber-200 shadow-sm">
                  <User className="text-amber-600" size={28} />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1 block">Mentor</span>
                  <div className="bg-white border-2 border-amber-200 p-5 rounded-2xl rounded-tl-none relative shadow-sm">
                    <div className="absolute -top-2 -left-2 w-4 h-4 bg-white border-t-2 border-l-2 border-amber-200 rotate-45" />
                    <p className="font-bold text-duo-eel leading-relaxed italic">"{challenge.context_dialogue || challenge.question}"</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pl-18">
                <p className="text-[10px] font-black text-voyage-secondary uppercase tracking-widest mb-2 opacity-60">Ta réponse :</p>
                {normalizedOptions.map((opt) => {
                    const isCorrect = opt.id === challenge.correctOptionId;
                    const isSelected = selectedOptionId === opt.id;
                    const showSuccess = showFeedback && isCorrect;

                    return (
                      <button
                        key={opt.id}
                        disabled={showFeedback}
                        onClick={() => {
                          playSound('click');
                          setSelectedOptionId(opt.id);
                        }}
                        className={cn(
                          "w-full p-4 text-left rounded-2xl border-2 transition-all group relative",
                          isSelected 
                            ? "bg-amber-600 text-white border-amber-600 shadow-[0_4px_0_0_#92400E] -translate-y-0.5"
                            : showSuccess
                              ? "bg-emerald-50 border-emerald-400 border-b-4 hover:bg-emerald-100/50"
                              : "bg-white border-amber-200 text-duo-eel border-b-4 hover:bg-amber-50"
                        )}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold">{opt.text}</span>
                          {showSuccess && (
                            <div className="flex-shrink-0 bg-emerald-500 text-white px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tight flex items-center gap-1 shadow-sm">
                              <CheckCircle2 size={10} />
                              Solution
                            </div>
                          )}
                        </div>
                      </button>
                    );
                })}
              </div>
            </div>
          )}

          {challenge.type === 'fill-in-blanks' && (
            <div className="space-y-10">
              <div className="bg-duo-swan/20 p-8 rounded-[2.5rem] border-2 border-duo-swan leading-loose text-xl text-duo-eel text-center font-bold">
                {challenge.content?.[0] ? challenge.content[0].split(/\[\d+\]/).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className={cn(
                        "inline-flex items-center justify-center min-w-[120px] h-11 border-b-4 mx-1.5 rounded-xl transition-all px-4 font-black text-voyage-accent bg-white shadow-sm align-middle mb-1",
                        blanksValues[String(i+1)] ? "border-voyage-accent text-voyage-accent" : "border-voyage-secondary/20 text-transparent"
                      )}>
                        {blanksValues[String(i+1)] || "...."}
                      </span>
                    )}
                  </span>
                )) : (
                  <div className="italic text-voyage-secondary/50">Prépare-toi à compléter ce texte...</div>
                )}
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                {normalizedOptions.map((opt) => {
                  const isUsed = Object.values(blanksValues).includes(opt.text);
                  return (
                    <button
                      key={opt.id}
                      disabled={isUsed || showFeedback}
                      onClick={() => {
                        playSound('click');
                        const nextBlank = String(Object.keys(blanksValues).length + 1);
                        setBlanksValues(prev => ({ ...prev, [nextBlank]: opt.text }));
                      }}
                      className={cn(
                        "px-6 py-4 rounded-2xl font-black transition-all shadow-md border-b-4",
                        isUsed 
                          ? "bg-duo-swan text-duo-wolf/40 border-transparent translate-y-1 shadow-none" 
                          : "bg-white border-duo-swan text-duo-eel hover:bg-duo-swan/20 active:translate-y-0.5 active:border-b-0"
                      )}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-center">
                 <button onClick={() => setBlanksValues({})} disabled={showFeedback} className="text-xs font-black text-voyage-accent uppercase tracking-widest hover:opacity-70 disabled:opacity-30">Réinitialiser</button>
              </div>
            </div>
          )}

          {challenge.type === 'matching' && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDragCancel={() => {
                setActiveDragId(null);
                setHoverDropId(null);
              }}
            >
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  {matchingOptions.map((opt, idx) => {
                    const isAssigned = !!matchingSelections[String(idx)];
                    return (
                      <DraggableCard
                        key={`match-src-${idx}`}
                        id={`match-src-${idx}`}
                        disabled={showFeedback}
                        className={cn(
                          "w-full p-4 rounded-2xl text-left text-sm font-black border-b-4 transition-all",
                          isAssigned
                            ? "bg-voyage-primary/10 border-voyage-primary/40 text-voyage-primary"
                            : "bg-white border-duo-swan text-duo-eel"
                        )}
                      >
                        {opt.text}
                      </DraggableCard>
                    );
                  })}
                </div>
                <div className="space-y-3">
                  {matchingTargets.map((target, idx) => {
                    const dropId = `match-target-${idx}`;
                    const linkedSourceTexts = Object.entries(matchingSelections)
                      .filter(([, value]) => value === target)
                      .map(([sourceIdx]) => matchingOptions[Number(sourceIdx)]?.text)
                      .filter(Boolean);
                    return (
                      <DroppableZone
                        key={dropId}
                        id={dropId}
                        className={cn(
                          "w-full p-4 rounded-2xl text-left text-sm font-black border-b-4 transition-all",
                          hoverDropId === dropId
                            ? "bg-voyage-accent/15 border-voyage-accent text-voyage-primary"
                            : showFeedback
                              ? isCorrect() 
                                ? "bg-emerald-50 border-emerald-400 text-emerald-700" 
                                : "bg-red-50 border-red-400 text-red-700"
                              : "bg-white border-duo-swan text-duo-eel"
                        )}
                      >
                        <div className="flex flex-col gap-1">
                          <span className="text-duo-wolf/70 text-[10px] uppercase tracking-widest">Cible</span>
                          <span>{target}</span>
                          {linkedSourceTexts.length > 0 && (
                            <div className="mt-2 flex flex-col gap-1">
                              {linkedSourceTexts.map((sourceText) => {
                                const sourceIdx = matchingOptions.findIndex(o => o.text === sourceText);
                                const isMatchCorrect = showFeedback && matchingOptions[sourceIdx]?.match === target;
                                
                                return (
                                  <span
                                    key={sourceText}
                                    className={cn(
                                      "inline-flex w-fit px-2 py-1 rounded-full text-[10px] uppercase tracking-wide border",
                                      showFeedback
                                        ? isMatchCorrect 
                                          ? "bg-emerald-500 text-white border-emerald-600" 
                                          : "bg-red-500 text-white border-red-600"
                                        : "bg-voyage-primary/10 text-voyage-primary border-voyage-primary/20"
                                    )}
                                  >
                                    {sourceText}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </DroppableZone>
                    );
                  })}
                </div>
              </div>
              <DragOverlay>
                {getActiveDragLabel() ? (
                  <div className="px-4 py-3 rounded-2xl bg-voyage-primary text-white font-black shadow-2xl">
                    {getActiveDragLabel()}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}

          {challenge.type === 'ranking' && (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDragCancel={() => {
                setActiveDragId(null);
                setHoverDropId(null);
              }}
            >
              <div className="grid grid-cols-1 gap-5">
                <DroppableZone
                  id="rank-pool"
                  className={cn(
                    "p-4 rounded-2xl border-2 border-dashed transition-all",
                    hoverDropId === 'rank-pool'
                      ? "border-voyage-accent bg-voyage-accent/10"
                      : "border-duo-swan bg-duo-swan/10"
                  )}
                >
                  <p className="text-[10px] font-black text-duo-wolf uppercase tracking-widest mb-2">Options à classer</p>
                  <div className="space-y-2">
                    {rankingOptions.filter((opt) => !selectedRankIds.includes(opt.id)).map((opt) => (
                      <DraggableCard
                        key={`rank-opt-${opt.id}`}
                        id={`rank-opt-${opt.id}`}
                        disabled={showFeedback}
                        className="w-full flex items-center gap-4 p-4 text-left rounded-2xl border-b-4 bg-white border-duo-swan"
                      >
                        <span className="font-bold text-duo-eel text-base">{opt.text}</span>
                      </DraggableCard>
                    ))}
                    {rankingOptions.filter((opt) => !selectedRankIds.includes(opt.id)).length === 0 && (
                      <p className="text-xs font-bold text-duo-wolf/60">Toutes les options sont classées.</p>
                    )}
                  </div>
                </DroppableZone>

                <div className="space-y-3">
                  {rankingOptions.map((_, slotIdx) => {
                    const slotId = `rank-slot-${slotIdx}`;
                    const assignedId = selectedRankIds[slotIdx];
                    const assignedOption = rankingOptions.find((opt) => opt.id === assignedId);
                    return (
                      <DroppableZone
                        key={slotId}
                        id={slotId}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-2xl border-b-4 transition-all min-h-18",
                          hoverDropId === slotId
                            ? "bg-voyage-primary/10 border-voyage-primary"
                            : "bg-white border-duo-swan"
                        )}
                      >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 bg-duo-orange/10 border-duo-orange text-duo-orange">
                          {slotIdx + 1}
                        </div>
                        {assignedOption ? (
                          <DraggableCard
                            id={`rank-opt-${assignedOption.id}`}
                            disabled={showFeedback}
                            className="w-full p-2 rounded-xl bg-transparent"
                          >
                            <span className="font-bold text-duo-eel text-lg">{assignedOption.text}</span>
                          </DraggableCard>
                        ) : (
                          <span className="text-duo-wolf/50 font-bold">Dépose ici...</span>
                        )}
                      </DroppableZone>
                    );
                  })}
                </div>
              </div>
              <DragOverlay>
                {getActiveDragLabel() ? (
                  <div className="px-4 py-3 rounded-2xl bg-voyage-primary text-white font-black shadow-2xl">
                    {getActiveDragLabel()}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}

          {challenge.type === 'team-roles' && (
            <div className="space-y-4">
              {((challenge.options as any)?.roles || []).map((roleObj: any, idx: number) => (
                <div key={idx} className="flex flex-col gap-2 p-4 bg-white border-2 border-duo-swan rounded-2xl shadow-sm hover:border-voyage-accent/50 transition-all">
                  <span className="text-[10px] font-black text-duo-wolf uppercase tracking-widest">{roleObj.role}</span>
                  <input
                    type="text"
                    placeholder="Nom du membre..."
                    className="p-2 bg-duo-swan/10 border-b-2 border-duo-swan font-bold text-duo-eel focus:border-voyage-accent outline-none transition-all"
                    onChange={(e) => setTeamRoleValues(prev => ({ ...prev, [roleObj.role]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          )}

          {challenge.type === 'short-answer' && (
             <div className="bg-duo-swan/10 rounded-3xl p-6 border-2 border-duo-swan focus-within:border-voyage-accent transition-colors">
               <textarea 
                 value={selectedOptionId || ''}
                 onChange={(e) => setSelectedOptionId(e.target.value)}
                 disabled={showFeedback}
                 placeholder="Écris ta réponse ici..."
                 className="w-full bg-transparent border-none focus:ring-0 text-xl font-bold text-duo-eel placeholder:text-duo-wolf/30 min-h-37.5 resize-none"
               />
             </div>
          )}

          {challenge.type === 'glitch' && (
            <div className="bg-white border-2 border-duo-swan p-8 rounded-[2.5rem] leading-[2.5] text-xl font-bold text-duo-eel text-center">
               {challenge.content?.[0]?.split(' ').map((word, i) => (
                 <button
                   key={i}
                   disabled={showFeedback}
                   onClick={() => {
                     playSound('click');
                     setSelectedWordIdx(i);
                   }}
                   className={cn(
                     "inline-block px-2 mx-0.5 rounded-lg transition-all",
                     selectedWordIdx === i 
                       ? "bg-voyage-accent text-white shadow-[0_4px_0_0_#A8862E] -translate-y-0.5" 
                       : "hover:bg-duo-swan/30 cursor-pointer"
                   )}
                 >
                   {word}
                 </button>
               ))}
               <p className="mt-8 text-xs font-black text-duo-wolf uppercase tracking-widest opacity-60">Clique sur le mot qui contient une erreur</p>
            </div>
          )}

          {challenge.type === 'error-detection' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-3">
                {normalizedOptions.map((opt) => {
                  const isSelected = selectedMultiIds.includes(opt.id);
                  const isActuallyError = opt.isError;
                  const showSuccess = showFeedback && isActuallyError;
                  const showDanger = showFeedback && isSelected && !isActuallyError;

                  return (
                    <button
                      key={opt.id}
                      disabled={showFeedback}
                      onClick={() => {
                        playSound('click');
                        setSelectedMultiIds(prev => 
                          prev.includes(opt.id) ? prev.filter(id => id !== opt.id) : [...prev, opt.id]
                        );
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-5 text-left rounded-2xl border-2 transition-all duration-200",
                        isSelected 
                          ? "bg-voyage-primary/5 border-voyage-primary shadow-[0_4px_0_0_#8B4513] -translate-y-0.5"
                          : "bg-white border-voyage-secondary/30 hover:bg-voyage-secondary/10 border-b-4",
                        showSuccess && "bg-emerald-50 border-emerald-500 shadow-[0_4px_0_0_#10B981]",
                        showDanger && "bg-red-50 border-red-500 shadow-[0_4px_0_0_#EF4444]"
                      )}
                    >
                      <span className={cn(
                        "font-bold text-lg",
                        isSelected ? "text-voyage-primary" : "text-duo-eel",
                        showSuccess && "text-emerald-700",
                        showDanger && "text-red-700"
                      )}>
                        {opt.text}
                      </span>
                      {isSelected && (
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center border-2",
                          showSuccess ? "bg-emerald-500 border-emerald-600 text-white" : 
                          showDanger ? "bg-red-500 border-red-600 text-white" :
                          "bg-voyage-primary border-voyage-primary text-white"
                        )}>
                          <Check size={14} strokeWidth={4} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {challenge.type === 'puzzle-riddle' && (
            <div className="bg-linear-to-br from-voyage-primary to-voyage-primary/80 p-8 rounded-[3rem] border-4 border-voyage-accent shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles size={120} className="text-white" />
               </div>
               <div className="relative z-10 space-y-8">
                 <div className="flex justify-center">
                    <div className="bg-voyage-accent/20 p-4 rounded-full border border-voyage-accent/30 backdrop-blur-sm">
                       <MessageSquare className="text-voyage-accent" size={32} />
                    </div>
                 </div>
                 <p className="text-2xl font-black text-white text-center leading-relaxed italic">
                   "{challenge.question}"
                 </p>
                 <div className="grid grid-cols-2 gap-4">
                    {normalizedOptions.map((opt) => (
                      <button
                        key={opt.id}
                        disabled={showFeedback}
                        onClick={() => {
                          playSound('click');
                          setSelectedOptionId(opt.id);
                        }}
                        className={cn(
                          "p-4 rounded-2xl font-black transition-all border-b-4",
                          selectedOptionId === opt.id 
                            ? "bg-voyage-accent text-voyage-primary border-voyage-accent-dark -translate-y-0.5" 
                            : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                        )}
                      >
                        {opt.text}
                      </button>
                    ))}
                 </div>
               </div>
            </div>
          )}

          {challenge.type === 'zellige' && (
            <div className="flex flex-col items-center gap-8 py-4">
               <div className="grid grid-cols-3 gap-2 w-full max-w-sm aspect-square bg-voyage-primary/5 p-4 rounded-3xl border-4 border-voyage-secondary/20 shadow-inner">
                  {[...Array(9)].map((_, i) => (
                    <motion.button 
                      key={i}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        if (showFeedback) return;
                        playSound('click');
                        setMatchingSelections(prev => ({ ...prev, [i]: String((parseInt(prev[i] || '0') + 90) % 360) }));
                      }}
                      className="bg-white rounded-xl border-2 border-voyage-secondary/10 flex items-center justify-center relative overflow-hidden group shadow-sm"
                    >
                       <motion.div 
                         animate={{ rotate: parseInt(matchingSelections[i] || '0') }}
                         className="w-full h-full flex items-center justify-center bg-linear-to-tr from-voyage-primary/10 to-voyage-accent/10"
                       >
                          <LayoutGrid className="text-voyage-primary opacity-30" size={32} />
                       </motion.div>
                       <div className="absolute inset-0 border-2 border-transparent group-hover:border-voyage-accent/30 rounded-xl transition-colors" />
                    </motion.button>
                  ))}
               </div>
               <div className="flex flex-col items-center gap-2">
                 <p className="text-voyage-primary font-black uppercase tracking-widest text-xs">Atelier Zellige</p>
                 <p className="text-duo-wolf font-bold italic text-center">Oriente correctement les carreaux pour restaurer le motif fassi.</p>
               </div>
            </div>
          )}

          {showHint && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-voyage-accent/10 border-2 border-voyage-accent/30 p-6 rounded-4xl flex items-start gap-4">
              <Lightbulb className="text-voyage-accent shrink-0" size={24} />
              <div>
                 <span className="text-[10px] font-black text-voyage-accent uppercase tracking-widest block mb-1">INDICE</span>
                 <p className="text-voyage-primary font-bold italic">"{challenge.hint || "Rappelle-toi des leçons précédentes !"}"</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>

      <AnimatePresence>
        {showFeedback ? (
          <motion.footer 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            className={cn(
              "fixed bottom-0 left-0 w-full z-50 p-6 pb-12 pt-8 flex flex-col items-center gap-6 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]",
              isCorrect() ? "bg-voyage-sand border-t-4 border-voyage-accent" : "bg-[#FFF1EE] border-t-4 border-voyage-terracotta"
            )}
          >
            <div className="max-w-2xl w-full flex items-start gap-6 px-4 text-left">
              <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 border-b-8 shadow-xl", isCorrect() ? "bg-voyage-primary border-voyage-primary-dark" : "bg-voyage-terracotta border-voyage-terracotta-dark")}>
                {isCorrect() ? <CheckCircle2 size={48} className="text-white stroke-[3px]" /> : <X size={48} className="text-white stroke-[3px]" />}
              </div>
              <div className="space-y-2">
                <h3 className={cn("text-3xl font-black tracking-tight", isCorrect() ? "text-voyage-primary" : "text-voyage-terracotta")}>
                  {isCorrect() ? "Excellent !" : "Pas tout à fait..."}
                </h3>
                <p className={cn("font-bold leading-relaxed", isCorrect() ? "text-voyage-primary/80" : "text-voyage-terracotta/80")}>
                  {isCorrect() ? (challenge.feedbackPositive || "C'est la bonne réponse ! +10 XP") : (challenge.feedbackNegative || "Retente ta chance !")}
                </p>
                {challenge.explanation_fr && (
                  <div className={cn("mt-2 p-3 rounded-xl text-sm italic font-medium", isCorrect() ? "bg-voyage-primary/5 text-voyage-primary/70" : "bg-voyage-terracotta/5 text-voyage-terracotta/70")}>
                    {challenge.explanation_fr}
                  </div>
                )}
                {isCorrect() && (
                   <div className="bg-white/40 backdrop-blur-sm px-4 py-2 rounded-2xl inline-flex items-center gap-2 border border-white/40">
                      <PartyPopper size={18} className="text-voyage-primary" />
                      <span className="text-voyage-primary font-black text-sm uppercase tracking-tight">+15 XP</span>
                   </div>
                )}
              </div>
            </div>
            <div className="w-full max-w-2xl px-4">
               <motion.button whileTap={{ scale: 0.95 }} onClick={handleNext} className={cn("w-full text-xl py-5 font-black uppercase tracking-tight", isCorrect() ? "btn-voyage-primary" : "bg-voyage-terracotta text-white border-b-4 border-voyage-terracotta-dark rounded-2xl")}>
                 {currentIdx === questions.length - 1 ? "VOIR LE RÉSULTAT" : "CONTINUER"}
               </motion.button>
            </div>
          </motion.footer>
        ) : (
          <footer className="fixed bottom-0 left-0 w-full z-40 bg-white border-t-[3px] border-voyage-secondary/20 p-6 pb-10 flex justify-center">
            <div className="w-full max-w-2xl flex items-center gap-4 px-4">
              <button onClick={() => setShowHint(!showHint)} className="p-4 bg-voyage-sand/30 border-2 border-voyage-secondary/20 rounded-2xl text-voyage-accent hover:bg-voyage-sand/50 transition-colors border-b-4">
                <Lightbulb size={24} />
              </button>
              <button onClick={handleSkip} className="p-4 bg-voyage-accent/10 border-2 border-voyage-accent/30 rounded-2xl text-voyage-accent hover:bg-voyage-accent/20 transition-colors border-b-4 tooltip" title="Passer cette question (0 points)">
                <SkipForward size={24} />
              </button>
              <motion.button
                disabled={!canConfirm()} whileTap={{ scale: 0.95 }} onClick={handleConfirm}
                className={cn("grow text-xl py-5 font-black uppercase tracking-tight transition-all", canConfirm() ? "btn-voyage" : "bg-voyage-secondary/20 text-voyage-primary/30 border-voyage-secondary/10 cursor-not-allowed border-b-0")}
              >
                Vérifier
              </motion.button>
            </div>
          </footer>
        )}
      </AnimatePresence>

      {/* Cinematic Text Overlay */}
      <AnimatePresence>
        {showCinematic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setShowCinematic(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowCinematic(false)}
                className="absolute top-4 right-4 p-2 hover:bg-black/5 rounded-full"
              >
                <X size={20} className="text-duo-wolf" />
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-voyage-primary/10 rounded-xl">
                    <Clapperboard size={20} className="text-voyage-primary" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-voyage-primary/60">Contexte de la mission</h3>
                </div>

                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-duo-eel leading-tight">{mission.title_fr}</h2>
                  <p className="text-duo-wolf font-bold leading-relaxed italic">
                    {mission.cinematic_text || mission.description_fr || "Aucun texte cinématique défini."}
                  </p>
                </div>

                <button 
                  onClick={() => setShowCinematic(false)}
                  className="w-full py-4 bg-voyage-primary text-white rounded-2xl font-black uppercase tracking-wide shadow-lg shadow-voyage-primary/20"
                >
                  J'ai compris
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const DraggableCard: FC<{
  id: string;
  className: string;
  children: ReactNode;
  disabled?: boolean;
}> = ({
  id,
  className,
  children,
  disabled = false,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    touchAction: 'none' as const,
    opacity: isDragging ? 0.45 : 1,
    zIndex: isDragging ? 20 : 1,
  };

  return (
    <motion.div
      layout
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(className, 'cursor-grab active:cursor-grabbing')}
    >
      {children}
    </motion.div>
  );
};

const DroppableZone: FC<{
  id: string;
  className: string;
  children: ReactNode;
}> = ({
  id,
  className,
  children,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <motion.div
      layout
      ref={setNodeRef}
      className={cn(className, isOver && 'ring-2 ring-voyage-accent/50')}
    >
      {children}
    </motion.div>
  );
};

