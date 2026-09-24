'use client';

/**
 * TextEffect — reconstruction fidèle du composant « Text Effect » de Motion
 * Primitives (21st.dev/@ibelick/components/text-effect, licence MIT,
 * dépendance framer-motion, déjà installée).
 *
 * Point de vérification honnête : le fichier source brut (`components/ui/
 * text-effect.tsx` du dépôt `ibelick/motion-primitives`) n'a pas pu être
 * récupéré tel quel — le registre `21st.dev/r/ibelick/text-effect` exige une
 * clé API 21st.dev, et `motion-primitives.com` bloque l'accès automatisé à
 * son registre CLI (robots.txt). Cette implémentation reproduit le
 * comportement documenté à partir de deux sources officielles vérifiées :
 * - la table des props (motion-primitives.com/docs/text-effect) : `per`,
 *   `as`, `variants`, `preset`, `delay`, `trigger`, `onAnimationComplete`,
 *   `onAnimationStart`, `segmentWrapperClassName`, `style`,
 *   `containerTransition`, `segmentTransition`, `speedReveal`,
 *   `speedSegment` — reprises ici avec les mêmes noms et significations ;
 * - l'exemple officiel `TextEffectWithCustomDelay` (21st.dev/@ibelick/
 *   components/text-effect), reproduit ligne à ligne dans `EffetTexte.tsx`
 *   (variants `rotateX`/`y` par caractère pour l'amorce, `preset="blur"`
 *   pour le corps de texte).
 *
 * Comportement reproduit : découpage en mots/caractères/lignes, orchestration
 * par `staggerChildren`/`delayChildren` sur un conteneur `motion`, et surtout
 * le prop `trigger` piloté par l'appelant (plutôt qu'une détection de
 * viewport interne) — c'est ce qui permet à `EffetTexte.tsx` de le rejouer à
 * chaque entrée dans le viewport en lui passant un booléen `useInView`.
 * Quand `trigger` repasse à `false`, le bloc est démonté via
 * `AnimatePresence` (variant `exit`) puis remonté au prochain passage à
 * `true`, ce qui rejoue proprement l'animation d'entrée à chaque fois.
 */

import * as React from 'react';
import { AnimatePresence, motion, type Transition, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

export type TextEffectPer = 'word' | 'char' | 'line';
export type TextEffectPreset = 'blur' | 'blur-sm' | 'fade-in-blur' | 'scale' | 'fade' | 'slide';

export interface TextEffectVariants {
  container?: Variants;
  item?: Variants;
}

export interface TextEffectProps {
  children: string;
  per?: TextEffectPer;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  variants?: TextEffectVariants;
  className?: string;
  preset?: TextEffectPreset;
  delay?: number;
  trigger?: boolean;
  onAnimationComplete?: () => void;
  onAnimationStart?: () => void;
  segmentWrapperClassName?: string;
  style?: React.CSSProperties;
  containerTransition?: Transition;
  segmentTransition?: Transition;
  speedReveal?: number;
  speedSegment?: number;
}

const presets: Record<TextEffectPreset, TextEffectVariants> = {
  fade: {
    item: { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } },
  },
  slide: {
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
  },
  scale: {
    item: { hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0 } },
  },
  'blur-sm': {
    item: {
      hidden: { opacity: 0, filter: 'blur(4px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
      exit: { opacity: 0, filter: 'blur(4px)' },
    },
  },
  blur: {
    item: {
      hidden: { opacity: 0, filter: 'blur(10px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
      exit: { opacity: 0, filter: 'blur(10px)' },
    },
  },
  'fade-in-blur': {
    item: {
      hidden: { opacity: 0, y: 20, filter: 'blur(12px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
      exit: { opacity: 0, y: 20, filter: 'blur(12px)' },
    },
  },
};

type Segment =
  | { type: 'space'; content: string }
  | { type: 'line'; content: string }
  | { type: 'word'; content: string }
  | { type: 'word-of-chars'; content: string };

/**
 * Découpe le texte en segments animables. Les espaces restent du texte brut
 * (jamais wrappés dans un `motion.span`) : le navigateur continue de gérer
 * le retour à la ligne normalement entre les mots, sans quoi chaque mot
 * `inline-block` collerait au suivant.
 */
function splitIntoSegments(text: string, per: TextEffectPer): Segment[] {
  if (per === 'line') {
    return text.split('\n').map((content) => ({ type: 'line', content }));
  }
  const tokens = text.split(/(\s+)/).filter((t) => t.length > 0);
  return tokens.map((content) => {
    if (/^\s+$/.test(content)) return { type: 'space', content };
    return { type: per === 'char' ? 'word-of-chars' : 'word', content };
  });
}

export const TextEffect = React.forwardRef<HTMLElement, TextEffectProps>(function TextEffect(
  {
    children,
    per = 'word',
    as = 'p',
    variants,
    className,
    preset = 'fade',
    delay = 0,
    trigger = true,
    onAnimationComplete,
    onAnimationStart,
    segmentWrapperClassName,
    style,
    containerTransition,
    segmentTransition,
    speedReveal = 1,
    speedSegment = 1,
  },
  forwardedRef,
) {
  const segments = React.useMemo(() => splitIntoSegments(children, per), [children, per]);

  const baseStagger = per === 'line' ? 0.1 : per === 'char' ? 0.03 : 0.05;
  const stagger = baseStagger / Math.max(speedReveal, 0.01);
  const itemDuration = 0.4 / Math.max(speedSegment, 0.01);

  const presetItem = presets[preset]?.item ?? presets.fade.item!;
  const resolvedItem = variants?.item ?? presetItem;

  const itemVariants: Variants = {
    hidden: resolvedItem.hidden,
    visible: {
      ...(resolvedItem.visible as object),
      transition: {
        duration: itemDuration,
        ...segmentTransition,
        ...((resolvedItem.visible as { transition?: Transition })?.transition ?? {}),
      },
    },
    exit: resolvedItem.exit ?? resolvedItem.hidden,
  };

  const containerVariants: Variants = {
    hidden: { ...(variants?.container?.hidden as object) },
    visible: {
      ...(variants?.container?.visible as object),
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
        ...containerTransition,
        ...((variants?.container?.visible as { transition?: Transition })?.transition ?? {}),
      },
    },
    exit: {
      ...(variants?.container?.exit as object),
      transition: { staggerChildren: stagger, staggerDirection: -1, ...containerTransition },
    },
  };

  const MotionTag = (motion as any)[as] ?? motion.p;

  return (
    <AnimatePresence mode="popLayout">
      {trigger && (
        <MotionTag
          ref={forwardedRef}
          key="bloc"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className={className}
          style={style}
          onAnimationComplete={onAnimationComplete}
          onAnimationStart={onAnimationStart}
        >
          {segments.map((segment, i) => {
            if (segment.type === 'space') {
              return <React.Fragment key={`espace-${i}`}>{segment.content}</React.Fragment>;
            }
            if (segment.type === 'line') {
              return (
                <motion.span
                  key={`ligne-${i}`}
                  variants={itemVariants}
                  className={cn('block', segmentWrapperClassName)}
                >
                  {segment.content}
                </motion.span>
              );
            }
            if (segment.type === 'word-of-chars') {
              return (
                <span
                  key={`mot-${i}`}
                  className={cn('inline-block whitespace-nowrap', segmentWrapperClassName)}
                >
                  {Array.from(segment.content).map((char, ci) => (
                    <motion.span
                      key={`car-${i}-${ci}`}
                      variants={itemVariants}
                      className="inline-block"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              );
            }
            return (
              <motion.span
                key={`mot-${i}`}
                variants={itemVariants}
                className={cn('inline-block', segmentWrapperClassName)}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {segment.content}
              </motion.span>
            );
          })}
        </MotionTag>
      )}
    </AnimatePresence>
  );
});
