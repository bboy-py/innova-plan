'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { site } from '@/data/site';

const lienMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  site.adresse.complet,
)}`;

/**
 * Plan de situation schématique.
 * Dessiné en SVG plutôt qu'intégré via une iframe Google Maps : pas de clé API,
 * pas de script tiers, pas de cookie, et un rendu cohérent avec la charte.
 * Le bouton renvoie vers Google Maps pour l'itinéraire réel.
 */
export function CarteLocalisation() {
  const reduit = useReducedMotion();

  return (
    <div className="relative isolate overflow-hidden bg-encre-950">
      {/*
        Shader 4 (Background Paths) : compromis assumé. Le plan ci-dessous est
        un unique <svg> avec un rectangle de fond opaque (#0A0A0A) — posé
        strictement "derrière" (z-index négatif) comme sur les autres sections
        à fond noir, Background Paths serait donc invisible, entièrement
        recouvert. Il est ici superposé AU-DESSUS du plan à très faible
        opacité, en `mix-blend-screen` (qui n'éclaircit que les zones sombres,
        sans jamais assombrir) : les routes et le texte du plan, déjà clairs,
        restent lisibles, et le bandeau d'info repasse en z-10 pour rester
        cliquable au-dessus de cette couche.
      */}
      {!reduit && <BackgroundPaths className="absolute inset-0 z-[1] opacity-[0.14] mix-blend-screen" />}
      <svg viewBox="0 0 800 520" className="relative h-full w-full" role="img" aria-label="Plan de situation du bureau à Akwa, Douala">
        <defs>
          <pattern id="trame" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          </pattern>
        </defs>

        <rect width="800" height="520" fill="#0A0A0A" />
        <rect width="800" height="520" fill="url(#trame)" />

        {/* Le Wouri : masse d'eau au sud-ouest du quartier Akwa */}
        <path
          d="M0 400 C 120 380, 220 430, 330 455 C 450 482, 600 470, 800 500 L800 520 L0 520 Z"
          fill="#171717"
          stroke="rgba(255,255,255,0.18)"
        />
        <text x="60" y="495" fill="rgba(255,255,255,0.45)" fontSize="13" fontFamily="system-ui">
          Fleuve Wouri
        </text>

        {/* Trame viaire simplifiée */}
        <g stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" fill="none">
          <path d="M-20 300 L820 230" />
          <path d="M-20 170 L820 120" />
          <path d="M240 -20 L330 540" />
          <path d="M540 -20 L590 540" />
        </g>
        <g stroke="rgba(13,148,136,0.75)" strokeWidth="3" fill="none">
          <path d="M-20 250 L820 185" />
        </g>
        <text x="600" y="175" fill="rgba(95,221,208,0.9)" fontSize="13" fontFamily="system-ui">
          Boulevard de la Liberté
        </text>
        <text x="270" y="90" fill="rgba(255,255,255,0.45)" fontSize="13" fontFamily="system-ui">
          Akwa
        </text>
        <text x="90" y="350" fill="rgba(255,255,255,0.45)" fontSize="13" fontFamily="system-ui">
          Bonanjo
        </text>

        {/* Repère du bureau, avec impulsion continue */}
        <g transform="translate(400 224)">
          {!reduit && (
            <motion.circle
              r="12"
              fill="none"
              stroke="#0D9488"
              animate={{ r: [12, 34], opacity: [0.85, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
            />
          )}
          <circle r="7" fill="#0D9488" />
          <path d="M0 -26 V26 M-26 0 H26" stroke="#0D9488" strokeWidth="1" opacity="0.7" />
        </g>
        <text x="424" y="218" fill="#FFFFFF" fontSize="15" fontWeight="700" fontFamily="system-ui">
          Innova Plan
        </text>
        <text x="424" y="240" fill="rgba(255,255,255,0.65)" fontSize="13" fontFamily="system-ui">
          Bureau d&apos;études
        </text>
      </svg>

      <div className="absolute bottom-6 left-6 right-6 z-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-rail font-bold uppercase text-white/60">Plan de situation</p>
          <p className="mt-2 max-w-[28ch] text-sm text-white">{site.adresse.complet}</p>
        </div>
        <a
          href={lienMaps}
          target="_blank"
          rel="noreferrer"
          className="border border-white/35 px-5 py-3 font-display text-sm font-bold text-white transition-colors hover:border-white hover:bg-white hover:text-encre-950"
        >
          Ouvrir dans Google Maps
        </a>
      </div>
    </div>
  );
}
