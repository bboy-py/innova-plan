import type { Metadata } from 'next';
import { EnTetePage } from '@/components/sections/EnTetePage';
import { RecitDefilant, type EtapeRecit } from '@/components/sections/RecitDefilant';
import { Equipe } from '@/components/sections/Equipe';
import { Certifications } from '@/components/sections/Certifications';
import { AppelAction } from '@/components/sections/AppelAction';
import { TitreSection } from '@/components/ui/TitreSection';
import { media } from '@/data/media';
// (aucun import de fond ici : la section « Récit » utilise directement la
// classe utilitaire `gradient-core-glow`, Shader 3 étant du CSS pur)

export const metadata: Metadata = {
  title: 'À propos',
  description:
    'Genèse, vision et mission d\u2019Innova Plan, bureau d\u2019études en génie civil fondé par trois ingénieurs à Douala.',
};

const etapes: EtapeRecit[] = [
  {
    repere: '01',
    titre: 'Genèse',
    texte:
      'Innova Plan a été fondée par trois jeunes ingénieurs diplômés, passionnés par la modernisation des infrastructures. Le constat de départ est simple : la rigueur du calcul traditionnel et les outils technologiques de pointe ne s\u2019opposent pas, ils se complètent. C\u2019est de leur alliance que viennent les gains réels sur les coûts et les délais.',
    image: { src: media.equipeTerrain, alt: 'Deux ingénieurs échangeant sur un chantier' },
  },
  {
    repere: '02',
    titre: 'Vision',
    texte:
      'Devenir, à cinq ou dix ans, la référence régionale en ingénierie civile durable et numérisée. Cela suppose d\u2019intégrer systématiquement la modélisation 3D (BIM) à nos missions et de proposer des solutions à faible empreinte carbone sur chaque ouvrage, pas seulement sur ceux qui l\u2019exigent.',
    image: { src: media.gruesSkyline, alt: 'Grues et immeubles en construction au-dessus d\u2019une ville' },
  },
  {
    repere: '03',
    titre: 'Mission',
    texte:
      'Offrir aux maîtres d\u2019ouvrage une tranquillité d\u2019esprit totale : des études de structure ultra-précises, un suivi rigoureux du chantier et un respect strict des normes de sécurité internationales. Concrètement, aucune décision technique n\u2019est prise sans être justifiée par écrit.',
    image: { src: media.charpenteMetallique, alt: 'Ouvrier sur une charpente métallique' },
  },
];

export default function APropos() {
  return (
    <>
      <EnTetePage
        repere="02"
        titre="Une jeune structure, une méthode déjà éprouvée."
        chapo="Innova Plan réunit trois ingénieurs associés autour d'une conviction : un ouvrage bien calculé se construit sans surprise. Voici d'où nous venons, où nous allons, et ce que nous nous engageons à tenir."
        variante="secondaire"
      />

      <section className="gradient-core-glow">
        <div className="shell pt-section">
          <TitreSection repere="03" intitule="Genèse, vision, mission" variante="secondaire" />
        </div>
        <RecitDefilant etapes={etapes} />
      </section>

      <Equipe />
      <Certifications />
      <AppelAction
        titre="Travaillons sur votre prochain ouvrage."
        texte="Que le projet soit au stade de l'idée ou du permis déposé, nous pouvons en discuter et vous dire franchement ce qu'il implique techniquement."
        variante="secondaire"
      />
    </>
  );
}
