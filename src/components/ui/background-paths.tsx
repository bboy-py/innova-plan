'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Background Paths — adapté de kokonutui.com, démo « background-paths »
 * récupérée via 21st.dev (composant source : background-paths-full.txt fourni
 * avec le prompt). Deux écarts par rapport à la démo source, demandés par le
 * prompt :
 *
 * 1. Palette : `rgba(15,23,42,…)` (bleu-gris « slate ») et la classe
 *    `text-slate-950 dark:text-white` du SVG sont retirés au profit d'un
 *    blanc fixe (`text-white`) — ce composant n'étant monté QUE sur des
 *    sections déjà à fond noir (voir la répartition du prompt), plus besoin
 *    de bascule `dark:`. Le champ `color` calculé par chemin dans la démo
 *    source n'était de toute façon jamais lu (le SVG utilise `currentColor`,
 *    pas ce champ) : retiré plutôt que conservé mort.
 * 2. Usage : ne garde que `FloatingPaths` (le tracé SVG animé) — le titre
 *    lettre-par-lettre et le bouton « Discover Excellence » appartiennent à
 *    la page de démonstration source, pas à un fond de section.
 *
 * `prefers-reduced-motion` : chaque trait est alors rendu directement à son
 * état final (`pathLength: 1`, opacité fixe), sans transition ni boucle —
 * cohérent avec le reste du site (voir `useReducedMotion` partout ailleurs).
 * Pause hors-champ : `useInView` (framer-motion, déjà une dépendance du
 * projet) fige l'animation dès que le composant sort du viewport plutôt que
 * de la laisser tourner en continu en arrière-plan — plusieurs sections à
 * fond noir peuvent coexister sur une même page (voir la répartition du
 * prompt pour À propos/Réalisations/Contact).
 *
 * Durée déterministe plutôt qu'aléatoire : la démo source tire
 * `duration: 20 + Math.random() * 10` directement dans le rendu. Ici,
 * `useInView` déclenche de vrais re-rendus de `FloatingPaths` (à l'entrée et
 * à la sortie du viewport) ; un `Math.random()` évalué à chaque rendu aurait
 * rebattu la durée de chaque trait à chaque passage, créant un à-coup visible.
 * Remplacé par une valeur dérivée de l'identifiant du trait (stable dans le
 * temps), légère correction nécessaire à cette intégration.
 */

function FloatingPaths({ position, actif }: { position: number; actif: boolean }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${
      312 - i * 5 * position
    } ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${
      470 - i * 6
    } ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
    duree: 20 + (i % 10),
  }));

  return (
    <div className="absolute inset-0">
      <svg className="h-full w-full text-white" viewBox="0 0 696 316" fill="none" aria-hidden>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={false}
            animate={
              actif
                ? { pathLength: 1, opacity: [0.3, 0.6, 0.3], pathOffset: [0, 1, 0] }
                : { pathLength: 1, opacity: 0.4, pathOffset: 0 }
            }
            transition={actif ? { duration: path.duree, repeat: Number.POSITIVE_INFINITY, ease: 'linear' } : { duration: 0 }}
          />
        ))}
      </svg>
    </div>
  );
}

export function BackgroundPaths({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const enVue = useInView(ref, { amount: 0.1 });
  const reduit = useReducedMotion();
  const actif = enVue && !reduit;

  return (
    <div ref={ref} className={cn('pointer-events-none relative overflow-hidden', className)}>
      <FloatingPaths position={1} actif={actif} />
      <FloatingPaths position={-1} actif={actif} />
    </div>
  );
}
