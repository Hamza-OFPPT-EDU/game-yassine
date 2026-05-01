/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Map, Star } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center bg-white overflow-hidden">
      <div className="z-10 flex flex-col items-center text-center px-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-40 h-40 mb-12 flex items-center justify-center"
        >
          {/* Animated Background Rings */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-voyage-accent/10"
          />
          <motion.div 
            animate={{ scale: [1.2, 1.4, 1.2], opacity: [0.1, 0.05, 0.1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute inset-0 rounded-full bg-voyage-accent/5"
          />
          
          <div className="w-32 h-32 rounded-full bg-white shadow-2xl flex items-center justify-center relative border-4 border-voyage-accent/20 overflow-hidden">
            <Map className="text-voyage-accent" size={64} strokeWidth={2.5} />
          </div>
          
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-2 -right-2 w-10 h-10 rounded-2xl bg-voyage-accent flex items-center justify-center shadow-lg border-b-4 border-voyage-accent-dark"
          >
            <Star className="text-white" size={20} fill="currentColor" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <h1 className="font-headline font-black text-3xl text-voyage-primary tracking-tight">
            Le Voyage des Compétences
          </h1>
          <p className="text-2xl font-black text-voyage-accent arabic-font" dir="rtl">
            رحلة المهارات والتعلم
          </p>
        </motion.div>
      </div>

      {/* Loading Indicator */}
      <div className="absolute bottom-24 w-48 space-y-4">
        <div className="h-4 w-full bg-voyage-accent/10 rounded-full overflow-hidden border-2 border-voyage-accent/20 p-0.5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="h-full bg-voyage-primary rounded-full relative"
          >
             <div className="absolute top-0.5 left-1 right-1 h-1 bg-white/30 rounded-full" />
          </motion.div>
        </div>
        <p className="text-center text-[10px] font-black text-duo-wolf uppercase tracking-widest animate-pulse">
          Chargement du monde...
        </p>
      </div>
    </div>
  );
}

