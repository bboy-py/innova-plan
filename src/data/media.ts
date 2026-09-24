/**
 * POINT UNIQUE DE REMPLACEMENT DES VISUELS
 * ---------------------------------------------------------------
 * Tous les visuels du site passent par ce fichier. Ce sont des photos
 * libres de droits (Unsplash) qui tiennent lieu de placeholders.
 * Pour basculer sur les vraies photos de chantier Innova Plan :
 * déposer les fichiers dans /public/images et remplacer les URL ci-dessous
 * par des chemins locaux ('/images/le-crystal-01.jpg'). Aucun autre
 * fichier du projet n'a besoin d'être touché.
 */
const unsplash = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${w}`;

export const media = {
  heroChantier: unsplash('1541888946425-d81bb19240f5', 2400),
  heroGrue: unsplash('1599995903128-531fc7fb694b', 2400),
  heroStructure: unsplash('1531834685032-c34bf0d84c77', 2400),
  ossatureBeton: unsplash('1508450859948-4e04fabaa4ea'),
  grueContrePlongee: unsplash('1535732759880-bbd5c7265e3f'),
  equipeTerrain: unsplash('1504307651254-35680f356dfd'),
  ingenieurCasque: unsplash('1589939705384-5185137a7f0f'),
  tourEnConstruction: unsplash('1565008447742-97f6f38c985c'),
  coucherChantier: unsplash('1579847188804-ecba0e2ea330'),
  gruesSkyline: unsplash('1485083269755-a7b559a4fe5e'),
  charpenteMetallique: unsplash('1587582423116-ec07293f0395'),
  grueJaune: unsplash('1599707254554-027aeb4deacd'),
  gruesToit: unsplash('1429497419816-9ca5cfb4571a'),
  grueMonochrome: unsplash('1591955506264-3f5a6834570a'),
  pontBeton: unsplash('1615117156039-6a27220d7382'),
  pontContrePlongee: unsplash('1559843788-693858bf7338'),
  pontTravaux: unsplash('1759849556089-b5789046530b'),
  pontMer: unsplash('1633363961301-4f100a78e92d'),
  pontPile: unsplash('1565677375514-80207e0d04f1'),
  grueEau: unsplash('1670912461796-81819c1e525b'),
  terrassement: unsplash('1603287696448-61d5b81cb720'),
  ouvrageAcier: unsplash('1645392686314-8822f1e2a4ae'),
  casqueChantier: unsplash('1567954970774-58d6aa6c50dc'),
} as const;

export type CleMedia = keyof typeof media;
