'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CarteProjet } from '@/components/ui/CarteProjet';
import { categoriesProjets, projets } from '@/data/projects';
import { instrument } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Grille filtrable des réalisations.
 * Les cartes sont réordonnées par `layout` : lorsqu'un filtre change, elles
 * glissent vers leur nouvelle position au lieu d'apparaître et disparaître
 * brutalement. Les catégories sans projet restent affichées mais désactivées,
 * afin que la barre de filtres ne bouge pas quand la base s'étoffera.
 */
export function GrilleProjets() {
  const [filtre, setFiltre] = useState<string>('Tous');
  const reduit = useReducedMotion();

  const compteurs = useMemo(() => {
    const map = new Map<string, number>();
    projets.forEach((p) => map.set(p.categorie, (map.get(p.categorie) ?? 0) + 1));
    return map;
  }, []);

  const visibles = filtre === 'Tous' ? projets : projets.filter((p) => p.categorie === filtre);

  return (
    <div className="shell py-section">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-b border-black/10 pb-6">
        <FiltreBouton
          label="Tous"
          total={projets.length}
          actif={filtre === 'Tous'}
          onClick={() => setFiltre('Tous')}
        />
        {categoriesProjets.map((c) => {
          const total = compteurs.get(c) ?? 0;
          return (
            <FiltreBouton
              key={c}
              label={c}
              total={total}
              actif={filtre === c}
              desactive={total === 0}
              onClick={() => setFiltre(c)}
            />
          );
        })}
      </div>

      <motion.div layout={!reduit} className="mt-12 grid gap-8 md:grid-cols-2 lg:gap-10">
        <AnimatePresence mode="popLayout">
          {visibles.map((projet, i) => (
            <motion.div
              key={projet.id}
              layout={!reduit}
              initial={reduit ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduit ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, ease: instrument }}
            >
              <CarteProjet projet={projet} repere={String(i + 1).padStart(2, '0')} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {visibles.length === 0 && (
        <p className="mt-16 max-w-prose text-encre-700">
          Aucune réalisation publiée dans cette catégorie pour l&apos;instant. Nos prochains chantiers
          y seront ajoutés dès leur réception.
        </p>
      )}
    </div>
  );
}

function FiltreBouton({
  label,
  total,
  actif,
  desactive,
  onClick,
}: {
  label: string;
  total: number;
  actif: boolean;
  desactive?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desactive}
      aria-pressed={actif}
      className={cn(
        'group relative pb-2 font-display text-sm font-bold transition-colors duration-300',
        actif ? 'text-encre-950' : 'text-encre-500 hover:text-encre-950',
        desactive && 'cursor-not-allowed opacity-45 hover:text-encre-500',
      )}
    >
      {label}
      <span className="chiffre-tabulaire ml-2 align-super text-[0.65rem] text-sarcelle-700">
        {String(total).padStart(2, '0')}
      </span>
      <span
        className={cn(
          'absolute -bottom-[25px] left-0 h-px bg-sarcelle-600 transition-all duration-300 ease-instrument',
          actif ? 'w-full' : 'w-0',
        )}
      />
    </button>
  );
}
