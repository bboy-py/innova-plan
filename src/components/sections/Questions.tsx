import { Accordeon, type EntreeFaq } from '@/components/ui/Accordeon';
import { TitreSection } from '@/components/ui/TitreSection';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { FondMeshDrift } from '@/components/ui/fonds-page';

const questions: EntreeFaq[] = [
  {
    question: 'À quel moment faut-il faire intervenir un bureau d\u2019études ?',
    reponse:
      'Le plus tôt possible, idéalement avant l\u2019achat du terrain ou dès l\u2019esquisse architecturale. Une étude de sol réalisée en amont oriente le choix des fondations, et donc une part importante du budget gros œuvre. Intervenir après le dépôt du permis revient souvent à corriger des choix déjà figés.',
  },
  {
    question: 'Une étude de sol est-elle vraiment obligatoire pour une maison individuelle ?',
    reponse:
      'Elle n\u2019est pas systématiquement imposée, mais sur le littoral camerounais — sols argileux, nappes hautes, remblais anciens — elle reste le poste le plus rentable d\u2019un budget de construction. Une campagne de sondages coûte une fraction de ce que coûte la reprise en sous-œuvre d\u2019une maison fissurée.',
  },
  {
    question: 'Quels documents dois-je fournir pour obtenir un devis ?',
    reponse:
      'Un plan de masse ou un plan architectural même provisoire, la localisation exacte du terrain, et si vous en disposez, un rapport de sol existant. À défaut, une simple description du projet et sa surface nous suffisent pour établir une première estimation d\u2019honoraires.',
  },
  {
    question: 'Travaillez-vous en dehors de Douala ?',
    reponse:
      'Oui. Nous suivons des chantiers sur l\u2019ensemble du Littoral, du Sud et du Centre — le pont Aura a été conduit à Kribi. Les déplacements et la fréquence des visites de chantier sont chiffrés dans le contrat de mission.',
  },
  {
    question: 'Que couvre exactement une mission de maîtrise d\u2019œuvre ?',
    reponse:
      'La sélection des entreprises exécutantes, le contrôle qualité des matériaux, la vérification de l\u2019avancement, la validation des situations de travaux avant paiement, et la conduite des opérations de réception. Vous gardez la décision ; nous portons le contrôle technique et le calendrier.',
  },
  {
    question: 'Que remettez-vous à la fin d\u2019une étude de structure ?',
    reponse:
      'Une note de calcul justifiant les dimensionnements, les plans de coffrage et de ferraillage, les nomenclatures d\u2019aciers, et le cas échéant la maquette BIM. L\u2019ensemble est directement exploitable par l\u2019entreprise et opposable au bureau de contrôle.',
  },
];

/** FAQ détaillée en accordéon. */
export function Questions() {
  return (
    <section className="relative isolate overflow-hidden bg-white py-section">
      <FondMeshDrift />
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <TitreSection repere="05" intitule="Questions fréquentes" />
          <BlurReveal className="mt-10 block max-w-[14ch]">
            <h2 className="font-display text-display-m font-extrabold text-encre-950">
              Ce que les maîtres d&apos;ouvrage nous demandent.
            </h2>
          </BlurReveal>
        </div>
        <div className="lg:col-span-8">
          <Accordeon entrees={questions} />
        </div>
      </div>
    </section>
  );
}
