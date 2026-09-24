'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Bouton } from '@/components/ui/Bouton';
import { BlurReveal, BlurRevealTitre } from '@/components/ui/blur-reveal';
import { FondMeshDrift } from '@/components/ui/fonds-page';
import { instrument } from '@/lib/motion';

/**
 * Hero — fond blanc épuré, sans photo, sans phare en filigrane, sans écran
 * d'intro à attendre.
 *
 * Prompt J : l'eyebrow, le titre (toujours découpé mot par mot) et le
 * paragraphe passent sur `BlurReveal` (composant réel 21st.dev/@badtzx0,
 * voir `blur-reveal.tsx`), qui se rejoue désormais à chaque entrée dans le
 * viewport plutôt qu'une seule fois au montage. Ce changement de mécanisme
 * de déclenchement rend obsolète l'ancien `useState`/`useEffect` local
 * (« pret »/« etat ») qui ne servait qu'à garantir un vrai changement
 * d'état au montage (voir l'historique dans le commentaire d'origine,
 * conservé dans le README) : `useInView` sur `heroRef` (déjà utilisé pour
 * l'effet de scroll ci-dessous) fournit maintenant ce déclenchement, de
 * façon uniforme avec `once: false`, pour les deux éléments qui restent sur
 * une animation « maison » (rangée de CTA, cartouche bas de page — non
 * concernés par ce prompt, ce ne sont pas du texte).
 */
const mots = ['Bâtir', "l'avenir", 'avec', 'précision', 'et', 'innovation.'];

export function Hero() {
  const reduit = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const enVue = useInView(heroRef, { once: false, margin: '-10% 0px -10% 0px' });
  const etat = enVue ? 'visible' : 'repos';

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const echelle = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const opacite = useTransform(scrollYProgress, [0, 1], [1, 0.75]);

  const delaiApresTitre = 0.2 + (mots.length - 1) * 0.08 + 0.8 + 0.55;

  const fondu = {
    repos: { opacity: reduit ? 1 : 0, y: reduit ? 0 : 16 },
    visible: (d: number) => ({
      opacity: 1,
      y: 0,
      transition: reduit ? { duration: 0 } : { duration: 0.7, ease: instrument, delay: d },
    }),
  };

  return (
    <section
      ref={heroRef}
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-white"
    >
      <FondMeshDrift />
      <motion.div
        style={reduit ? undefined : { scale: echelle, opacity: opacite }}
        className="relative z-10 flex flex-1 flex-col justify-end"
      >
        <div className="shell pb-10 pt-32 sm:pb-14">
          <BlurReveal className="block">
            <p className="flex items-center gap-3 font-display text-rail font-bold uppercase text-encre-600">
              {/* Seule touche de couleur de marque de tout le hero : ce petit trait */}
              <span className="h-px w-10 bg-sarcelle-600" />
              Bureau d&apos;études en génie civil — Douala, Cameroun
            </p>
          </BlurReveal>

          <BlurRevealTitre
            texte={mots.join(' ')}
            as="h1"
            delaiDepart={0.2}
            pas={0.08}
            className="mt-7 font-display text-display-xl font-extrabold text-encre-950"
          />

          <div className="mt-10 grid gap-8 border-t border-black/10 pt-8 lg:grid-cols-12 lg:items-end">
            <BlurReveal delay={0.8} className="block max-w-prose lg:col-span-6">
              <p className="text-base font-light leading-relaxed text-encre-700">
                Études de structures, géotechnique et maîtrise d&apos;œuvre. Nous calculons, modélisons en
                BIM et suivons le chantier jusqu&apos;à la réception — pour que la surprise reste sur le
                papier, jamais sur le terrain.
              </p>
            </BlurReveal>

            <motion.div
              variants={fondu}
              custom={delaiApresTitre}
              initial="repos"
              animate={etat}
              className="flex flex-wrap gap-3 lg:col-span-6 lg:justify-end"
            >
              <Bouton href="/realisations" icone="realisations">
                Explorer nos projets
              </Bouton>
              <Bouton href="/contact" variante="contour" icone="devis">
                Demander un devis
              </Bouton>
            </motion.div>
          </div>
        </div>

        {/* Cartouche bas de page, à la manière d'un cadre de plan */}
        <motion.div
          variants={fondu}
          custom={delaiApresTitre + 0.12}
          initial="repos"
          animate={etat}
          className="shell relative z-10 flex items-center justify-between gap-6 border-t border-black/10 py-4"
        >
          <span className="font-display text-rail font-semibold uppercase text-encre-500">
            Eurocodes · BAEL 91 · ONIGC
          </span>
          <span className="hidden font-display text-rail font-semibold uppercase text-encre-500 sm:block">
            Depuis 2024
          </span>
          <span className="flex items-center gap-3 font-display text-rail font-semibold uppercase text-encre-500">
            Défiler
            <motion.span
              aria-hidden
              animate={reduit ? undefined : { y: [0, 7, 0] }}
              transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
              className="block h-4 w-px bg-sarcelle-600"
            />
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
