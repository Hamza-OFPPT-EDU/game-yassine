/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAudio } from '../hooks/useAudio';

interface LoginScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function LoginScreen({ onBack, onSuccess }: LoginScreenProps) {
  const { playSound } = useAudio();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    setError(null);
    playSound('click');

    try {
      // Map username to the generated email pattern
      const email = `${username.trim()}@voyage.ma`.toLowerCase();
      
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: password.trim(),
      });

      if (authError) {
        setError("Identifiant ou mot de passe incorrect.");
        playSound('wrong');
      } else {
        playSound('success');
        onSuccess();
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col relative bg-[#0f172a] text-white">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-[40%] -right-[10%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[100px]" />
      </div>

      <header className="relative z-10 px-6 pt-12 pb-6 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20"
        >
          <ArrowRight className="rotate-180" size={20} />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tight">Connexion</h1>
      </header>

      <main className="relative z-10 flex-grow flex flex-col px-6 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-2xl"
        >
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <User size={40} strokeWidth={2.5} />
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-white/60 uppercase tracking-widest ml-2">Identifiant (Pseudo)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ex: yacine_b"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium text-lg"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-white/60 uppercase tracking-widest ml-2">Mot de passe</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium text-lg"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-red-400 bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-sm font-bold"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full bg-white text-[#0f172a] py-5 rounded-2xl font-black text-xl uppercase tracking-tighter flex items-center justify-center gap-3 shadow-xl shadow-white/10 hover:bg-blue-50 disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  Se connecter
                  <ArrowRight size={24} strokeWidth={3} />
                </>
              )}
            </button>
          </form>
        </motion.div>

        <p className="mt-12 text-center text-white/40 text-sm font-medium px-8">
          Utilise ton identifiant et ton mot de passe fournis pour accéder à ton voyage.
        </p>
      </main>
    </div>
  );
}
