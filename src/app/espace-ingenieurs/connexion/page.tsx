import type { Metadata } from 'next';
import Link from 'next/link';
import { FormulaireConnexion } from '@/components/sections/FormulaireConnexion';
import { ImageParallax } from '@/components/ui/ImageParallax';
import { Marque } from '@/components/layout/Marque';
import { media } from '@/data/media';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Connexion — Espace ingénieurs',
  description: 'Accès réservé aux ingénieurs et collaborateurs habilités d\u2019Innova Plan.',
  // Un écran de connexion n'a rien à faire dans les résultats de recherche
  robots: { index: false, follow: false },
};

export default function Connexion() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Colonne d'identité : visuel de chantier et rappel de la mission */}
      <aside className="relative isolate hidden overflow-hidden bg-encre-950 lg:flex lg:flex-col lg:justify-between">
        <ImageParallax
          src={media.coucherChantier}
          alt=""
          amplitude={6}
          className="absolute inset-0 -z-10 h-full w-full opacity-35"
          sizes="50vw"
        />
        <div className="absolute inset-0 -z-10 bg-grille bg-grille opacity-50" />

        <div className="p-12">
          <Marque ton="sombre" />
        </div>

        <div className="p-12">
          <p className="max-w-[26ch] font-display text-display-s font-extrabold text-white">
            Les dossiers d&apos;études, les comptes rendus et les maquettes, au même endroit.
          </p>
          <p className="mt-6 max-w-[38ch] text-sm font-light leading-relaxed text-white/70">
            Cet espace regroupera les pièces techniques des chantiers en cours. Son contenu est
            confidentiel et couvert par les engagements contractuels signés avec les maîtres
            d&apos;ouvrage.
          </p>
        </div>

        <div className="border-t border-white/10 p-12 py-6">
          <p className="text-xs text-white/60">
            {site.nom}, {site.formeJuridique} — {site.adresse.complet}
          </p>
        </div>
      </aside>

      {/* Colonne de connexion */}
      <div className="flex flex-col bg-brume">
        <div className="flex items-center justify-between px-6 py-6 sm:px-12 lg:justify-end">
          <span className="lg:hidden">
            <Marque />
          </span>
          <Link
            href="/"
            className="font-display text-rail font-bold uppercase text-encre-500 transition-colors hover:text-encre-950"
          >
            Retour au site
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-16 pt-6 sm:px-12">
          <FormulaireConnexion />
        </div>
      </div>
    </div>
  );
}
