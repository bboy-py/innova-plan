import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles, articlesLies, getArticle } from '@/data/posts';
import { getProjet } from '@/data/projects';
import { BlocsArticle } from '@/components/ui/BlocsArticle';
import { CarteArticle } from '@/components/ui/CarteArticle';
import { Etiquette } from '@/components/ui/Etiquette';
import { Apparition } from '@/components/ui/Apparition';
import { BlurReveal, BlurRevealTitre } from '@/components/ui/blur-reveal';
import { ImageHover } from '@/components/ui/image-reveal';
import { SommaireArticle } from '@/components/sections/SommaireArticle';
import { AppelAction } from '@/components/sections/AppelAction';
import { FondMeshDrift } from '@/components/ui/fonds-page';

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticle(params.slug);
  if (!article) return { title: 'Article introuvable' };
  return {
    title: article.titre,
    description: article.extrait,
    openGraph: { images: [article.image.src], type: 'article', publishedTime: article.date },
  };
}

export default function PageArticle({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const lies = articlesLies(article.slug);
  const projet = article.projetLie ? getProjet(article.projetLie) : undefined;

  return (
    <>
      <article>
        <header className="relative isolate overflow-hidden bg-white pb-14 pt-32 sm:pt-40">
          <FondMeshDrift />
          <div className="shell">
            <Apparition>
              <Link
                href="/blog"
                className="font-display text-rail font-bold uppercase text-encre-500 transition-colors hover:text-encre-950"
              >
                Retour aux actualités
              </Link>
            </Apparition>

            <Apparition delai={0.06}>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Etiquette ton="accent">{article.categorie}</Etiquette>
                <span className="text-xs text-encre-500">
                  {article.dateLabel} — {article.tempsLecture} de lecture
                </span>
              </div>
            </Apparition>

            <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
              <BlurRevealTitre
                texte={article.titre}
                as="h1"
                delaiDepart={0.15}
                pas={0.05}
                className="max-w-[28ch] font-display text-display-m font-extrabold text-encre-950 lg:max-w-[64%]"
              />
              <BlurReveal delay={0.5} className="block lg:max-w-[16ch] lg:pb-2 lg:text-right">
                <p className="text-base font-light text-encre-700">Par {article.auteur}</p>
              </BlurReveal>
            </div>
          </div>
        </header>

        <ImageHover
          src={article.image.src}
          alt={article.image.alt}
          priority
          sizes="100vw"
          className="aspect-[16/9] w-full sm:aspect-[21/9]"
        />

        <div className="relative isolate overflow-hidden bg-brume py-section">
          <FondMeshDrift />
          <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Sommaire : colonne de gauche, masqué sous lg */}
            <div className="hidden lg:col-span-3 lg:block">
              <SommaireArticle blocs={article.contenu} />
            </div>

            <div className="lg:col-span-8 lg:col-start-5">
              <p className="max-w-prose font-display text-xl font-semibold leading-relaxed text-encre-950">
                {article.extrait}
              </p>
              <div className="filet my-10" />

              <div className="max-w-prose">
                <BlocsArticle blocs={article.contenu} />
              </div>

              {/* Renvoi vers la réalisation citée, quand il y en a une */}
              {projet && (
                <div className="mt-14 border-t border-black/10 pt-8">
                  <p className="font-display text-rail font-bold uppercase text-encre-500">
                    Réalisation citée
                  </p>
                  <Link
                    href={`/realisations/${projet.slug}`}
                    data-curseur="Voir"
                    className="group mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1"
                  >
                    <span className="font-display text-display-s font-extrabold text-encre-950 transition-colors group-hover:text-encre-600">
                      {projet.titre}
                    </span>
                    <span className="text-sm text-encre-500">{projet.localisation}</span>
                  </Link>
                </div>
              )}

              <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-8">
                <p className="text-sm text-encre-500">
                  Rédigé par {article.auteur} — {article.dateLabel}
                </p>
                <Link
                  href="/contact"
                  className="border-b border-sarcelle-600 pb-1 font-display text-sm font-bold text-encre-950 transition-colors hover:text-encre-600"
                >
                  Poser une question à l&apos;équipe
                </Link>
              </footer>
            </div>
          </div>
        </div>
      </article>

      {/* Articles liés */}
      <section className="relative isolate overflow-hidden bg-white py-section">
        <FondMeshDrift />
        <div className="shell">
          <p className="font-display text-rail font-bold uppercase text-encre-500">À lire ensuite</p>
          <ul className="mt-10 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {lies.map((lie, i) => (
              <Apparition as="li" key={lie.id} delai={i * 0.08}>
                <CarteArticle article={lie} repere={String(i + 1).padStart(2, '0')} />
              </Apparition>
            ))}
          </ul>
        </div>
      </section>

      <AppelAction
        titre="Un sujet que vous aimeriez voir traité ?"
        texte="Les questions récurrentes des maîtres d'ouvrage deviennent souvent nos meilleurs articles."
        variante="principale"
      />
    </>
  );
}
