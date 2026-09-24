import Link from 'next/link';
import { Apparition } from '@/components/ui/Apparition';
import { ApparitionVisuel } from '@/components/ui/ApparitionVisuel';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { TitreSection } from '@/components/ui/TitreSection';
import { ImageParallax } from '@/components/ui/ImageParallax';
import { FondMeshDrift } from '@/components/ui/fonds-page';
import { media } from '@/data/media';

/**
 * Accroche de la section « 01 Bureau d'études ».
 *
 * Trois propositions ont été rédigées pour ce remplacement (rigueur technique
 * + vision moderne du génie civil, ton court et percutant) :
 *   1. « L'exigence du calcul, la vitesse du numérique. »   ← retenue
 *   2. « Trois ingénieurs. Un seul principe : calculer avant de construire. »
 *   3. « Le génie civil, pensé avant d'être coulé. »
 *
 * La première a été retenue : structure en deux temps équilibrés, sans
 * jargon, qui pose la rigueur du calcul et la modernité des outils sur un
 * pied d'égalité — exactement la double promesse d'Innova Plan — dans une
 * cadence courte, éditoriale, cohérente avec le reste du site.
 */
const accroche = 'L\u2019exigence du calcul, la vitesse du numérique.';

const principes = [
  {
    titre: 'Le calcul avant le béton',
    texte:
      'Chaque ouvrage est dimensionné, vérifié et justifié par une note de calcul défendable devant un bureau de contrôle.',
  },
  {
    titre: 'La maquette avant le coffrage',
    texte:
      'La modélisation BIM met en évidence les conflits entre lots pendant la conception, quand les corriger ne coûte encore rien.',
  },
  {
    titre: 'Le terrain avant la promesse',
    texte:
      'Aucune fondation n\u2019est proposée sans campagne de sondages. La portance du sol décide, pas le calendrier commercial.',
  },
];

export function Presentation() {
  return (
    <section className="relative isolate overflow-hidden bg-brume py-section">
      <FondMeshDrift />
      <div className="shell">
        <TitreSection repere="01" intitule="Le bureau d'études" />

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <BlurReveal className="block">
              <h2 className="max-w-[20ch] font-display text-display-m font-extrabold text-encre-950">
                {accroche}
              </h2>
            </BlurReveal>

            <BlurReveal delay={0.25} className="mt-8 block max-w-prose">
              <p className="text-lg font-light leading-relaxed text-encre-700">
                Innova Plan est né du constat qu&apos;un ouvrage réussi tient à deux choses : la rigueur
                du calcul traditionnel et les outils qui permettent de la vérifier vite. Nous
                intervenons sur les études de structures, la géotechnique et la conduite de travaux,
                de Douala à Kribi.
              </p>
            </BlurReveal>

            <Apparition delai={0.18}>
              {/* Le soulignement fin reste la seule touche de couleur de marque de ce bloc */}
              <Link
                href="/a-propos"
                className="mt-8 inline-block border-b border-sarcelle-600 pb-1 font-display text-sm font-bold text-encre-950 transition-colors hover:text-encre-600"
              >
                Découvrir notre histoire
              </Link>
            </Apparition>
          </div>

          <div className="lg:col-span-5">
            {/* Décalage volontaire par rapport au texte : l'image « prend sa place » un instant après */}
            <ApparitionVisuel delai={0.16}>
              <ImageParallax
                src={media.ingenieurCasque}
                alt="Ingénieur équipé sur un chantier"
                className="aspect-[4/5] w-full"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </ApparitionVisuel>
          </div>
        </div>

        <ul className="mt-20 grid gap-px border-t border-black/10 sm:grid-cols-3">
          {principes.map((p, i) => (
            <Apparition as="li" key={p.titre} delai={i * 0.1} className="pt-8 sm:pr-8">
              <span className="chiffre-tabulaire font-display text-rail font-bold text-sarcelle-700">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-encre-950">{p.titre}</h3>
              <p className="mt-3 max-w-[38ch] text-[0.95rem] font-light leading-relaxed text-encre-700">
                {p.texte}
              </p>
            </Apparition>
          ))}
        </ul>
      </div>
    </section>
  );
}
