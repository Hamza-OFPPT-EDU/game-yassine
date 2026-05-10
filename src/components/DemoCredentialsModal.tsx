import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Lock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import GameButton from './GameButton';
import { cn } from '../lib/utils';

interface DemoCredentialsModalProps {
  isOpen: boolean;
  credentials: {
    fullName: string;
    username: string;
    password: string;
  } | null;
  onConfirm: () => void;
}

export default function DemoCredentialsModal({ isOpen, credentials, onConfirm }: DemoCredentialsModalProps) {
  const [copiedField, setCopiedField] = React.useState<'username' | 'password' | null>(null);

  if (!credentials) return null;

  const handleCopy = (text: string, field: 'username' | 'password') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="bg-white rounded-[40px] w-full max-w-sm overflow-hidden shadow-2xl border-2 border-white/20 relative"
          >
            {/* Decorative Header */}
            <div className="bg-gradient-to-br from-[#7B3F1A] to-[#4E2510] p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={120} className="text-white" />
              </div>
              
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/30"
              >
                <CheckCircle2 size={40} className="text-white" />
              </motion.div>
              
              <h2 className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-2">Compte Créé !</h2>
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest">Bienvenue dans l'aventure</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                {/* Identity Card */}
                <div className="bg-[#FFF8F0] border-2 border-[#E5D5B8]/30 rounded-3xl p-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#7B3F1A] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#7B3F1A]/20">
                      <User size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-[#7B3F1A]/40 uppercase tracking-widest">Ton Nom</p>
                      <p className="font-black text-lg text-[#4E2510] leading-tight">{credentials.fullName}</p>
                    </div>
                  </div>
                  
                  <div className="h-px bg-[#E5D5B8]/30 w-full" />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-[#F4A261]" />
                        <span className="text-[10px] font-black text-[#7B3F1A]/60 uppercase tracking-widest">Identifiant</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#4E2510] bg-white px-3 py-1 rounded-full border border-[#E5D5B8]/30">{credentials.username}</span>
                        <button 
                          onClick={() => handleCopy(credentials.username, 'username')}
                          className={cn(
                            "p-1.5 rounded-lg transition-all flex items-center justify-center",
                            copiedField === 'username' ? "bg-emerald-100 text-emerald-600" : "hover:bg-[#7B3F1A]/5 text-[#7B3F1A]/40 hover:text-[#7B3F1A]"
                          )}
                        >
                          <AnimatePresence mode="wait">
                            {copiedField === 'username' ? (
                              <motion.div
                                key="check"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                              >
                                <CheckCircle2 size={14} />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="copy"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock size={14} className="text-[#F4A261]" />
                        <span className="text-[10px] font-black text-[#7B3F1A]/60 uppercase tracking-widest">Mot de passe</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#4E2510] bg-white px-3 py-1 rounded-full border border-[#E5D5B8]/30">{credentials.password}</span>
                        <button 
                          onClick={() => handleCopy(credentials.password, 'password')}
                          className={cn(
                            "p-1.5 rounded-lg transition-all flex items-center justify-center",
                            copiedField === 'password' ? "bg-emerald-100 text-emerald-600" : "hover:bg-[#7B3F1A]/5 text-[#7B3F1A]/40 hover:text-[#7B3F1A]"
                          )}
                        >
                          <AnimatePresence mode="wait">
                            {copiedField === 'password' ? (
                              <motion.div
                                key="check"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                              >
                                <CheckCircle2 size={14} />
                              </motion.div>
                            ) : (
                              <motion.div
                                key="copy"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-center text-[11px] font-bold text-[#7B3F1A]/60 px-4 leading-relaxed italic">
                  "Garde précieusement ces informations pour te reconnecter plus tard et continuer ton voyage."
                </p>
              </div>
              
              <GameButton
                variant="primary"
                size="lg"
                onClick={onConfirm}
                className="w-full py-5 rounded-3xl"
              >
                <span>C'est parti !</span>
                <ArrowRight size={20} strokeWidth={3} />
              </GameButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
