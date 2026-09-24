import { BandeauLogos } from '@/components/ui/BandeauLogos';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { FondMeshDrift } from '@/components/ui/fonds-page';
import { partenaires } from '@/data/site';

/** Bandeau défilant des clients et partenaires. */
export function Partenaires() {
  return (
    <section className="relative isolate overflow-hidden border-y border-black/10 bg-white">
      <FondMeshDrift />
      <BlurReveal className="shell block pt-10">
        <p className="font-display text-rail font-semibold uppercase text-encre-500">
          Ils nous confient leurs ouvrages
        </p>
      </BlurReveal>
      <BandeauLogos entrees={partenaires} />
    </section>
  );
}
