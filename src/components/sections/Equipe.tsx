import { Apparition } from '@/components/ui/Apparition';
import { EffetTexte } from '@/components/ui/EffetTexte';
import { TitreSection } from '@/components/ui/TitreSection';
import { equipe } from '@/data/team';

/**
 * Les trois associés.
 * Les portraits officiels n'étant pas encore disponibles, chaque fiche affiche
 * un monogramme dessiné dans la charte. Le jour où les photos arrivent,
 * il suffit d'ajouter un champ `photo` au type MembreEquipe et de remplacer ce bloc.
 *
 * Prompt H (menu SlideTabs + Image Reveal) demandait d'appliquer l'effet
 * ImageHover à ces portraits : volontairement pas fait ici tant qu'il n'y a
 * pas de vraie photo. Il n'y a rien à « révéler » sous un flou sur un bloc
 * qui annonce déjà lui-même « Portrait à venir » — appliquer l'effet
 * aujourd'hui reviendrait à flouter une image qui n'existe pas. Dès qu'un
 * `membre.photo` sera disponible et remplacera ce bloc par une véritable
 * <Image>, l'ajouter avec `<ImageHover src={membre.photo} .../>` (voir
 * `@/components/ui/image-reveal`) pour rester cohérent avec la galerie
 * avant/pendant/après et les autres images sans lien du site.
 */
export function Equipe() {
  return (
    <section className="gradient-core-glow py-section">
      <div className="shell">
        <TitreSection repere="04" intitule="Les associés" variante="secondaire" />
        <EffetTexte
          as="h2"
          variante="titre"
          className="mt-10 block max-w-[22ch] font-display text-display-m font-extrabold text-encre-950"
        >
          Trois signatures au bas de chaque note de calcul.
        </EffetTexte>

        <ul className="mt-16 grid gap-10 md:grid-cols-3">
          {equipe.map((membre, i) => (
            <Apparition as="li" key={membre.id} delai={i * 0.1}>
              <div className="relative flex aspect-[4/5] items-end justify-start overflow-hidden bg-encre-950 p-6">
                {/* Monogramme provisoire, en attendant les portraits */}
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center font-display text-[7rem] font-extrabold text-white/10"
                >
                  {membre.initiales}
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 bg-grille bg-grille opacity-60"
                />
                <span className="relative font-display text-rail font-bold uppercase text-white/60">
                  Portrait à venir
                </span>
              </div>

              <h3 className="mt-6 font-display text-xl font-extrabold text-encre-950">{membre.nom}</h3>
              <p className="mt-2 text-sm font-medium text-encre-700">{membre.role}</p>
              <div className="mt-4 h-px w-10 bg-sarcelle-600" />
              <p className="mt-4 text-[0.95rem] leading-relaxed text-encre-700">{membre.bio}</p>
              <p className="mt-4 text-sm text-encre-500">
                {membre.formation} — {membre.experience}
              </p>
            </Apparition>
          ))}
        </ul>
      </div>
    </section>
  );
}
