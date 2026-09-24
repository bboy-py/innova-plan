import type { Service } from '@/types';
import { media } from './media';

export const services: Service[] = [
  {
    id: 'svc-structures',
    slug: 'conception-etudes-structures',
    titre: 'Conception & Études de Structures',
    accroche: 'Dimensionner l\u2019ossature avant que le premier mètre cube de béton ne soit coulé.',
    description: [
      'Calculs d\u2019ingénierie avancés pour dimensionner les ossatures de bâtiments, les ponts et les ouvrages d\u2019art. Nous modélisons le comportement mécanique de la structure face aux charges d\u2019exploitation, aux séismes et aux contraintes climatiques.',
      'La modélisation BIM permet de détecter les conflits entre lots dès la phase de dessin : une poutre qui traverse une gaine technique se voit à l\u2019écran, pas sur le chantier.',
    ],
    clients: ['Promoteurs immobiliers', 'Collectivités territoriales', 'Entreprises de BTP'],
    technologies: ['AutoCAD 2D/3D', 'Revit Structure', 'Robot Structural Analysis', 'ETABS'],
    image: { src: media.charpenteMetallique, alt: 'Charpente métallique en cours de montage sur un chantier' },
  },
  {
    id: 'svc-geotechnique',
    slug: 'geotechnique-etudes-sols',
    titre: 'Géotechnique & Études de Sols',
    accroche: 'Lire le terrain avant de lui confier une charge.',
    description: [
      'Campagnes de sondages géotechniques pour déterminer la portance du terrain et définir le type de fondation adapté : semelles semi-profondes, pieux ou radier général.',
      'Expertise des glissements de terrain, soutènement de fouilles et prévention des désordres sur les bâtiments existants en mitoyenneté.',
    ],
    clients: ['Particuliers', 'Promoteurs immobiliers', 'Industriels'],
    technologies: ['Plaxis 2D', 'GeoStudio', 'Pressiomètres', 'Pénétromètres dynamiques'],
    image: { src: media.terrassement, alt: 'Engin de terrassement sur une fouille de fondation' },
  },
  {
    id: 'svc-maitrise-oeuvre',
    slug: 'maitrise-oeuvre-gestion-chantier',
    titre: 'Maîtrise d\u2019Œuvre & Gestion de Chantier',
    accroche: 'Un seul interlocuteur, de la première pierre à la réception.',
    description: [
      'Suivi technique et financier du chantier : sélection des entreprises exécutantes, contrôle qualité des matériaux, respect de la planification et des budgets validés.',
      'Comptes rendus de visite hebdomadaires, relevés photographiques par drone et validation des situations de travaux avant paiement.',
    ],
    clients: ['Particuliers', 'PME', 'Investisseurs privés'],
    technologies: ['MS Project', 'Primavera P6', 'Drones d\u2019inspection DJI', 'BatiScript'],
    image: { src: media.equipeTerrain, alt: 'Deux ingénieurs consultant des plans sur un chantier' },
  },
];
