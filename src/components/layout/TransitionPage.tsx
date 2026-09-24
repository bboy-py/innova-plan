'use client';

import { useContext, useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { instrument } from '@/lib/motion';

/**
 * Fige le contexte de routage de l'arbre sortant.
 * Sans cela, la page quittée serait immédiatement re-rendue avec le contenu de
 * la nouvelle route, et l'animation de sortie porterait sur la mauvaise page.
 */
function RouteurGele({ children }: { children: ReactNode }) {
  const contexte = useContext(LayoutRouterContext);
  const gele = useRef(contexte).current;
  return <LayoutRouterContext.Provider value={gele}>{children}</LayoutRouterContext.Provider>;
}

/**
 * Transition entre les routes : la page sortante s'efface en montant
 * légèrement, la page entrante apparaît ensuite (mode « wait », donc jamais
 * deux pages superposées). Le défilement est remis en haut une fois la sortie
 * terminée, et non au clic — sinon la page sortante « saute » avant de partir.
 */
export function TransitionPage({ children }: { children: ReactNode }) {
  const chemin = usePathname();
  const reduit = useReducedMotion();

  if (reduit) return <>{children}</>;

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })}
    >
      <motion.div
        key={chemin}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.34, ease: instrument }}
      >
        <RouteurGele>{children}</RouteurGele>
      </motion.div>
    </AnimatePresence>
  );
}
