'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { apparition, statique } from '@/lib/motion';

/**
 * Enveloppe d'apparition au scroll, façon Apple : le bloc apparaît à chaque
 * entrée dans le viewport, y compris en remontant puis en redescendant — pas
 * seulement au premier passage. C'est `viewport.once: false` qui porte ce
 * comportement ; Framer Motion ramène l'élément à son état « repos » dès
 * qu'il quitte le viewport, prêt à rejouer l'apparition la prochaine fois.
 * Le repli statique reste automatique quand `prefers-reduced-motion: reduce`
 * est actif.
 */
export function Apparition({
  children,
  delai = 0,
  className,
  as = 'div',
}: {
  children: ReactNode;
  delai?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article';
}) {
  const reduit = useReducedMotion();
  const Composant = motion[as];

  return (
    <Composant
      variants={reduit ? statique : apparition}
      custom={delai}
      initial="repos"
      whileInView="visible"
      viewport={{ once: false, margin: '-10% 0px -10% 0px' }}
      className={className}
    >
      {children}
    </Composant>
  );
}
