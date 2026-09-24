'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { instrument } from '@/lib/motion';

export interface EntreeFaq {
  question: string;
  reponse: string;
}

/** FAQ en accordéon : une seule entrée ouverte à la fois. */
export function Accordeon({ entrees }: { entrees: EntreeFaq[] }) {
  const [ouvert, setOuvert] = useState<number | null>(0);
  const reduit = useReducedMotion();

  return (
    <div className="border-t border-black/10">
      {entrees.map((entree, i) => {
        const estOuvert = ouvert === i;
        return (
          <div key={entree.question} className="border-b border-black/10">
            <h3>
              <button
                type="button"
                aria-expanded={estOuvert}
                onClick={() => setOuvert(estOuvert ? null : i)}
                className="flex w-full items-start justify-between gap-6 py-6 text-left"
              >
                <span className="max-w-[52ch] font-display text-lg font-bold text-encre-950">
                  {entree.question}
                </span>
                <motion.span
                  aria-hidden
                  animate={{ rotate: estOuvert ? 45 : 0 }}
                  transition={{ duration: reduit ? 0 : 0.4, ease: instrument }}
                  className="mt-1 shrink-0 text-sarcelle-700"
                >
                  <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M7 0v14M0 7h14" />
                  </svg>
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {estOuvert && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduit ? 0 : 0.42, ease: instrument }}
                  className="overflow-hidden"
                >
                  <p className="max-w-prose pb-7 text-[0.975rem] leading-relaxed text-encre-700">
                    {entree.reponse}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
