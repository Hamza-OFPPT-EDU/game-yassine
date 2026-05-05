/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowLeft, Star, TrendingUp, X } from 'lucide-react';
import { cn } from '../lib/utils';


interface TopAppBarProps {
  stats: { xp: number; stars: number; level: number };
  onBack?: () => void;
  title?: string;
  showProgress?: boolean;
}

export default function TopAppBar({ stats, onBack, title = "Le Voyage", showProgress = true }: TopAppBarProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white px-6 py-3 flex items-center justify-between border-b border-[#E5D5B8]/30 shadow-sm">
      <div className="flex items-center gap-6">
        {onBack && (
          <button onClick={onBack} className="p-2 hover:bg-[#FBF3E3] rounded-xl transition-colors">
            <X size={20} className="text-[#7B3F1A]" />
          </button>
        )}
        <h1 className="text-2xl font-headline font-black text-[#4E2510] tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* XP Badge */}
        <div className="flex items-center gap-2 bg-[#FBF3E3] px-3 py-1.5 rounded-full border border-[#D4A43E]/20 shadow-sm">
           <div className="w-6 h-6 bg-[#D4A43E]/20 rounded-md flex items-center justify-center">
              <TrendingUp size={14} className="text-[#D4A43E]" />
           </div>
           <span className="font-black text-[#7B3F1A] text-sm">{stats.xp}</span>
        </div>

        {/* Level Badge */}
        <div className="flex items-center gap-2 bg-[#7B3F1A] px-3 py-1.5 rounded-full border border-[#4E2510] shadow-md">
           <div className="w-6 h-6 bg-white/10 rounded-md flex items-center justify-center">
              <Star size={14} className="text-white fill-white" />
           </div>
           <span className="font-black text-white text-sm tracking-tight">Niv. {stats.level}</span>
        </div>
      </div>
    </header>
  );
}
