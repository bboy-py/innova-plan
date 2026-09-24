import type { Metadata } from 'next';
import { EnTetePage } from '@/components/sections/EnTetePage';
import { GrilleArticles } from '@/components/sections/GrilleArticles';
import { AppelAction } from '@/components/sections/AppelAction';
import { FondMeshDrift } from '@/components/ui/fonds-page';

export const metadata: Metadata = {
  title: 'Actualités',
  description:
    'Notes techniques, veille normative et retours de chantier de l\u2019équipe Innova Plan : parasismique, BIM, géotechnique et construction durable.',
};

export default function Blog() {
  return (
    <>
      <EnTetePage
        repere="05"
        titre="Ce que le chantier nous apprend, écrit noir sur blanc."
        chapo="Retours d'expérience, méthodes de calcul et veille normative, rédigés par les ingénieurs qui ont conduit les opérations."
        variante="principale"
      />

      <section className="relative isolate overflow-hidden bg-brume">
        <FondMeshDrift />
        <GrilleArticles />
      </section>

      <AppelAction
        titre="Une question technique précise ?"
        texte="Nous répondons volontiers, même hors mission. Décrivez la situation et nous vous dirons ce que nous en pensons."
        variante="principale"
      />
    </>
  );
}
