'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState, type ReactNode } from 'react';
import { temoignages } from '@/data/testimonials';
import { TitreSection } from '@/components/ui/TitreSection';
import { instrument } from '@/lib/motion';
import { LiquidMetalSurface } from '@/components/ui/liquid-metal-button';
import { FondMeshDrift } from '@/components/ui/fonds-page';

/** Carrousel de témoignages : navigation manuelle, une citation à la fois. */
export function Temoignages() {
  const [index, setIndex] = useState(0);
  const reduit = useReducedMotion();
  const actuel = temoignages[index];

  const aller = (pas: number) =>
    setIndex((i) => (i + pas + temoignages.length) % temoignages.length);

  return (
    <section className="relative isolate overflow-hidden bg-brume py-section">
      <FondMeshDrift />
      <div className="shell">
        <TitreSection repere="04" intitule="Ce qu'en disent les maîtres d'ouvrage" />

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={actuel.auteur}
                initial={reduit ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduit ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: instrument }}
              >
                {/* Taille de corps de texte : l'italique et le filet suffisent à
                    distinguer la citation, sans en faire un titre. */}
                <p className="max-w-prose text-lg font-light italic leading-relaxed text-encre-950">
                  « {actuel.citation} »
                </p>
                <footer className="mt-8 flex items-center gap-4">
                  <span className="h-px w-12 bg-sarcelle-600" />
                  <div>
                    <p className="font-display text-sm font-bold text-encre-950">{actuel.auteur}</p>
                    <p className="text-sm text-encre-500">{actuel.fonction}</p>
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="flex items-end gap-3 lg:col-span-3 lg:justify-end">
            <span className="chiffre-tabulaire mr-2 font-display text-sm font-bold text-encre-500">
              {String(index + 1).padStart(2, '0')} / {String(temoignages.length).padStart(2, '0')}
            </span>
            <FlecheCarrousel onClick={() => aller(-1)} label="Témoignage précédent" reduit={!!reduit}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 2L4 8l6 6" />
              </svg>
            </FlecheCarrousel>
            <FlecheCarrousel onClick={() => aller(1)} label="Témoignage suivant" reduit={!!reduit}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2l6 6-6 6" />
              </svg>
            </FlecheCarrousel>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Flèche de navigation du carrousel — bouton secondaire rond, cas d'usage
 * naturel du variant compact de LiquidMetalSurface (Prompt G, « boutons
 * secondaires »). Suit le même schéma que <Bouton> : survol/pression du
 * vrai <button> relayés à la surface, qui reste `pointer-events: none`.
 */
function FlecheCarrousel({
  onClick,
  label,
  reduit,
  children,
}: {
  onClick: () => void;
  label: string;
  reduit: boolean;
  children: ReactNode;
}) {
  const [survole, setSurvole] = useState(false);
  const [presse, setPresse] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      onMouseEnter={() => setSurvole(true)}
      onMouseLeave={() => {
        setSurvole(false);
        setPresse(false);
      }}
      onMouseDown={() => setPresse(true)}
      onMouseUp={() => setPresse(false)}
      className="relative flex h-12 w-12 items-center justify-center text-white transition-colors"
    >
      <LiquidMetalSurface hovered={survole} pressed={presse} reduceMotion={reduit} />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
