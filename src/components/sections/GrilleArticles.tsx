'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CarteArticle } from '@/components/ui/CarteArticle';
import { Apparition } from '@/components/ui/Apparition';
import { articles, categoriesArticles } from '@/data/posts';
import { instrument } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Listing du blog : filtre par thématique et réorganisation animée des cartes.
 * Le premier article de la sélection est mis en avant en grand format ;
 * quand un filtre ne laisse qu'un article, il occupe naturellement cette place.
 */
export function GrilleArticles() {
  const [filtre, setFiltre] = useState<string>('Tous');
  const reduit = useReducedMotion();

  const compteurs = useMemo(() => {
    const map = new Map<string, number>();
    articles.forEach((a) => map.set(a.categorie, (map.get(a.categorie) ?? 0) + 1));
    return map;
  }, []);

  const selection = filtre === 'Tous' ? articles : articles.filter((a) => a.categorie === filtre);
  const [premier, ...suite] = selection;

  return (
    <div className="shell py-section">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-b border-black/10 pb-6">
        <FiltreTheme
          label="Tous les articles"
          total={articles.length}
          actif={filtre === 'Tous'}
          onClick={() => setFiltre('Tous')}
        />
        {categoriesArticles.map((c) => (
          <FiltreTheme
            key={c}
            label={c}
            total={compteurs.get(c) ?? 0}
            actif={filtre === c}
            desactive={(compteurs.get(c) ?? 0) === 0}
            onClick={() => setFiltre(c)}
          />
        ))}
      </div>

      {premier && (
        <Apparition className="mt-14 border-b border-black/10 pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={premier.slug}
              initial={reduit ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduit ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: instrument }}
            >
              <CarteArticle article={premier} repere="01" format="large" priorite />
            </motion.div>
          </AnimatePresence>
        </Apparition>
      )}

      <motion.ul layout={!reduit} className="mt-16 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {suite.map((article, i) => (
            <motion.li
              key={article.id}
              layout={!reduit}
              initial={reduit ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduit ? undefined : { opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, ease: instrument, delay: reduit ? 0 : (i % 3) * 0.06 }}
            >
              <CarteArticle article={article} repere={String(i + 2).padStart(2, '0')} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {selection.length === 0 && (
        <p className="mt-16 max-w-prose text-encre-700">
          Aucun article publié dans cette thématique pour l&apos;instant.
        </p>
      )}
    </div>
  );
}

function FiltreTheme({
  label,
  total,
  actif,
  desactive,
  onClick,
}: {
  label: string;
  total: number;
  actif: boolean;
  desactive?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desactive}
      aria-pressed={actif}
      className={cn(
        'relative pb-2 font-display text-sm font-bold transition-colors duration-300',
        actif ? 'text-encre-950' : 'text-encre-500 hover:text-encre-950',
        desactive && 'cursor-not-allowed opacity-45 hover:text-encre-500',
      )}
    >
      {label}
      <span className="chiffre-tabulaire ml-2 align-super text-[0.65rem] text-sarcelle-600">
        {String(total).padStart(2, '0')}
      </span>
      <span
        className={cn(
          'absolute -bottom-[25px] left-0 h-px bg-sarcelle-600 transition-all duration-300 ease-instrument',
          actif ? 'w-full' : 'w-0',
        )}
      />
    </button>
  );
}
