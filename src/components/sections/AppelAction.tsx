import { Bouton } from '@/components/ui/Bouton';
import { Apparition } from '@/components/ui/Apparition';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { EffetTexte } from '@/components/ui/EffetTexte';
import { ImageParallax } from '@/components/ui/ImageParallax';
import { FondBeams, FondBackgroundPaths } from '@/components/ui/fonds-page';
import { media } from '@/data/media';

/**
 * Bloc de conversion réutilisé en bas de (presque) toutes les pages — donc
 * des deux groupes de la répartition des fonds animés (voir le prompt dédié) :
 * `variante="principale"` (Accueil/Services/Actualités) pose Beams Background
 * en fond ; `variante="secondaire"` (À propos/Réalisations) pose Background
 * Paths. Le fond se glisse sous `ImageParallax` déjà en place (`-z-20` contre
 * son `-z-10`), les deux restant visibles ensemble à faible opacité.
 */
export function AppelAction({
  titre = 'Un terrain, un plan, une échéance ?',
  texte = 'Envoyez-nous le dossier. Nous revenons sous 48 heures avec un avis technique et une estimation d\u2019honoraires.',
  variante = 'principale',
}: {
  titre?: string;
  texte?: string;
  variante?: 'principale' | 'secondaire';
}) {
  return (
    <section className="relative isolate overflow-hidden bg-encre-950">
      {variante === 'principale' ? <FondBeams /> : <FondBackgroundPaths />}
      <ImageParallax
        src={media.coucherChantier}
        alt=""
        className="absolute inset-0 -z-10 h-full w-full opacity-30"
        amplitude={10}
      />
      <div className="shell relative py-section">
        {variante === 'principale' ? (
          <>
            <BlurReveal className="block">
              <h2 className="max-w-[20ch] font-display text-display-m font-extrabold text-white">{titre}</h2>
            </BlurReveal>
            <BlurReveal delay={0.25} className="mt-6 block max-w-prose">
              <p className="text-lg font-light leading-relaxed text-white/75">{texte}</p>
            </BlurReveal>
          </>
        ) : (
          <>
            <EffetTexte
              as="h2"
              variante="titre"
              className="max-w-[20ch] font-display text-display-m font-extrabold text-white"
            >
              {titre}
            </EffetTexte>
            <EffetTexte
              as="p"
              variante="corps"
              delai={0.3}
              className="mt-6 max-w-prose text-lg font-light leading-relaxed text-white/75"
            >
              {texte}
            </EffetTexte>
          </>
        )}
        <Apparition delai={0.16}>
          <div className="mt-10 flex flex-wrap gap-4">
            <Bouton href="/contact" variante="primaire-inverse" icone="devis">Demander un devis</Bouton>
            <Bouton href="/services" variante="contour-clair">
              Voir nos expertises
            </Bouton>
          </div>
        </Apparition>
      </div>
    </section>
  );
}
