'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { EffetTexte } from '@/components/ui/EffetTexte';
import { trait, statique } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * En-tête de section : repère numéroté (seul élément qui garde la couleur de
 * marque, en petit détail), intitulé neutre en petites capitales, et filet
 * qui se trace à l'entrée dans le viewport — rejoué à chaque passage, comme
 * le reste des apparitions du site.
 *
 * Prompt J : le repère et l'intitulé — le « titre de section » cité en
 * exemple dans le prompt (layout horizontal « 01 Bureau d'étude ») —
 * passent désormais par `BlurReveal` ou `TextEffect` selon `variante`,
 * exactement comme `EnTetePage`/`AppelAction` (`principale` = groupe
 * BlurReveal, `secondaire` = groupe TextEffect). Le filet lui-même n'est
 * pas du texte : son tracé (`whileInView`, déjà `once: false`) reste
 * inchangé.
 */
export function TitreSection({
  repere,
  intitule,
  ton = 'clair',
  className,
  variante = 'principale',
}: {
  repere?: string;
  intitule: string;
  ton?: 'clair' | 'sombre';
  className?: string;
  variante?: 'principale' | 'secondaire';
}) {
  const reduit = useReducedMotion();

  const classeRepere = cn(
    'chiffre-tabulaire font-display text-rail font-bold',
    ton === 'clair' ? 'text-sarcelle-700' : 'text-sarcelle-400',
  );
  const classeIntitule = cn(
    'font-display text-rail font-semibold uppercase',
    ton === 'clair' ? 'text-encre-950' : 'text-white',
  );

  return (
    <div className={cn('w-full', className)}>
      {variante === 'principale' ? (
        <BlurReveal className="flex items-baseline gap-4">
          {repere && <span className={classeRepere}>{repere}</span>}
          <span className={classeIntitule}>{intitule}</span>
        </BlurReveal>
      ) : (
        <div className="flex items-baseline gap-4">
          {repere && (
            <EffetTexte as="span" variante="amorce" className={classeRepere}>
              {repere}
            </EffetTexte>
          )}
          <EffetTexte as="span" variante="amorce" delai={0.08} className={classeIntitule}>
            {intitule}
          </EffetTexte>
        </div>
      )}
      <motion.div
        variants={reduit ? statique : trait}
        initial="repos"
        whileInView="visible"
        viewport={{ once: false }}
        className={cn('mt-4 h-px origin-left', ton === 'clair' ? 'bg-black/15' : 'bg-white/20')}
      />
    </div>
  );
}
