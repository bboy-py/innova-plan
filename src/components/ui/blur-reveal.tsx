'use client';

/**
 * BlurReveal — composant réel de badtz-ui / 21st.dev
 * (21st.dev/@badtzx0/components/blur-reveal — source : badtz-ui.com/docs/
 * text-effects/blur-reveal, registre badtz-ui.com/r/blur-reveal.json,
 * licence MIT, dépendance `motion`).
 *
 * Récupéré depuis le registre officiel, avec deux adaptations demandées par
 * le Prompt J :
 * 1. `useInView(..., { once: true })` → `once: false` : la source ne joue le
 *    flou qu'une seule fois. Pour permettre un vrai rejeu à chaque entrée
 *    dans le viewport (section 3 du prompt), il fallait aussi remplacer la
 *    cible `animate={isInView ? {...} : {}}` de la source — un objet vide
 *    ne fait *rien* dans motion (l'élément resterait figé sur ses dernières
 *    valeurs visibles en sortant du viewport, donc rien à rejouer en
 *    revenant) — par une paire de variants `cache`/`visible` explicites, sur
 *    le modèle déjà en place dans `Apparition.tsx`.
 * 2. Ajout de `prefers-reduced-motion` (absent de la source) : affichage
 *    direct, sans flou ni translation, quand la préférence est active —
 *    même principe que le reste du site.
 *
 * `motion` (successeur de framer-motion) était déjà une dépendance du
 * projet avant ce prompt (ajoutée au Prompt G pour les icônes Lucide
 * animées) et coexiste sans conflit avec `framer-motion`, utilisé partout
 * ailleurs : aucune bascule d'import n'a donc été nécessaire.
 */

import * as React from 'react';
import { motion, useInView, useReducedMotion, type Variants } from 'motion/react';
import { cn } from '@/lib/utils';

export interface BlurRevealProps {
  className?: string;
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export function BlurReveal({ className, children, delay = 0, duration = 1 }: BlurRevealProps) {
  const spanRef = React.useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(spanRef, { once: false, margin: '-10% 0px -10% 0px' });
  const reduitMotion = useReducedMotion();

  const variantes: Variants = reduitMotion
    ? {
        cache: { opacity: 1, filter: 'blur(0px)', y: '0%' },
        visible: { opacity: 1, filter: 'blur(0px)', y: '0%', transition: { duration: 0 } },
      }
    : {
        cache: { opacity: 0, filter: 'blur(10px)', y: '20%' },
        visible: { opacity: 1, filter: 'blur(0px)', y: '0%', transition: { duration, delay } },
      };

  return (
    <motion.span
      ref={spanRef}
      variants={variantes}
      initial="cache"
      animate={isInView ? 'visible' : 'cache'}
      className={cn('inline-block', className)}
    >
      {children}
    </motion.span>
  );
}

/**
 * Titre découpé mot par mot avec BlurReveal — pendant du motif déjà en place
 * (Hero.tsx notamment) mais porté sur le composant réel plutôt que sur une
 * implémentation Framer Motion manuelle. Un `BlurReveal` par mot, délai
 * incrémental, exactement comme dans la démonstration officielle
 * (`delay={0}`, `delay={0.1}`, `delay={0.2}`…).
 */
export function BlurRevealTitre({
  texte,
  as: Tag = 'h1',
  delaiDepart = 0,
  pas = 0.08,
  duration = 0.8,
  className,
}: {
  texte: string;
  as?: 'h1' | 'h2' | 'h3';
  delaiDepart?: number;
  pas?: number;
  duration?: number;
  className?: string;
}) {
  const mots = texte.split(' ');
  return (
    <Tag className={className}>
      {mots.map((mot, i) => (
        <BlurReveal key={`${i}-${mot}`} delay={delaiDepart + i * pas} duration={duration}>
          {mot}
          {i < mots.length - 1 ? ' ' : ''}
        </BlurReveal>
      ))}
    </Tag>
  );
}
