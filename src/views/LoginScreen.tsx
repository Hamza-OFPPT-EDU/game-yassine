import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, ArrowRight, Loader2, AlertCircle, Sparkles, Map } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAudio } from '../hooks/useAudio';

interface LoginScreenProps {
  onBack: () => void;
  onRegister: () => void;
  onSuccess: () => void;
}

export default function LoginScreen({ onBack, onRegister, onSuccess }: LoginScreenProps) {
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
      const email = `${username.trim().toLowerCase()}@voyage.ma`;
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: password.trim(),
      });

      if (authError) {
        setError(authError.message === "Invalid login credentials" ? "Pseudo ou mot de passe incorrect." : authError.message);
        playSound('wrong');
      } else if (data.user) {
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
    <div className="h-full w-full flex flex-col relative bg-[#FFF8F0] text-[#1A1A2E] overflow-hidden font-sans">
      {/* Dynamic Background with Moroccan Influence */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-[#2D6A4F]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#F4A261]/10 rounded-full blur-[100px]" />
        
        {/* Subtle Moroccan Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 15-15 15-15-15zM0 30l15 15-15 15-15-15zM60 30l15 15-15 15-15-15zM30 60l15 15-15 15-15-15z' fill='%232D6A4F' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <header className="relative z-10 px-6 pt-12 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white shadow-md border border-[#2D6A4F]/10 text-[#2D6A4F]"
          >
            <ArrowRight className="rotate-180" size={22} strokeWidth={2.5} />
          </motion.button>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-[#1A1A2E]">Connexion</h1>
            <p className="text-[10px] font-bold text-[#2D6A4F]/60 uppercase tracking-widest">Le Voyage Continue</p>
          </div>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-[#2D6A4F] flex items-center justify-center shadow-lg shadow-[#2D6A4F]/20">
            <Map size={24} className="text-white" />
        </div>
      </header>

      <main className="relative z-10 flex-grow flex flex-col px-6 justify-center max-w-md mx-auto w-full pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="bg-white/80 backdrop-blur-2xl border-2 border-white rounded-[40px] p-8 shadow-[0_20px_60px_rgba(45,106,79,0.15)] relative overflow-hidden"
        >
          {/* Top Decorative Sparkle */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#F4A261] rounded-3xl flex items-center justify-center shadow-lg rotate-12">
            <Sparkles className="text-white" size={28} fill="currentColor" />
          </div>

          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-black text-[#1A1A2E] uppercase">Bon retour !</h2>
              <p className="text-sm font-medium text-[#6B7280]">Entre tes identifiants pour reprendre ton aventure.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#2D6A4F] uppercase tracking-[0.2em] ml-2">Ton Pseudo de voyageur</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#2D6A4F]/40 group-focus-within:text-[#2D6A4F] transition-colors">
                    <User size={20} strokeWidth={2.5} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="prenom.nom"
                    className="w-full bg-[#FFF8F0] border-2 border-[#E5D5B8]/30 rounded-3xl py-5 pl-14 pr-6 focus:outline-none focus:border-[#2D6A4F] focus:ring-4 focus:ring-[#2D6A4F]/5 transition-all font-bold text-[#1A1A2E]"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#2D6A4F] uppercase tracking-[0.2em] ml-2">Mot de passe secret</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#2D6A4F]/40 group-focus-within:text-[#2D6A4F] transition-colors">
                    <Lock size={20} strokeWidth={2.5} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#FFF8F0] border-2 border-[#E5D5B8]/30 rounded-3xl py-5 pl-14 pr-6 focus:outline-none focus:border-[#2D6A4F] focus:ring-4 focus:ring-[#2D6A4F]/5 transition-all font-bold text-[#1A1A2E]"
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 text-[#E76F51] bg-[#E76F51]/10 p-4 rounded-2xl border border-[#E76F51]/20 text-xs font-bold"
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !username || !password}
                className="w-full bg-gradient-to-br from-[#2D6A4F] to-[#1D3557] text-white py-5 rounded-3xl font-black text-lg uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-[#2D6A4F]/30 hover:shadow-[#2D6A4F]/50 disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    Explorer le Royaume
                    <ArrowRight size={22} strokeWidth={3} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="pt-4 text-center">
              <button 
                onClick={onRegister}
                className="group inline-flex flex-col items-center gap-1"
              >
                <span className="text-[11px] font-bold text-[#6B7280]">Pas encore de compte ?</span>
                <span className="text-sm font-black text-[#F4A261] group-hover:text-[#E76F51] transition-colors flex items-center gap-1">
                  Rejoins l'aventure maintenant
                  <ArrowRight size={14} strokeWidth={3} />
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center space-y-4"
        >
          <p className="text-[#2D6A4F]/40 text-[10px] font-bold uppercase tracking-[0.2em] italic px-10 leading-relaxed">
            "Tes badges et ta progression t'attendent pour la suite du voyage."
          </p>
          
          <div className="flex justify-center gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#2D6A4F]/20" />
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

