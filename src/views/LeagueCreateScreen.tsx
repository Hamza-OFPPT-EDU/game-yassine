/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Save, Trophy, Users, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

interface LeagueCreateScreenProps {
  onBack: () => void;
  onCreated: () => void;
}

export default function LeagueCreateScreen({ onBack, onCreated }: LeagueCreateScreenProps) {
  const [name, setName] = useState('');
  const [tier, setTier] = useState<'bronze' | 'silver' | 'gold'>('bronze');

  return (
    <div className="flex flex-col h-full bg-voyage-sand pb-32">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 bg-white border-b border-voyage-accent/10 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-voyage-accent/10 rounded-full transition-colors text-voyage-primary"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-black text-voyage-primary font-headline">Créer une Ligue</h1>
            <p className="text-slate-500 text-xs">Configurez votre propre compétition</p>
          </div>
        </div>
      </header>

      <main className="flex-grow p-6 space-y-8 overflow-y-auto">
        {/* Name input */}
        <section className="space-y-3">
          <label className="text-xs uppercase tracking-widest font-black text-slate-400 block ml-1">
            Nom de la ligue
          </label>
          <div className="relative">
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Les Guerriers de l'Atlas"
              className="w-full bg-white border border-voyage-accent/20 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-voyage-primary focus:border-transparent outline-none transition-all text-voyage-primary font-bold"
            />
            <Trophy className="absolute right-4 top-1/2 -translate-y-1/2 text-voyage-accent opacity-50" size={20} />
          </div>
        </section>

        {/* Tier selection */}
        <section className="space-y-3">
          <label className="text-xs uppercase tracking-widest font-black text-slate-400 block ml-1">
            Niveau de la ligue (Tier)
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['bronze', 'silver', 'gold'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTier(t)}
                className={cn(
                  "p-4 rounded-2xl border transition-all flex flex-col items-center gap-2",
                  tier === t 
                    ? "bg-voyage-primary border-voyage-primary text-white shadow-lg" 
                    : "bg-white border-voyage-accent/10 text-slate-400 grayscale"
                )}
              >
                <Trophy size={24} />
                <span className="text-[10px] font-black uppercase tracking-tighter">{t}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Perks Section */}
        <section className="space-y-4">
          <label className="text-xs uppercase tracking-widest font-black text-slate-400 block ml-1">
            Avantages de l'administrateur
          </label>
          <div className="space-y-3">
            {[
              { icon: Users, label: "Invitation de membres illimitée", desc: "Invitez vos amis par lien ou QR code." },
              { icon: ShieldCheck, label: "Modération avancée", desc: "Contrôlez qui participe à votre ligue." }
            ].map((perk, i) => (
              <div key={i} className="flex gap-4 p-4 bg-white rounded-2xl border border-voyage-accent/10">
                <div className="w-10 h-10 rounded-xl bg-voyage-accent/10 flex items-center justify-center text-voyage-accent shrink-0">
                  <perk.icon size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-voyage-primary">{perk.label}</h4>
                  <p className="text-[10px] text-slate-500">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Submit Button */}
        <button
          disabled={!name}
          onClick={onCreated}
          className={cn(
            "w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all flex items-center justify-center gap-4",
            name 
              ? "bg-voyage-primary text-white hover:scale-105 active:scale-95" 
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          )}
        >
          <span>Créer la ligue</span>
          <Save size={20} />
        </button>
      </main>
    </div>
  );
}
