'use client';

import dynamic from 'next/dynamic';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Enveloppes « fond de section » pour 3 des 4 shaders/gradients du prompt
 * dédié (le 4ᵉ, Core Glow, est une classe CSS pure — `.gradient-core-glow`
 * dans `globals.css` — posée directement sur la section, sans composant).
 *
 * Répartition (voir le prompt) :
 * - `FondMeshDrift`       → sections à fond blanc, Accueil/Services/Actualités
 * - `FondBeams`           → sections à fond noir,  Accueil/Services/Actualités
 * - `FondBackgroundPaths` → sections à fond noir,  À propos/Réalisations/Contact
 *
 * Chargement conditionnel par page (contrainte du prompt) : `EnTetePage` et
 * `AppelAction` sont communs aux deux groupes de pages et choisissent entre
 * deux de ces enveloppes selon leur prop `variante` — leur code source
 * référence donc les trois. Sans précaution, un import statique aurait fait
 * atterrir le poids des TROIS shaders (WebGL + canvas 2D + SVG animé) dans le
 * bundle JS de CHAQUE page, y compris celles qui n'en affichent que deux.
 * Chaque composant sous-jacent est donc importé via `next/dynamic` : Next.js
 * le découpe en chunk séparé, chargé uniquement quand la branche
 * correspondante est effectivement montée — donc uniquement sur les pages
 * qui l'utilisent réellement, indépendamment de ce que le code source
 * référence par ailleurs. `ssr: false` : ce sont des canvas/SVG purement
 * décoratifs, sans contenu à indexer, et WebGL/canvas n'existent pas côté
 * serveur.
 *
 * Chaque enveloppe, par ailleurs :
 * - respecte `prefers-reduced-motion` en ne montant jamais le canvas/SVG
 *   animé, au profit d'un dégradé statique — même logique que
 *   `LiquidMetalSurface` (`liquid-metal-button.tsx`), qui applique déjà ce
 *   principe au reste du site ;
 * - se pose en `-z-20` (et non `-z-10`, déjà pris par `ImageParallax` sur les
 *   sections qui en ont une, ex. `AppelAction`) pour rester systématiquement
 *   la couche la plus basse de la section.
 *
 * La section hôte doit être positionnée (`relative isolate overflow-hidden`)
 * pour que ce `-z-20` reste confiné à cette section plutôt que de se glisser
 * derrière la précédente — convention déjà utilisée par `AppelAction` avant
 * ce prompt.
 */

const ShaderBackground = dynamic(() => import('./shader-background').then((m) => m.ShaderBackground), {
  ssr: false,
});
const BeamsBackground = dynamic(() => import('./beams-background').then((m) => m.BeamsBackground), {
  ssr: false,
});
const BackgroundPaths = dynamic(() => import('./background-paths').then((m) => m.BackgroundPaths), {
  ssr: false,
});

export function FondMeshDrift({ className }: { className?: string }) {
  const reduit = useReducedMotion();
  return (
    <div className={cn('pointer-events-none absolute inset-0 -z-20 overflow-hidden', className)}>
      {reduit ? (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at 50% 35%, #f4f4f4, #e4e4e4 75%)' }}
        />
      ) : (
        <ShaderBackground className="absolute inset-0" />
      )}
    </div>
  );
}

export function FondBeams({ className }: { className?: string }) {
  const reduit = useReducedMotion();
  return (
    <div className={cn('pointer-events-none absolute inset-0 -z-20 overflow-hidden', className)}>
      {reduit ? (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'linear-gradient(100deg, #0a0a0a, #1c1c1c 45%, #0a0a0a 75%)' }}
        />
      ) : (
        <BeamsBackground className="absolute inset-0" />
      )}
    </div>
  );
}

export function FondBackgroundPaths({ className }: { className?: string }) {
  const reduit = useReducedMotion();
  return (
    <div className={cn('pointer-events-none absolute inset-0 -z-20 overflow-hidden', className)}>
      {reduit ? (
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(115deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 14px)',
          }}
        />
      ) : (
        <BackgroundPaths className="absolute inset-0" />
      )}
    </div>
  );
}
