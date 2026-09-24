'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { instrument } from '@/lib/motion';
import { cn } from '@/lib/utils';

export interface EtapeRecit {
  repere: string;
  titre: string;
  texte: string;
  image: { src: string; alt: string };
}

/**
 * Récit en trois temps : la colonne de texte défile, le visuel reste fixe
 * et change au passage de chaque étape. Sur mobile, chaque étape reprend
 * son image sous le texte, l'effet de sticky n'ayant pas de sens à cette largeur.
 */
function Etape({
  etape,
  index,
  onActive,
}: {
  etape: EtapeRecit;
  index: number;
  onActive: (i: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { margin: '-45% 0px -45% 0px' });

  useEffect(() => {
    if (visible) onActive(index);
  }, [visible, index, onActive]);

  return (
    <div ref={ref} className="border-t border-black/10 py-12 first:border-t-0 lg:py-20">
      <div className="flex items-baseline gap-4">
        <span
          className={cn(
            'chiffre-tabulaire font-display text-rail font-bold transition-colors duration-500',
            visible ? 'text-sarcelle-700' : 'text-encre-500',
          )}
        >
          {etape.repere}
        </span>
        <h3 className="font-display text-display-s font-extrabold text-encre-950">{etape.titre}</h3>
      </div>
      <p className="mt-6 max-w-prose text-lg leading-relaxed text-encre-700">{etape.texte}</p>

      <div className="relative mt-8 aspect-[4/3] w-full lg:hidden">
        <Image
          src={etape.image.src}
          alt={etape.image.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}

export function RecitDefilant({ etapes }: { etapes: EtapeRecit[] }) {
  const [actif, setActif] = useState(0);
  const reduit = useReducedMotion();

  return (
    <div className="shell grid gap-12 py-section lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-6">
        {etapes.map((etape, i) => (
          <Etape key={etape.repere} etape={etape} index={i} onActive={setActif} />
        ))}
      </div>

      <div className="hidden lg:col-span-6 lg:block">
        <div className="sticky top-28">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-encre-900">
            {etapes.map((etape, i) => (
              <motion.div
                key={etape.image.src}
                initial={false}
                animate={{ opacity: reduit ? (i === 0 ? 1 : 0) : i === actif ? 1 : 0 }}
                transition={{ duration: 0.75, ease: instrument }}
                className="absolute inset-0"
              >
                <Image
                  src={etape.image.src}
                  alt={etape.image.alt}
                  fill
                  sizes="45vw"
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-black/10">
              <motion.div
                animate={{ width: `${((actif + 1) / etapes.length) * 100}%` }}
                transition={{ duration: 0.5, ease: instrument }}
                className="h-px bg-sarcelle-600"
              />
            </div>
            <span className="chiffre-tabulaire font-display text-rail font-bold text-encre-500">
              {etapes[actif].repere} / {etapes[etapes.length - 1].repere}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
