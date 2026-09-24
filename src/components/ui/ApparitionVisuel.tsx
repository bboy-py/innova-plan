'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { apparitionVisuel, statique } from '@/lib/motion';

/**
 * Pendant visuel d'`Apparition`, pour les images posées à côté d'un bloc de
 * texte (une section « présentation », un service illustré…). Le mouvement
 * est complémentaire, pas identique : en plus de la montée en fondu, l'image
 * gagne légèrement en échelle (0.95 → 1), pour donner une sensation de
 * « prise de volume » au scroll plutôt qu'un simple fondu plat.
 *
 * Le `delai` doit être choisi légèrement différent de celui du texte associé
 * (ex. texte à 0, image à 0.12) pour un rendu orchestré plutôt que mécanique —
 * jamais rigoureusement synchrone.
 */
export function ApparitionVisuel({
  children,
  delai = 0.12,
  className,
}: {
  children: ReactNode;
  delai?: number;
  className?: string;
}) {
  const reduit = useReducedMotion();

  return (
    <motion.div
      variants={reduit ? statique : apparitionVisuel}
      custom={delai}
      initial="repos"
      whileInView="visible"
      viewport={{ once: false, margin: '-10% 0px -10% 0px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
