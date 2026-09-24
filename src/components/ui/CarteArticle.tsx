'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { HardHat } from 'lucide-react';
import type { Article } from '@/types';
import { Etiquette } from './Etiquette';
import { instrument } from '@/lib/motion';
import { cn } from '@/lib/utils';

const LienAnime = motion(Link);

/**
 * Carte d'article. Même construction que CarteProjet : zoom + dégradé en CSS
 * pur (robuste, group-hover/article:), badge central tracé (pathLength) en
 * Framer Motion pour ce qu'aucune classe CSS seule ne peut faire.
 */
export function CarteArticle({
  article,
  repere,
  format = 'standard',
  priorite = false,
}: {
  article: Article;
  repere?: string;
  format?: 'standard' | 'large';
  priorite?: boolean;
}) {
  const large = format === 'large';
  const reduit = useReducedMotion();

  const varianteFondu: Variants = {
    repos: { opacity: 0 },
    survol: { opacity: 1, transition: { duration: 0.2 } },
  };
  const varianteTrait: Variants = {
    repos: { pathLength: 0 },
    survol: { pathLength: 1, transition: { duration: reduit ? 0 : 0.3, ease: instrument } },
  };
  const varianteTexteBadge: Variants = {
    repos: { opacity: 0, y: 4 },
    survol: { opacity: 1, y: 0, transition: { duration: 0.25, delay: reduit ? 0 : 0.08, ease: instrument } },
  };

  return (
    <article className={cn('group/article', large && 'grid gap-8 lg:grid-cols-12 lg:gap-12')}>
      <LienAnime
        href={`/blog/${article.slug}`}
        tabIndex={-1}
        aria-hidden
        data-curseur="Lire"
        initial="repos"
        whileHover="survol"
        animate="repos"
        className={cn('block overflow-hidden bg-encre-900', large && 'lg:col-span-7')}
      >
        <div className={cn('relative w-full', large ? 'aspect-[16/10]' : 'aspect-[4/3]')}>
          <Image
            src={article.image.src}
            alt={article.image.alt}
            fill
            priority={priorite}
            sizes={large ? '(max-width: 1024px) 100vw, 55vw' : '(max-width: 640px) 100vw, 33vw'}
            className="object-cover transition-transform duration-[400ms] ease-instrument group-hover/article:scale-105"
          />

          {/* Voile léger, uniquement pour garder le badge lisible — jamais opaque */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-transparent transition-colors duration-500 group-hover/article:from-black/45" />

          {repere && (
            <span className="chiffre-tabulaire absolute left-5 top-5 z-10 font-display text-rail font-bold text-white/70">
              {repere}
            </span>
          )}

          {/* Badge central : le contour se trace (pathLength), le texte suit de peu */}
          <motion.div
            variants={varianteFondu}
            className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-2.5 px-6">
              <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="h-2.5 w-24" fill="none">
                <motion.path
                  d="M0,10 L0,4 M0,7 L100,7 M100,10 L100,4"
                  stroke="white"
                  strokeWidth="3"
                  variants={varianteTrait}
                />
              </svg>
              <motion.span
                variants={varianteTexteBadge}
                className="flex items-center gap-2 whitespace-nowrap font-display text-xs font-bold uppercase tracking-[0.08em] text-white"
              >
                <span className="chiffre-tabulaire">{repere ?? '01'}</span>
                {'\u2014'} Lire l&apos;article
                <HardHat size={14} strokeWidth={2} />
              </motion.span>
            </div>
          </motion.div>
        </div>
      </LienAnime>

      <div className={cn(large && 'flex flex-col justify-center lg:col-span-5')}>
        <div className={cn('flex flex-wrap items-center gap-3', !large && 'mt-5')}>
          <Etiquette ton="accent">{article.categorie}</Etiquette>
          <span className="text-xs text-encre-500">
            {article.dateLabel} — {article.tempsLecture} de lecture
          </span>
        </div>

        <h3
          className={cn(
            'font-display font-extrabold text-encre-950',
            large ? 'mt-5 text-display-m' : 'mt-4 text-xl font-bold leading-snug',
          )}
        >
          {/* Le titre reste noir : seul le soulignement, en accent, réagit au survol */}
          <Link
            href={`/blog/${article.slug}`}
            className="underline decoration-transparent decoration-2 underline-offset-4 transition-colors duration-300 hover:decoration-sarcelle-600"
          >
            {article.titre}
          </Link>
        </h3>

        <p
          className={cn(
            'font-light leading-relaxed text-encre-700',
            large ? 'mt-5 max-w-prose' : 'mt-3 max-w-[44ch] text-[0.95rem]',
          )}
        >
          {article.extrait}
        </p>

        <p className="mt-4 text-sm text-encre-500">Par {article.auteur}</p>
      </div>
    </article>
  );
}
