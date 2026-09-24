import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjet, projets } from '@/data/projects';
import { Apparition } from '@/components/ui/Apparition';
import { EffetTexte } from '@/components/ui/EffetTexte';
import { Etiquette } from '@/components/ui/Etiquette';
import { TitreSection } from '@/components/ui/TitreSection';
import { ImageHover } from '@/components/ui/image-reveal';
import { AppelAction } from '@/components/sections/AppelAction';
import { FondBackgroundPaths } from '@/components/ui/fonds-page';

/** Génère une page statique par projet — et par projet futur, sans modification. */
export function generateStaticParams() {
  return projets.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const projet = getProjet(params.slug);
  if (!projet) return { title: 'Projet introuvable' };
  return {
    title: projet.titre,
    description: projet.description,
    openGraph: { images: [projet.couverture.src] },
  };
}

const libellePhase: Record<string, string> = {
  avant: 'Avant travaux',
  pendant: 'En cours de chantier',
  apres: 'Après réception',
  'rendu-3d': 'Rendu 3D',
};

export default function PageProjet({ params }: { params: { slug: string } }) {
  const projet = getProjet(params.slug);
  if (!projet) notFound();

  const suivant = projets[(projets.findIndex((p) => p.slug === projet.slug) + 1) % projets.length];

  return (
    <>
      {/* En-tête noir sur blanc, façon storeyarchitecture.co.uk/projects */}
      <section className="gradient-core-glow pb-14 pt-32 sm:pb-20 sm:pt-40">
        <div className="shell">
          <Apparition>
            <Link
              href="/realisations"
              className="font-display text-rail font-bold uppercase text-encre-500 hover:text-encre-950"
            >
              Retour aux réalisations
            </Link>
          </Apparition>

          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <EffetTexte
              as="h1"
              variante="titre"
              delai={0.15}
              className="max-w-[22ch] font-display text-display-m font-extrabold text-encre-950 lg:max-w-[64%]"
            >
              {projet.titre}
            </EffetTexte>
            <EffetTexte
              as="p"
              variante="corps"
              delai={0.5}
              className="text-base font-light leading-relaxed text-encre-700 lg:max-w-sm lg:pb-2 lg:text-right"
            >
              {projet.role}
            </EffetTexte>
          </div>

          <Apparition delai={0.14}>
            <dl className="mt-12 grid gap-8 border-t border-black/10 pt-8 sm:grid-cols-3">
              {[
                ['Catégorie', projet.categorie],
                ['Localisation', projet.localisation],
                ['Réalisation', projet.periodeLabel],
              ].map(([label, valeur]) => (
                <div key={label}>
                  <dt className="font-display text-rail font-bold uppercase text-encre-500">{label}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-encre-950">{valeur}</dd>
                </div>
              ))}
            </dl>
          </Apparition>
        </div>
      </section>

      {/* Description + fiche technique */}
      <section className="gradient-core-glow py-section">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <TitreSection repere="01" intitule="Le projet" variante="secondaire" />
            <EffetTexte
              as="p"
              variante="corps"
              className="mt-10 max-w-prose text-xl font-light leading-relaxed text-encre-950"
            >
              {projet.description}
            </EffetTexte>

            <div className="mt-14 grid gap-10 sm:grid-cols-2">
              <div>
                <EffetTexte
                  as="h2"
                  variante="amorce"
                  className="font-display text-rail font-bold uppercase text-encre-500"
                >
                  Défi technique
                </EffetTexte>
                <EffetTexte as="p" variante="corps" delai={0.15} className="mt-4 leading-relaxed text-encre-700">
                  {projet.defi}
                </EffetTexte>
              </div>
              <div>
                <EffetTexte
                  as="h2"
                  variante="amorce"
                  delai={0.08}
                  className="font-display text-rail font-bold uppercase text-encre-500"
                >
                  Solution retenue
                </EffetTexte>
                <EffetTexte as="p" variante="corps" delai={0.23} className="mt-4 leading-relaxed text-encre-700">
                  {projet.solution}
                </EffetTexte>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <Apparition delai={0.1}>
              <div className="cartouche border border-black/15 bg-white p-8 text-encre-950">
                <EffetTexte
                  as="h2"
                  variante="amorce"
                  className="font-display text-rail font-bold uppercase text-encre-500"
                >
                  Fiche technique
                </EffetTexte>
                <dl className="mt-6 divide-y divide-black/10">
                  {projet.ficheTechnique.map((ligne) => (
                    <div key={ligne.label} className="flex items-baseline justify-between gap-6 py-3">
                      <dt className="text-sm text-encre-500">{ligne.label}</dt>
                      <dd className="chiffre-tabulaire text-right font-display text-sm font-bold text-encre-950">
                        {ligne.valeur}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Apparition>
          </aside>
        </div>
      </section>

      {/* Galerie ordonnée avant / pendant / après */}
      <section className="gradient-core-glow py-section">
        <div className="shell">
          <TitreSection repere="02" intitule="Le chantier, étape par étape" variante="secondaire" />
          <ul className="mt-14 grid gap-10 md:grid-cols-2">
            {projet.images.map((image, i) => (
              <Apparition as="li" key={image.src + i} delai={(i % 2) * 0.08}>
                <figure>
                  <ImageHover
                    src={image.src}
                    alt={image.alt}
                    className="aspect-[4/3] w-full"
                    sizes="(max-width: 768px) 100vw, 45vw"
                  />
                  <figcaption className="mt-4 flex items-start justify-between gap-6">
                    <p className="max-w-[42ch] text-sm leading-relaxed text-encre-700">
                      {image.legende ?? image.alt}
                    </p>
                    <Etiquette>{libellePhase[image.phase]}</Etiquette>
                  </figcaption>
                </figure>
              </Apparition>
            ))}
          </ul>
        </div>
      </section>

      {/* Témoignage du maître d'ouvrage */}
      {projet.temoignage && (
        <section className="relative isolate overflow-hidden bg-encre-950 py-section">
          <FondBackgroundPaths />
          <div className="shell">
            <blockquote className="max-w-prose">
              <p className="text-lg italic leading-relaxed text-white">
                « {projet.temoignage.citation} »
              </p>
              <footer className="mt-8 flex items-center gap-4">
                <span className="h-px w-12 bg-sarcelle-400" />
                <div>
                  <p className="font-display text-sm font-bold text-white">{projet.temoignage.auteur}</p>
                  <p className="text-sm text-white/65">{projet.temoignage.fonction}</p>
                </div>
              </footer>
            </blockquote>
          </div>
        </section>
      )}

      {/* Projet suivant */}
      {suivant.slug !== projet.slug && (
        <section className="gradient-core-glow py-20">
          <div className="shell">
            <p className="font-display text-rail font-bold uppercase text-encre-500">Projet suivant</p>
            <Link
              href={`/realisations/${suivant.slug}`}
              data-curseur="Voir"
              className="group mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2"
            >
              <span className="font-display text-display-m font-extrabold text-encre-950 transition-colors group-hover:text-encre-600">
                {suivant.titre}
              </span>
              <span className="text-sm text-encre-500">{suivant.localisation}</span>
            </Link>
          </div>
        </section>
      )}

      <AppelAction variante="secondaire" />
    </>
  );
}
