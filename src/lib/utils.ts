import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * clsx + tailwind-merge (ce second paquet est ajouté par le Prompt G, requis
 * par le composant LiquidMetalButton) : les classes passées en `className`
 * pour surcharger un composant (ex. `!px-4 !py-2.5` sur <Bouton>) dédoublonnent
 * désormais proprement les utilitaires Tailwind en conflit, plutôt que de
 * simplement les concaténer et compter sur l'ordre d'apparition.
 */
export const cn = (...classes: ClassValue[]) => twMerge(clsx(classes));

/** Formate un entier à la française : 2 500 plutôt que 2,500. */
export const formatNombre = (n: number) => new Intl.NumberFormat('fr-FR').format(n);
