import { BlurReveal, BlurRevealTitre } from '@/components/ui/blur-reveal';
import { EffetTexte } from '@/components/ui/EffetTexte';
import { FondMeshDrift } from '@/components/ui/fonds-page';
import { cn } from '@/lib/utils';

/**
 * En-tête commun aux pages intérieures — noir sur blanc, sans photo.
 *
 * Reproduit la disposition de storeyarchitecture.co.uk/projects : un grand
 * titre à gauche, un paragraphe descriptif plus discret aligné à droite à
 * hauteur du titre (disposition horizontale, pas empilée). Les « premières
 * pages d'ouverture » du site étaient jusqu'ici traitées comme des chapitres
 * noirs façon Apple ; ce n'est plus le cas ici, sur retour explicite après
 * test — seules les sections de conversion et le pied de page gardent
 * l'inversion noire.
 *
 * Utilisé par les deux groupes de la répartition des fonds animés (prompt
 * dédié) : `variante="principale"` (Services/Actualités) pose Mesh Drift en
 * fond ; `variante="secondaire"` (À propos/Réalisations/Contact) applique
 * la classe Core Glow, statique, directement sur la section.
 *
 * Prompt J : cette même répartition sert désormais aussi à choisir le
 * composant d'apparition du texte — `BlurReveal` en `principale` (donc sur
 * Services/Actualités, groupe BlurReveal), `TextEffect` en `secondaire`
 * (À propos/Réalisations/Contact, groupe TextEffect). Le repère (eyebrow),
 * le titre — toujours découpé mot par mot — et le chapo se rejouent à
 * chaque entrée dans le viewport (voir `blur-reveal.tsx` / `EffetTexte.tsx`).
 */
export function EnTetePage({
  repere,
  titre,
  chapo,
  variante = 'principale',
}: {
  repere: string;
  titre: string;
  chapo: string;
  variante?: 'principale' | 'secondaire';
}) {
  return (
    <section
      className={cn(
        'relative isolate overflow-hidden pb-14 pt-32 sm:pb-20 sm:pt-40',
        variante === 'principale' ? 'bg-white' : 'gradient-core-glow',
      )}
    >
      {variante === 'principale' && <FondMeshDrift />}
      <div className="shell">
        {variante === 'principale' ? (
          <BlurReveal>
            <p className="flex items-center gap-3 font-display text-rail font-bold uppercase text-encre-500">
              <span className="chiffre-tabulaire">{repere}</span>
              <span className="h-px w-10 bg-sarcelle-600" />
            </p>
          </BlurReveal>
        ) : (
          <div className="flex items-center gap-3">
            <EffetTexte
              as="span"
              variante="amorce"
              className="chiffre-tabulaire font-display text-rail font-bold uppercase text-encre-500"
            >
              {repere}
            </EffetTexte>
            <span className="h-px w-10 bg-sarcelle-600" />
          </div>
        )}

        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          {/*
            Deux contraintes de largeur, à deux niveaux, pour une bonne raison :
            - sur ce conteneur, une largeur en % du flex-row, qui ne dépend
              d'aucune taille de police ;
            - sur le h1 lui-même, une largeur en « ch », qui doit se résoudre
              contre SA propre (grande) taille de police pour bien faire
              revenir plusieurs mots par ligne.
            Poser le « ch » sur le conteneur plutôt que sur le titre était
            justement la cause du bug : hérité d'une police ambiante beaucoup
            plus petite, il donnait une largeur minuscule, et chaque mot du
            titre finissait seul sur sa ligne.
          */}
          <div className="lg:max-w-[64%]">
            {variante === 'principale' ? (
              <BlurRevealTitre
                texte={titre}
                as="h1"
                delaiDepart={0.15}
                className="max-w-[26ch] font-display text-display-m font-extrabold text-encre-950"
              />
            ) : (
              <EffetTexte
                as="h1"
                variante="titre"
                delai={0.35}
                className="max-w-[26ch] font-display text-display-m font-extrabold text-encre-950"
              >
                {titre}
              </EffetTexte>
            )}
          </div>
          <div className="lg:max-w-sm lg:pb-2 lg:text-right">
            {variante === 'principale' ? (
              <BlurReveal delay={0.55} className="block">
                <p className="text-base font-light leading-relaxed text-encre-700">{chapo}</p>
              </BlurReveal>
            ) : (
              <EffetTexte
                as="p"
                variante="corps"
                delai={0.7}
                className="text-base font-light leading-relaxed text-encre-700"
              >
                {chapo}
              </EffetTexte>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
