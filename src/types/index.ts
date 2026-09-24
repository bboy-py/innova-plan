/**
 * Contrats de données du site.
 * Ces types sont volontairement écrits comme s'ils venaient déjà d'une API :
 * en phase 2, il suffira de remplacer les tableaux statiques de /src/data
 * par des appels réseau renvoyant exactement ces formes.
 */

export type CategorieProjet =
  | 'Commercial / Bureau'
  | 'Infrastructure / Ouvrage d\u2019art'
  | 'R\u00e9sidentiel'
  | 'Audit technique';

export interface ImageProjet {
  src: string;
  alt: string;
  /** Étape du chantier : sert à ordonner la galerie avant / pendant / après. */
  phase: 'avant' | 'pendant' | 'apres' | 'rendu-3d';
  legende?: string;
}

export interface Temoignage {
  citation: string;
  auteur: string;
  fonction: string;
  /** Renseigné quand le témoignage est rattaché à un projet précis. */
  projetSlug?: string;
}

export interface Projet {
  id: string;
  slug: string;
  titre: string;
  categorie: CategorieProjet;
  localisation: string;
  /** Format ISO (YYYY-MM) pour pouvoir trier sans parser du texte. */
  debut: string;
  fin: string;
  periodeLabel: string;
  role: string;
  description: string;
  defi: string;
  solution: string;
  ficheTechnique: { label: string; valeur: string }[];
  images: ImageProjet[];
  couverture: ImageProjet;
  temoignage?: Temoignage;
  miseEnAvant: boolean;
}

export interface Service {
  id: string;
  slug: string;
  titre: string;
  accroche: string;
  description: string[];
  clients: string[];
  technologies: string[];
  image: { src: string; alt: string };
}

export interface MembreEquipe {
  id: string;
  nom: string;
  role: string;
  formation: string;
  experience: string;
  bio: string;
  /** Monogramme affiché tant que les portraits officiels ne sont pas fournis. */
  initiales: string;
}

/** Les trois thématiques éditoriales, utilisées telles quelles par le filtre du blog. */
export type CategorieArticle = 'Techniques & Normes' | 'Actualités chantiers' | 'BIM & Innovation';

/**
 * Corps d'article décrit en blocs plutôt qu'en HTML : le rendu reste maîtrisé
 * et le format se transpose directement dans un CMS en phase 2.
 */
export type BlocArticle =
  | { type: 'paragraphe'; texte: string }
  | { type: 'intertitre'; id: string; texte: string }
  | { type: 'liste'; items: string[] }
  | { type: 'citation'; texte: string; source?: string }
  | { type: 'image'; src: string; alt: string; legende: string }
  | { type: 'encadre'; titre: string; texte: string };

export interface Article {
  id: string;
  slug: string;
  titre: string;
  extrait: string;
  categorie: CategorieArticle;
  /** Format ISO (YYYY-MM-DD) pour trier sans parser du texte. */
  date: string;
  dateLabel: string;
  tempsLecture: string;
  auteur: string;
  image: { src: string; alt: string };
  contenu: BlocArticle[];
  /** Slug d'une réalisation à mettre en lien depuis l'article, le cas échéant. */
  projetLie?: string;
}

export interface ChiffreCle {
  valeur: number;
  suffixe?: string;
  prefixe?: string;
  label: string;
  precision: string;
}
