'use client';

/**
 * Compass — 21st.dev/community/icons/animated, code repris tel quel pour le
 * dessin (masque + tracé du cercle + morphing/rotation de l'aiguille via
 * <animate>/<animateTransform> SMIL) : rien n'est redessiné à la main.
 *
 * Seul le DÉCLENCHEMENT change par rapport au fichier source :
 * - dans le composant original, la première <animate> n'a pas de `begin`
 *   explicite (donc `begin="0s"`, déclenchement au montage) et les suivantes
 *   sont à `begin="0.6s"` (délai absolu depuis le montage) — l'animation
 *   jouait donc automatiquement au chargement, pas au survol ;
 * - ici, la première <animate> passe en `begin="indefinite"` et les
 *   suivantes en syncbase relatif (`begin="{id}.end"`, elles s'enchaînent
 *   donc automatiquement après elle, sans dépendre d'un délai absolu) ;
 *   c'est ce composant qui appelle `beginElement()` sur la première au
 *   survol — l'option que le prompt propose explicitement (« relancer
 *   l'animation SVG via JavaScript au onMouseEnter ») plutôt qu'un
 *   déclenchement au chargement.
 * - la <svg> se remonte (clé react incrémentée) à la sortie de la souris
 *   pour revenir à l'état « aiguille non trouvée » et pouvoir rejouer le
 *   tracé à chaque survol, plutôt que de rester figée sur l'état final
 *   (comportement `fill="freeze"` d'origine, pensé pour une lecture unique).
 * - un id unique par instance (`useId`) remplace l'id fixe du fichier
 *   source (`SVGvmIgmdVi`), qui entrerait en collision si l'icône apparaît
 *   plusieurs fois sur la même page (plusieurs boutons génériques).
 *
 * `prefers-reduced-motion` : le tracé animé est remplacé par le dessin final
 * statique (cercle complet, aiguille pointée), jamais déclenché au survol —
 * état statique équivalent demandé par le prompt.
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
} from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CompassIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface CompassIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export const CompassIcon = forwardRef<CompassIconHandle, CompassIconProps>(
  ({ onMouseEnter, onMouseLeave, className, size = 24, ...props }, ref) => {
    const reduit = useReducedMotion();
    const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
    const maskId = `compass-mask-${uid}`;
    const drawId = `compass-draw-${uid}`;
    const drawRef = useRef<SVGAnimateElement>(null);
    const [playKey, setPlayKey] = useState(0);
    const isControlledRef = useRef(false);

    const jouer = useCallback(() => {
      // La balise vient d'être (re)montée avec begin="indefinite" : il faut
      // la déclencher explicitement, une fois qu'elle existe dans le DOM.
      requestAnimationFrame(() => drawRef.current?.beginElement());
    }, []);

    useImperativeHandle(ref, () => {
      isControlledRef.current = ref != null;
      return {
        startAnimation: () => setPlayKey((k) => k + 1),
        stopAnimation: () => setPlayKey(0),
      };
    });

    useEffect(() => {
      if (playKey > 0 && !reduit) jouer();
    }, [playKey, jouer, reduit]);

    const handleMouseEnter = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else if (!reduit) {
          setPlayKey((k) => k + 1);
        }
      },
      [onMouseEnter, reduit]
    );

    const handleMouseLeave = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else {
          setPlayKey(0);
        }
      },
      [onMouseLeave]
    );

    if (reduit) {
      // État statique équivalent : cercle complet, aiguille déjà pointée,
      // aucune balise <animate> montée.
      return (
        <div className={cn(className)} {...props}>
          <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <defs>
              <mask id={maskId}>
                <path
                  fill="none"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"
                />
                <path fill="#fff" d="M10.2 10.2l6.8 -3.2l-3.2 6.8l-6.8 3.2Z" />
                <circle cx="12" cy="12" r="1" />
              </mask>
            </defs>
            <path fill="currentColor" d="M0 0h24v24H0z" mask={`url(#${maskId})`} />
          </svg>
        </div>
      );
    }

    return (
      <div className={cn(className)} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...props}>
        <svg key={playKey} width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <defs>
            <mask id={maskId}>
              <path
                fill="none"
                stroke="#fff"
                strokeDasharray="60"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"
              >
                <animate
                  ref={drawRef}
                  id={drawId}
                  fill="freeze"
                  attributeName="stroke-dashoffset"
                  begin="indefinite"
                  dur="0.6s"
                  values="60;0"
                />
              </path>
              <path fill="#fff" d="M11 11l1 1l1 1l-1 -1Z" transform="rotate(-180 12 12)">
                <animate
                  fill="freeze"
                  attributeName="d"
                  begin={`${drawId}.end`}
                  dur="0.3s"
                  to="M10.2 10.2l6.8 -3.2l-3.2 6.8l-6.8 3.2Z"
                />
                <animateTransform
                  fill="freeze"
                  attributeName="transform"
                  begin={`${drawId}.end`}
                  dur="0.5s"
                  type="rotate"
                  values="-180 12 12;0 12 12"
                />
              </path>
              <circle cx="12" cy="12">
                <animate fill="freeze" attributeName="r" begin={`${drawId}.end`} dur="0.3s" to="1" />
              </circle>
            </mask>
          </defs>
          <path fill="currentColor" d="M0 0h24v24H0z" mask={`url(#${maskId})`} />
        </svg>
      </div>
    );
  }
);

CompassIcon.displayName = 'CompassIcon';
