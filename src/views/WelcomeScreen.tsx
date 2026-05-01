/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useAudio } from '../hooks/useAudio';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const { playSound } = useAudio();
  return (
    <div className="h-full w-full flex flex-col bg-white overflow-y-auto overflow-x-hidden">
      {/* Hero section */}
      <section className="relative h-[45vh] min-h-[350px] w-full shrink-0 flex items-center justify-center p-8">
        <div className="absolute inset-0 bg-gradient-to-b from-voyage-accent/5 to-white z-0" />
        
        <div className="relative z-10 w-full max-w-[300px]">
           <motion.div
             animate={{ y: [0, -10, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
           >
             <img 
               alt="Family Ben Ali" 
               className="w-full h-auto drop-shadow-2xl"
               src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX02xVm_1ZbEHldthvtfyk9kUvrQ7kJWEKKk97q7NNECvo4OYKAHpwZ2l-DlvuMB3FN_ifc4BrXJpjFVuoX3al4uIU4qAx26Qsyzx-wSKFaDwbo2XTgkySsffXUeRQQIbSAil8_diMshNVvTaCw4gItFnxapZ4xcowAq8SU8Fp5YMMksFFp29ESMBlqlfKbogLdWLd88IPnc0V6iQkzUeh-7ef_HCrFnXWdqsW6qYsCj5mEL2xUcall-TiugdcLTONkicSEAyMtHU"
               referrerPolicy="no-referrer"
             />
           </motion.div>
           
           {/* Speech Bubble */}
           <motion.div 
             initial={{ scale: 0, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ delay: 1, type: "spring" }}
             className="absolute -top-4 -right-4 bg-white border-2 border-voyage-accent/20 p-3 rounded-2xl rounded-bl-none shadow-xl max-w-[120px]"
           >
              <p className="text-[10px] font-black text-voyage-primary leading-tight">
                "Prêt pour l'aventure au Maroc ?"
              </p>
           </motion.div>
        </div>
      </section>

      {/* Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-10 text-center space-y-6">
        <div className="space-y-2">
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-headline text-3xl font-black tracking-tight text-voyage-primary leading-tight"
          >
            Le Voyage des Compétences
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-voyage-accent font-black text-xl arabic-font" 
            dir="rtl"
          >
            رحلة المهارات والنجاح
          </motion.p>
        </div>

        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-voyage-primary/60 font-bold leading-relaxed max-w-[280px]"
        >
          Développe ton potentiel avec la famille Ben Ali à travers un parcours ludique au cœur du Maroc.
        </motion.p>
      </main>

      {/* Buttons */}
      <section className="px-8 pb-12 space-y-4 w-full max-w-md mx-auto mb-4 shrink-0">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            playSound('click');
            onStart();
          }}
          className="btn-voyage-primary w-full text-xl py-4 flex items-center justify-center gap-3"
        >
          <span className="font-black uppercase tracking-tight">C'est parti !</span>
          <ArrowRight size={24} strokeWidth={3} />
        </motion.button>
        
        <button 
          onClick={() => playSound('click')}
          className="w-full py-4 border-2 border-voyage-accent/30 rounded-2xl text-voyage-accent font-black uppercase tracking-tight hover:bg-voyage-accent/5 transition-all border-b-4"
        >
          Se connecter
        </button>
      </section>
    </div>
  );
}

