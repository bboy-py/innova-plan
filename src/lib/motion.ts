import type { Variants } from 'framer-motion';

/** Courbe partagée par toutes les animations : départ franc, arrivée amortie. */
export const instrument: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const dureeCourte = 0.45;
export const dureeMoyenne = 0.7;

/**
 * Apparition façon Apple : les blocs de texte montent légèrement en émergeant
 * du bas (translateY 34px → 0) en même temps qu'ils passent de transparent à
 * opaque. Rejouée à chaque entrée dans le viewport — voir `Apparition.tsx`,
 * qui pilote le `once: false` correspondant.
 */
export const apparition: Variants = {
  repos: { opacity: 0, y: 34 },
  visible: (delai = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: instrument, delay: delai },
  }),
};

/**
 * Pendant visuel de `apparition`, pour les images associées à un bloc de
 * texte : au même mouvement vertical s'ajoute une légère montée en échelle
 * (0.95 → 1), qui donne l'impression que le visuel « prend sa place » plutôt
 * que de simplement apparaître. Voir `ApparitionVisuel.tsx`.
 */
export const apparitionVisuel: Variants = {
  repos: { opacity: 0, y: 28, scale: 0.95 },
  visible: (delai = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: instrument, delay: delai },
  }),
};

/** Orchestration d'une séquence (hero, listes) : les enfants arrivent l'un après l'autre. */
export const sequence: Variants = {
  repos: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
};

/** Ligne qui se trace horizontalement — utilisée sous les titres de section. */
export const trait: Variants = {
  repos: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.9, ease: instrument } },
};

/** Variantes neutres servies lorsque l'utilisateur demande moins d'animations. */
export const statique: Variants = {
  repos: { opacity: 1, y: 0, scale: 1, scaleX: 1 },
  visible: { opacity: 1, y: 0, scale: 1, scaleX: 1, transition: { duration: 0 } },
};
