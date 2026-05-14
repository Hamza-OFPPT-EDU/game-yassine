import React, { useState, useMemo } from 'react'; 
import { motion } from 'motion/react';
import { User, Lock, ArrowRight, Loader2, AlertCircle, Sparkles, ChevronDown, Map, Volume2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAudio } from '../contexts/AudioContext';
import { AVATAR_MALE_URL, AVATAR_FEMALE_URL } from '../types';

interface RegisterScreenProps {
  onBack: () => void;
  onLogin: () => void;
  onSuccess: () => void;
}



export default function RegisterScreen({ onBack, onLogin, onSuccess }: RegisterScreenProps) {
  const { playSound, openSettings } = useAudio();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'F' | 'H'>('H');
  const [establishment, setEstablishment] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [academicLevel, setAcademicLevel] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const username = useMemo(() => {
    const f = firstName.trim().toLowerCase().replace(/\s+/g, '');
    const l = lastName.trim().toLowerCase().replace(/\s+/g, '');
    if (!f && !l) return 'voyageur' + Math.floor(1000 + Math.random() * 9000);
    if (!f) return l;
    if (!l) return f;
    return `${f}.${l}`;
  }, [firstName, lastName]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Le mot de passe est requis pour créer ton compte.");
      return;
    }

    setLoading(true);
    setError(null);
    playSound('click');

    try {
      const lowerFirstName = firstName.trim().toLowerCase();
      const lowerLastName = lastName.trim().toLowerCase();
      const lowerUsername = username;
      const avatarUrl = gender === 'F' ? AVATAR_FEMALE_URL : AVATAR_MALE_URL;
      const email = `${lowerUsername}@voyage.ma`;
      
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password: password.trim(),
        options: {
          data: {
            username: lowerUsername,
            full_name: `${lowerFirstName} ${lowerLastName}`,
            first_name: lowerFirstName,
            last_name: lowerLastName,
            gender: gender,
            avatar_url: avatarUrl,
            group_name: specialty, // Keep mapping specialty to group_name for backward compatibility
            establishment: establishment,
            specialty: specialty,
            academic_level: academicLevel,
            birth_date: birthDate
          }
        }
      });

      if (authError) {
        setError(authError.message === "User already registered" ? "Ce profil existe déjà (pseudo: " + lowerUsername + ")" : authError.message);
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
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-[#7B3F1A]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#F4A261]/10 rounded-full blur-[100px]" />
        
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 15-15 15-15-15zM0 30l15 15-15 15-15-15zM60 30l15 15-15 15-15-15zM30 60l15 15-15 15-15-15z' fill='%237B3F1A' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
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
            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white shadow-md border border-[#7B3F1A]/10 text-[#7B3F1A]"
          >
            <ArrowRight className="rotate-180" size={22} strokeWidth={2.5} />
          </motion.button>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter text-[#1A1A2E]">Inscription</h1>
            <p className="text-[10px] font-bold text-[#7B3F1A]/60 uppercase tracking-widest">Nouveau Voyageur</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={openSettings}
            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white shadow-md border border-[#7B3F1A]/10 text-[#7B3F1A]"
            title="Réglages Audio"
          >
            <Volume2 size={22} strokeWidth={2.5} />
          </motion.button>
          <div className="w-12 h-12 rounded-2xl bg-[#F4A261] flex items-center justify-center shadow-lg shadow-[#F4A261]/20">
              <Sparkles size={24} className="text-white" fill="currentColor" />
          </div>
        </div>
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
                <label className="text-[10px] font-black text-[#7B3F1A] uppercase tracking-widest ml-2">Prénom</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Amir"
                  className="w-full bg-[#FFF8F0] border-2 border-[#E5D5B8]/30 rounded-2xl py-3 px-4 focus:outline-none focus:border-[#7B3F1A] focus:ring-4 focus:ring-[#7B3F1A]/5 transition-all font-bold text-sm"
                  disabled={loading}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#7B3F1A] uppercase tracking-widest ml-2">Nom</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Boulyali"
                  className="w-full bg-[#FFF8F0] border-2 border-[#E5D5B8]/30 rounded-2xl py-3 px-4 focus:outline-none focus:border-[#7B3F1A] focus:ring-4 focus:ring-[#7B3F1A]/5 transition-all font-bold text-sm"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#7B3F1A] uppercase tracking-widest ml-2">Ton Pseudo de voyageur</label>
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
                <label className="text-[10px] font-black text-[#7B3F1A] uppercase tracking-widest ml-2">Genre</label>
                <div className="flex gap-2 p-1 bg-[#FFF8F0] border-2 border-[#E5D5B8]/30 rounded-2xl">
                  {['H', 'F'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g as 'H' | 'F')}
                      className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all ${
                        gender === g 
                          ? 'bg-white text-[#7B3F1A] shadow-sm' 
                          : 'text-[#7B3F1A]/40 hover:text-[#7B3F1A]/60'
                      }`}
                    >
                      {g === 'H' ? 'Homme' : 'Femme'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#7B3F1A] uppercase tracking-widest ml-2 flex items-center gap-1">
                  Établissement <span className="text-[#7B3F1A]/40 lowercase font-bold text-[8px]">(Optionnel)</span>
                </label>
                <input
                  type="text"
                  value={establishment}
                  onChange={(e) => setEstablishment(e.target.value)}
                  placeholder="ex: OFPPT"
                  className="w-full bg-[#FFF8F0] border-2 border-[#E5D5B8]/30 rounded-2xl py-3 px-4 focus:outline-none focus:border-[#7B3F1A] focus:ring-4 focus:ring-[#7B3F1A]/5 transition-all font-bold text-sm"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#7B3F1A] uppercase tracking-widest ml-2 flex items-center gap-1">
                  Spécialité <span className="text-[#7B3F1A]/40 lowercase font-bold text-[8px]">(Optionnel)</span>
                </label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="ex: Dév Digital"
                  className="w-full bg-[#FFF8F0] border-2 border-[#E5D5B8]/30 rounded-2xl py-3 px-4 focus:outline-none focus:border-[#7B3F1A] focus:ring-4 focus:ring-[#7B3F1A]/5 transition-all font-bold text-sm"
                  disabled={loading}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#7B3F1A] uppercase tracking-widest ml-2 flex items-center gap-1">
                  Niveau <span className="text-[#7B3F1A]/40 lowercase font-bold text-[8px]">(Optionnel)</span>
                </label>
                <input
                  type="text"
                  value={academicLevel}
                  onChange={(e) => setAcademicLevel(e.target.value)}
                  placeholder="ex: 1ère année"
                  className="w-full bg-[#FFF8F0] border-2 border-[#E5D5B8]/30 rounded-2xl py-3 px-4 focus:outline-none focus:border-[#7B3F1A] focus:ring-4 focus:ring-[#7B3F1A]/5 transition-all font-bold text-sm"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#7B3F1A] uppercase tracking-widest ml-2">Ta date de naissance</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B3F1A]/40 group-focus-within:text-[#7B3F1A] transition-colors pointer-events-none">
                  <Sparkles size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full bg-[#FFF8F0] border-2 border-[#E5D5B8]/30 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-[#7B3F1A] focus:ring-4 focus:ring-[#7B3F1A]/5 transition-all font-bold text-sm"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#7B3F1A] uppercase tracking-widest ml-2">Mot de passe secret</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B3F1A]/40 group-focus-within:text-[#7B3F1A] transition-colors">
                  <Lock size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FFF8F0] border-2 border-[#E5D5B8]/30 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-[#7B3F1A] focus:ring-4 focus:ring-[#7B3F1A]/5 transition-all font-bold text-sm"
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
              disabled={loading || !password}
              className="w-full bg-gradient-to-br from-[#7B3F1A] to-[#4E2510] text-white py-4.5 rounded-3xl font-black text-lg uppercase tracking-tight flex items-center justify-center gap-3 shadow-xl shadow-[#7B3F1A]/20 hover:shadow-[#7B3F1A]/40 disabled:opacity-50 transition-all mt-4 border-b-4 border-black/20"
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

        <p className="text-center text-[#7B3F1A]/30 text-[10px] font-bold px-10 italic leading-relaxed">
          "Ton aventure commence ici. Choisis ton nom de voyageur et prépare-toi pour une exploration inoubliable."
        </p>
      </main>
    </div>
  );
}

