'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * SlideTabs — composant source : 21st.dev/@minhxthanh/components/slide-tabs.
 *
 * Principe du composant d'origine conservé : une rangée d'onglets côte à
 * côte, un fond en pilule qui se déplace en douceur derrière l'onglet ciblé.
 * Deux écarts volontaires par rapport à la démo source, demandés par le
 * Prompt H :
 *
 * 1. Déclenchement au SURVOL, pas au clic (`onMouseEnter`/`onFocus` sur
 *    chaque item, pas `onClick`). Le clic ne sert qu'à la navigation réelle
 *    (`<Link>`), la pilule s'étant déjà positionnée avant que le clic
 *    n'arrive. Quand la souris quitte la zone sans clic, la pilule ne
 *    disparaît pas : elle revient sur l'onglet de la page actuellement
 *    affichée (`usePathname`) — comportement jugé plus naturel qu'un simple
 *    retour à vide, puisqu'il rappelle en permanence où l'on se trouve.
 * 2. Ce sont de vrais liens de navigation (`next/link`), pas des onglets
 *    qui changent un panneau local — la démo source ne fait pas naviguer.
 *
 * Mesure de la pilule : plutôt qu'un `layoutId` Framer Motion (qui recalcule
 * un shared-layout complet à chaque changement, plus coûteux ici), la
 * position/largeur de l'item ciblé est lue directement dans le DOM
 * (`offsetLeft`/`offsetWidth`) et appliquée à une pilule unique animée par
 * ressort — plus simple à raisonner pour une rangée d'éléments côte à côte
 * qui ne se réordonnent jamais.
 */
export interface SlideTab {
  label: string;
  href: string;
}

export function SlideTabs({ tabs, className }: { tabs: SlideTab[]; className?: string }) {
  const chemin = usePathname();
  const reduit = useReducedMotion();

  const indexActif = tabs.findIndex((t) => t.href === chemin);
  const [survolIndex, setSurvolIndex] = useState<number | null>(null);
  // Rien de survolé : la pilule retombe sur la page actuelle (ou disparaît
  // si aucun des 5 onglets ne correspond, ex. page Contact).
  const indexAffiche = survolIndex ?? (indexActif >= 0 ? indexActif : null);

  const listeRef = useRef<HTMLUListElement>(null);
  // Un ref par onglet, indexé indépendamment de sa position parmi les
  // enfants du DOM. La pilule (`motion.li`, ci-dessous) est insérée comme
  // premier enfant du même <ul> dès qu'elle existe : indexer via
  // `listeRef.current.children[i]` se décale alors d'un cran (chaque onglet
  // se retrouve un rang plus loin que son index réel), ce qui faisait
  // pointer la mesure vers l'onglet précédent. Cibler directement le <li>
  // de l'onglet via son propre ref élimine ce décalage, quel que soit
  // l'ordre des enfants du <ul>.
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [pilule, setPilule] = useState<{ x: number; largeur: number } | null>(null);

  useEffect(() => {
    const mesurer = () => {
      if (indexAffiche === null) {
        setPilule(null);
        return;
      }
      const item = itemRefs.current[indexAffiche];
      if (!item) return;
      setPilule({ x: item.offsetLeft, largeur: item.offsetWidth });
    };

    mesurer();
    window.addEventListener('resize', mesurer);
    return () => window.removeEventListener('resize', mesurer);
  }, [indexAffiche, tabs]);

  return (
    <nav aria-label="Navigation principale" className={cn('relative', className)}>
      <ul
        ref={listeRef}
        onMouseLeave={() => setSurvolIndex(null)}
        className="no-scrollbar relative flex items-center gap-1 overflow-x-auto"
      >
        {pilule && (
          <motion.li
            aria-hidden
            initial={false}
            animate={{ x: pilule.x, width: pilule.largeur }}
            transition={reduit ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
            className="absolute inset-y-0 left-0 z-0 rounded-full bg-encre-950"
          />
        )}
        {tabs.map((tab, i) => {
          const cible = indexAffiche === i;
          return (
            <li
              key={tab.href}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="relative z-10 shrink-0"
            >
              <Link
                href={tab.href}
                onMouseEnter={() => setSurvolIndex(i)}
                onFocus={() => setSurvolIndex(i)}
                onBlur={() => setSurvolIndex(null)}
                aria-current={indexActif === i ? 'page' : undefined}
                className={cn(
                  'block whitespace-nowrap px-5 py-2.5 font-display text-[0.8125rem] font-bold uppercase tracking-[0.04em] transition-colors duration-300',
                  cible ? 'text-white' : 'text-encre-950',
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
