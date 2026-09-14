import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingStepWrapperProps {
  stepKey: string | number;
  children: React.ReactNode;
}

export function OnboardingStepWrapper({ stepKey, children }: OnboardingStepWrapperProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, x: 20, scale: 0.98 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -20, scale: 0.98 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="w-full max-w-2xl mx-auto"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
