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
      bg: 'bg-voyage-primary',
      depth: 'border-voyage-primary-dark',
      text: 'text-white'
    },
    secondary: {
      bg: 'bg-voyage-sand',
      depth: 'border-voyage-secondary',
      text: 'text-voyage-primary-dark'
    },
    accent: {
      bg: 'bg-voyage-accent',
      depth: 'border-voyage-accent-dark',
      text: 'text-voyage-primary-dark'
    },
    glass: {
      bg: 'bg-white/12 backdrop-blur-md',
      depth: 'border-white/25',
      text: 'text-white shadow-xl'
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
