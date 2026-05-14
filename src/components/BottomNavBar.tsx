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
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-12 pt-2 bg-white border-t border-[#E5D5B8]/30 shadow-2xl">
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
              "flex flex-col items-center justify-center p-3 rounded-2xl transition-all relative group",
              isActive ? "text-[#7B3F1A]" : "text-[#C9A96E]"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="nav-active"
                className="absolute inset-x-1 bottom-0 h-1 bg-[#7B3F1A] rounded-t-full shadow-[0_-4px_10px_rgba(123,63,26,0.3)]"
              />
            )}
            <div className={cn(
              "p-2 rounded-xl transition-all duration-300",
              isActive ? "bg-[#7B3F1A]/5 scale-110" : "group-hover:bg-[#FBF3E3]"
            )}>
              <Icon 
                size={22} 
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
