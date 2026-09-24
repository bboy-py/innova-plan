'use client';

import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { useRef, type MouseEvent as ReactMouseEvent } from 'react';
import { cn } from '@/lib/utils';
import { LiquidMetalSurface, type LiquidMetalSurfaceHandle } from '@/components/ui/liquid-metal-button';
import { CompassIcon, type CompassIconHandle } from '@/components/icons/CompassIcon';
import { PhoneCallIcon, type PhoneCallIconHandle } from '@/components/icons/PhoneCallIcon';
import { FileTextIcon, type FileTextIconHandle } from '@/components/icons/FileTextIcon';
import { BuildingOffice2Icon, type BuildingOffice2IconHandle } from '@/components/icons/BuildingOffice2Icon';

type Variante = 'primaire' | 'primaire-inverse' | 'contour' | 'contour-clair';
type Taille = 'normale' | 'compacte';
/** Icône dédiée des trois boutons du Prompt G ; `boussole` = Compass générique. */
type Icone = 'boussole' | 'telephone' | 'devis' | 'realisations';

interface Props {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variante?: Variante;
  taille?: Taille;
  type?: 'button' | 'submit';
  disabled?: boolean;
  /** Affiche un indicateur de traitement et neutralise le clic. */
  chargement?: boolean;
  className?: string;
  /**
   * `telephone` (Contactez-nous), `devis` (Demander un devis) et
   * `realisations` (Voir nos réalisations) déclenchent l'icône animée
   * dédiée du Prompt G ; par défaut, Compass générique animé.
   */
  icone?: Icone;
}

/**
 * Prompt G — fond/bordure Liquid Metal sur tous les boutons.
 *
 * `variantes` ne pilote plus de fond/bordure : `<LiquidMetalSurface>` (fond
 * métallique animé, cf. liquid-metal-button.tsx) est désormais posée en
 * couche `absolute inset-0` derrière le contenu de CHAQUE bouton, quelle que
 * soit sa variante — conformément au prompt (« remplacer le style visuel
 * actuel de tous les boutons du site »). Les quatre variantes distinctes
 * (fond noir, fond blanc, contour sombre, contour clair) convergent donc
 * visuellement vers le même fond métallique sombre ; ce qui subsiste de
 * `variantes` est la couleur du texte, désormais claire dans tous les cas
 * pour rester lisible sur ce fond. La forme passe aussi de `rounded-none`
 * (coins nets, direction éditoriale d'origine) à `rounded-full`, la pilule
 * étant la forme du composant source — c'est un changement visuel notable
 * par rapport au reste du site, à valider avant mise en ligne.
 */
const base =
  'group relative inline-flex items-center justify-center gap-3 rounded-full font-display font-bold tracking-[0.04em] transition-all duration-300 ease-instrument disabled:cursor-not-allowed disabled:opacity-50';

const tailles: Record<Taille, string> = {
  normale: 'px-7 py-4 text-sm',
  compacte: 'px-5 py-3 text-[0.8125rem]',
};

const variantes: Record<Variante, string> = {
  primaire: 'text-white',
  'primaire-inverse': 'text-white',
  contour: 'text-white',
  'contour-clair': 'text-white',
};

const transitionIcone = { duration: 0.3, ease: 'easeInOut' as const };
const LienAnime = motion(Link);

type PoigneeIcone = { startAnimation: () => void; stopAnimation: () => void };

function IconeDediee({
  icone,
  iconRef,
}: {
  icone: Icone;
  iconRef: React.Ref<CompassIconHandle | PhoneCallIconHandle | FileTextIconHandle | BuildingOffice2IconHandle>;
}) {
  switch (icone) {
    case 'telephone':
      return <PhoneCallIcon ref={iconRef as React.Ref<PhoneCallIconHandle>} size={16} />;
    case 'devis':
      return <FileTextIcon ref={iconRef as React.Ref<FileTextIconHandle>} size={16} />;
    case 'realisations':
      return <BuildingOffice2Icon ref={iconRef as React.Ref<BuildingOffice2IconHandle>} size={16} />;
    default:
      return <CompassIcon ref={iconRef as React.Ref<CompassIconHandle>} size={16} />;
  }
}

/**
 * Texte + icône dédiée. Le texte garde son léger resserrement au survol
 * (×0,95, inchangé du Prompt E) ; l'icône, elle, n'est plus pivotée/agrandie
 * par ce composant — chacune des quatre icônes (Compass compris) trace ou
 * rejoue désormais sa propre animation SVG interne au survol, pilotée par
 * `<Bouton>` via `iconRef` (cf. plus bas). Superposer en plus une rotation
 * Framer par-dessus aurait fait tourner *une icône déjà en train de se
 * tracer/s'animer elle-même* — les deux logiques auraient concurrencé sur
 * les mêmes fractions de seconde ; on privilégie donc le tracé propre à
 * chaque icône, comme demandé, et le texte reste seul à porter le
 * changement d'échelle pour rester visuellement coordonné avec lui (même
 * durée, même easing).
 */
function ContenuBouton({
  enfants,
  chargement,
  icone,
  iconRef,
}: {
  enfants: ReactNode;
  chargement?: boolean;
  icone: Icone;
  iconRef: React.Ref<CompassIconHandle | PhoneCallIconHandle | FileTextIconHandle | BuildingOffice2IconHandle>;
}) {
  const reduit = useReducedMotion();

  const varianteTexte: Variants = {
    repos: { scale: 1 },
    survol: { scale: reduit ? 1 : 0.95, transition: transitionIcone },
  };

  return (
    <span className={cn('relative z-10 flex items-center gap-2.5', chargement && 'opacity-0')}>
      <motion.span variants={varianteTexte} transition={transitionIcone} className="inline-block">
        {enfants}
      </motion.span>
      <span aria-hidden className="inline-flex shrink-0">
        <IconeDediee icone={icone} iconRef={iconRef} />
      </span>
    </span>
  );
}

export function Bouton({
  children,
  href,
  onClick,
  variante = 'primaire',
  taille = 'normale',
  type = 'button',
  disabled,
  chargement = false,
  className,
  icone = 'boussole',
}: Props) {
  const reduit = useReducedMotion();
  const classes = cn(base, tailles[taille], variantes[variante], className);
  const iconRef = useRef<PoigneeIcone>(null);
  const surfaceRef = useRef<LiquidMetalSurfaceHandle>(null);

  // Survol/pression relayés à la surface Liquid Metal (qui, étant en
  // `pointer-events: none`, ne peut pas les détecter elle-même) et à
  // l'icône dédiée (déclenchée au survol du bouton entier, pas seulement de
  // l'icône — cf. consigne du Prompt G).
  const survoler = () => {
    if (!reduit) iconRef.current?.startAnimation();
  };
  const quitter = () => {
    iconRef.current?.stopAnimation();
  };
  const ricocher = (e: ReactMouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    surfaceRef.current?.triggerRipple(e.clientX - rect.left, e.clientY - rect.top);
  };

  if (href) {
    return (
      <LienAnime
        href={href}
        initial="repos"
        whileHover="survol"
        animate="repos"
        className={classes}
        onClick={(e: ReactMouseEvent<HTMLAnchorElement>) => {
          ricocher(e);
          onClick?.();
        }}
        onHoverStart={survoler}
        onHoverEnd={quitter}
      >
        <LiquidMetalSurface ref={surfaceRef} reduceMotion={!!reduit} />
        <ContenuBouton enfants={children} icone={icone} iconRef={iconRef} />
      </LienAnime>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={(e: ReactMouseEvent<HTMLButtonElement>) => {
        ricocher(e);
        onClick?.();
      }}
      disabled={disabled || chargement}
      aria-busy={chargement}
      initial="repos"
      whileHover="survol"
      animate="repos"
      className={classes}
      onHoverStart={survoler}
      onHoverEnd={quitter}
    >
      <LiquidMetalSurface ref={surfaceRef} reduceMotion={!!reduit} />
      <ContenuBouton enfants={children} chargement={chargement} icone={icone} iconRef={iconRef} />
      {chargement && (
        <span className="absolute inset-0 z-10 flex items-center justify-center gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-current"
              style={{ animationDelay: `${i * 160}ms`, animationDuration: '900ms' }}
            />
          ))}
        </span>
      )}
    </motion.button>
  );
}
