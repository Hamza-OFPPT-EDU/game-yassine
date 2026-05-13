/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Trophy, Sparkles, Loader2, Shield, Users, Target } from 'lucide-react';
import { useLeagues } from '../hooks/useLeagues';
import { useAuth } from '../hooks/useSupabase';

interface LeagueCreateScreenProps {
  userStats: { xp: number; stars: number; level: number; cities: number; badges: number };
  leagueId?: string; // Optional: for editing
  onBack: () => void;
  onCreated: () => void;
}

const TIERS = [
  { id: 'bronze', name: 'Bronze', color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' },
  { id: 'silver', name: 'Argent', color: 'text-slate-400', bg: 'bg-slate-100', border: 'border-slate-200' },
  { id: 'gold', name: 'Or', color: 'text-voyage-primary', bg: 'bg-voyage-primary/10', border: 'border-voyage-primary' },
];

export default function LeagueCreateScreen({ userStats, leagueId, onBack, onCreated }: LeagueCreateScreenProps) {
  const { session } = useAuth();
  const { leagues, createLeague, updateLeague } = useLeagues(session?.user?.id);
  const [name, setName] = useState('');
  const [selectedTier, setSelectedTier] = useState(TIERS[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (leagueId) {
      const existing = leagues.find(l => l.id === leagueId);
      if (existing) {
        setName(existing.name);
        setSelectedTier(existing.tier);
      }
    }
  }, [leagueId, leagues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Donne un nom à ta compétition !");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (leagueId) {
        await updateLeague(leagueId, name, selectedTier);
      } else {
        await createLeague(name, selectedTier, userStats.xp, userStats.cities, userStats.badges);
      }
      onCreated();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA] relative overflow-hidden font-sans">
      <header className="relative z-10 px-6 pt-12 pb-6 flex items-center gap-4">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white shadow-md border border-voyage-accent/10 text-voyage-accent"
        >
          <ArrowLeft size={22} strokeWidth={2.5} />
        </motion.button>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-[#1A1A2E]">
            {leagueId ? 'Modifier la Ligue' : 'Nouvelle Ligue'}
          </h1>
          <p className="text-[10px] font-bold text-voyage-accent/60 uppercase tracking-widest">
            {leagueId ? 'Ajuste tes paramètres' : 'Crée ton groupe'}
          </p>
        </div>
      </header>

      <main className="relative z-10 flex-grow px-6 max-w-md mx-auto w-full pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-slate-50 rounded-[40px] p-8 shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-black text-voyage-accent uppercase tracking-widest ml-1 flex items-center gap-2">
                <Users size={14} /> Nom de la compétition
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Les Guerriers du Sahara"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 outline-none focus:border-voyage-accent transition-all font-bold text-lg"
                disabled={loading}
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-voyage-accent uppercase tracking-widest ml-1 flex items-center gap-2">
                <Target size={14} /> Niveau de difficulté
              </label>
              <div className="grid grid-cols-3 gap-3">
                {TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedTier(tier.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      selectedTier === tier.id 
                        ? `${tier.border} ${tier.bg} shadow-sm` 
                        : 'border-slate-100 bg-white opacity-40 grayscale'
                    }`}
                  >
                    <Trophy className={tier.color} size={24} />
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${tier.color}`}>{tier.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-3 rounded-xl border border-red-100 italic">
                "{error}"
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full bg-gradient-to-br from-voyage-accent to-voyage-primary text-white py-5 rounded-3xl font-black text-lg uppercase tracking-tight flex items-center justify-center gap-3 shadow-xl shadow-voyage-accent/20 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  {leagueId ? 'Enregistrer' : 'Lancer la Ligue'}
                  <Sparkles size={20} fill="currentColor" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
