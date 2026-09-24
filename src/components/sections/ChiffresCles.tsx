import { Compteur } from '@/components/ui/Compteur';
import { TitreSection } from '@/components/ui/TitreSection';
import { FondBeams } from '@/components/ui/fonds-page';
import { chiffresCles } from '@/data/projects';

/** Bandeau de chiffres clés : les compteurs démarrent à l'entrée dans le viewport. */
export function ChiffresCles() {
  return (
    <section className="relative isolate overflow-hidden bg-encre-950 py-section">
      <FondBeams />
      <div className="shell">
        <TitreSection repere="03" intitule="Chiffres clés" ton="sombre" />
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {chiffresCles.map((c) => (
            <Compteur
              key={c.label}
              valeur={c.valeur}
              suffixe={c.suffixe}
              label={c.label}
              precision={c.precision}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
