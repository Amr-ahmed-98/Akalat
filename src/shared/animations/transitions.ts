import { Transition } from 'motion/react';

export const springTransition: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 20,
};

export const smoothTransition: Transition = {
  type: 'tween',
  duration: 0.3,
  ease: 'easeInOut',
};