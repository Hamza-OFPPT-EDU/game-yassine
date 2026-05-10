import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface GameButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export default function GameButton({ 
  children, 
  onClick, 
  className, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  type = 'button',
  ...props
}: GameButtonProps & React.ComponentPropsWithoutRef<typeof motion.button>) {
  
  const variants = {
    primary: {
      bg: 'bg-[#7B3F1A]',
      depth: 'border-[#4E2510]',
      text: 'text-white'
    },
    secondary: {
      bg: 'bg-[#F1Dbb1]',
      depth: 'border-[#B58B60]',
      text: 'text-[#4E2510]'
    },
    accent: {
      bg: 'bg-[#D4A43E]',
      depth: 'border-[#A87D28]',
      text: 'text-white'
    },
    glass: {
      bg: 'bg-white/10 backdrop-blur-md',
      depth: 'border-white/20',
      text: 'text-white'
    }
  };

  const sizes = {
    sm: 'py-2 px-4 text-xs rounded-xl border-b-2',
    md: 'py-3.5 px-6 text-sm rounded-2xl border-b-4',
    lg: 'py-4.5 px-8 text-lg rounded-[28px] border-b-[6px]'
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { y: 4, borderBottomWidth: variant === 'glass' ? 0 : 2 } : {}}
      className={cn(
        'relative flex items-center justify-center gap-2 font-black uppercase tracking-wider transition-all shadow-lg',
        currentVariant.bg,
        currentVariant.depth,
        currentVariant.text,
        currentSize,
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
