import type { Metadata } from 'next';
import { EnTetePage } from '@/components/sections/EnTetePage';
import { AppelAction } from '@/components/sections/AppelAction';
import { Apparition } from '@/components/ui/Apparition';
import { ApparitionVisuel } from '@/components/ui/ApparitionVisuel';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { Etiquette } from '@/components/ui/Etiquette';
import { TitreSection } from '@/components/ui/TitreSection';
import { ImageHover } from '@/components/ui/image-reveal';
import { FondMeshDrift } from '@/components/ui/fonds-page';
import { services } from '@/data/services';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Études de structures, géotechnique et maîtrise d\u2019œuvre : les trois expertises d\u2019Innova Plan, leurs clients et leurs outils.',
};

export default function Services() {
  return (
    <>
      <EnTetePage
        repere="03"
        titre="Trois expertises, une chaîne technique continue."
        chapo="Du sondage de sol à la réception des travaux, nos missions peuvent être prises séparément ou s'enchaîner. Dans ce dernier cas, personne ne se renvoie la responsabilité entre l'étude et le chantier."
        variante="principale"
      />

      <section className="relative isolate overflow-hidden bg-brume">
        <FondMeshDrift />
        <div className="shell pt-section">
          <TitreSection repere="04" intitule="Nos missions" />
        </div>

        <div className="shell pb-section">
          {services.map((service, i) => (
            <article
              key={service.id}
              id={service.slug}
              className="scroll-mt-28 border-t border-black/10 py-16 first:mt-14 lg:py-24"
            >
              <div
                className={cn(
                  'grid gap-10 lg:grid-cols-12 lg:gap-16',
                  // Alternance gauche / droite d'une mission à l'autre
                  i % 2 === 1 && 'lg:[&>*:first-child]:order-2',
                )}
              >
                {/* L'image « prend sa place » légèrement après le texte associé */}
                <ApparitionVisuel delai={0.16} className="lg:col-span-6">
                  <ImageHover
                    src={service.image.src}
                    alt={service.image.alt}
                    className="aspect-[4/3] w-full"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                </ApparitionVisuel>

                <div className="lg:col-span-6">
                  <span className="chiffre-tabulaire font-display text-rail font-bold text-sarcelle-700">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <BlurReveal delay={0.1} className="mt-4 block max-w-[18ch]">
                    <h2 className="font-display text-display-m font-extrabold text-encre-950">
                      {service.titre}
                    </h2>
                  </BlurReveal>
                  <BlurReveal delay={0.3} className="mt-5 block max-w-prose">
                    <p className="font-display text-lg font-semibold text-encre-700">{service.accroche}</p>
                  </BlurReveal>

                  <BlurReveal delay={0.5} className="mt-6 block">
                    <div className="space-y-4">
                      {service.description.map((p) => (
                        <p key={p.slice(0, 24)} className="max-w-prose leading-relaxed text-encre-700">
                          {p}
                        </p>
                      ))}
                    </div>
                  </BlurReveal>

                  <Apparition delai={0.2}>
                    <div className="mt-10 grid gap-8 sm:grid-cols-2">
                      <div>
                        <p className="font-display text-rail font-bold uppercase text-encre-500">
                          Clients concernés
                        </p>
                        <ul className="mt-4 space-y-2">
                          {service.clients.map((c) => (
                            <li key={c} className="flex items-baseline gap-3 text-sm text-encre-700">
                              <span className="h-1 w-1 shrink-0 bg-sarcelle-600" aria-hidden />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-display text-rail font-bold uppercase text-encre-500">
                          Outils employés
                        </p>
                        <ul className="mt-4 flex flex-wrap gap-2">
                          {service.technologies.map((t) => (
                            <li key={t}>
                              <Etiquette ton="accent">{t}</Etiquette>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Apparition>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <AppelAction
        titre="Une mission, plusieurs, ou l'ensemble de la chaîne ?"
        texte="Décrivez-nous le projet : nous vous dirons quelles missions sont nécessaires, et lesquelles ne le sont pas."
        variante="principale"
      />
    </>
  );
}
