'use client';

import React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { AnimationPersonality } from '../domain/theme/theme.types';

interface AnimationWrapperProps {
  children: React.ReactNode;
  personality?: AnimationPersonality;
  delay?: number;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export function AnimationWrapper({
  children,
  personality = 'elegant',
  delay = 0,
  className,
  onClick,
}: AnimationWrapperProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion || personality === 'none') {
    return (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    );
  }

  const getVariants = (): Variants => {
    switch (personality) {
      case 'cinematic':
        return {
          hidden: { opacity: 0, scale: 0.96, y: 30 },
          visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, delay, ease: 'easeOut' } },
        };
      case 'romantic':
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: 'easeOut' } },
        };
      case 'playful':
        return {
          hidden: { opacity: 0, scale: 0.9, y: 20 },
          visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 15, delay } },
        };
      case 'subtle':
      default:
        return {
          hidden: { opacity: 0, y: 15 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
        };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={getVariants()}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
