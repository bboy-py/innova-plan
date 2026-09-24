'use client';

import Image from 'next/image';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * ImageHover — composant source : 21st.dev/@jatin-yadav05/components/image-reveal.
 *
 * Comportement natif reproduit : au repos, l'image est entièrement voilée
 * par un flou ; au survol, une zone circulaire nette suit le curseur —
 * obtenue en appliquant le flou à une seule couche `backdrop-filter`
 * superposée, dont un `mask-image` (dégradé radial centré sur le curseur)
 * découpe un « trou » là où le flou ne doit pas s'appliquer. Le rayon du
 * trou est lui-même animé par un ressort (0 → plein rayon) plutôt que
 * basculé entre `none` et le dégradé : le trou grandit/rétrécit en douceur
 * au lieu d'apparaître/disparaître d'un coup, et une seule valeur anime
 * `mask-image` d'un bout à l'autre.
 *
 * Extension demandée par le Prompt H (absente du composant source) : un
 * clic rend l'image nette en permanence (flou entièrement neutralisé, quelle
 * que soit la position du curseur) ; un clic ailleurs sur la page reflloute.
 * Une seule image « révélée en permanence » à la fois sur la page — un état
 * partagé minimal (`revealedId` ci-dessous), pas de Context React : plus
 * simple pour un comportement qui n'a besoin d'être lu que par les instances
 * de ce composant, et qui évite de toucher `layout.tsx`/`Chrome.tsx`.
 * L'ordre d'exécution des clics (celui qui vient d'être cliqué doit rester
 * révélé, celui qui l'était avant doit se reflouter, un clic hors de toute
 * image doit reflouter l'actif) est garanti en relisant l'état à jour dans
 * un unique écouteur posé sur `document` — plus fiable qu'un écouteur par
 * instance, qui peut s'exécuter dans un ordre différent selon l'élément
 * cliqué.
 *
 * Tactile : sans survol réel, le premier tap déclenche directement la
 * révélation permanente (choix retenu parmi les deux proposés par le
 * prompt) — c'est simplement la conséquence de désactiver le suivi par
 * `mousemove`/`mouseenter` sur les pointeurs grossiers, le `onClick` (qui se
 * déclenche aussi au tap) prenant seul le relais.
 */

type Ecouteur = () => void;

let revealedId: string | null = null;
const ecouteurs = new Set<Ecouteur>();
const registre = new Map<string, HTMLElement>();
let ecouteurDocumentPose = false;

function notifier() {
  ecouteurs.forEach((e) => e());
}

function definirRevele(id: string | null) {
  revealedId = id;
  notifier();
}

function poserEcouteurDocument() {
  if (ecouteurDocumentPose || typeof document === 'undefined') return;
  ecouteurDocumentPose = true;
  document.addEventListener('click', (e) => {
    if (!revealedId) return;
    const el = registre.get(revealedId);
    if (el && !el.contains(e.target as Node)) definirRevele(null);
  });
}

function useRevele(id: string) {
  const [actif, setActif] = useState(false);

  useEffect(() => {
    poserEcouteurDocument();
    const maj = () => setActif(revealedId === id);
    maj();
    ecouteurs.add(maj);
    return () => {
      ecouteurs.delete(maj);
    };
  }, [id]);

  return actif;
}

const RAYON = 130;

export function ImageHover({
  src,
  alt,
  className,
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const id = useId();
  const reduit = useReducedMotion();
  const revele = useRevele(id);
  const conteneurRef = useRef<HTMLDivElement>(null);
  const [peutSurvoler, setPeutSurvoler] = useState(false);
  const [survole, setSurvole] = useState(false);

  useEffect(() => {
    setPeutSurvoler(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  useEffect(() => {
    if (conteneurRef.current) registre.set(id, conteneurRef.current);
    return () => {
      registre.delete(id);
      if (revealedId === id) definirRevele(null);
    };
  }, [id]);

  const relX = useMotionValue(0);
  const relY = useMotionValue(0);
  const xRessort = useSpring(relX, { stiffness: 320, damping: 32, mass: 0.4 });
  const yRessort = useSpring(relY, { stiffness: 320, damping: 32, mass: 0.4 });
  // 0 = aucun trou (flou plein) ; RAYON = trou complet, au survol.
  // Important : la cible passée à `useSpring` doit être une `MotionValue`.
  // `useSpring` ne relit une valeur brute (non-MotionValue) qu'au tout
  // premier rendu — il ne s'abonne à ses changements que si elle est déjà
  // une `MotionValue` — donc `survole ? RAYON : 0` figeait le rayon à 0 pour
  // toujours après le montage. On passe donc par une MotionValue intermédiaire
  // mise à jour explicitement quand `survole` change.
  const cibleRayon = useMotionValue(survole ? RAYON : 0);
  useEffect(() => {
    cibleRayon.set(survole ? RAYON : 0);
  }, [survole, cibleRayon]);
  const rayonRessort = useSpring(cibleRayon, { stiffness: 260, damping: 30 });
  const masque = useMotionTemplate`radial-gradient(circle ${rayonRessort}px at ${xRessort}px ${yRessort}px, transparent 0%, transparent 55%, #000 100%)`;

  const deplacer = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!peutSurvoler || !conteneurRef.current) return;
    const rect = conteneurRef.current.getBoundingClientRect();
    relX.set(e.clientX - rect.left);
    relY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={conteneurRef}
      onMouseEnter={() => peutSurvoler && setSurvole(true)}
      onMouseMove={deplacer}
      onMouseLeave={() => setSurvole(false)}
      onClick={() => definirRevele(id)}
      className={cn('relative cursor-pointer overflow-hidden bg-encre-900', className)}
    >
      <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />

      {!reduit && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backdropFilter: 'blur(22px) saturate(1.05)',
            WebkitBackdropFilter: 'blur(22px) saturate(1.05)',
            maskImage: masque,
            WebkitMaskImage: masque,
            opacity: revele ? 0 : 1,
            transition: 'opacity 550ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      )}
    </div>
  );
}
