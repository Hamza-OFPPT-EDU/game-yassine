import React, { useState } from 'react'; 
import { motion } from 'motion/react';
import { User, Lock, ArrowRight, Loader2, AlertCircle, Sparkles, ChevronDown, Map, Volume2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAudio } from '../hooks/useAudio';
import AudioSettingsModal from '../components/AudioSettingsModal';

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
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSoundModal, setShowSoundModal] = useState(false);

  const username = (firstName && lastName) 
    ? `${firstName.trim().toLowerCase()}.${lastName.trim().toLowerCase()}`.replace(/\s+/g, '')
    : '';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !password || !birthDate) {
      setError("Veuillez remplir tous les champs, y compris ta date de naissance.");
      return;
    }

    setLoading(true);
    setError(null);
    playSound('click');

    try {
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
            group_name: group,
            birth_date: birthDate
          }
        }
      });

      if (authError) {
        setError(authError.message === "User already registered" ? "Ce profil existe déjà (pseudo: " + username + ")" : authError.message);
        playSound('wrong');
      } else if (data.user) {
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
    <div className="h-full w-full flex flex-col relative bg-[#FFF8F0] text-[#1A1A2E] overflow-y-auto pb-10 font-sans">
      {/* Dynamic Background with Moroccan Influence */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none fixed">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-[#2D6A4F]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#F4A261]/10 rounded-full blur-[100px]" />
        
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
            <h1 className="text-2xl font-black uppercase tracking-tighter text-[#1A1A2E]">Inscription</h1>
            <p className="text-[10px] font-bold text-[#2D6A4F]/60 uppercase tracking-widest">Nouveau Voyageur</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowSoundModal(true)}
            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white shadow-md border border-[#2D6A4F]/10 text-[#2D6A4F]"
            title="Réglages Audio"
          >
            <Volume2 size={22} strokeWidth={2.5} />
          </motion.button>
          <div className="w-12 h-12 rounded-2xl bg-[#F4A261] flex items-center justify-center shadow-lg shadow-[#F4A261]/20">
              <Sparkles size={24} className="text-white" fill="currentColor" />
          </div>
        </div>

        <AudioSettingsModal 
          isOpen={showSoundModal} 
          onClose={() => setShowSoundModal(false)} 
        />
      </header>

      <main className="relative z-10 flex-grow flex flex-col px-6 max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-2xl border-2 border-white rounded-[40px] p-6 shadow-[0_20px_60px_rgba(45,106,79,0.1)] mb-6"
        >
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#2D6A4F] uppercase tracking-widest ml-2">Prénom</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Amir"
                  className="w-full bg-[#FFF8F0] border-2 border-[#E5D5B8]/30 rounded-2xl py-3 px-4 focus:outline-none focus:border-[#2D6A4F] focus:ring-4 focus:ring-[#2D6A4F]/5 transition-all font-bold text-sm"
                  disabled={loading}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#2D6A4F] uppercase tracking-widest ml-2">Nom</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Ben Ali"
                  className="w-full bg-[#FFF8F0] border-2 border-[#E5D5B8]/30 rounded-2xl py-3 px-4 focus:outline-none focus:border-[#2D6A4F] focus:ring-4 focus:ring-[#2D6A4F]/5 transition-all font-bold text-sm"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#2D6A4F] uppercase tracking-widest ml-2">Ton Pseudo de voyageur</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F4A261]">
                  <User size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  value={username}
                  readOnly
                  placeholder="prenom.nom"
                  className="w-full bg-[#F4A261]/5 border-2 border-[#F4A261]/20 rounded-2xl py-3.5 pl-11 pr-4 text-[#F4A261] font-black italic cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#2D6A4F] uppercase tracking-widest ml-2">Genre</label>
                <div className="flex gap-2 p-1 bg-[#FFF8F0] border-2 border-[#E5D5B8]/30 rounded-2xl">
                  {['H', 'F'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g as 'H' | 'F')}
                      className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all ${
                        gender === g 
                          ? 'bg-white text-[#2D6A4F] shadow-sm' 
                          : 'text-[#2D6A4F]/40 hover:text-[#2D6A4F]/60'
                      }`}
                    >
                      {g === 'H' ? 'Homme' : 'Femme'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#2D6A4F] uppercase tracking-widest ml-2">Groupe</label>
                <div className="relative">
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="w-full bg-[#FFF8F0] border-2 border-[#E5D5B8]/30 rounded-2xl py-3 pl-4 pr-10 appearance-none focus:outline-none focus:border-[#2D6A4F] font-bold text-xs text-[#1A1A2E]"
                    disabled={loading}
                  >
                    {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2D6A4F]/40 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#2D6A4F] uppercase tracking-widest ml-2">Ta date de naissance</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D6A4F]/40 group-focus-within:text-[#2D6A4F] transition-colors pointer-events-none">
                  <Sparkles size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-[#FFF8F0] border-2 border-[#E5D5B8]/30 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-[#2D6A4F] focus:ring-4 focus:ring-[#2D6A4F]/5 transition-all font-bold text-sm"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#2D6A4F] uppercase tracking-widest ml-2">Mot de passe secret</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2D6A4F]/40 group-focus-within:text-[#2D6A4F] transition-colors">
                  <Lock size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FFF8F0] border-2 border-[#E5D5B8]/30 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-[#2D6A4F] focus:ring-4 focus:ring-[#2D6A4F]/5 transition-all font-bold text-sm"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 text-[#E76F51] bg-[#E76F51]/10 p-3 rounded-2xl border border-[#E76F51]/20 text-[11px] font-bold"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !username || !password}
              className="w-full bg-gradient-to-br from-[#2D6A4F] to-[#1D3557] text-white py-4.5 rounded-3xl font-black text-lg uppercase tracking-tight flex items-center justify-center gap-3 shadow-xl shadow-[#2D6A4F]/20 hover:shadow-[#2D6A4F]/40 disabled:opacity-50 transition-all mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  Commencer le Voyage
                  <ArrowRight size={22} strokeWidth={3} />
                </>
              )}
            </motion.button>
          </form>

          <div className="pt-6 text-center">
            <button 
              onClick={onLogin}
              className="group inline-flex flex-col items-center gap-1"
            >
              <span className="text-[11px] font-bold text-[#6B7280]">Déjà un voyageur ?</span>
              <span className="text-sm font-black text-[#F4A261] group-hover:text-[#E76F51] transition-colors flex items-center gap-1">
                Connecte-toi ici
                <ArrowRight size={14} strokeWidth={3} />
              </span>
            </button>
          </div>
        </motion.div>

        <p className="text-center text-[#2D6A4F]/30 text-[10px] font-bold px-10 italic leading-relaxed">
          "Ton aventure commence ici. Choisis ton nom de voyageur et prépare-toi pour une exploration inoubliable."
        </p>
      </main>
    </div>
  );
}

