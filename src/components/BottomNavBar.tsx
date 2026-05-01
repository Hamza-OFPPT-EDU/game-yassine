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
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-white border-t-[3px] border-voyage-secondary/20 shadow-[0_-10px_40px_rgba(139,69,19,0.05)]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              playSound('click');
              onTabChange(tab.id);
            }}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl transition-all group",
              isActive ? "bg-voyage-primary/10 border-b-4 border-voyage-primary" : "hover:bg-voyage-sand/30 border-b-4 border-transparent"
            )}
          >
            <Icon 
              size={24} 
              className={cn(
                "transition-colors",
                isActive ? "text-voyage-primary stroke-[3px]" : "text-voyage-secondary group-hover:text-voyage-primary/60"
              )} 
            />
            <span className={cn(
              "text-[10px] font-black uppercase tracking-tight",
              isActive ? "text-voyage-primary" : "text-voyage-secondary"
            )}>
              {tab.label}
            </span>
          </motion.button>
        );
      })}
    </nav>
  );
}
