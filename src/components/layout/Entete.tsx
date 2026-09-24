'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Marque } from './Marque';
import { Bouton } from '@/components/ui/Bouton';
import { SlideTabs, type SlideTab } from '@/components/ui/slide-tabs';
import { navigation } from '@/data/site';
import { cn } from '@/lib/utils';

/**
 * Barre supérieure — Prompt H : nouvelle disposition à 3 zones, menu latéral
 * retiré au profit d'un SlideTabs en position centrale.
 *
 * - Gauche : logo (taille « grande », inchangée du prompt précédent).
 * - Centre : SlideTabs, 5 onglets (Accueil → Actualités ; Contact n'en fait
 *   pas partie, il reste le CTA dédié à droite).
 * - Droite : uniquement « Contactez-nous » (icône PhoneCall + Liquid Metal,
 *   inchangés).
 *
 * Style — référence quintadamalia.com : plus de bandeau opaque en
 * permanence. Le fond reste transparent en haut de page, et ne prend qu'un
 * très léger voile flouté une fois qu'on a commencé à défiler — jamais un
 * aplat blanc plein.
 *
 * Comportement de disparition/réapparition au scroll inchangé. Le panneau
 * de menu (`MenuLateral`) et son bouton hamburger ont été retirés entièrement
 * (composant et références) : il n'y a plus de « menu » à ouvrir, seulement
 * le SlideTabs. La forme compacte qui prenait le relais quand le bandeau se
 * cachait ne conserve donc que le CTA Contact.
 */
const ongletsSlideTabs: SlideTab[] = navigation.slice(0, 5).map((entree) => ({
  label: entree.label,
  href: entree.href,
}));

export function Entete() {
  const [enHaut, setEnHaut] = useState(true);
  const [cache, setCache] = useState(false);
  const dernierY = useRef(0);
  const chemin = usePathname();
  const reduit = useReducedMotion();

  useEffect(() => {
    dernierY.current = window.scrollY;

    const surScroll = () => {
      const y = window.scrollY;
      const delta = y - dernierY.current;

      if (y < 12) {
        // Tout en haut : le bandeau reste affiché, quoi qu'il arrive.
        setEnHaut(true);
        setCache(false);
      } else {
        setEnHaut(false);
        if (delta > 4) setCache(true); // on descend : on s'efface
        else if (delta < -4) setCache(false); // on remonte : on réapparaît aussitôt
      }
      dernierY.current = y;
    };

    surScroll();
    window.addEventListener('scroll', surScroll, { passive: true });
    return () => window.removeEventListener('scroll', surScroll);
  }, []);

  // Sécurité : toute navigation réaffiche le bandeau.
  useEffect(() => {
    setCache(false);
  }, [chemin]);

  return (
    <>
      <motion.header
        animate={reduit ? undefined : { y: cache ? '-100%' : '0%', opacity: cache ? 0 : 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-[90] transition-[background-color,border-color,padding,backdrop-filter] duration-500 ease-instrument',
          !enHaut
            ? 'border-b border-black/5 bg-white/45 py-3 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent py-6',
          cache && !reduit && 'pointer-events-none',
        )}
      >
        <div className="shell grid grid-cols-[auto_1fr_auto] items-center gap-4 lg:gap-8">
          <div id="marque-header-cible" className="inline-flex">
            <Marque taille="grande" />
          </div>

          <div className="hidden justify-center md:flex">
            <SlideTabs tabs={ongletsSlideTabs} />
          </div>

          <div className="flex items-center justify-end">
            <Bouton href="/contact" taille="compacte" icone="telephone">
              <span className="hidden sm:inline">Contactez-nous</span>
              <span className="sm:hidden">Contact</span>
            </Bouton>
          </div>
        </div>

        {/* Sous mode md : le SlideTabs ne tient pas sur une seule ligne à 3
            zones sans écraser le logo/CTA — repli sur une seconde ligne,
            avec défilement horizontal si les 5 onglets débordent. */}
        <div className="shell mt-3 md:hidden">
          <SlideTabs tabs={ongletsSlideTabs} />
        </div>
      </motion.header>

      {/* Forme réduite : ne s'affiche que pendant que le bandeau principal est caché. */}
      <motion.div
        animate={reduit ? undefined : { opacity: cache ? 1 : 0, y: cache ? 0 : -8 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed right-5 top-4 z-[91] flex items-center gap-2 border border-black/10 bg-white/90 p-1.5 backdrop-blur-md sm:right-8',
          !cache && 'pointer-events-none',
          reduit && 'hidden',
        )}
        aria-hidden={!cache}
      >
        <Bouton href="/contact" taille="compacte" className="!px-4 !py-2.5 text-xs" icone="telephone">
          Contact
        </Bouton>
      </motion.div>
    </>
  );
}
