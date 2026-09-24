import type { Config } from 'tailwindcss';

/**
 * SYSTÈME DE DESIGN INNOVA PLAN — DIRECTION ÉDITORIALE NOIR & BLANC
 * ---------------------------------------------------------------
 * Le site a basculé vers un système achromatique dominant, façon
 * storeyarchitecture.co.uk / apple.com : fond blanc quasi pur, texte
 * noir/anthracite, sections « chapitres » inversées en noir plein.
 *
 *   encre-950   #0A0A0A   Fond des sections inversées, texte le plus sombre
 *   brume       #FAFAFA   Fond des sections claires (neutre, sans dominante bleue)
 *
 * Le bleu saphir et le vert sarcelle de la charte d'origine sont CONSERVÉS
 * dans leurs nuances (aucune valeur supprimée, pour ne rien casser), mais
 * ne sont plus utilisés comme fond ou grand aplat nulle part dans les
 * composants : ils ne servent plus qu'à de très petits détails choisis
 * (un point, un soulignement fin, une icône, un badge de catégorie, l'état
 * de focus). C'est une décision éditoriale prise composant par composant,
 * pas une suppression de la palette.
 *
 * `ardoise-900` (#0F172A) est laissée intacte à dessein : c'est la seule
 * nuance encore utilisée par le Preloader, qui n'a volontairement pas été
 * retouché dans cette passe.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        saphir: {
          50: '#F2F6FB',
          100: '#E2EAF4',
          200: '#C2D2E8',
          300: '#95B0D2',
          400: '#5E80B0',
          500: '#3A5C8E',
          600: '#2A4A78',
          700: '#1A365D', // ← charte
          800: '#152B4A',
          900: '#112038',
          950: '#0B1626',
        },
        sarcelle: {
          50: '#EFFCFA',
          100: '#CCF7F1',
          200: '#99EEE3',
          300: '#5FDDD0',
          400: '#2BC3B6',
          500: '#0D9488', // ← charte
          600: '#0B7C73',
          700: '#0C635C',
          800: '#0D4F4A',
          900: '#0F413E',
        },
        // Réservée au Preloader : voir la note ci-dessus, valeurs héritées inchangées.
        ardoise: {
          100: '#E2E8F0',
          300: '#CBD5E1',
          500: '#64748B',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        /**
         * Encre — le nouveau neutre achromatique dominant : texte de lecture,
         * fonds de section inversés, hairlines. Aucune dominante bleue, à
         * l'inverse d'« ardoise ».
         */
        encre: {
          50: '#F7F7F7',
          100: '#EDEDED',
          200: '#D6D6D6',
          300: '#A8A8A8',
          400: '#7A7A7A',
          500: '#595959',
          600: '#404040',
          700: '#262626',
          800: '#171717',
          900: '#111111',
          950: '#0A0A0A',
        },
        brume: '#FAFAFA', // fond des sections claires — neutre, plus de teinte bleue
        /**
         * Couleur de signalement des formulaires : un ambre sourd, volontairement
         * moins agressif qu'un rouge, et lisible sur fond clair (4,9:1).
         */
        alerte: { DEFAULT: '#B45309', fond: '#FEF6E7' },
      },
      fontFamily: {
        display: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Échelle typographique (ratio ~1.25 en mobile, ~1.33 au-delà)
        'display-xl': ['clamp(2.75rem, 8vw, 6.5rem)', { lineHeight: '0.95', letterSpacing: '-0.035em' }],
        'display-l': ['clamp(2.25rem, 5.5vw, 4.25rem)', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'display-m': ['clamp(1.75rem, 3.5vw, 2.75rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        'display-s': ['clamp(1.35rem, 2.2vw, 1.75rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        rail: ['0.6875rem', { lineHeight: '1', letterSpacing: '0.18em' }],
      },
      maxWidth: { prose: '68ch' },
      spacing: { rail: '4.5rem', section: 'clamp(5rem, 10vw, 9rem)' },
      transitionTimingFunction: {
        // Courbe "instrument" : départ franc, arrivée amortie.
        instrument: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        // Trame technique bleutée : réservée au Preloader (non retouché).
        blueprint:
          'linear-gradient(rgba(148,176,210,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148,176,210,0.07) 1px, transparent 1px)',
        // Même trame, en blanc neutre : utilisée sur toutes les nouvelles
        // sections inversées (elle ne doit rien à la charte bleue d'origine).
        grille:
          'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
      },
      backgroundSize: { blueprint: '72px 72px', grille: '72px 72px' },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      animation: { marquee: 'marquee 38s linear infinite' },
    },
  },
  plugins: [],
};
export default config;
