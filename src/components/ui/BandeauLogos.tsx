'use client';

import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Bandeau de partenaires en défilement horizontal infini.
 * La liste est dupliquée : la translation de -50 % rend la boucle invisible.
 * En mode « animations réduites », le bandeau devient une liste statique.
 */
export function BandeauLogos({ entrees }: { entrees: string[] }) {
  const reduit = useReducedMotion();
  const piste = [...entrees, ...entrees];

  if (reduit) {
    return (
      <ul className="shell flex flex-wrap justify-center gap-x-10 gap-y-4 py-10">
        {entrees.map((e) => (
          <li key={e} className="font-display text-sm font-bold uppercase tracking-[0.1em] text-encre-500">
            {e}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="masque-lateral overflow-hidden py-10">
      {/* Le défilement se met en pause au survol : on peut lire un nom au passage */}
      <ul
        className={cn(
          'flex w-max animate-marquee items-center gap-16 will-change-transform',
          'hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]',
        )}
        aria-label="Clients et partenaires"
      >
        {piste.map((entree, i) => (
          <li
            key={`${entree}-${i}`}
            aria-hidden={i >= entrees.length}
            className="flex items-center gap-4 whitespace-nowrap font-display text-base font-bold uppercase tracking-[0.1em] text-encre-500 transition-colors duration-300 hover:text-encre-950"
          >
            <span className="h-1.5 w-1.5 bg-sarcelle-500" aria-hidden />
            {entree}
          </li>
        ))}
      </ul>
    </div>
  );
}
