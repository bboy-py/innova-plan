import type { Metadata } from 'next';
import { EnTetePage } from '@/components/sections/EnTetePage';
import { GrilleProjets } from '@/components/sections/GrilleProjets';
import { AppelAction } from '@/components/sections/AppelAction';

export const metadata: Metadata = {
  title: 'Réalisations',
  description:
    'Les ouvrages conçus et suivis par Innova Plan : immeuble tertiaire Le Crystal à Douala, pont d\u2019accès Aura à Kribi.',
};

export default function Realisations() {
  return (
    <>
      <EnTetePage
        repere="04"
        titre="Chaque ouvrage a commencé par une contrainte."
        chapo="Nappe phréatique affleurante, mitoyennetés anciennes, milieu marin corrosif : voici les chantiers que nous avons conduits, et la manière dont ces difficultés ont été traitées."
        variante="secondaire"
      />
      <section className="gradient-core-glow">
        <GrilleProjets />
      </section>
      <AppelAction
        titre="Votre chantier a une contrainte que personne ne veut traiter ?"
        texte="C'est en général là que nous sommes utiles. Envoyez-nous le dossier, nous vous dirons si c'est faisable et à quelles conditions."
        variante="secondaire"
      />
    </>
  );
}
