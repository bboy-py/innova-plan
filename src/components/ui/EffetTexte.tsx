'use client';

/**
 * EffetTexte — enveloppe de scroll-reveal pour `TextEffect`, pendant de
 * `BlurReveal`/`BlurRevealTitre` pour le groupe À propos / Réalisations /
 * Contact (voir Prompt J, section 2).
 *
 * `TextEffect` (Motion Primitives) ne détecte pas lui-même le viewport : son
 * prop `trigger` est un booléen que l'appelant pilote (voir la démo
 * officielle « TextEffectWithExit », qui bascule `trigger` pour montrer
 * l'entrée ET la sortie). Cette enveloppe fournit ce déclenchement avec
 * `useInView(..., { once: false })`, ce qui donne exactement le
 * comportement demandé : l'animation se rejoue à chaque entrée dans le
 * viewport, y compris en remontant puis en redescendant (section 3 du
 * prompt) — et respecte `prefers-reduced-motion` (affichage direct, sans
 * rotation ni flou).
 *
 * `variante` reprend telle quelle la composition à trois blocs de la
 * démonstration officielle `TextEffectWithCustomDelay`
 * (21st.dev/@ibelick/components/text-effect) :
 * - 'amorce' → per="char", variants personnalisés (rotateX + léger
 *   décalage vertical) — premier bloc de la démo, pour les petits repères
 *   (« 02 », eyebrows) ;
 * - 'titre'  → per="word", préréglage par défaut ('fade') — deuxième bloc
 *   de la démo, pour les titres de hero/section ;
 * - 'corps'  → per="word", preset="blur" — troisième bloc de la démo, pour
 *   les paragraphes descriptifs.
 */

import { useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { TextEffect, type TextEffectVariants } from './text-effect';

type Variante = 'amorce' | 'titre' | 'corps';

// framer-motion type ce paramètre en interne (`MarginType`) mais ne l'exporte
// pas publiquement ; on redéclare la même forme structurelle ici plutôt que
// d'utiliser `any`.
type ValeurMarge = `${number}px` | `${number}%`;
type Marge =
  | ValeurMarge
  | `${ValeurMarge} ${ValeurMarge}`
  | `${ValeurMarge} ${ValeurMarge} ${ValeurMarge}`
  | `${ValeurMarge} ${ValeurMarge} ${ValeurMarge} ${ValeurMarge}`;

const variantsAmorce: TextEffectVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  },
  item: {
    hidden: { opacity: 0, rotateX: 90, y: 10 },
    visible: { opacity: 1, rotateX: 0, y: 0, transition: { duration: 0.2 } },
  },
};

export function EffetTexte({
  children,
  variante = 'titre',
  as = 'p',
  delai = 0,
  className,
  margin = '-10% 0px -10% 0px',
}: {
  children: string;
  variante?: Variante;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  delai?: number;
  className?: string;
  margin?: Marge;
}) {
  const ref = useRef<HTMLElement>(null);
  const enVue = useInView(ref, { once: false, margin });
  const reduit = useReducedMotion();

  if (reduit) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const per = variante === 'amorce' ? 'char' : 'word';
  const preset = variante === 'corps' ? 'blur' : undefined;
  const variants = variante === 'amorce' ? variantsAmorce : undefined;

  return (
    <TextEffect
      ref={ref}
      per={per}
      as={as}
      preset={preset}
      variants={variants}
      delay={delai}
      trigger={enVue}
      className={className}
    >
      {children}
    </TextEffect>
  );
}
