/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Êtes-vous sûr ?",
  message = "Voulez-vous vraiment quitter cette page ?",
  confirmLabel = "Oui, quitter",
  cancelLabel = "Non, rester",
  type = 'warning'
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-sm bg-white rounded-[40px] shadow-2xl overflow-hidden relative border-2 border-voyage-accent/10"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
            >
              <X size={20} />
            </button>

            <div className="p-8 pt-10 text-center space-y-6">
              <div className={cn(
                "w-20 h-20 rounded-[32px] mx-auto flex items-center justify-center border-b-4",
                type === 'danger' ? "bg-red-50 text-red-500 border-red-200" :
                type === 'warning' ? "bg-amber-50 text-amber-500 border-amber-200" :
                "bg-voyage-accent/10 text-voyage-accent border-voyage-accent/20"
              )}>
                <AlertCircle size={40} strokeWidth={2.5} />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-duo-eel tracking-tight">{title}</h2>
                <p className="text-slate-500 font-bold leading-relaxed px-4">
                  {message}
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={cn(
                    "w-full py-4 rounded-2xl font-black uppercase tracking-wide transition-all border-b-4 active:border-b-0 active:translate-y-1 shadow-lg",
                    type === 'danger' ? "bg-red-500 text-white border-red-700 shadow-red-200" :
                    type === 'warning' ? "bg-amber-500 text-white border-amber-700 shadow-amber-200" :
                    "bg-voyage-primary text-white border-voyage-primary-dark shadow-voyage-primary/20"
                  )}
                >
                  {confirmLabel}
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-4 text-slate-400 font-black uppercase tracking-widest text-xs hover:text-slate-600 transition-colors"
                >
                  {cancelLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
