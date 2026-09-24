import Link from 'next/link';
import { CarteProjet } from '@/components/ui/CarteProjet';
import { TitreSection } from '@/components/ui/TitreSection';
import { Apparition } from '@/components/ui/Apparition';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { FondBeams } from '@/components/ui/fonds-page';
import { projets } from '@/data/projects';

/**
 * Grille des réalisations mises en avant.
 * Le tableau est filtré sur `miseEnAvant` : ajouter un projet en base
 * suffira à le faire apparaître ici sans toucher au composant.
 */
export function ProjetsALaUne() {
  const selection = projets.filter((p) => p.miseEnAvant);

  return (
    <section className="relative isolate overflow-hidden bg-encre-950 py-section">
      <FondBeams />
      <div className="shell">
        <TitreSection repere="02" intitule="Réalisations" ton="sombre" />

        <div className="mt-12 flex flex-wrap items-end justify-between gap-6">
          <BlurReveal className="block">
            <h2 className="max-w-[20ch] font-display text-display-m font-extrabold text-white">
              Des ouvrages livrés, des contraintes documentées.
            </h2>
          </BlurReveal>
          <Apparition delai={0.1}>
            <Link
              href="/realisations"
              className="border-b border-sarcelle-500 pb-1 font-display text-sm font-bold text-white transition-colors hover:text-white/70"
            >
              Toutes les réalisations
            </Link>
          </Apparition>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:gap-10">
          {selection.map((projet, i) => (
            <Apparition key={projet.id} delai={i * 0.1}>
              <CarteProjet projet={projet} repere={String(i + 1).padStart(2, '0')} />
            </Apparition>
          ))}
        </div>
      </div>
    </section>
  );
}
