import { Bouton } from '@/components/ui/Bouton';

export default function Introuvable() {
  return (
    <section className="flex min-h-[80vh] items-center bg-encre-950 bg-grille bg-grille">
      <div className="shell py-32">
        <p className="chiffre-tabulaire font-display text-rail font-bold uppercase text-sarcelle-500">
          Erreur 404
        </p>
        <h1 className="mt-6 max-w-[20ch] font-display text-display-m font-extrabold text-white">
          Cette page n&apos;existe pas au plan.
        </h1>
        <p className="mt-6 max-w-prose font-light text-white/75">
          Le lien est peut-être obsolète. Revenez à l&apos;accueil ou consultez directement nos
          réalisations.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Bouton href="/" variante="primaire-inverse">Retour à l&apos;accueil</Bouton>
          <Bouton href="/realisations" variante="contour-clair" icone="realisations">
            Voir les réalisations
          </Bouton>
        </div>
      </div>
    </section>
  );
}
