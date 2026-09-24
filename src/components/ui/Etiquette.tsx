import { cn } from '@/lib/utils';

/**
 * Badge : catégorie ou statut.
 *
 * - « clair »  : badge neutre sur fond clair (ex. légende « Avant travaux »
 *   sur la galerie d'un projet) — noir sur blanc, aucune couleur de marque.
 * - « sombre » : badge de CATÉGORIE sur fond sombre (ex. thématique d'un
 *   article, affichée sur l'en-tête noir de la page). C'est l'un des rares
 *   endroits où la couleur de marque reste autorisée par la nouvelle charte
 *   (« un badge de catégorie ») — nuance choisie pour rester lisible sur
 *   fond quasi noir (9:1 de contraste).
 * - « accent » : même rôle de badge de catégorie, mais sur fond clair —
 *   nuance plus sombre du même vert, pour rester lisible sur blanc (7:1).
 */
export function Etiquette({
  children,
  ton = 'clair',
  className,
}: {
  children: React.ReactNode;
  ton?: 'clair' | 'sombre' | 'accent';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center border px-3 py-1.5 font-sans text-xs tracking-wide',
        ton === 'clair' && 'border-black/20 bg-white text-encre-950',
        ton === 'sombre' && 'border-sarcelle-400/40 bg-sarcelle-400/10 text-sarcelle-300',
        ton === 'accent' && 'border-sarcelle-600/40 bg-sarcelle-600/10 text-sarcelle-700',
        className,
      )}
    >
      {children}
    </span>
  );
}
