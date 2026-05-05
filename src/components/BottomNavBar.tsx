import { motion } from 'motion/react';
import { MapIcon, Trophy, User, Compass, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAudio } from '../hooks/useAudio';

interface BottomNavBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNavBar({ activeTab, onTabChange }: BottomNavBarProps) {
  const { playSound } = useAudio();
  const tabs = [
    { id: 'explore', icon: Compass, label: 'Explorer' },
    { id: 'league', icon: Trophy, label: 'Ligues' },
    { id: 'journey', icon: MapIcon, label: 'Parcours' },
    { id: 'profile', icon: User, label: 'Profil' },
    { id: 'settings', icon: Settings, label: 'Réglages' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-2 pt-2 bg-[#FDFBF7] border-t-[3px] border-[#7B3F1A]/20 shadow-[0_-10px_40px_rgba(123,63,26,0.15)] rounded-t-[32px] backdrop-blur-sm">
      {/* Texture parchemin subtile */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-t-[32px] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/p6-dark.png')]" />
      </div>

      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.85 }}
            onClick={() => {
              playSound('click');
              onTabChange(tab.id);
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 p-3 rounded-[20px] transition-all relative",
              isActive 
                ? "bg-amber-100/50 shadow-inner border border-amber-200/50" 
                : "hover:bg-amber-50/30"
            )}
          >
            {isActive && (
              <motion.div 
                layoutId="nav-active"
                className="absolute inset-0 bg-amber-100 rounded-[20px] -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon 
              size={isActive ? 28 : 24} 
              className={cn(
                "transition-all duration-300",
                isActive 
                  ? "text-[#7B3F1A] stroke-[3px] scale-110 drop-shadow-sm" 
                  : "text-[#7B3F1A]/50 group-hover:text-[#7B3F1A]/70"
              )} 
            />
            {isActive && (
              <motion.span 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] font-black text-[#7B3F1A] uppercase tracking-tighter"
              >
                {tab.label}
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </nav>

  );
}
