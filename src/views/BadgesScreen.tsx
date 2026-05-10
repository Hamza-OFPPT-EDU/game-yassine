import { motion } from 'motion/react';
import { Trophy, Shield, Star, MessageCircle, Brain, Users, GitBranch, ChevronLeft, Loader2, Lock } from 'lucide-react';
import { useAuth, useSupabaseBadges, useSupabaseProfile, useSupabaseAssetConfigs } from '../hooks/useSupabase';
import TopAppBar from '../components/TopAppBar';
import { cn } from '../lib/utils';
import { optimizeSupabaseUrl } from '../lib/city-theme';


interface BadgesScreenProps {
  onBack: () => void;
}

const ICON_MAP: Record<string, any> = {
  Trophy,
  Shield,
  Star,
  MessageCircle,
  Brain,
  Users,
  GitBranch,
};

export default function BadgesScreen({ onBack }: BadgesScreenProps) {
  const { session } = useAuth();
  const { profile } = useSupabaseProfile(session?.user?.id);
  const { badges, earnedBadges, loading: badgesLoading } = useSupabaseBadges(session?.user?.id);
  const { getAssetStyle, loading: configsLoading } = useSupabaseAssetConfigs('badges');

  const loading = badgesLoading || configsLoading;

  const stats = {
    xp: profile?.xp || 0,
    stars: profile?.stars || 0,
    level: profile?.level || 1
  };

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-voyage-sand gap-4">
        <Loader2 className="animate-spin text-voyage-primary" size={48} />
        <p className="text-voyage-primary/60 font-black uppercase tracking-widest text-xs">Chargement de tes succès...</p>
      </div>
    );
  }

  // Group badges by category if needed, or just show them all
  const categories = [
    { id: 'cultural', label: 'Culture & Patrimoine', labelAr: 'الثقافة والتراث' },
    { id: 'achievement', label: 'Exploits', labelAr: 'الإنجازات' },
    { id: 'challenge', label: 'Défis', labelAr: 'التحديات' },
    { id: 'multiplayer', label: 'Compétition', labelAr: 'المنافسة' },
  ];

  return (
    <div className="h-full w-full bg-voyage-sand flex flex-col relative overflow-hidden">
      {/* Premium Header */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b-2 border-voyage-primary/10 px-4 py-3 flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-voyage-primary/5 flex items-center justify-center text-voyage-primary"
        >
          <ChevronLeft size={24} strokeWidth={3} />
        </motion.button>
        <div>
          <h1 className="text-xl font-black text-voyage-primary leading-tight">Tes Badges</h1>
          <p className="text-[10px] font-bold text-voyage-primary/60 uppercase tracking-widest">
            {earnedBadges.length} / {badges.length} débloqués
          </p>
        </div>
      </div>

      <main className="flex-grow overflow-y-auto px-6 pt-24 pb-32 space-y-8 scrollbar-hide">
        {categories.map((cat, catIdx) => {
          const catBadges = badges.filter(b => b.category === cat.id);
          if (catBadges.length === 0) return null;

          return (
            <section key={cat.id} className="space-y-4">
              <div className="flex justify-between items-end px-2">
                <div>
                  <h2 className="text-lg font-black text-voyage-primary">{cat.label}</h2>
                  <p className="text-[10px] font-bold text-voyage-primary/40 uppercase tracking-widest">{cat.labelAr}</p>
                </div>
                <div className="h-px flex-grow mx-4 bg-voyage-primary/10 mb-2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {catBadges.map((badge, idx) => {
                  const isEarned = earnedBadges.includes(badge.id);
                  const Icon = ICON_MAP[badge.icon_name] || Trophy;
                  
                  return (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (catIdx * 0.2) + (idx * 0.05) }}
                      className={cn(
                        "relative p-5 rounded-3xl border-2 border-b-4 flex flex-col items-center text-center gap-3 transition-all",
                        isEarned 
                          ? "bg-white border-voyage-primary/20 shadow-sm" 
                          : "bg-voyage-primary/5 border-transparent opacity-60 grayscale"
                      )}
                    >
                      {/* Badge Icon Container */}
                      <div 
                        className={cn("w-20 h-20 rounded-full flex items-center justify-center border-b-4 shadow-sm transition-transform bg-voyage-primary/10 border-voyage-primary/20 overflow-hidden relative mb-2")}
                        style={isEarned ? getAssetStyle(badge.image_url) : {}}
                      >
                        {badge.image_url && badge.image_url.startsWith('http') ? (
                          <img 
                            src={optimizeSupabaseUrl(badge.image_url, 160, 85)} 
                            alt={badge.badge_name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <span className="text-4xl">{badge.image_url || '🏆'}</span>
                        )}
                        
                        {!isEarned && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-2xl">
                            <Lock size={24} className="text-white/60" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h3 className={cn("font-black text-sm leading-tight", isEarned ? "text-voyage-primary" : "text-voyage-primary/40")}>
                          {badge.badge_name}
                        </h3>
                        <p className="text-[9px] font-bold text-voyage-primary/40 arabic-font leading-none">
                          {badge.badge_name_ar || badge.description_ar}
                        </p>
                      </div>

                      {isEarned && (
                        <div className="mt-1 px-3 py-1 bg-voyage-accent/10 rounded-full">
                           <span className="text-[10px] font-black text-voyage-accent uppercase">Débloqué</span>
                        </div>
                      )}
                      
                      {!isEarned && badge.points && (
                         <div className="mt-1 flex items-center gap-1">
                            <Star size={10} className="fill-voyage-primary/20 text-voyage-primary/20" />
                            <span className="text-[10px] font-black text-voyage-primary/30 uppercase">{badge.points} XP</span>
                         </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
