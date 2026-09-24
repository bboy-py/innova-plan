import type { Article, CategorieArticle } from '@/types';
import { media } from './media';

/** Thématiques proposées au filtre du blog. */
export const categoriesArticles: CategorieArticle[] = [
  'Techniques & Normes',
  'Actualités chantiers',
  'BIM & Innovation',
];

/**
 * Contenus de démonstration.
 * Le corps de chaque article est décrit en blocs (`contenu`) : la page de
 * détail les rend sans interprétation de HTML, et le CMS de la phase 2
 * n'aura qu'à produire le même format.
 */
export const articles: Article[] = [
  {
    id: 'art-parasismique',
    slug: 'normes-parasismiques-zone-tropicale',
    titre: 'Les nouvelles normes de construction parasismique en zone tropicale',
    extrait:
      'Sismicité modérée ne veut pas dire risque nul. Ce que l\u2019Eurocode 8 impose réellement sur nos ouvrages, et les trois dispositions constructives qui font la différence le jour où le sol bouge.',
    categorie: 'Techniques & Normes',
    date: '2026-05-18',
    dateLabel: '18 mai 2026',
    tempsLecture: '7 min',
    auteur: 'Marc-Aurèle TCHAMBA',
    image: { src: media.ossatureBeton, alt: 'Ossature en béton armé en cours d\u2019élévation' },
    contenu: [
      {
        type: 'paragraphe',
        texte:
          'Le Cameroun n\u2019est pas le Japon, et c\u2019est précisément ce qui rend le sujet délicat. Une sismicité classée modérée n\u2019appelle pas les mêmes dispositions qu\u2019une zone à fort aléa, mais elle interdit de traiter la question par prétérition — ce qui reste pourtant la pratique courante sur beaucoup de petits ouvrages.',
      },
      {
        type: 'intertitre',
        id: 'ce-que-dit-le-texte',
        texte: 'Ce que le texte impose, et ce qu\u2019il laisse à l\u2019ingénieur',
      },
      {
        type: 'paragraphe',
        texte:
          'L\u2019Eurocode 8 ne fournit pas un catalogue de solutions : il fixe une accélération de calcul, une classe de sol, un coefficient de comportement, et laisse au concepteur la charge de justifier que la structure dissipe l\u2019énergie là où il l\u2019a prévu. C\u2019est ce dernier point qui se perd le plus souvent entre la note de calcul et le ferraillage réellement posé.',
      },
      {
        type: 'paragraphe',
        texte:
          'La classe de sol est le premier paramètre à ne pas bâcler. Sur le littoral, les dépôts meubles saturés amplifient le signal : passer d\u2019une classe C à une classe D peut augmenter l\u2019effort de calcul de moitié. Cette classification vient de l\u2019étude géotechnique, pas d\u2019une hypothèse d\u2019atelier.',
      },
      {
        type: 'intertitre',
        id: 'trois-dispositions',
        texte: 'Trois dispositions constructives qui changent le comportement réel',
      },
      {
        type: 'liste',
        items: [
          'Continuité des chaînages : un chaînage interrompu au droit d\u2019une ouverture annule une bonne partie du bénéfice attendu.',
          'Confinement des nœuds poteau-poutre : c\u2019est là que la ruine s\u2019amorce, et c\u2019est là que les cadres sont le plus souvent espacés faute de place.',
          'Régularité en plan et en élévation : un décrochement mal compensé crée une torsion que le calcul peut absorber, mais que l\u2019exécution supporte mal.',
        ],
      },
      {
        type: 'image',
        src: media.charpenteMetallique,
        alt: 'Assemblage de charpente métallique sur chantier',
        legende:
          'Les assemblages sont les points de passage obligés des efforts sismiques : leur exécution vaut la note de calcul qui les justifie.',
      },
      {
        type: 'intertitre',
        id: 'sur-le-chantier',
        texte: 'Le calcul ne protège personne si le chantier ne le suit pas',
      },
      {
        type: 'paragraphe',
        texte:
          'Nous imposons systématiquement un point d\u2019arrêt avant coulage sur les nœuds les plus sollicités. Cinq minutes de vérification contradictoire, procès-verbal à l\u2019appui, valent mieux qu\u2019un litige deux ans plus tard sur un ouvrage dont personne ne sait plus comment il a été ferraillé.',
      },
      {
        type: 'encadre',
        titre: 'À retenir',
        texte:
          'La conformité parasismique ne se joue pas dans le logiciel mais sur trois points : une classe de sol issue d\u2019un vrai sondage, des dispositions constructives dessinées et non renvoyées à l\u2019entreprise, et un contrôle avant coulage.',
      },
    ],
  },
  {
    id: 'art-bim-cameroun',
    slug: 'bim-chantiers-camerounais',
    titre: 'Pourquoi le BIM change la donne sur les chantiers camerounais',
    extrait:
      'La maquette numérique n\u2019est pas un argument commercial. Sur Le Crystal, elle a révélé onze conflits entre réseaux et structure avant le coulage — voici ce que chacun aurait coûté une fois sur site.',
    categorie: 'BIM & Innovation',
    date: '2026-04-22',
    dateLabel: '22 avril 2026',
    tempsLecture: '6 min',
    auteur: 'David KOUAM',
    image: { src: media.gruesToit, alt: 'Grues au-dessus d\u2019un bâtiment en construction' },
    projetLie: 'immeuble-le-crystal',
    contenu: [
      {
        type: 'paragraphe',
        texte:
          'Le reproche adressé au BIM est presque toujours le même : trop lourd pour nos tailles de projet. Il est recevable si l\u2019on confond BIM et maquette photoréaliste. Il ne l\u2019est plus dès qu\u2019on regarde ce que coûte, ici, une reprise après coulage.',
      },
      {
        type: 'intertitre',
        id: 'onze-conflits',
        texte: 'Onze conflits, et ce qu\u2019ils auraient coûté',
      },
      {
        type: 'paragraphe',
        texte:
          'Sur l\u2019immeuble Le Crystal, la superposition des modèles structure, plomberie et électricité a fait apparaître onze incompatibilités. Trois étaient bénignes. Deux imposaient de percer une poutre porteuse en zone tendue, ce qui n\u2019aurait pas été autorisé : la solution de secours aurait été un faux plafond abaissé sur deux niveaux, soit une perte de hauteur libre commercialisable.',
      },
      {
        type: 'citation',
        texte:
          'Une gaine qui traverse une poutre se corrige en dix minutes à l\u2019écran. Après coulage, elle se corrige en quinze jours et en litige.',
        source: 'David KOUAM, chef de projets BIM',
      },
      {
        type: 'intertitre',
        id: 'ce-qui-marche-ici',
        texte: 'Ce qui fonctionne réellement dans notre contexte',
      },
      {
        type: 'paragraphe',
        texte:
          'Inutile de viser un niveau de détail maximal sur tous les lots. Nous modélisons finement la structure et les réseaux encastrés, et restons volontairement grossiers ailleurs. L\u2019objectif n\u2019est pas la complétude de la maquette : c\u2019est la détection des interférences qui coûtent cher.',
      },
      {
        type: 'liste',
        items: [
          'Modèle structure exploitable dès la phase d\u2019avant-projet, pas au moment du permis.',
          'Une revue de maquette par lot, avec les entreprises, avant validation des plans d\u2019exécution.',
          'Export de plans 2D cotés depuis la maquette : le chantier travaille sur papier, et c\u2019est très bien ainsi.',
        ],
      },
      {
        type: 'image',
        src: media.tourEnConstruction,
        alt: 'Immeuble de bureaux en construction',
        legende: 'Le Crystal, Bonanjo : six niveaux et un sous-sol modélisés avant la première fouille.',
      },
      {
        type: 'paragraphe',
        texte:
          'Le vrai obstacle n\u2019est pas technique mais contractuel : il faut que les entreprises acceptent de livrer leurs plans avant l\u2019exécution. C\u2019est une clause, pas un logiciel.',
      },
    ],
  },
  {
    id: 'art-sols-meubles',
    slug: 'fondations-sols-meubles',
    titre: 'Fondations sur sols meubles : les techniques qui font la différence',
    extrait:
      'Radier, pieux, substitution de sol ou colonnes ballastées : quatre réponses à un même problème de portance, et les critères qui permettent de trancher sans se ruiner.',
    categorie: 'Techniques & Normes',
    date: '2026-03-30',
    dateLabel: '30 mars 2026',
    tempsLecture: '8 min',
    auteur: 'Sandra NKEZE',
    image: { src: media.terrassement, alt: 'Engin de terrassement sur une fouille de fondation' },
    contenu: [
      {
        type: 'paragraphe',
        texte:
          'À Douala, la question n\u2019est presque jamais « le sol porte-t-il ? » mais « combien va-t-il tasser, et de façon homogène ou non ? ». Un tassement de trois centimètres uniforme ne gêne personne. Le même tassement différentiel entre deux files de poteaux fissure une façade.',
      },
      {
        type: 'intertitre',
        id: 'quatre-familles',
        texte: 'Quatre familles de solutions, quatre logiques économiques',
      },
      {
        type: 'liste',
        items: [
          'Radier général : répartit la charge sur toute l\u2019emprise. Efficace quand la couche compressible est homogène, coûteux en acier et en béton.',
          'Fondations profondes sur pieux : reportent la charge vers un horizon résistant. Le coût dépend moins du nombre de pieux que de l\u2019amenée du matériel.',
          'Substitution de sol : on remplace la couche molle par un matériau d\u2019apport compacté. Imbattable sur faible épaisseur, ruineux au-delà de deux à trois mètres.',
          'Colonnes ballastées : on renforce le sol en place. Séduisant, mais suppose un contrôle de mise en œuvre rigoureux pour être autre chose qu\u2019une ligne de devis.',
        ],
      },
      {
        type: 'intertitre',
        id: 'critere-de-choix',
        texte: 'Le critère qui tranche vraiment',
      },
      {
        type: 'paragraphe',
        texte:
          'Ce n\u2019est ni la mode ni le catalogue de l\u2019entreprise : c\u2019est l\u2019épaisseur et la régularité de la couche compressible, donnée qui sort des sondages. Deux terrains mitoyens peuvent appeler deux solutions différentes, et l\u2019argument « le voisin a fait comme ça » a déjà coûté très cher à plusieurs maîtres d\u2019ouvrage.',
      },
      {
        type: 'image',
        src: media.grueEau,
        alt: 'Chantier en bord d\u2019eau avec grue',
        legende:
          'En bord d\u2019eau, la variation saisonnière de la nappe conditionne autant le choix que la portance elle-même.',
      },
      {
        type: 'encadre',
        titre: 'Ordre de grandeur',
        texte:
          'Une campagne de sondages représente en général moins de 1 % du budget de construction. Une reprise en sous-œuvre après fissuration dépasse couramment 10 %.',
      },
    ],
  },
  {
    id: 'art-crystal-retour',
    slug: 'le-crystal-retour-de-chantier',
    titre: 'Le Crystal : retour sur un chantier à hauts défis géotechniques',
    extrait:
      'Nappe affleurante, sol marécageux et bâtiments anciens en mitoyenneté. Chronique technique des douze mois de chantier de l\u2019immeuble tertiaire livré à Bonanjo.',
    categorie: 'Actualités chantiers',
    date: '2026-02-12',
    dateLabel: '12 février 2026',
    tempsLecture: '9 min',
    auteur: 'Sandra NKEZE',
    image: { src: media.tourEnConstruction, alt: 'Immeuble de bureaux achevé' },
    projetLie: 'immeuble-le-crystal',
    contenu: [
      {
        type: 'paragraphe',
        texte:
          'Le terrain avait été refusé par deux entreprises avant que le dossier n\u2019arrive chez nous. Nappe à moins d\u2019un mètre, remblais hétérogènes, et deux immeubles des années soixante-dix collés à la limite de propriété. Le programme, lui, ne bougeait pas : six niveaux, un sous-sol de parking, 2 500 m².',
      },
      {
        type: 'intertitre',
        id: 'le-sous-sol',
        texte: 'Un sous-sol sous la nappe : le vrai sujet',
      },
      {
        type: 'paragraphe',
        texte:
          'Creuser sous le niveau de la nappe pose deux problèmes distincts qu\u2019on confond souvent : tenir les terres pendant les travaux, et rester étanche pendant cinquante ans. La première question appelle un soutènement, la seconde un ouvrage en béton conçu pour résister à une pression permanente.',
      },
      {
        type: 'paragraphe',
        texte:
          'Nous avons retenu une enceinte en parois moulées, qui joue les deux rôles, associée à un radier général nervuré en béton hydrofuge. Le rabattement de nappe a été limité au strict nécessaire : pomper trop fort, c\u2019est tasser les terrains voisins et fissurer les bâtiments mitoyens.',
      },
      {
        type: 'intertitre',
        id: 'mitoyennete',
        texte: 'Les voisins, partie prenante du chantier',
      },
      {
        type: 'paragraphe',
        texte:
          'Un référé préventif a été réalisé avant travaux, avec relevé photographique de toutes les fissures existantes, et des repères de nivellement ont été posés sur les deux façades mitoyennes. Trois relevés mensuels ont montré un mouvement inférieur au millimètre. Ces chiffres ont clos le sujet le jour où une réclamation est arrivée.',
      },
      {
        type: 'image',
        src: media.grueContrePlongee,
        alt: 'Grue à tour vue en contre-plongée',
        legende: 'Phase d\u2019élévation : le planning de grue a conditionné l\u2019ordre des coulages.',
      },
      {
        type: 'citation',
        texte:
          'L\u2019équipe d\u2019Innova Plan a su gérer les contraintes de notre terrain difficile avec un grand professionnalisme. Bâtiment livré à la date prévue.',
        source: 'M. Alain FOKAM, Directeur Général de SOGELIM',
      },
      {
        type: 'paragraphe',
        texte:
          'L\u2019ouvrage a été réceptionné en décembre 2025, dans le délai contractuel. Le poste fondations a représenté une part nettement supérieure à la moyenne du budget gros œuvre — c\u2019était le prix du terrain, et il était connu dès l\u2019étude de sol.',
      },
    ],
  },
  {
    id: 'art-beton-carbone',
    slug: 'reduire-empreinte-carbone-beton',
    titre: 'Génie civil durable : réduire l\u2019empreinte carbone du béton',
    extrait:
      'Ciments composés, optimisation des sections, réemploi des coffrages : inventaire honnête des leviers réellement disponibles au Cameroun, et de ce qu\u2019ils coûtent.',
    categorie: 'BIM & Innovation',
    date: '2026-01-20',
    dateLabel: '20 janvier 2026',
    tempsLecture: '7 min',
    auteur: 'Marc-Aurèle TCHAMBA',
    image: { src: media.coucherChantier, alt: 'Chantier en fin de journée' },
    contenu: [
      {
        type: 'paragraphe',
        texte:
          'Le béton n\u2019est pas remplaçable à court terme sur nos ouvrages. La question utile n\u2019est donc pas « comment s\u2019en passer » mais « comment en mettre moins, et de quelle nature ». Deux leviers, l\u2019un de conception, l\u2019autre de matériau.',
      },
      {
        type: 'intertitre',
        id: 'moins-de-matiere',
        texte: 'Mettre moins de matière : le levier le plus rentable',
      },
      {
        type: 'paragraphe',
        texte:
          'Le surdimensionnement est la norme, par prudence et par habitude. Une section de poteau reprise au plus juste, une trame de poutres révisée, une dalle calculée plutôt que recopiée : ces arbitrages réduisent simultanément l\u2019empreinte et la facture. Ils supposent seulement que quelqu\u2019un fasse le calcul.',
      },
      {
        type: 'intertitre',
        id: 'ciments-composes',
        texte: 'Ciments composés : disponibles, mais pas universels',
      },
      {
        type: 'paragraphe',
        texte:
          'Les ciments à ajouts disponibles localement réduisent sensiblement le clinker, donc les émissions. Leur montée en résistance est plus lente, ce qui se gère par le planning de décoffrage — pas par un ajout d\u2019eau sur site, qui annule le bénéfice et abîme le béton.',
      },
      {
        type: 'liste',
        items: [
          'Vérifier la compatibilité du liant avec l\u2019exposition : milieu marin, sulfates, contact permanent avec l\u2019eau.',
          'Adapter les délais de décoffrage et les prévoir au planning, pas à la réunion de chantier.',
          'Réemployer les coffrages : leur nombre de rotations pèse davantage qu\u2019on ne le croit sur le bilan du poste.',
        ],
      },
      {
        type: 'encadre',
        titre: 'Ce qui ne marche pas',
        texte:
          'Annoncer un ouvrage « bas carbone » sans mesurer la quantité de matière employée. Sans métré comparatif, l\u2019argument est purement commercial.',
      },
    ],
  },
  {
    id: 'art-etude-geotechnique',
    slug: 'etude-geotechnique-avant-achat-terrain',
    titre: 'Comprendre l\u2019étude géotechnique avant d\u2019acheter un terrain',
    extrait:
      'Ce que contient un rapport de sol, comment le lire sans être ingénieur, et les trois lignes qui doivent retenir votre attention avant de signer chez le notaire.',
    categorie: 'Techniques & Normes',
    date: '2025-12-05',
    dateLabel: '5 décembre 2025',
    tempsLecture: '6 min',
    auteur: 'Sandra NKEZE',
    image: { src: media.ingenieurCasque, alt: 'Ingénieur équipé sur un terrain' },
    contenu: [
      {
        type: 'paragraphe',
        texte:
          'Un rapport géotechnique n\u2019est pas un document administratif de plus. C\u2019est le seul élément du dossier qui vous dise ce que coûtera réellement le fait de construire à cet endroit précis — parfois 5 % du gros œuvre, parfois 25 %.',
      },
      {
        type: 'intertitre',
        id: 'ce-que-contient',
        texte: 'Ce que contient le rapport',
      },
      {
        type: 'liste',
        items: [
          'La coupe des sondages : la succession des couches rencontrées et leur profondeur.',
          'Les essais réalisés : pressiomètre, pénétromètre, prélèvements en laboratoire.',
          'Le niveau de la nappe, et surtout sa variation saisonnière estimée.',
          'Les recommandations de fondation, avec une contrainte admissible et une profondeur d\u2019ancrage.',
        ],
      },
      {
        type: 'intertitre',
        id: 'trois-lignes',
        texte: 'Les trois lignes à regarder avant de signer',
      },
      {
        type: 'paragraphe',
        texte:
          'D\u2019abord la profondeur d\u2019ancrage recommandée : au-delà de trois mètres, le budget fondations change de catégorie. Ensuite le niveau de nappe : s\u2019il affleure, tout sous-sol devient un ouvrage d\u2019étanchéité à part entière. Enfin la présence de remblais : un terrain remblayé récemment tasse encore, et personne ne peut vous dire pendant combien de temps.',
      },
      {
        type: 'image',
        src: media.terrassement,
        alt: 'Fouille de reconnaissance sur un terrain',
        legende:
          'Les sondages se font avant la promesse de vente, pas après le permis : c\u2019est à ce moment-là que l\u2019information a encore une valeur de négociation.',
      },
      {
        type: 'paragraphe',
        texte:
          'Un rapport défavorable n\u2019interdit pas d\u2019acheter. Il vous donne un argument chiffré pour négocier, ou la certitude de passer votre chemin. Dans les deux cas, il aura été rentable.',
      },
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);

/** Articles proposés en fin de lecture : même thématique d'abord, complétés par les plus récents. */
export const articlesLies = (slug: string, nombre = 3) => {
  const courant = getArticle(slug);
  if (!courant) return articles.slice(0, nombre);
  const memeTheme = articles.filter((a) => a.slug !== slug && a.categorie === courant.categorie);
  const autres = articles.filter((a) => a.slug !== slug && a.categorie !== courant.categorie);
  return [...memeTheme, ...autres].slice(0, nombre);
};
