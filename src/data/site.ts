import { media } from './media';

/** Informations d'entreprise utilisées dans le header, le footer et la page contact. */
export const site = {
  nom: 'Innova Plan',
  formeJuridique: 'SARL',
  baseline: 'Bâtir l\u2019avenir avec précision et innovation',
  description:
    'Bureau d\u2019études en génie civil à Douala : conception de structures, géotechnique et maîtrise d\u2019œuvre, appuyés par la modélisation BIM.',
  url: 'https://www.innovaplan.com',
  adresse: {
    rue: 'Boulevard de la Liberté',
    quartier: 'Akwa',
    ville: 'Douala',
    pays: 'Cameroun',
    complet: 'Boulevard de la Liberté, Akwa, Douala, Cameroun',
    coordonnees: { lat: 4.0511, lng: 9.7085 },
  },
  telephones: ['+237 6 90 00 11 22', '+237 6 70 33 44 55'],
  emails: { general: 'contact@innovaplan.com', technique: 'support@innovaplan.com' },
  reseaux: [
    { nom: 'LinkedIn', url: 'https://linkedin.com/company/innova-plan-engineering' },
    { nom: 'Facebook', url: 'https://facebook.com/innovaplan.btp' },
    { nom: 'Instagram', url: 'https://instagram.com/innovaplan_ing' },
  ],
  mentions: { rccm: 'RC/DLA/2024/B/1842', niu: 'M052418932011P' },
  horaires: 'Lundi – Vendredi, 8h00 – 17h30',
};

/**
 * Navigation principale.
 * `apercu` alimente la vignette affichée dans le panneau de menu au survol
 * d'une entrée (desktop uniquement) ; `resume` sert de légende à cette vignette.
 */
export const navigation = [
  {
    label: 'Accueil',
    href: '/',
    index: '01',
    resume: 'Le bureau d\u2019études en un coup d\u2019œil',
    apercu: media.heroChantier,
  },
  {
    label: 'À propos',
    href: '/a-propos',
    index: '02',
    resume: 'Genèse, vision et les trois associés',
    apercu: media.equipeTerrain,
  },
  {
    label: 'Services',
    href: '/services',
    index: '03',
    resume: 'Structures, géotechnique, maîtrise d\u2019œuvre',
    apercu: media.charpenteMetallique,
  },
  {
    label: 'Réalisations',
    href: '/realisations',
    index: '04',
    resume: 'Les ouvrages livrés et leurs contraintes',
    apercu: media.pontBeton,
  },
  {
    label: 'Actualités',
    href: '/blog',
    index: '05',
    resume: 'Notes techniques et retours de chantier',
    apercu: media.gruesToit,
  },
  {
    label: 'Contact',
    href: '/contact',
    index: '06',
    resume: 'Cinq questions, réponse sous 48 heures',
    apercu: media.casqueChantier,
  },
];

/** Partenaires et donneurs d'ordre affichés dans le bandeau défilant. */
export const partenaires = [
  'SOGELIM',
  'Kribi Beach Resort',
  'Communauté Urbaine de Douala',
  'BATIMEX CMR',
  'Ordre National des Ingénieurs',
  'CIMENCAM',
  'Groupe MANSA',
  'AXIS Promotion',
];

export const certifications = [
  {
    sigle: 'ONIGC',
    titre: 'Ordre National des Ingénieurs de Génie Civil',
    detail: 'Inscription au Tableau de l\u2019Ordre — les trois associés sont ingénieurs inscrits.',
  },
  {
    sigle: 'EC',
    titre: 'Eurocodes',
    detail: 'Certification de conformité aux normes européennes de calcul des structures.',
  },
  {
    sigle: 'BAEL 91',
    titre: 'Béton armé aux états limites',
    detail: 'Dimensionnement conforme aux règles BAEL 91 révisées.',
  },
];
