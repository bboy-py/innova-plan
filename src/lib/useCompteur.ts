'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Incrémente une valeur de 0 jusqu'à `cible` lorsque l'élément entre dans le viewport.
 * Repose sur IntersectionObserver et ne se déclenche qu'une seule fois.
 * Si l'utilisateur a activé « réduire les animations », la valeur finale est affichée
 * immédiatement, sans décompte.
 */
export function useCompteur(cible: number, duree = 1600) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reduit = useReducedMotion();
  const [valeur, setValeur] = useState(reduit ? cible : 0);

  useEffect(() => {
    if (reduit) {
      setValeur(cible);
      return;
    }
    const noeud = ref.current;
    if (!noeud) return;

    let frame = 0;
    let depart = 0;

    const observer = new IntersectionObserver(
      ([entree]) => {
        if (!entree.isIntersecting) return;
        observer.disconnect();

        const avancer = (t: number) => {
          if (!depart) depart = t;
          const progression = Math.min((t - depart) / duree, 1);
          // Amortissement en fin de course pour éviter l'arrêt brutal
          const eased = 1 - Math.pow(1 - progression, 3);
          setValeur(Math.round(eased * cible));
          if (progression < 1) frame = requestAnimationFrame(avancer);
        };
        frame = requestAnimationFrame(avancer);
      },
      { threshold: 0.4 },
    );

    observer.observe(noeud);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [cible, duree, reduit]);

  return { ref, valeur };
}
