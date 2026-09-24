'use client';

import { useEffect, useState } from 'react';
import type { BlocArticle } from '@/types';
import { cn } from '@/lib/utils';

/**
 * Sommaire flottant.
 * Il n'apparaît qu'à partir de `lg` (au-dessous, il prendrait la place du texte)
 * et suit la lecture : la section visible est repérée par IntersectionObserver,
 * pas par un calcul de position au scroll.
 */
export function SommaireArticle({ blocs }: { blocs: BlocArticle[] }) {
  const sections = blocs.filter(
    (b): b is Extract<BlocArticle, { type: 'intertitre' }> => b.type === 'intertitre',
  );
  const [actif, setActif] = useState<string | null>(sections[0]?.id ?? null);

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entrees) => {
        const visible = entrees
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActif(visible.target.id);
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: 0 },
    );

    sections.forEach((s) => {
      const noeud = document.getElementById(s.id);
      if (noeud) observer.observe(noeud);
    });

    return () => observer.disconnect();
    // Les identifiants de section sont figés au rendu de l'article
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections.length]);

  if (sections.length < 2) return null;

  return (
    <nav aria-label="Sommaire de l'article" className="sticky top-32">
      <p className="font-display text-rail font-bold uppercase text-encre-500">Sommaire</p>
      <ul className="mt-5 space-y-1 border-l border-black/10">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={cn(
                '-ml-px block border-l py-2 pl-5 text-sm leading-snug transition-colors duration-300',
                actif === section.id
                  ? 'border-sarcelle-600 font-medium text-encre-950'
                  : 'border-transparent text-encre-500 hover:text-encre-950',
              )}
            >
              {section.texte}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
