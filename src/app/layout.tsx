import type { Metadata } from 'next';

import './globals.css';
import { CurseurPersonnalise } from '@/components/layout/CurseurPersonnalise';
import { Entete } from '@/components/layout/Entete';
import { PiedDePage } from '@/components/layout/PiedDePage';
import { Chrome } from '@/components/layout/Chrome';
import { site } from '@/data/site';

// Montserrat porte les titres et les chiffres ; Inter, le texte courant.
const montserrat = { variable: 'font-mont' };

const inter = { variable: 'font-inter' };

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nom} — ${site.baseline}`,
    template: `%s — ${site.nom}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.nom} — ${site.baseline}`,
    description: site.description,
    locale: 'fr_FR',
    type: 'website',
  },
};

/**
 * Racine du site. Aucun écran d'intro à orchestrer : le site charge
 * directement sur le contenu de chaque page — le hero de l'accueil compris.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${inter.variable}`}>
      <body>
        <CurseurPersonnalise />
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[130] focus:bg-sarcelle-700 focus:px-4 focus:py-2 focus:font-display focus:text-sm focus:text-white"
        >
          Aller au contenu
        </a>
        <Chrome entete={<Entete />} pied={<PiedDePage />}>
          {children}
        </Chrome>
      </body>
    </html>
  );
}
