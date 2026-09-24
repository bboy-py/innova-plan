'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { Compass, Pencil, PencilRuler, Ruler, Layers, PenTool } from 'lucide-react';

/**
 * Curseur personnalisé.
 *
 * Couleur (#6B7280) et comportement de traînée inchangés, comme demandé.
 * Nouveauté : au repos, le point neutre est remplacé par une icône
 * lucide-react qui dépend de la section du site — un repère discret de
 * l'endroit où l'on se trouve. Elle disparaît dès qu'un élément porte
 * `data-curseur` (le disque noir « Voir »/« Lire » prend alors le relais,
 * inchangé), et revient dès qu'on quitte cet élément.
 *
 * Activé uniquement sur pointeur fin (souris) : sur tactile, et lorsque
 * l'utilisateur demande moins d'animations, le curseur système reste en
 * place et rien n'est monté.
 */
const GRIS_CURSEUR = '#6B7280';

const iconesParSection: { prefixe: string; Icone: typeof Compass }[] = [
  { prefixe: '/a-propos', Icone: Pencil },
  { prefixe: '/services', Icone: PencilRuler },
  { prefixe: '/realisations', Icone: Ruler },
  { prefixe: '/blog', Icone: Layers },
  { prefixe: '/contact', Icone: PenTool },
];

function iconeDeLaSection(chemin: string) {
  if (chemin === '/') return Compass;
  const trouvee = iconesParSection.find((s) => chemin.startsWith(s.prefixe));
  return trouvee?.Icone ?? null;
}

export function CurseurPersonnalise() {
  const reduit = useReducedMotion();
  const chemin = usePathname();
  const [actif, setActif] = useState(false);
  const [libelle, setLibelle] = useState<string | null>(null);

  const IconeSection = iconeDeLaSection(chemin);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Le point principal suit de près ; les deux points de traînée sont des
  // ressorts de plus en plus lents, tous alimentés par la même position —
  // c'est ce décalage progressif qui dessine le sillage.
  const xPrincipal = useSpring(x, { stiffness: 480, damping: 40, mass: 0.3 });
  const yPrincipal = useSpring(y, { stiffness: 480, damping: 40, mass: 0.3 });
  const xTrainee1 = useSpring(x, { stiffness: 220, damping: 32, mass: 0.5 });
  const yTrainee1 = useSpring(y, { stiffness: 220, damping: 32, mass: 0.5 });
  const xTrainee2 = useSpring(x, { stiffness: 120, damping: 28, mass: 0.7 });
  const yTrainee2 = useSpring(y, { stiffness: 120, damping: 28, mass: 0.7 });

  useEffect(() => {
    const finPointeur = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!finPointeur || reduit) return;

    setActif(true);
    document.body.classList.add('cursor-custom');

    const deplacer = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const cible = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-curseur]');
      setLibelle(cible?.dataset.curseur ?? null);
    };
    const sortir = () => {
      x.set(-100);
      y.set(-100);
      setLibelle(null);
    };

    window.addEventListener('mousemove', deplacer);
    document.addEventListener('mouseleave', sortir);
    return () => {
      window.removeEventListener('mousemove', deplacer);
      document.removeEventListener('mouseleave', sortir);
      document.body.classList.remove('cursor-custom');
    };
  }, [reduit, x, y]);

  if (!actif) return null;

  return (
    <>
      {/* Traînée : deux points grisés, de plus en plus estompés et en retard — inchangée */}
      <motion.div
        aria-hidden
        style={{ x: xTrainee2, y: yTrainee2 }}
        className="pointer-events-none fixed left-0 top-0 z-[108] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.span
          animate={{ opacity: libelle ? 0 : 0.16, scale: libelle ? 0.4 : 1 }}
          transition={{ duration: 0.3 }}
          className="block h-4 w-4 rounded-full"
          style={{ backgroundColor: GRIS_CURSEUR, filter: 'blur(1.5px)' }}
        />
      </motion.div>
      <motion.div
        aria-hidden
        style={{ x: xTrainee1, y: yTrainee1 }}
        className="pointer-events-none fixed left-0 top-0 z-[109] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.span
          animate={{ opacity: libelle ? 0 : 0.3, scale: libelle ? 0.5 : 1 }}
          transition={{ duration: 0.25 }}
          className="block h-3 w-3 rounded-full"
          style={{ backgroundColor: GRIS_CURSEUR, filter: 'blur(0.5px)' }}
        />
      </motion.div>

      {/* Point principal / disque labellisé */}
      <motion.div
        aria-hidden
        style={{ x: xPrincipal, y: yPrincipal }}
        className="pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={
            libelle
              ? { width: 68, height: 68, backgroundColor: 'rgba(10,10,10,0.94)' }
              : { width: 20, height: 20, backgroundColor: 'rgba(0,0,0,0)' }
          }
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center justify-center gap-0.5 rounded-full"
        >
          {/* Icône de section au repos ; à défaut (routes hors des 6 sections
              listées, ex. l'espace ingénieurs), un simple point neutre plutôt
              que de laisser le curseur invisible. */}
          <motion.span
            animate={{ opacity: libelle ? 0 : 1, scale: libelle ? 0.5 : 1 }}
            transition={{ duration: 0.2 }}
            className="absolute flex items-center justify-center"
          >
            {IconeSection ? (
              <IconeSection size={17} strokeWidth={2} color={GRIS_CURSEUR} />
            ) : (
              <span className="block h-[11px] w-[11px] rounded-full" style={{ backgroundColor: GRIS_CURSEUR }} />
            )}
          </motion.span>

          <motion.span
            animate={{ opacity: libelle ? 1 : 0 }}
            transition={{ duration: 0.18 }}
            className="text-center font-display text-[0.6875rem] font-bold uppercase leading-tight tracking-[0.06em] text-white"
          >
            {libelle}
          </motion.span>
          <motion.svg
            animate={{ opacity: libelle ? 1 : 0 }}
            transition={{ duration: 0.18 }}
            width="11"
            height="11"
            viewBox="0 0 14 14"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            aria-hidden
          >
            <path d="M1 7h12M7 1l6 6-6 6" />
          </motion.svg>
        </motion.div>
      </motion.div>
    </>
  );
}
