import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * Signature de marque : le logo officiel (phare, texte « Innova Plan »,
 * route ondulée) fourni en PNG à fond transparent.
 *
 * Deux tons :
 * - « clair » : le fichier tel quel (couleurs d'origine), pour les fonds
 *   blancs/clairs du site (header, formulaires).
 * - « sombre » : la même image, passée au filtre CSS `brightness(0) invert(1)`.
 *   Ce filtre ramène chaque pixel non transparent au noir puis l'inverse en
 *   blanc pur, en conservant exactement la silhouette du logo (alpha intact) —
 *   un traitement purement CSS, sans ressource graphique supplémentaire à
 *   produire ni à maintenir. C'est la variante utilisée sur les sections
 *   inversées (footer, menu, pages d'ouverture sombres).
 */
const tailles = {
  petite: { largeur: 132, hauteur: 65, classe: 'h-7 w-auto sm:h-8' },
  normale: { largeur: 168, hauteur: 83, classe: 'h-8 w-auto sm:h-9' },
  grande: { largeur: 220, hauteur: 108, classe: 'h-11 w-auto sm:h-12' },
} as const;

export function Marque({
  ton = 'clair',
  taille = 'normale',
  className,
}: {
  ton?: 'clair' | 'sombre';
  taille?: keyof typeof tailles;
  className?: string;
}) {
  const t = tailles[taille];

  return (
    <Link
      href="/"
      className={cn('inline-flex shrink-0 items-center', className)}
      aria-label="Innova Plan — accueil"
    >
      <Image
        src="/logo.png"
        alt="Innova Plan"
        width={t.largeur}
        height={t.hauteur}
        priority
        className={cn(t.classe, ton === 'sombre' && 'brightness-0 invert')}
      />
    </Link>
  );
}
