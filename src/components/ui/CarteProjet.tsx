'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { HardHat } from 'lucide-react';
import type { Projet } from '@/types';
import { instrument } from '@/lib/motion';
import { cn } from '@/lib/utils';

const LienAnime = motion(Link);

/**
 * Carte de projet.
 *
 * Le zoom de l'image, le dégradé et le petit « + » restent pilotés en CSS
 * pur (`group-hover/projet:`) — c'est le mécanisme robuste validé au prompt
 * précédent, inchangé. Le nouveau badge central, lui, a besoin de Framer
 * Motion : son contour se trace via `pathLength` (l'équivalent React de
 * `stroke-dashoffset` animé), ce qu'aucune classe CSS ne peut faire seule.
 * Le survol est détecté une seule fois, sur le <Link> entier
 * (`whileHover="survol"`), puis propagé au tracé et au texte du badge via
 * des variantes nommées — les deux animations (zoom CSS + badge Framer
 * Motion) tournent en parallèle sur la même interaction, sans se gêner,
 * puisqu'elles ne pilotent pas les mêmes propriétés ni les mêmes éléments.
 */
export function CarteProjet({
  projet,
  repere,
  className,
}: {
  projet: Projet;
  repere?: string;
  className?: string;
}) {
  const reduit = useReducedMotion();

  const varianteFondu: Variants = {
    repos: { opacity: 0 },
    survol: { opacity: 1, transition: { duration: 0.2 } },
  };
  const varianteTrait: Variants = {
    repos: { pathLength: 0 },
    survol: { pathLength: 1, transition: { duration: reduit ? 0 : 0.3, ease: instrument } },
  };
  const varianteTexteBadge: Variants = {
    repos: { opacity: 0, y: 4 },
    survol: { opacity: 1, y: 0, transition: { duration: 0.25, delay: reduit ? 0 : 0.08, ease: instrument } },
  };

  return (
    <LienAnime
      href={`/realisations/${projet.slug}`}
      data-curseur="Voir"
      initial="repos"
      whileHover="survol"
      whileFocus="survol"
      animate="repos"
      className={cn(
        'group/projet block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sarcelle-600',
        className,
      )}
    >
      <article className="relative overflow-hidden bg-encre-900">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={projet.couverture.src}
            alt={projet.couverture.alt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-[400ms] ease-instrument group-hover/projet:scale-105 group-focus-visible/projet:scale-105"
          />

          {/* Dégradé de base, déjà présent, légèrement plus marqué au survol */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent transition-colors duration-500 group-hover/projet:from-black/85 group-focus-visible/projet:from-black/85" />

          {repere && (
            <span className="chiffre-tabulaire absolute left-5 top-5 z-10 font-display text-rail font-bold text-white/70">
              {repere}
            </span>
          )}

          {/* Bouton « + » : pivote et grandit au survol, façon m3-pg */}
          <span className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center border border-white/40 text-white transition-transform duration-300 ease-instrument group-hover/projet:rotate-90 group-hover/projet:scale-110 group-focus-visible/projet:rotate-90 group-focus-visible/projet:scale-110">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 0v14M0 7h14" />
            </svg>
          </span>

          {/* Badge central : le contour se trace (pathLength), le texte suit de peu */}
          <motion.div
            variants={varianteFondu}
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-2.5 px-6">
              <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="h-2.5 w-24" fill="none">
                <motion.path
                  d="M0,10 L0,4 M0,7 L100,7 M100,10 L100,4"
                  stroke="white"
                  strokeWidth="3"
                  variants={varianteTrait}
                />
              </svg>
              <motion.span
                variants={varianteTexteBadge}
                className="flex items-center gap-2 whitespace-nowrap font-display text-xs font-bold uppercase tracking-[0.08em] text-white"
              >
                <span className="chiffre-tabulaire">{repere ?? '01'}</span>
                {'\u2014'} Voir le projet
                <HardHat size={14} strokeWidth={2} />
              </motion.span>
            </div>
          </motion.div>

          {/* Catégorie + titre, toujours visibles */}
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
            <p className="font-sans text-xs tracking-wide text-white/70">{projet.categorie}</p>
            <h3 className="mt-2 max-w-[20ch] font-display text-display-s font-extrabold text-white">
              {projet.titre}
            </h3>
          </div>
        </div>
      </article>
    </LienAnime>
  );
}
