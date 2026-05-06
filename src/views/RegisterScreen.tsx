import React, { useState, useEffect } from 'react'; 
import { motion } from 'motion/react';
import { User, Lock, ArrowRight, Loader2, AlertCircle, Sparkles, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAudio } from '../hooks/useAudio';

interface RegisterScreenProps {
  onBack: () => void;
  onLogin: () => void;
  onSuccess: () => void;
}

const GROUPS = ['GE 101', 'GE 102', 'GE 103', 'GEOCF201', 'GEOCF202', 'GEOCF301', 'GEOCM201'];

export default function RegisterScreen({ onBack, onLogin, onSuccess }: RegisterScreenProps) {
  const { playSound } = useAudio();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'F' | 'H'>('H');
  const [group, setGroup] = useState(GROUPS[0]);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-generate pseudo: prenom.nom
  const username = (firstName && lastName) 
    ? `${firstName.trim().toLowerCase()}.${lastName.trim().toLowerCase()}`.replace(/\s+/g, '')
    : '';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    setError(null);
    playSound('click');

    try {
      // Map username to the generated email pattern
      const email = `${username}@voyage.ma`;
      
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password: password.trim(),
        options: {
          data: {
            username: username,
            full_name: `${firstName} ${lastName}`,
            first_name: firstName,
            last_name: lastName,
            gender: gender,
            group_name: group
          }
        }
      });

      if (authError) {
        setError(authError.message === "User already registered" ? "Ce profil existe déjà (pseudo: " + username + ")" : authError.message);
        playSound('wrong');
      } else if (data.user) {
        // Double check if profile update is needed or handled by trigger
        // In many setups, a trigger handles app_users creation from auth.users metadata
        playSound('success');
        onSuccess();
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col relative bg-[#0f172a] text-white overflow-y-auto pb-10">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-amber-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-[40%] -right-[10%] w-[30%] h-[30%] bg-blue-600/20 rounded-full blur-[100px]" />
      </div>

      <header className="relative z-10 px-6 pt-12 pb-6 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20"
        >
          <ArrowRight className="rotate-180" size={20} />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tight">Inscription</h1>
      </header>

      <main className="relative z-10 flex-grow flex flex-col px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl"
        >
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Prénom</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Amir"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-bold"
                  disabled={loading}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Nom</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Ben Ali"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-bold"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Pseudo Généré</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/60">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  readOnly
                  placeholder="prenom.nom"
                  className="w-full bg-amber-500/10 border border-amber-500/20 rounded-xl py-3 pl-11 pr-4 text-amber-200 font-black italic cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Genre</label>
                <div className="flex gap-2">
                  {['H', 'F'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g as 'H' | 'F')}
                      className={`flex-1 py-3 rounded-xl border-2 font-black transition-all ${
                        gender === g 
                          ? 'bg-amber-500 border-amber-400 text-white shadow-lg shadow-amber-500/20' 
                          : 'bg-white/5 border-white/10 text-white/40'
                      }`}
                    >
                      {g === 'H' ? 'Homme' : 'Femme'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Groupe</label>
                <div className="relative">
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-bold text-sm"
                    disabled={loading}
                  >
                    {GROUPS.map(g => <option key={g} value={g} className="bg-[#1e293b]">{g}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-2">Mot de passe</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-bold"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-[11px] font-bold"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-2xl font-black text-lg uppercase tracking-tight flex items-center justify-center gap-3 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 disabled:opacity-50 transition-all active:scale-[0.98] mt-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  Créer mon compte
                  <ArrowRight size={24} strokeWidth={3} />
                </>
              )}
            </button>
          </form>

          <button 
            onClick={onLogin}
            className="mt-6 w-full text-center text-white/40 font-bold hover:text-white transition-colors text-xs"
          >
            Déjà un compte ? <span className="text-amber-400 underline decoration-2 underline-offset-4">Connecte-toi</span>
          </button>
        </motion.div>

        <p className="mt-6 text-center text-white/30 text-[10px] font-medium px-8 italic">
          "Ton aventure commence ici. Choisis ton nom de voyageur et prépare-toi pour le Maroc."
        </p>
      </main>
    </div>
  );
}
