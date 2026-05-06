import { motion } from 'motion/react';
import { BookOpen, Sparkles, Languages, Compass, ChevronRight, PlayCircle, Star, Heart } from 'lucide-react';
import TopAppBar from '../components/TopAppBar';
import { cn } from '../lib/utils';
import { useAudio } from '../hooks/useAudio';

interface GrammarQuestScreenProps {
  onBack: () => void;
}

export default function GrammarQuestScreen({ onBack }: GrammarQuestScreenProps) {
  const { playSound } = useAudio();
  const stats = { xp: 1450, stars: 120, level: 4 };

  const modules = [
    {
      title: 'Grammaire Essentielle',
      arabicTitle: 'قواعد أساسية',
      description: 'Maîtrisez les bases de la structure des phrases.',
      icon: BookOpen,
      color: 'text-voyage-accent',
      bg: 'bg-voyage-accent/10',
      border: 'border-voyage-accent/20',
      progress: 65,
      lessons: 12
    },
    {
      title: 'Vocabulaire Thématique',
      arabicTitle: 'مفردات موضوعية',
      description: 'Apprenez les mots clés pour voyager au Maroc.',
      icon: Languages,
      color: 'text-voyage-primary',
      bg: 'bg-voyage-primary/10',
      border: 'border-voyage-primary/20',
      progress: 40,
      lessons: 8
    },
    {
      title: 'Culture & Traditions',
      arabicTitle: 'الثقافة والتقاليد',
      description: 'Découvrez l\'histoire et les coutumes locales.',
      icon: Compass,
      color: 'text-voyage-terracotta',
      bg: 'bg-voyage-terracotta/10',
      border: 'border-voyage-terracotta/20',
      progress: 90,
      lessons: 5
    }
  ];

  const quickTips = [
    { title: 'Le saviez-vous ?', text: 'Rabat est la capitale du Maroc depuis 1912.', icon: Sparkles },
    { title: 'Astuce du jour', text: 'Utilisez "Salam" pour saluer n\'importe qui !', icon: Star }
  ];

  return (
    <div className="h-full w-full bg-white flex flex-col relative overflow-hidden">
      <TopAppBar stats={stats} title="Exploration" onBack={onBack} />
      
      <main className="flex-grow overflow-y-auto px-6 pt-24 pb-32 space-y-8 max-w-2xl mx-auto w-full relative z-10 scrollbar-hide">
        
        {/* Hero Section */}
        <section className="bg-voyage-accent rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl">
           <div className="relative z-10 space-y-4">
              <h1 className="text-3xl font-black tracking-tight leading-tight">
                Découvre de nouvelles <br/> compétences !
              </h1>
              <p className="text-white/80 font-bold max-w-[200px]">
                Explore les modules thématiques pour progresser plus vite.
              </p>
              <button 
                onClick={() => playSound('click')}
                className="bg-white text-voyage-accent font-black px-6 py-3 rounded-2xl border-b-4 border-white/20 active:border-b-0 active:translate-y-[2px] transition-all uppercase tracking-tight text-sm"
              >
                 Commencer un module
              </button>
           </div>
           <Sparkles className="absolute -bottom-6 -right-6 text-white/10" size={180} />
        </section>

        {/* Quick Tips Carousel */}
        <section className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
           {quickTips.map((tip, i) => (
             <div key={i} className="min-w-[280px] bg-voyage-accent/5 border-2 border-voyage-accent/20 rounded-3xl p-5 flex items-start gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border-b-4 border-voyage-secondary/20">
                   <tip.icon className="text-voyage-accent" size={24} />
                </div>
                <div>
                   <h4 className="font-black text-duo-eel text-sm">{tip.title}</h4>
                   <p className="text-xs font-bold text-duo-wolf mt-1 leading-relaxed">{tip.text}</p>
                </div>
             </div>
           ))}
        </section>

        {/* Modules List */}
        <section className="space-y-6">
           <div className="flex justify-between items-center px-2">
              <h2 className="text-2xl font-black text-duo-eel tracking-tight">Modules d'Apprentissage</h2>
              <PlayCircle className="text-voyage-accent" size={28} />
           </div>

           <div className="space-y-4">
              {modules.map((module, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => playSound('click')}
                  className={cn("p-6 rounded-[2rem] border-2 border-b-4 flex items-center gap-6 cursor-pointer transition-all", module.bg, module.border)}
                >
                   <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-md border-b-4 border-duo-swan/50 shrink-0">
                      <module.icon className={module.color} size={36} />
                   </div>
                   
                   <div className="flex-grow space-y-1">
                      <div className="flex justify-between items-start">
                         <h3 className="font-black text-duo-eel text-lg leading-tight">{module.title}</h3>
                         <span className="text-[10px] font-black text-duo-wolf uppercase tracking-widest">{module.lessons} COURS</span>
                      </div>
                      <p className="text-voyage-accent font-black text-sm arabic-font leading-none mb-2">{module.arabicTitle}</p>
                      
                      <div className="space-y-2 pt-1">
                         <div className="flex justify-between items-center text-[10px] font-black text-duo-wolf/60 uppercase">
                            <span>Progression</span>
                            <span>{module.progress}%</span>
                         </div>
                         <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${module.progress}%` }}
                               className={cn("h-full rounded-full", module.color.replace('text', 'bg'))}
                            />
                         </div>
                      </div>
                   </div>
                   
                   <ChevronRight className="text-duo-wolf/40" size={24} />
                </motion.div>
              ))}
           </div>
        </section>

        {/* Challenges Recommendation */}
        <section className="bg-white border-2 border-duo-swan rounded-3xl p-8 border-b-4 flex flex-col items-center text-center space-y-4">
           <div className="w-16 h-16 bg-voyage-primary/10 rounded-full flex items-center justify-center border-2 border-voyage-primary/20">
              <Star className="text-voyage-primary fill-voyage-primary" size={32} />
           </div>
           <div className="space-y-1">
              <h3 className="text-xl font-black text-duo-eel uppercase tracking-tight">Le Défi du Jour</h3>
              <p className="text-duo-wolf font-bold">Réussis 3 exercices sans faute pour gagner 50 XP bonus !</p>
           </div>
           <button 
             onClick={() => playSound('click')}
             className="btn-voyage-primary px-8 py-3 w-full"
           >
             RELEVER LE DÉFI
           </button>
        </section>

      </main>
    </div>
  );
}
