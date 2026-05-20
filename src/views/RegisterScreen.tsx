import React, { useState, useMemo } from 'react'; 
import { motion } from 'motion/react';
import { User, Lock, ArrowRight, Loader2, AlertCircle, Sparkles, ChevronDown, Map, Volume2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAudio } from '../contexts/AudioContext';
import { useSettings } from '../contexts/SettingsContext';
import { AVATAR_MALE_URL, AVATAR_FEMALE_URL } from '../types';

interface RegisterScreenProps {
  onBack: () => void;
  onLogin: () => void;
  onSuccess: () => void;
}

export default function RegisterScreen({ onBack, onLogin, onSuccess }: RegisterScreenProps) {
  const { playSound, openSettings } = useAudio();
  const { language } = useSettings();
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

  const isAr = language === 'ar';

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
      setError(isAr ? "كلمة المرور مطلوبة لإنشاء حسابك." : "Le mot de passe est requis pour créer ton compte.");
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
            group_name: specialty, 
            establishment: establishment,
            specialty: specialty,
            academic_level: academicLevel,
            birth_date: birthDate
          }
        }
      });

      if (authError) {
        const errorMsg = authError.message === "User already registered" 
          ? (isAr ? `هذا الحساب موجود بالفعل (الاسم: ${lowerUsername})` : "Ce profil existe déjà (pseudo: " + lowerUsername + ")")
          : authError.message;
        setError(errorMsg);
        playSound('wrong');
      } else if (data.user) {
        playSound('success');
        onSuccess();
      }
    } catch (err) {
      setError(isAr ? "حدث خطأ أثناء التسجيل." : "Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col relative bg-voyage-sand text-voyage-duo-eel overflow-y-auto pb-10 font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Dynamic Background with Moroccan Influence */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-voyage-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-voyage-accent/10 rounded-full blur-[100px]" />
        
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l15 15-15 15-15-15zM0 30l15 15-15 15-15-15zM60 30l15 15-15 15-15-15zM30 60l15 15-15 15-15-15z' fill='%235A2207' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
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
            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white shadow-md border border-voyage-primary/25 text-voyage-primary"
          >
            <ArrowRight className={isAr ? "" : "rotate-180"} size={22} strokeWidth={2.5} />
          </motion.button>
          <div>
            <h1 className={`text-2xl font-black uppercase tracking-tighter text-voyage-primary-dark ${isAr ? 'arabic-font' : ''}`}>
              {isAr ? "إنشاء حساب" : "Inscription"}
            </h1>
            <p className={`text-[10px] font-bold text-voyage-primary/75 uppercase tracking-widest ${isAr ? 'arabic-font' : ''}`}>
              {isAr ? "مسافر جديد" : "Nouveau Voyageur"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={openSettings}
            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white shadow-md border border-voyage-primary/25 text-voyage-primary"
            title="Réglages Audio"
          >
            <Volume2 size={22} strokeWidth={2.5} />
          </motion.button>
          <div className="w-12 h-12 rounded-2xl bg-voyage-accent flex items-center justify-center shadow-lg shadow-voyage-accent/30">
              <Sparkles size={24} className="text-white" fill="currentColor" />
          </div>
        </div>
      </header>

      <main className="relative z-10 grow flex flex-col px-6 max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-2xl border-2 border-voyage-secondary/30 rounded-[40px] p-6 shadow-[0_20px_60px_rgba(90,34,7,0.15)] mb-6"
        >
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={`text-[10px] font-black text-voyage-primary-dark uppercase tracking-widest ${isAr ? 'arabic-font mr-2' : 'ml-2'}`}>
                  {isAr ? "الاسم الشخصي" : "Prénom"}
                </label>
                <input
                  name="register_firstname"
                  autoComplete="off"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={isAr ? "أمير" : "Amir"}
                  className={`w-full bg-voyage-sand/30 border-2 border-voyage-secondary/40 rounded-2xl py-3 px-4 focus:outline-none focus:border-voyage-primary focus:ring-4 focus:ring-voyage-primary/10 transition-all font-bold text-sm text-voyage-primary-dark placeholder-voyage-primary/40 ${isAr ? 'text-right arabic-font' : ''}`}
                  disabled={loading}
                />
              </div>
              <div className="space-y-1.5">
                <label className={`text-[10px] font-black text-voyage-primary-dark uppercase tracking-widest ${isAr ? 'arabic-font mr-2' : 'ml-2'}`}>
                  {isAr ? "الاسم العائلي" : "Nom"}
                </label>
                <input
                  name="register_lastname"
                  autoComplete="off"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={isAr ? "بوليالي" : "Boulyali"}
                  className={`w-full bg-voyage-sand/30 border-2 border-voyage-secondary/40 rounded-2xl py-3 px-4 focus:outline-none focus:border-voyage-primary focus:ring-4 focus:ring-voyage-primary/10 transition-all font-bold text-sm text-voyage-primary-dark placeholder-voyage-primary/40 ${isAr ? 'text-right arabic-font' : ''}`}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-[10px] font-black text-voyage-primary-dark uppercase tracking-widest ${isAr ? 'arabic-font mr-2' : 'ml-2'}`}>
                {isAr ? "اسم المستخدم الخاص بك (تلقائي)" : "Ton Pseudo de voyageur"}
              </label>
              <div className="relative">
                <div className={`absolute top-1/2 -translate-y-1/2 text-voyage-accent-dark ${isAr ? 'right-4' : 'left-4'}`}>
                  <User size={18} strokeWidth={2.5} />
                </div>
                <input
                  name="register_username"
                  autoComplete="off"
                  value={username}
                  readOnly
                  placeholder="prenom.nom"
                  className={`w-full bg-voyage-accent/5 border-2 border-voyage-accent/30 rounded-2xl py-3.5 text-voyage-accent-dark font-black italic cursor-not-allowed ${isAr ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4'}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={`text-[10px] font-black text-voyage-primary-dark uppercase tracking-widest ${isAr ? 'arabic-font mr-2' : 'ml-2'}`}>
                  {isAr ? "الجنس" : "Genre"}
                </label>
                <div className="flex gap-2 p-1 bg-voyage-sand/40 border-2 border-voyage-secondary/30 rounded-2xl">
                  {['H', 'F'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g as 'H' | 'F')}
                      className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all ${
                        gender === g 
                          ? 'bg-white text-voyage-primary shadow-md border border-voyage-secondary/20' 
                          : 'text-voyage-primary/60 hover:text-voyage-primary/95'
                      } ${isAr ? 'arabic-font' : ''}`}
                    >
                      {g === 'H' 
                        ? (isAr ? 'ذكر' : 'Homme') 
                        : (isAr ? 'أنثى' : 'Femme')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={`text-[10px] font-black text-voyage-primary-dark uppercase tracking-widest flex items-center gap-1 ${isAr ? 'arabic-font mr-2' : 'ml-2'}`}>
                  <span>{isAr ? "المؤسسة" : "Établissement"}</span> 
                  <span className="text-voyage-primary/60 lowercase font-bold text-[8px]">
                    {isAr ? "(اختياري)" : "(Optionnel)"}
                  </span>
                </label>
                <input
                  name="register_establishment"
                  autoComplete="new-password"
                  value={establishment}
                  onChange={(e) => setEstablishment(e.target.value)}
                  placeholder={isAr ? "مثال: مكتب التكوين" : "ex: OFPPT"}
                  className={`w-full bg-voyage-sand/30 border-2 border-voyage-secondary/40 rounded-2xl py-3 px-4 focus:outline-none focus:border-voyage-primary focus:ring-4 focus:ring-voyage-primary/10 transition-all font-bold text-sm text-voyage-primary-dark placeholder-voyage-primary/40 ${isAr ? 'text-right arabic-font' : ''}`}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={`text-[10px] font-black text-voyage-primary-dark uppercase tracking-widest flex items-center gap-1 ${isAr ? 'arabic-font mr-2' : 'ml-2'}`}>
                  <span>{isAr ? "التخصص" : "Spécialité"}</span> 
                  <span className="text-voyage-primary/60 lowercase font-bold text-[8px]">
                    {isAr ? "(اختياري)" : "(Optionnel)"}
                  </span>
                </label>
                <input
                  name="register_specialty"
                  autoComplete="new-password"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder={isAr ? "مثال: التطوير الرقمي" : "ex: Dév Digital"}
                  className={`w-full bg-voyage-sand/30 border-2 border-voyage-secondary/40 rounded-2xl py-3 px-4 focus:outline-none focus:border-voyage-primary focus:ring-4 focus:ring-voyage-primary/10 transition-all font-bold text-sm text-voyage-primary-dark placeholder-voyage-primary/40 ${isAr ? 'text-right arabic-font' : ''}`}
                  disabled={loading}
                />
              </div>
              <div className="space-y-1.5">
                <label className={`text-[10px] font-black text-voyage-primary-dark uppercase tracking-widest flex items-center gap-1 ${isAr ? 'arabic-font mr-2' : 'ml-2'}`}>
                  <span>{isAr ? "المستوى" : "Niveau"}</span> 
                  <span className="text-voyage-primary/60 lowercase font-bold text-[8px]">
                    {isAr ? "(اختياري)" : "(Optionnel)"}
                  </span>
                </label>
                <input
                  name="register_level"
                  autoComplete="new-password"
                  value={academicLevel}
                  onChange={(e) => setAcademicLevel(e.target.value)}
                  placeholder={isAr ? "مثال: السنة الأولى" : "ex: 1ère année"}
                  className={`w-full bg-voyage-sand/30 border-2 border-voyage-secondary/40 rounded-2xl py-3 px-4 focus:outline-none focus:border-voyage-primary focus:ring-4 focus:ring-voyage-primary/10 transition-all font-bold text-sm text-voyage-primary-dark placeholder-voyage-primary/40 ${isAr ? 'text-right arabic-font' : ''}`}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-[10px] font-black text-voyage-primary-dark uppercase tracking-widest ${isAr ? 'arabic-font mr-2' : 'ml-2'}`}>
                {isAr ? "تاريخ ميلادك" : "Ta date de naissance"}
              </label>
              <div className="relative group">
                <div className={`absolute top-1/2 -translate-y-1/2 text-voyage-primary/50 group-focus-within:text-voyage-primary transition-colors pointer-events-none ${isAr ? 'right-4' : 'left-4'}`}>
                  <Sparkles size={18} strokeWidth={2.5} />
                </div>
                <input
                  name="register_birthdate"
                  autoComplete="new-password"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  placeholder={isAr ? "يوم/شهر/سنة" : "JJ/MM/AAAA"}
                  className={`w-full bg-voyage-sand/30 border-2 border-voyage-secondary/40 rounded-2xl py-3.5 focus:outline-none focus:border-voyage-primary focus:ring-4 focus:ring-voyage-primary/10 transition-all font-bold text-sm text-voyage-primary-dark placeholder-voyage-primary/40 ${isAr ? 'pr-11 pl-4 text-right arabic-font' : 'pl-11 pr-4'}`}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-[10px] font-black text-voyage-primary-dark uppercase tracking-widest ${isAr ? 'arabic-font mr-2' : 'ml-2'}`}>
                {isAr ? "كلمة المرور السرية" : "Mot de passe secret"}
              </label>
              <div className="relative group">
                <div className={`absolute top-1/2 -translate-y-1/2 text-voyage-primary/50 group-focus-within:text-voyage-primary transition-colors ${isAr ? 'right-4' : 'left-4'}`}>
                  <Lock size={18} strokeWidth={2.5} />
                </div>
                <input
                  name="register_password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-voyage-sand/30 border-2 border-voyage-secondary/40 rounded-2xl py-3.5 focus:outline-none focus:border-voyage-primary focus:ring-4 focus:ring-voyage-primary/10 transition-all font-bold text-sm text-voyage-primary-dark placeholder-voyage-primary/40 ${isAr ? 'pr-11 pl-4 text-right' : 'pl-11 pr-4'}`}
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-3 text-red-700 bg-red-50 p-3 rounded-2xl border border-red-200/50 text-[11px] font-bold ${isAr ? 'arabic-font' : ''}`}
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
              className="w-full bg-linear-to-br from-voyage-primary to-voyage-primary-dark text-white py-4.5 rounded-3xl font-black text-lg uppercase tracking-tight flex items-center justify-center gap-3 shadow-xl shadow-voyage-primary/20 hover:shadow-voyage-primary/40 disabled:opacity-50 transition-all mt-4 border-b-4 border-voyage-primary-dark/50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <div className={`flex items-center gap-2 ${isAr ? 'flex-row-reverse arabic-font' : ''}`}>
                  <span>{isAr ? "ابدأ الرحلة" : "Commencer le Voyage"}</span>
                  <ArrowRight className={isAr ? "rotate-180" : ""} size={22} strokeWidth={3} />
                </div>
              )}
            </motion.button>
          </form>

          <div className="pt-6 text-center">
            <button 
              onClick={onLogin}
              className="group inline-flex flex-col items-center gap-1"
            >
              <span className={`text-[11px] font-bold text-[#6B7280] ${isAr ? 'arabic-font' : ''}`}>
                {isAr ? "لديك حساب بالفعل ؟" : "Déjà un voyageur ?"}
              </span>
              <span className={`text-sm font-black text-voyage-accent-dark group-hover:text-voyage-primary transition-colors flex items-center gap-1 ${isAr ? 'arabic-font flex-row-reverse' : ''}`}>
                <span>{isAr ? "سجل دخولك هنا" : "Connecte-toi ici"}</span>
                <ArrowRight className={isAr ? "rotate-180" : ""} size={14} strokeWidth={3} />
              </span>
            </button>
          </div>
        </motion.div>

        <p className={`text-center text-voyage-primary/50 text-[10px] font-bold px-10 italic leading-relaxed ${isAr ? 'arabic-font text-[11px]' : ''}`}>
          {isAr
            ? "تبدأ مغامرتك من هنا. اختر اسم المسافر الخاص بك واستعد لاستكشاف لا يُنسى."
            : "Ton aventure commence ici. Choisis ton nom de voyageur et prépare-toi pour une exploration inoubliable."}
        </p>
      </main>
    </div>
  );
}

