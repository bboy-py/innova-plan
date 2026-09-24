'use client';

import { useCompteur } from '@/lib/useCompteur';
import { formatNombre } from '@/lib/utils';

/** Chiffre clé qui s'incrémente à l'entrée dans le viewport. */
export function Compteur({
  valeur,
  suffixe,
  prefixe,
  label,
  precision,
}: {
  valeur: number;
  suffixe?: string;
  prefixe?: string;
  label: string;
  precision?: string;
}) {
  const { ref, valeur: courante } = useCompteur(valeur);

  return (
    <div className="border-t border-white/15 pt-6">
      <span
        ref={ref}
        className="chiffre-tabulaire block font-display text-[clamp(3rem,7vw,5.5rem)] font-extrabold leading-none text-white"
      >
        {prefixe}
        {formatNombre(courante)}
        {suffixe && <span className="text-sarcelle-500">{suffixe}</span>}
      </span>
      <p className="mt-4 font-display text-sm font-bold uppercase tracking-[0.12em] text-white/80">
        {label}
      </p>
      {precision && <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-white/55">{precision}</p>}
    </div>
  );
}
