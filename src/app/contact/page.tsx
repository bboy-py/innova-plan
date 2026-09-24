import type { Metadata } from 'next';
import { EnTetePage } from '@/components/sections/EnTetePage';
import { FormulaireEtapes } from '@/components/sections/FormulaireEtapes';
import { CarteLocalisation } from '@/components/sections/CarteLocalisation';
import { TitreSection } from '@/components/ui/TitreSection';
import { Apparition } from '@/components/ui/Apparition';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contactez Innova Plan : Boulevard de la Liberté, Akwa, Douala. Demande d\u2019étude, de devis ou d\u2019avis technique.',
};

export default function Contact() {
  return (
    <>
      <EnTetePage
        repere="06"
        titre="Parlons du terrain avant de parler du prix."
        chapo="Cinq questions, deux minutes. Plus la description est précise, plus notre première réponse sera utile — et elle arrive sous 48 heures ouvrées."
        variante="secondaire"
      />

      <section className="gradient-core-glow py-section">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <FormulaireEtapes />
          </div>

          <aside className="lg:col-span-5">
            <TitreSection intitule="Nous joindre directement" variante="secondaire" />

            <Apparition>
              <dl className="mt-10 divide-y divide-black/10 border-y border-black/10">
                <div className="py-6">
                  <dt className="font-display text-rail font-bold uppercase text-encre-500">Bureau</dt>
                  <dd className="mt-3 text-base leading-relaxed text-encre-700">
                    {site.adresse.rue}
                    <br />
                    {site.adresse.quartier}, {site.adresse.ville}
                    <br />
                    {site.adresse.pays}
                  </dd>
                </div>
                <div className="py-6">
                  <dt className="font-display text-rail font-bold uppercase text-encre-500">Téléphone</dt>
                  <dd className="mt-3 space-y-1">
                    {site.telephones.map((t) => (
                      <p key={t}>
                        <a
                          href={`tel:${t.replace(/\s/g, '')}`}
                          className="font-display text-lg font-bold text-encre-950 hover:text-encre-600"
                        >
                          {t}
                        </a>
                      </p>
                    ))}
                  </dd>
                </div>
                <div className="py-6">
                  <dt className="font-display text-rail font-bold uppercase text-encre-500">E-mail</dt>
                  <dd className="mt-3 space-y-2">
                    <p>
                      <a
                        href={`mailto:${site.emails.general}`}
                        className="font-display text-base font-bold text-encre-950 hover:text-encre-600"
                      >
                        {site.emails.general}
                      </a>
                      <span className="ml-2 text-sm text-encre-500">demandes générales</span>
                    </p>
                    <p>
                      <a
                        href={`mailto:${site.emails.technique}`}
                        className="font-display text-base font-bold text-encre-950 hover:text-encre-600"
                      >
                        {site.emails.technique}
                      </a>
                      <span className="ml-2 text-sm text-encre-500">support technique</span>
                    </p>
                  </dd>
                </div>
                <div className="py-6">
                  <dt className="font-display text-rail font-bold uppercase text-encre-500">Horaires</dt>
                  <dd className="mt-3 text-base text-encre-700">{site.horaires}</dd>
                </div>
              </dl>
            </Apparition>

            <Apparition delai={0.1}>
              <ul className="mt-8 flex flex-wrap gap-4">
                {site.reseaux.map((r) => (
                  <li key={r.nom}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="border-b border-sarcelle-600 pb-1 font-display text-sm font-bold text-encre-950 hover:text-encre-600"
                    >
                      {r.nom}
                    </a>
                  </li>
                ))}
              </ul>
            </Apparition>
          </aside>
        </div>
      </section>

      <section className="gradient-core-glow pb-section">
        <div className="shell">
          <div className="aspect-[16/10] w-full sm:aspect-[21/9]">
            <CarteLocalisation />
          </div>
        </div>
      </section>
    </>
  );
}
