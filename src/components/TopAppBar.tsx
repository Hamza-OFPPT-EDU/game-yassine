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
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b-[3px] border-voyage-secondary/20 shadow-sm">
      <div className="flex items-center gap-6">
        {onBack && (
          <button onClick={onBack} className="p-2 hover:bg-voyage-sand rounded-xl transition-colors">
            <X size={20} className="text-voyage-primary" />
          </button>
        )}
        <h1 className="text-xl font-headline font-black text-voyage-primary-dark tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* XP Badge */}
        <div className="flex items-center gap-2 bg-voyage-accent/10 px-3 py-1.5 rounded-2xl border border-voyage-accent/30 shadow-sm group hover:scale-105 transition-transform">
           <div className="w-7 h-7 bg-voyage-accent rounded-lg flex items-center justify-center shadow-sm">
              <TrendingUp size={18} className="text-white" />
           </div>
           <span className="font-black text-voyage-accent text-sm tracking-tight">{stats.xp}</span>
        </div>

        {/* Level Badge */}
        <div className="flex items-center gap-2 bg-voyage-primary/10 px-3 py-1.5 rounded-2xl border border-voyage-primary/30 shadow-sm group hover:scale-105 transition-transform">
           <div className="w-7 h-7 bg-voyage-primary rounded-lg flex items-center justify-center shadow-sm">
              <Star size={18} className="text-white" />
           </div>
           <span className="font-black text-voyage-primary text-sm tracking-tight">Niv. {stats.level}</span>
        </div>
      </div>
    </header>
  );
}
