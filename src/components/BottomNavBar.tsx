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
    { id: 'league', icon: Trophy, label: 'Ligues' },
    { id: 'journey', icon: MapIcon, label: 'Parcours' },
    { id: 'profile', icon: User, label: 'Profil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-[0.6rem] pt-[0.3rem] bg-white border-t border-voyage-secondary/30 shadow-2xl">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => {
              playSound('click');
              onTabChange(tab.id);
            }}
            className={cn(
              "flex flex-col items-center justify-center p-[0.90rem] rounded-2xl transition-all relative group",
              isActive ? "text-voyage-primary" : "text-voyage-secondary"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="nav-active"
                className="absolute inset-x-1 bottom-0 h-1 bg-voyage-primary rounded-t-full shadow-[0_-4px_10px_rgba(123,63,26,0.3)]"
              />
            )}
            <div className={cn(
              "p-[0.71rem] rounded-xl transition-all duration-300",
              isActive ? "bg-voyage-primary/5 scale-110" : "group-hover:bg-voyage-sand"
            )}>
              <Icon 
                size={33} 
                className={cn(
                  "transition-all duration-300",
                  isActive ? "stroke-[3px]" : "stroke-[2px] opacity-70"
                )} 
              />
            </div>
          </button>
        );
      })}
    </nav>

  );
}
