import type { Projet, CategorieProjet } from '@/types';
import { media } from './media';

/**
 * Deux réalisations livrées. La structure est prête à en accueillir davantage :
 * la grille, les filtres et les pages de détail sont générés à partir de ce tableau.
 */
export const projets: Projet[] = [
  {
    id: 'prj-crystal',
    slug: 'immeuble-le-crystal',
    titre: 'Immeuble Tertiaire « Le Crystal »',
    categorie: 'Commercial / Bureau',
    localisation: 'Bonanjo, Douala',
    debut: '2025-01',
    fin: '2025-12',
    periodeLabel: 'Janvier 2025 – Décembre 2025',
    role: 'Étude de structure complète & Maîtrise d\u2019œuvre',
    description:
      'Construction d\u2019un bâtiment commercial moderne de 2 500 m² sur six étages, abritant des bureaux, un parking souterrain et une terrasse aménagée.',
    defi:
      'Nappe phréatique très élevée et sol marécageux. Il fallait descendre les fondations sans déstabiliser les bâtiments mitoyens anciens, ni noyer le sous-sol.',
    solution:
      'Enceinte de soutènement en parois moulées, combinée à un radier général nervuré en béton armé hydrofuge garantissant l\u2019étanchéité totale du sous-sol.',
    ficheTechnique: [
      { label: 'Surface construite', valeur: '2 500 m²' },
      { label: 'Niveaux', valeur: '6 étages + 1 sous-sol' },
      { label: 'Système de fondation', valeur: 'Radier général nervuré' },
      { label: 'Soutènement', valeur: 'Parois moulées' },
      { label: 'Durée de chantier', valeur: '12 mois' },
      { label: 'Normes appliquées', valeur: 'Eurocodes 2 & 7, BAEL 91' },
    ],
    couverture: {
      src: media.tourEnConstruction,
      alt: 'Immeuble de bureaux en construction sous un ciel nuageux',
      phase: 'apres',
    },
    images: [
      { src: media.terrassement, alt: 'Terrassement et fouille de fondation', phase: 'avant', legende: 'Ouverture de la fouille et mise en place des parois moulées' },
      { src: media.ossatureBeton, alt: 'Ossature béton en cours d\u2019élévation', phase: 'pendant', legende: 'Élévation de l\u2019ossature béton armé, niveau R+3' },
      { src: media.grueContrePlongee, alt: 'Grue à tour vue en contre-plongée', phase: 'pendant', legende: 'Levage des prédalles depuis la grue à tour' },
      { src: media.tourEnConstruction, alt: 'Bâtiment livré', phase: 'apres', legende: 'Façade achevée avant réception' },
    ],
    temoignage: {
      citation:
        'L\u2019équipe d\u2019Innova Plan a su gérer les contraintes de notre terrain difficile avec un grand professionnalisme. Bâtiment livré à la date prévue.',
      auteur: 'M. Alain FOKAM',
      fonction: 'Directeur Général, SOGELIM',
      projetSlug: 'immeuble-le-crystal',
    },
    miseEnAvant: true,
  },
  {
    id: 'prj-aura',
    slug: 'pont-acces-aura',
    titre: 'Pont d\u2019Accès Résidentiel « Aura »',
    categorie: 'Infrastructure / Ouvrage d\u2019art',
    localisation: 'Kribi, Région du Sud',
    debut: '2026-02',
    fin: '2026-06',
    periodeLabel: 'Février 2026 – Juin 2026',
    role: 'Conception géotechnique & Suivi des travaux',
    description:
      'Franchissement d\u2019un cours d\u2019eau de 18 mètres de portée pour désenclaver un complexe hôtelier en bord de mer.',
    defi:
      'Milieu marin corrosif et fortes crues saisonnières, avec un risque réel d\u2019affouillement des culées.',
    solution:
      'Culées en béton précontraint, enrochement de protection au droit des appuis et revêtement anti-carbonatation résistant à la salinité.',
    ficheTechnique: [
      { label: 'Portée', valeur: '18,00 m' },
      { label: 'Type d\u2019ouvrage', valeur: 'Pont-dalle en béton précontraint' },
      { label: 'Appuis', valeur: 'Culées massives sur semelles' },
      { label: 'Protection', valeur: 'Enrochement + anti-carbonatation' },
      { label: 'Durée de chantier', valeur: '5 mois' },
      { label: 'Normes appliquées', valeur: 'Eurocodes 2 & 8' },
    ],
    couverture: {
      src: media.pontBeton,
      alt: 'Pont en béton franchissant un cours d\u2019eau',
      phase: 'apres',
    },
    images: [
      { src: media.grueEau, alt: 'Grue installée au bord de l\u2019eau', phase: 'avant', legende: 'Installation des moyens de levage en rive' },
      { src: media.pontTravaux, alt: 'Levage d\u2019un élément de tablier', phase: 'pendant', legende: 'Mise en place du tablier précontraint' },
      { src: media.pontPile, alt: 'Pile de pont vue en contre-plongée', phase: 'pendant', legende: 'Culée coulée et enrochement de protection' },
      { src: media.pontBeton, alt: 'Ouvrage terminé', phase: 'apres', legende: 'Ouvrage ouvert à la circulation' },
    ],
    temoignage: {
      citation:
        'Un ouvrage solide et parfaitement intégré à l\u2019environnement marin. Travail exemplaire.',
      auteur: 'Direction du Resort Kribi Beach',
      fonction: 'Maître d\u2019ouvrage',
      projetSlug: 'pont-acces-aura',
    },
    miseEnAvant: true,
  },
];

/** Catégories proposées au filtre — figées pour rester stables quand la base grandira. */
export const categoriesProjets: CategorieProjet[] = [
  'Commercial / Bureau',
  'Infrastructure / Ouvrage d\u2019art',
  'Résidentiel',
  'Audit technique',
];

export const getProjet = (slug: string) => projets.find((p) => p.slug === slug);

export const chiffresCles = [
  { valeur: 32, label: 'projets réalisés', precision: 'Études et chantiers livrés depuis la création' },
  { valeur: 8, label: 'ans d\u2019expertise cumulée', precision: 'Trois ingénieurs, terrain et bureau d\u2019études' },
  { valeur: 100, suffixe: '%', label: 'délais respectés', precision: 'Sur l\u2019ensemble des chantiers réceptionnés' },
  { valeur: 14, label: 'communes couvertes', precision: 'Littoral, Sud et Centre du Cameroun' },
];
