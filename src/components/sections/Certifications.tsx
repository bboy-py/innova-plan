'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { TitreSection } from '@/components/ui/TitreSection';
import { EffetTexte } from '@/components/ui/EffetTexte';
import { FondBackgroundPaths } from '@/components/ui/fonds-page';
import { certifications } from '@/data/site';
import { instrument } from '@/lib/motion';

/**
 * Références professionnelles présentées sous forme de cartouches.
 * Les trois badges arrivent en cascade à l'entrée dans le viewport
 * (orchestration par le conteneur, pas par des délais recopiés à la main).
 */
const conteneur = {
  repos: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const badge = {
  repos: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: instrument } },
};

export function Certifications() {
  const reduit = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-encre-950 py-section">
      <FondBackgroundPaths />
      <div className="shell">
        <TitreSection repere="05" intitule="Références professionnelles" ton="sombre" variante="secondaire" />
        <EffetTexte
          as="h2"
          variante="titre"
          className="mt-10 max-w-[20ch] font-display text-display-m font-extrabold text-white"
        >
          Des cadres normatifs, pas des logos décoratifs.
        </EffetTexte>

        <motion.ul
          variants={reduit ? undefined : conteneur}
          initial={reduit ? false : 'repos'}
          whileInView="visible"
          viewport={{ once: false, margin: '-80px' }}
          className="mt-14 grid gap-px sm:grid-cols-3"
        >
          {certifications.map((c) => (
            <motion.li key={c.sigle} variants={reduit ? undefined : badge}>
              <div className="cartouche h-full border border-white/15 p-8 text-white">
                <span className="font-display text-[2.5rem] font-extrabold leading-none text-sarcelle-400">
                  {c.sigle}
                </span>
                <h3 className="mt-6 font-display text-base font-bold text-white">{c.titre}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{c.detail}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
