import Link from 'next/link';
import { navigation, site, certifications } from '@/data/site';
import { services } from '@/data/services';
import { Marque } from './Marque';

/**
 * Pied de page — l'un des « chapitres » noirs de la nouvelle direction
 * éditoriale, au même titre que le hero ou les sections de conversion.
 * Coordonnées complètes, plan du site et mentions légales.
 */
export function PiedDePage() {
  return (
    <footer className="bg-encre-950 bg-grille bg-grille text-white/70">
      <div className="shell py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Marque ton="sombre" />
            <p className="mt-6 max-w-[38ch] text-sm font-light leading-relaxed text-white/75">
              Bureau d&apos;études en génie civil. Conception de structures, géotechnique et maîtrise
              d&apos;œuvre, appuyées par la modélisation BIM.
            </p>
            <address className="mt-8 not-italic">
              <p className="font-display text-rail font-bold uppercase text-white/60">Bureau</p>
              <p className="mt-2 text-sm">{site.adresse.rue}</p>
              <p className="text-sm">
                {site.adresse.quartier}, {site.adresse.ville} — {site.adresse.pays}
              </p>
              <div className="mt-5 space-y-1">
                {site.telephones.map((t) => (
                  <p key={t} className="text-sm">
                    <a href={`tel:${t.replace(/\s/g, '')}`} className="transition-colors hover:text-white">
                      {t}
                    </a>
                  </p>
                ))}
              </div>
              <div className="mt-5 space-y-1">
                <p className="text-sm">
                  <a href={`mailto:${site.emails.general}`} className="transition-colors hover:text-white">
                    {site.emails.general}
                  </a>
                  <span className="ml-2 text-xs text-white/55">général</span>
                </p>
                <p className="text-sm">
                  <a href={`mailto:${site.emails.technique}`} className="transition-colors hover:text-white">
                    {site.emails.technique}
                  </a>
                  <span className="ml-2 text-xs text-white/55">support technique</span>
                </p>
              </div>
            </address>
          </div>

          <nav className="lg:col-span-3">
            <p className="font-display text-rail font-bold uppercase text-white/60">Navigation</p>
            <ul className="mt-5 space-y-3">
              {navigation.map((e) => (
                <li key={e.href}>
                  <Link href={e.href} className="text-sm transition-colors hover:text-white">
                    {e.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <p className="font-display text-rail font-bold uppercase text-white/60">Expertises</p>
            <ul className="mt-5 space-y-3">
              {services.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/services#${s.slug}`}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {s.titre}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-10 font-display text-rail font-bold uppercase text-white/60">
              Références professionnelles
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {certifications.map((c) => (
                <li
                  key={c.sigle}
                  className="border border-white/20 px-3 py-1.5 font-display text-xs font-bold tracking-wide"
                >
                  {c.sigle}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {site.nom}, {site.formeJuridique} — RCCM : {site.mentions.rccm} — NIU : {site.mentions.niu}
          </p>
          <ul className="flex gap-5">
            {site.reseaux.map((r) => (
              <li key={r.nom}>
                <a href={r.url} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
                  {r.nom}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
