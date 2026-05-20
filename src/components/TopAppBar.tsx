/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowLeft, Star, TrendingUp, X, Volume2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAudio } from '../contexts/AudioContext';
import { useSettings } from '../contexts/SettingsContext';

interface TopAppBarProps {
  stats: { xp: number; stars: number; level: number };
  onBack?: () => void;
  title?: string;
  showProgress?: boolean;
}

export default function TopAppBar({ stats, onBack, title = "Le Voyage", showProgress = true }: TopAppBarProps) {
  const { openSettings } = useAudio();
  const { language } = useSettings();

  const finalTitle = title === "Le Voyage" 
    ? (language === 'ar' ? "الرحلة" : "Le Voyage")
    : title;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white px-4 py-2 flex items-center justify-between border-b border-voyage-secondary/30 shadow-sm" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="p-1.5 hover:bg-voyage-sand rounded-lg transition-colors">
            <X size={18} strokeWidth={2.8} className="text-voyage-primary" />
          </button>
        )}
        <h1 className={cn("text-lg font-headline font-black text-voyage-primary-dark tracking-tight", language === 'ar' && "arabic-font")}>{finalTitle}</h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Sound Control */}
        <button 
          onClick={openSettings}
          className="p-1.5 bg-white border border-voyage-secondary/50 text-voyage-primary rounded-lg hover:bg-voyage-sand transition-all shadow-sm group"
          title={language === 'ar' ? "الإعدادات الصوتية" : "Réglages Audio"}
        >
          <Volume2 size={16} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
        </button>

        {/* XP Badge */}
        <div className="flex items-center gap-1.5 bg-voyage-sand px-2 py-1 rounded-full border border-voyage-accent/25 shadow-sm">
           <div className="w-5 h-5 bg-voyage-accent/20 rounded flex items-center justify-center">
              <TrendingUp size={12} strokeWidth={2.5} className="text-voyage-accent" />
           </div>
           <span className="font-black text-voyage-primary text-xs">{stats.xp}</span>
        </div>

        {/* Level Badge */}
        <div className="flex items-center gap-1.5 bg-voyage-primary px-2 py-1 rounded-full border border-voyage-primary-dark shadow-sm">
           <div className="w-5 h-5 bg-white/10 rounded flex items-center justify-center">
              <Star size={12} strokeWidth={2.5} className="text-white fill-white" />
           </div>
           <span className={cn("font-black text-white text-xs tracking-tight", language === 'ar' && "arabic-font")}>
             {language === 'ar' ? 'مستوى' : 'Niv.'} {stats.level}
           </span>
        </div>
      </div>
    </header>
  );
}
