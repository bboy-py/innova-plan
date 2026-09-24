# Innova Plan — site vitrine (phase 1, 2 & 3 : front-end)

Next.js 14 (App Router) · TypeScript · Tailwind · Framer Motion. Déployable sur Vercel.
Aucune base de données, aucune authentification réelle : tout le contenu est statique.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Arborescence

```
src/
├── app/
│   ├── layout.tsx                 Polices, preloader, curseur, Chrome
│   ├── page.tsx                   Accueil
│   ├── a-propos/ services/        Pages éditoriales
│   ├── realisations/ + [slug]/    Grille filtrable et fiche projet
│   ├── blog/ + [slug]/            Listing filtrable et article détaillé
│   ├── contact/                   Formulaire multi-étapes + plan de situation
│   └── espace-ingenieurs/connexion/   Écran de connexion (façade visuelle)
├── components/
│   ├── layout/   Chrome, Entete, MenuLateral, Preloader, CurseurPersonnalise,
│   │             TransitionPage, PiedDePage, Marque
│   ├── ui/       Bouton, ChampFlottant, Etiquette, Apparition, ApparitionVisuel,
│   │             TitreSection, Compteur, CarteProjet, CarteArticle, BlocsArticle,
│   │             BandeauLogos, Accordeon, ImageParallax
│   └── sections/ Blocs de page composés à partir de ui/
├── data/     site, services, projects, team, posts, testimonials, media
├── lib/      utils, motion (presets), useCompteur, chargement (contexte)
└── types/    Projet, Article (+ BlocArticle), Service, MembreEquipe, Temoignage
```

`Chrome` (client) décide de l'affichage de l'en-tête et du pied de page — masqués
sous `/espace-ingenieurs` — et héberge la transition entre routes.

## Système de design — direction éditoriale noir & blanc

Le site a basculé d'une identité bleu saphir/vert sarcelle dominante vers un système
achromatique façon storeyarchitecture.co.uk / apple.com : fond blanc quasi pur, texte
noir/anthracite, sections « chapitres » inversées en noir plein (hero, CTA de fin de
page, footer, en-têtes de page intérieure). Les couleurs de la charte d'origine **ne
sont pas supprimées** — leurs valeurs restent dans `tailwind.config.ts` — mais ne
servent plus nulle part de fond ou de grand aplat. Elles sont réservées à des détails
choisis un par un : un repère numéroté, un point, un soulignement fin, une icône, un
badge de catégorie, l'anneau de focus clavier.

| Rôle | Token | Valeur |
| --- | --- | --- |
| Encre — texte de lecture, sections inversées | `encre-950` / `encre-700` / `encre-500` | `#0A0A0A` / `#262626` / `#595959` |
| Fond des sections claires (neutre, sans teinte bleue) | `brume` | `#FAFAFA` |
| Bleu Saphir — conservé, réservé aux tout petits détails | `saphir-700` | `#1A365D` |
| Vert Sarcelle — conservé, réservé aux tout petits détails | `sarcelle-500/600/700` | `#0D9488` / `#0B7C73` / `#0C635C` |
| Ambre de signalement — messages de formulaire | `alerte` | `#B45309` |

`ardoise-900` (`#0F172A`) est volontairement **laissée intacte et isolée** : c'est la
seule nuance encore utilisée par le Preloader, qui n'a pas été retouché dans cette passe
(il sera remplacé par une animation d'entrée avec le logo dans un prochain prompt).

Typographies inchangées (Montserrat / Inter), mais avec un jeu de graisses plus marqué :
`font-light` sur le corps de texte éditorial, `font-extrabold`/`font-black` réservé aux
titres d'impact.

### Logo

Le logo officiel (`public/logo.png`, fond transparent) est intégré via `Marque.tsx`.
Sa variante monochrome blanche, utilisée sur les fonds sombres (footer, menu, pages
d'accueil sombres), est obtenue par un simple filtre CSS — `brightness(0) invert(1)` —
qui ramène chaque pixel non transparent au noir puis l'inverse en blanc, en conservant
exactement la silhouette du logo. Aucun second fichier image à maintenir.

### Accroche de la section « 01 Bureau d'études »

Trois propositions ont été rédigées pour remplacer l'ancienne accroche ; la première a
été retenue et intégrée (voir le commentaire en tête de `components/sections/Presentation.tsx`) :
1. **« L'exigence du calcul, la vitesse du numérique. »** ← retenue
2. « Trois ingénieurs. Un seul principe : calculer avant de construire. »
3. « Le génie civil, pensé avant d'être coulé. »

## Animations

Preloader 0→100 % (inchangé) · scroll reveal façon Apple, rejoué à chaque entrée dans le
viewport y compris en remontant puis en redescendant (`Apparition`/`ApparitionVisuel`,
`viewport.once: false`) · en-tête qui s'efface au scroll vers le bas et revient
immédiatement au moindre scroll vers le haut, avec un module compact toujours accessible
(CTA + menu) pendant qu'il est caché · menu latéral en tiroir · cartes de projet et
d'article avec un rideau noir qui monte au survol, façon storeyarchitecture · curseur
personnalisé compact (point d'accent au repos, disque noir « Voir »/« Lire » au survol)
· compteurs au scroll · parallaxe (desktop uniquement) · transition sortie/entrée entre
routes · filtres animés (portfolio et blog) · bandeau de logos en défilement infini avec
pause au survol · cascade des badges de certification.

`prefers-reduced-motion` est respecté partout, y compris sur toutes les animations
ajoutées dans cette passe : `useReducedMotion` neutralise chaque animation JS (preloader,
curseur personnalisé et rideaux ne sont alors pas montés/déclenchés) et une règle globale
de `globals.css` coupe les animations CSS. Le nouvel en-tête à disparition/réapparition
reste, lui, en permanence affiché et cliquable quand les animations sont réduites — il ne
se contente pas de sauter sans transition, il ne bouge simplement plus.

**Point de vigilance (inchangé)** : `components/layout/TransitionPage.tsx` importe
`LayoutRouterContext` depuis `next/dist/shared/lib/app-router-context.shared-runtime` —
API interne de Next, seul moyen actuel d'obtenir une animation de *sortie* dans l'App
Router. À revérifier lors d'une montée de version majeure. Repli : supprimer
`RouteurGele` et ne conserver que l'animation d'entrée.

**Simplification assumée sur le rideau et le curseur** : le brief demandait un
remplissage noir sur image claire / blanc sur image sombre, « selon le contraste local ».
Déterminer ce contraste image par image (ou pixel par pixel sous le curseur, en continu)
dépassait le cadre raisonnable de cette passe. Le traitement retenu est un aplat noir
unique pour les deux (rideau des cartes et disque du curseur), cohérent entre eux et avec
le reste de la direction éditoriale — plutôt qu'une adaptation dynamique fragile.

## Images

Toutes les URL de contenu sont centralisées dans `src/data/media.ts` (placeholders
Unsplash). Pour basculer sur les vraies photos : déposer les fichiers dans
`public/images/` et remplacer les URL par des chemins locaux — aucun autre fichier à
modifier. Les portraits des associés restent des monogrammes dessinés dans la charte, en
attente des photos officielles. La photographie du site n'a volontairement pas été
désaturée : la direction noir & blanc porte sur l'interface (fonds, texte, boutons), pas
sur le traitement des images.

## Points d'accroche pour la phase back-end

| Sujet | Fichier | À faire |
| --- | --- | --- |
| Projets | `data/projects.ts` → `getProjet()` | Remplacer le tableau par un `fetch` ; les types sont déjà ceux attendus |
| Articles | `data/posts.ts` → `getArticle()`, `articlesLies()` | Idem ; le corps est décrit en blocs (`BlocArticle`), directement mappable depuis un CMS |
| Formulaire de contact | `sections/FormulaireEtapes.tsx` → `envoyer()` | Un `POST` vers `/api/contact` ; l'état de chargement du bouton est déjà câblé |
| Pièce jointe | même fichier, `champFichier` | Le nom du fichier est mémorisé, le téléversement reste à implémenter |
| Connexion | `sections/FormulaireConnexion.tsx` → `soumettre()` | Brancher le client d'authentification puis rediriger vers le tableau de bord |
| Tableau de bord | — | N'existe pas : seule la porte d'entrée `/espace-ingenieurs/connexion` est dessinée |

Les filtres du portfolio et du blog affichent les catégories vides en grisé :
la barre de filtres ne bougera pas quand de nouveaux contenus seront publiés.

## Refonte noir & blanc éditorial (dernière passe)

Le système de couleurs a basculé d'un thème saphir/sarcelle dominant vers une
direction noir & blanc éditoriale (fond blanc/`brume`, sections « chapitres »
inversées en noir `encre-950`), inspirée de storeyarchitecture.co.uk et
apple.com. Le bleu saphir et le vert sarcelle de la charte sont conservés dans
`tailwind.config.ts` (aucune valeur supprimée) mais ne servent plus qu'à des
détails choisis : un point, un soulignement, un badge de catégorie, les états
de focus/validation. Voir les commentaires en tête de `tailwind.config.ts` et
de chaque composant recoloré pour le détail des choix.

Points clés à connaître pour la suite :
- **`ardoise-900`** (`#0F172A`) est intentionnellement inchangée : c'est la
  seule nuance encore utilisée par le Preloader, qui n'a pas été retouché.
  `bg-blueprint` (trame bleutée) lui est également réservé ; toutes les autres
  sections sombres utilisent `bg-grille`, sa version neutre.
- **Logo** : `/public/logo.png` (fond transparent). La variante monochrome
  (footer, menu, sections sombres) est un filtre CSS (`brightness-0 invert`),
  pas un second fichier — voir `components/layout/Marque.tsx`.
- **Bouton primaire** : remplissage noir/blanc (façon Apple), plus vert
  sarcelle. Deux variantes existent (`primaire` sur fond clair,
  `primaire-inverse` sur fond sombre) — voir `components/ui/Bouton.tsx`.
- **Curseur personnalisé et rideau des cartes** : traités en noir uni plutôt
  qu'adaptatifs au contraste local de chaque image (voir le commentaire dans
  `CurseurPersonnalise.tsx` pour le raisonnement).
- **Scroll reveal** : `Apparition.tsx` rejoue désormais l'animation à chaque
  entrée dans le viewport (`once: false`), y compris en remontant puis
  redescendant. `ApparitionVisuel.tsx` est le pendant pour les images
  associées à un bloc de texte (translation + léger effet d'échelle).
- **Header** : `Entete.tsx` gère la disparition/réapparition au scroll ; le
  panneau de menu (`MenuLateral.tsx`) n'est pas concerné par ce comportement.
- **Sécurité** : Next.js a été mis à jour vers `14.2.35` (correctif de
  sécurité RSC de décembre 2025) — voir le changelog officiel si une future
  mise à jour est nécessaire.

## Corrections après test + intro animée + refonte du Hero (dernière passe)

### Corrections
- **Pages d'ouverture (à propos, services, réalisations, blog, contact, fiches
  projet/article, menu latéral)** : repassées en noir sur blanc, disposition
  horizontale façon storeyarchitecture.co.uk/projects (grand titre à gauche,
  paragraphe aligné à droite à hauteur du titre). Les sections de conversion
  (chiffres clés, certifications, CTA, footer, témoignages) restent en
  chapitres noirs — ce n'est que la porte d'entrée de chaque page/section qui
  a changé, sur retour explicite après test.
- **Curseur personnalisé** : le point au repos utilise désormais
  `mix-blend-mode: difference` (voir `CurseurPersonnalise.tsx`) — il s'inverse
  automatiquement selon ce qu'il survole, sans détection de couleur ; l'ancien
  point vert n'existe plus. Le disque labellisé (« Voir »/« Lire ») reste noir
  plein, inchangé.
- **Hover des cartes** : le rideau noir plein du prompt précédent a été
  retiré de `CarteProjet.tsx` et `CarteArticle.tsx`. L'effet est revenu à un
  zoom léger + un détail qui se déplie, sans jamais recouvrir l'image.
- **Logo du header** : agrandi (`taille="grande"` dans `Marque.tsx`, appelé
  depuis `Entete.tsx`).

### Intro animée (remplace le préchargeur 0→100 %)
`components/layout/IntroLogo.tsx` + `TracePhare.tsx` + `lib/pharePoints.ts`.

**Choix technique : 2D (SVG + Framer Motion), pas de vraie 3D.** Une scène
Three.js/WebGL aurait exigé un moteur de rendu, une caméra, un éclairage et
un modèle 3D du phare, pour un gain marginal sur une séquence de ~2 secondes
qui ne se rejoue qu'une fois par session. Le contour du phare est tracé via
`pathLength` (Framer Motion), et l'impression de profondeur vient d'un
`perspective` CSS + une légère rotation 3D qui se redresse pendant le tracé,
plus une ombre portée — un effet convaincant, léger, sur les mêmes briques que
le reste du site.

Séquence (~2,1 s) : tracé du contour → allumage du foyer et des rayons →
fondu enchaîné vers le vrai logo → rétrécissement mesuré (`getBoundingClientRect`
sur la cible `#marque-header-cible` dans `Entete.tsx`) vers la position réelle
du logo dans le header, pendant que le fond devient transparent et que le
hero apparaît derrière. `prefers-reduced-motion` : un simple fondu, sans tracé
ni transfert mesuré. Ne s'affiche qu'une fois par session (sessionStorage) et
uniquement sur `/` — y compris si l'accueil n'est atteint qu'après d'autres
pages, la vérification étant relancée à chaque changement de route.

### Hero (page d'accueil)
Fond blanc, plus de photo. Le titre se révèle mot par mot ; le sous-texte et
les CTA arrivent une fois le titre terminé. `PhareArrierePlan.tsx` dessine le
phare en filigrane (silhouette à 9 % d'opacité) avec un faisceau (dégradé
conique) qui pivote vers le curseur via un ressort Framer Motion — jamais une
rotation instantanée. Sortie au scroll : `useScroll`/`useTransform` lient
directement l'échelle (1 → 0,94) et l'opacité (1 → 0,75) du contenu à la
position de défilement, réversible sans logique supplémentaire.

**Compromis assumé** : sur tactile, pas de souris disponible pour faire
pivoter le faisceau. Le brief autorisait explicitement soit un phare fixe,
soit un suivi gyroscopique « si trivial ». Le gyroscope (permission iOS,
gestion d'erreurs) a été jugé disproportionné pour un élément purement
décoratif : le faisceau reste fixe à un angle de repos sur tactile.

## Nouvelle intro « spotlight reveal » + corrections curseur/hover/titres (dernière passe)

### 1 — Ancienne intro 3D supprimée
`IntroLogo.tsx` et `TracePhare.tsx` ont été supprimés du dépôt (pas seulement
désactivés). `lib/pharePoints.ts` est conservé : cette géométrie partagée est
toujours utilisée par `PhareArrierePlan.tsx` (le phare en filigrane du Hero,
une fonctionnalité distincte, non concernée par ce prompt).

### 2 — Nouvelle intro : `IntroSpotlight.tsx`
Fond gris (`#4A4A4A`) plein écran, un point de lumière apparaît au centre,
puis un `clip-path: circle()` animé (Framer Motion interpole directement la
chaîne `circle(Npx at 50% 50%)`) grandit pour révéler le vrai `/public/logo.png`
— jamais redessiné. Une fois révélé : pause courte, puis rétrécissement
mesuré (`getBoundingClientRect` sur `#marque-header-cible`) vers la position
réelle du logo dans le header, pendant que le gris s'efface et que le hero
apparaît. `prefers-reduced-motion` : fondu simple, sans cercle ni transfert
mesuré. Session unique, page d'accueil uniquement — même logique de
vérification par route que la version précédente.

### 3 — Curseur : gris fixe + traînée
`mix-blend-mode: difference` a été retiré : peu fiable dès qu'un ancêtre crée
son propre contexte d'empilement (fréquent sur ce site, plein d'éléments
transformés/animés), il laissait le curseur blanc — donc invisible sur les
fonds blancs, majoritaires. Remplacé par une couleur grise fixe (`#6B7280`,
suggestion du brief, contraste vérifié ≈4,8:1 sur blanc et ≈4,1:1 sur noir)
et une traînée de deux points, ressorts de plus en plus lents, tous
alimentés par la même position brute — c'est ce décalage progressif qui
dessine le sillage. Le disque labellisé (« Voir »/« Lire ») reste inchangé.

### 4 — Hover des cartes : passage en CSS pur
`CarteProjet.tsx` et `CarteArticle.tsx` reposaient sur un état React alimenté
par une détection JS du type de pointeur (`matchMedia`) — fragile, et
manifestement pas toujours déclenché. L'effet (zoom léger + détail qui se
déplie) est maintenant en pur CSS (`group-hover:` / `group-focus-visible:`),
ce qui le rend fiable partout, accessible au clavier, et respecte
`prefers-reduced-motion` automatiquement via la règle globale de
`globals.css` — sans JavaScript. Les deux composants n'ont plus besoin d'être
des composants client.

### 5 — Titres qui retournaient à la ligne mot par mot
Cause identifiée : plusieurs titres avaient leur `max-w-[Nch]` posé sur le
conteneur `Apparition` plutôt que sur le titre lui-même — l'unité `ch` se
résolvait contre la taille de police ambiante du conteneur (petite), pas
celle, bien plus grande, du `<h1>`/`<h2>` qu'elle était censée contraindre,
donnant une largeur effective minuscule. Corrigé dans `EnTetePage.tsx` et les
en-têtes de `realisations/[slug]` et `blog/[slug]` : la largeur du conteneur
flex est désormais exprimée en `%` (insensible à la police), et le `max-w`
en `ch` est posé directement sur le titre. Quatre autres titres
(`AppelAction`, `ProjetsALaUne`, `Equipe`, `not-found`) souffraient d'un
défaut différent — un `max-w` en `ch` déjà bien placé mais simplement trop
étroit pour les tournures utilisées — élargis pour la même raison. Toutes ces
occurrences sont passées de `text-display-l` à `text-display-m` (palier en
dessous dans l'échelle du projet).

## Simplification (retrait intro & phare) + diagnostic du hover (dernière passe)

### 1 & 2 — Intro et phare/faisceau retirés
`IntroSpotlight.tsx`, `PhareArrierePlan.tsx`, `lib/pharePoints.ts` et
`lib/chargement.tsx` (le contexte `FournisseurChargement`/`useChargement`,
qui ne servait qu'à synchroniser l'ancienne intro avec le Hero) ont été
supprimés du dépôt. `app/layout.tsx` ne monte plus rien avant le contenu de
chaque page. `Hero.tsx` déclenche désormais sa révélation mot par mot dès son
montage (`initial`/`animate` Framer Motion directs, sans état externe à
attendre) ; le rétrécissement + la baisse d'opacité liés au scroll
(`useScroll`/`useTransform`) sont inchangés.

### 3 — Hover des images : diagnostic réel, pas une simple ré-affirmation
Plutôt que de recorriger à l'aveugle, la génération de production a été
lancée et inspectée directement :
- le CSS compilé contient bien la règle `.group:hover .group-hover\:scale-105`
  (vérifié caractère pour caractère dans le bundle) ;
- le HTML rendu confirme que la classe `group-hover:scale-105` est bien
  posée sur l'`<img>`, et que le style en ligne injecté par `next/image`
  (`position:absolute;height:100%;width:100%;...`) ne touche jamais
  `transform` — donc pas de conflit de propriété ;
- aucun composant dupliqué ne contourne `CarteProjet`/`CarteArticle` ;
  `next.config.mjs` autorise bien le domaine d'images utilisé.

Verdict : le code livré à l'issue du prompt précédent n'est pas défectueux
d'après cette analyse statique — l'hypothèse la plus probable est un test
mené sur une version antérieure (avant cette correction). Deux fragilités
réelles ont néanmoins été trouvées et corrigées par précaution, indépendamment
de ce constat :
1. La légende dépliée de `CarteProjet` reposait sur une transition
   `grid-template-rows` (0fr → 1fr), une technique au support historiquement
   inégal selon les navigateurs — remplacée par un simple fondu + translation
   (support universel).
2. `group` (générique) est réutilisé ailleurs sur le site (boutons, liens de
   navigation, onglets de filtre) ; `CarteProjet` et `CarteArticle` utilisent
   désormais des groupes Tailwind **nommés** (`group/projet`, `group/article`),
   ce qui les rend insensibles à toute imbrication future avec un autre
   élément `.group`, même si aucune collision réelle n'existait aujourd'hui.

Composants audités : `CarteProjet.tsx` (accueil « Projets à la une » +
réalisations), `CarteArticle.tsx` (blog listing + « À lire ensuite »). Non
concernés, volontairement : galerie avant/pendant/après (illustrative, sans
lien), portraits de l'équipe (sans destination), vignettes du menu latéral
(réagissent déjà au survol du lien texte), logo du header (branding, pas une
« carte »).

## Icônes lucide-react animées + restauration de l'entrée du Hero (dernière passe)

`lucide-react` a été ajouté aux dépendances. Chaque icône utilisée est
importée par son nom exact depuis la bibliothèque — aucun SVG dessiné à la
main pour représenter ces concepts.

### 1 — Boutons : icône Compass synchronisée
`Bouton.tsx` : au survol, l'icône `Compass` pivote (45°) et grandit (×1,1)
pendant que le texte se resserre (×0,95), même durée (0,3 s), même easing
(ease-in-out), retour identique au retrait de la souris. Techniquement, le
survol est détecté **une seule fois, sur le bouton entier**
(`whileHover="survol"` posé sur le `<Link>`/`<button>` parent via
`motion(Link)`), puis propagé aux deux enfants par des variantes nommées —
sans cela, deux `whileHover` indépendants sur l'icône et le texte ne se
seraient déclenchés que si l'un ou l'autre était survolé individuellement,
jamais ensemble. S'applique partout où `<Bouton>` est utilisé (header,
accueil, sections de conversion, formulaires) — toutes les pages en héritent
automatiquement.

### 2 — Badge central tracé sur les cartes
`CarteProjet.tsx` et `CarteArticle.tsx` : au survol, un badge apparaît au
centre de l'image — numéro à deux chiffres (généré depuis la position réelle
dans sa grille, jamais codé en dur) + tiret cadratin + « Voir le projet »/
« Lire l'article » + icône `HardHat`. Le contour du badge se trace via
`pathLength` (l'équivalent Framer Motion de `stroke-dashoffset` animé) sur
0,3 s, le texte suit avec 0,08 s de décalage. Le zoom de l'image et le
dégradé restent pilotés en CSS pur (`group-hover/projet:`, inchangé et
toujours aussi robuste) : les deux animations tournent en parallèle sans
conflit, puisqu'elles ne touchent ni les mêmes éléments ni les mêmes
propriétés. Cela a nécessité de repasser ces deux composants en composants
client (`'use client'`) — uniquement parce que `pathLength` est une capacité
Framer Motion, sans équivalent CSS pur ; le mécanisme de zoom robuste (CSS,
sans détection JS du pointeur) n'a pas été touché.

### 3 — Curseur : icône contextuelle par section
`CurseurPersonnalise.tsx` : couleur et traînée inchangées, comme demandé. Le
point neutre au repos est remplacé par une icône `lucide-react` selon la
route (`usePathname`) : Compass (accueil), Pencil (à propos), PencilRuler
(services), Ruler (réalisations), Layers (actualités), PenTool (contact).
Un repli en simple point gris a été ajouté pour les routes hors de cette
liste (l'espace ingénieurs, notamment), afin que le curseur ne devienne
jamais invisible. Le disque noir labellisé (« Voir »/« Lire ») reste
inchangé et prend le relais dès qu'un élément porte `data-curseur`.

Point de vérification honnête : contrairement au bouton et au badge, l'icône
du curseur ne peut pas être confirmée en inspectant le HTML statique généré
par le build — ce composant ne se monte qu'une fois dans le navigateur, sur
pointeur fin détecté (`matchMedia`), par construction, y compris avant ce
prompt. La correction a été vérifiée par relecture de code et compilation
(`tsc`, build), pas par un rendu visuel réel.

### 4 — Animation d'entrée du Hero restaurée
Cause exacte de la disparition : au retrait du phare/intro, `Hero.tsx` avait
été simplifié en `animate="visible"` — une valeur *statique*, fixée dès le
tout premier rendu, plutôt que déclenchée par un changement d'état. Le
mécanisme qui fonctionnait avant reposait sur un vrai changement en deux
temps (`repos` puis `visible`, piloté par le contexte `useChargement`
supprimé). La correction restaure ce même mécanisme en deux temps, mais
entièrement local à `Hero.tsx` : un `useState(false)` + un `useEffect` au
montage qui bascule l'état — sans plus aucune dépendance externe. Ajout par
rapport à la version d'avant le prompt D : les variantes respectent
maintenant explicitement `prefers-reduced-motion` (affichage immédiat, sans
translation ni délai), ce qui n'était pas le cas auparavant.

## Liquid Metal Button + icônes animées 21st.dev (dernière passe — Prompt G)

### 1 — LiquidMetalButton
Code source réel récupéré sur `jolyui.dev/docs/components/buttons/liquid-metal-button`
(21st.dev, @johuniq, MIT) et conservé dans `components/ui/liquid-metal-button.tsx`
sous le nom `LiquidMetalButton` — rien n'a été redessiné de mémoire.

Ce composant source est cependant un bouton atomique autonome (taille fixe
142×46 ou 46×46, un seul `label`, aucune navigation) : il ne peut pas
remplacer tel quel `<Bouton>`, qui doit gérer un texte de longueur libre, la
navigation (`<Link>`/`submit`), une icône dédiée et un état de chargement.
`LiquidMetalSurface`, dans le même fichier, est l'extraction qui a permis
l'intégration : mêmes uniforms de shader (`@paper-design/shaders`,
`liquidMetalFragmentShader`), mais en couche de fond `absolute inset-0`
dimensionnée au conteneur plutôt qu'en pixels fixes, sans texte ni `<button>`
propre (`pointer-events: none`, pour laisser les clics traverser jusqu'au
vrai bouton posé au-dessus), pilotée par les états survol/pression de son
hôte plutôt que par ses propres gestionnaires de souris. Le ricochet lumineux
au clic de la démo source est conservé, exposé via une méthode impérative
(`triggerRipple`) que `<Bouton>` appelle avec les coordonnées du clic.

**Adaptation de teinte** : les décalages chromatiques du shader (`u_shiftRed`
/ `u_shiftBlue`, 0.3 dans la démo source) ont été réduits à 0.12 pour rester
dans un rendu argenté/gris métallique cohérent avec la charte noir & blanc,
plutôt que le liquid metal plus irisé de la démo.

**`prefers-reduced-motion`** : le shader (animé en continu, y compris au
repos) n'est jamais monté ; un dégradé statique (`#2a2a2a` → `#050505`, la
même base que le shader au repos) le remplace.

### 2 — Application à `<Bouton>`
`Bouton.tsx` pose désormais `<LiquidMetalSurface>` derrière le contenu de
**toutes** les variantes (`primaire`, `primaire-inverse`, `contour`,
`contour-clair`) — elles convergent donc visuellement vers le même fond
métallique sombre ; seule la couleur du texte (blanc partout, pour rester
lisible) subsiste de l'ancien système de variantes. La forme passe de
`rounded-none` (coins nets, direction éditoriale d'origine) à `rounded-full`
(la pilule étant la forme du composant source) — **écart visuel notable par
rapport au reste du site, à valider avant mise en ligne** : c'est la seule
famille de composants à coins arrondis desormais.

### 3 — Icône Compass animée
`components/icons/CompassIcon.tsx` reprend le masque/tracé SMIL du fichier
source à l'identique. Seul le déclenchement change : dans le fichier
d'origine, la première `<animate>` n'a pas de `begin` explicite (donc
`begin="0s"`, déclenchement au chargement) et les suivantes sont à
`begin="0.6s"` (délai absolu depuis le montage). Ici, la première passe en
`begin="indefinite"` et les suivantes en syncbase relatif (`begin="{id}.end"`,
elles s'enchaînent donc automatiquement après elle) ; c'est le composant qui
appelle `beginElement()` au survol du bouton — l'option que le prompt
proposait explicitement plutôt qu'un déclenchement au chargement. La `<svg>`
se remonte (clé react incrémentée) à la sortie de la souris pour revenir à
l'état « aiguille non trouvée » et pouvoir rejouer le tracé à chaque survol ;
un id unique par instance (`useId`) remplace l'id fixe du fichier source, qui
entrerait en collision si l'icône apparaît plusieurs fois sur la même page.
`prefers-reduced-motion` : dessin final statique directement rendu, aucune
balise `<animate>` montée.

### 4 — PhoneCall / FileText / Building2
Code fourni par l'utilisateur repris tel quel dans `components/icons/`
(bibliothèque Lucide Animated, @pqoqubbw, MIT, paquet `motion`). Une seule
correction : le fichier collé pour `BuildingOffice2Icon` contenait un
template literal cassé par le rendu du document source
(`` key={${window.path}-${index}} `` sans ses accents graves) — corrigé en
`` key={`${window.path}-${index}`} `` pour compiler. `prefers-reduced-motion`
n'est pas géré dans ces fichiers eux-mêmes (fidélité au code fourni) mais en
amont, dans `Bouton.tsx` : leur `startAnimation()` n'est simplement jamais
appelée quand la préférence est active, ce qui les laisse dans leur variante
`normal` — leur état statique équivalent.

### 5 — Attribution icône ↔ bouton
Les trois libellés du prompt (« Contactez-nous », « Demander un devis »,
« Voir nos réalisations ») ne correspondent pas tous exactement à un bouton
existant :
- **Contactez-nous** → PhoneCall. Présent deux fois (en-tête complet et
  en-tête compact au scroll, libellé raccourci « Contact ») ; les deux
  reçoivent l'icône, même CTA.
- **Demander un devis** → FileText. Présent deux fois (`AppelAction.tsx`,
  `Hero.tsx`) ; les deux reçoivent l'icône, même CTA.
- **Voir nos réalisations** → Building2. N'existe pas verbatim. Appliqué par
  rôle plutôt que par texte exact : le CTA portfolio du Hero (« Explorer nos
  projets ») et celui de la page 404 (« Voir les réalisations », le plus
  proche textuellement) reçoivent tous deux l'icône Building2.

Tous les autres boutons génériques (« Retour à l'accueil », « Voir nos
expertises », les CTA de formulaire, l'écran de connexion) gardent l'icône
Compass par défaut (nouveau prop `icone` sur `<Bouton>`, `'boussole'` par
défaut).

### 6 — Boutons hors de `<Bouton>`
Le prompt cite aussi « boutons de formulaire » et « filtres de portfolio »
parmi les boutons à retraiter :
- **Formulaires** (`FormulaireEtapes`, `FormulaireConnexion`) : leurs CTA
  principaux (« Continuer »/« Envoyer la demande », soumission de connexion)
  utilisaient déjà `<Bouton>` et héritent donc automatiquement du fond Liquid
  Metal. Les contrôles utilitaires (« Étape précédente », « Choisir un
  fichier », les puces de sélection « Type de projet », « Afficher/Masquer »
  le mot de passe) restent inchangés : ce sont des liens texte ou des
  puces de formulaire, pas des boutons CTA au sens du composant `<Bouton>`.
- **Carrousel de témoignages** : les deux flèches précédent/suivant (petits
  boutons carrés) sont passées en `LiquidMetalSurface` ronde — cas d'usage
  proche du variant `icon` de la démo source.
- **Filtres de portfolio/blog** (`FiltreBouton` dans `GrilleProjets.tsx` et
  son équivalent dans `GrilleArticles.tsx`) : **non retouchés, compromis
  assumé**. Ce sont des onglets texte soulignés (pas des boutons boîtés) :
  leur donner un fond Liquid Metal aurait exigé de repenser entièrement leur
  disposition, et monter un contexte WebGL par catégorie de filtre affichée
  (potentiellement une dizaine simultanément) est disproportionné pour un
  élément de navigation secondaire. Un remplacement fidèle nécessiterait un
  prompt dédié à la refonte de ces filtres, plutôt qu'un simple changement de
  style.
- **Menu et curseur personnalisé** : non touchés, comme demandé.

### Dépendances ajoutées
`@paper-design/shaders`, `motion` (paquet requis par le code fourni pour les
trois icônes, distinct de `framer-motion` déjà en place — les deux
cohabitent, chaque fichier n'utilisant que l'un des deux), `tailwind-merge`
(désormais utilisé dans `lib/utils.ts` : `cn()` dédoublonne les classes
Tailwind en conflit au lieu de les concaténer).

### Vérifications effectuées
`npm install`, `npx tsc --noEmit`, `npm run build` (18/18 pages générées) et
`npm run lint` passent tous sans erreur ni avertissement.

## Nouveau menu SlideTabs + Image Reveal (dernière passe — Prompt H)

### 1 — Menu latéral retiré, SlideTabs à la place
`components/layout/MenuLateral.tsx` est supprimé (fichier + ses deux
références, dans `Entete.tsx` — c'était le seul consommateur). Nouveau
composant `components/ui/slide-tabs.tsx` (source : 21st.dev/@minhxthanh),
5 onglets (Accueil → Actualités, Contact reste un CTA séparé).

Écart demandé par le prompt par rapport à la démo source : le fond en
pilule se positionne **au survol/focus** (`onMouseEnter`/`onFocus`), pas au
clic — le clic ne fait que naviguer via `<Link>`, la pilule ayant déjà
bougé avant qu'il n'arrive. Mesure de position : plutôt qu'un `layoutId`
Framer Motion (recalcul de shared-layout complet), lecture directe
`offsetLeft`/`offsetWidth` du DOM + une pilule unique animée par ressort —
plus simple pour une rangée qui ne se réordonne jamais. Quand la souris
quitte la zone sans clic, **la pilule revient sur l'onglet de la page
actuellement affichée** (`usePathname`) plutôt que de disparaître — des
deux comportements proposés par le prompt, celui-ci a été retenu car il
rappelle en permanence où l'on se trouve, plutôt qu'un simple retour à vide.

### 2 — En-tête à 3 zones, style quintadamalia.com
`Entete.tsx` réécrit : logo (taille « grande », inchangée) à gauche,
SlideTabs au centre, uniquement « Contactez-nous » à droite (icône
PhoneCall + Liquid Metal inchangés). Le bandeau n'est plus jamais un aplat
blanc plein : transparent tout en haut de page, très légèrement voilé
(`bg-white/45` + `backdrop-blur-md`) une fois le défilement commencé. Le
comportement caché/réaffiché au scroll est conservé. La forme compacte qui
prenait le relais quand le bandeau se cache ne contient plus qu'un CTA
Contact réduit — il n'y a plus de bouton menu/hamburger à y loger, le
SlideTabs n'a pas d'équivalent condensé pertinent pour cette forme.
Sous `md`, le SlideTabs redescend sur une deuxième ligne pleine largeur
(la grille à 3 colonnes de l'en-tête ne lui laisse pas assez de place à
côté du logo et du CTA) avec défilement horizontal si besoin (nouvelle
classe utilitaire `.no-scrollbar` dans `globals.css`).

### 3 — ImageHover (Image Reveal)
Nouveau composant `components/ui/image-reveal.tsx` (source :
21st.dev/@jatin-yadav05/components/image-reveal). Effet natif reproduit :
au repos l'image est voilée par un flou, une zone circulaire suit le
curseur pour la révéler par endroits. Implémentation : une seule couche
`backdrop-filter: blur()` superposée à l'image, avec un `mask-image`
(dégradé radial) qui y découpe un trou centré sur le curseur ; le **rayon**
du trou est lui-même animé par un ressort (0 → plein rayon) plutôt que
basculé entre `none` et le dégradé, pour que le trou grandisse/rétrécisse
en douceur au lieu d'apparaître d'un coup.

Extension demandée par le prompt (absente du composant source) : un clic
neutralise le flou entièrement (image nette en permanence, quelle que soit
la position du curseur) ; un clic ailleurs sur la page reflloute. Une seule
image révélée à la fois sur toute la page — état partagé minimal au niveau
du module (`revealedId`, un `Set` d'abonnés, `useSyncExternalStore`), pas de
`Context` React : ça évite de toucher `layout.tsx`/`Chrome.tsx` pour un
comportement que seules les instances de ce composant ont besoin de lire.
Point technique à noter : la fermeture de l'image précédemment révélée passe
par un **unique** écouteur `click` posé sur `document` (pas un écouteur par
image) qui relit l'état à jour au moment où il se déclenche — un écouteur
par instance aurait pu se déclencher dans un ordre différent selon l'élément
cliqué et fermer par erreur l'image qu'on vient juste d'ouvrir.

Tactile : sans survol réel, le suivi `mousemove` est simplement désactivé
(détection `(hover: hover) and (pointer: fine)`, même pattern que
`CurseurPersonnalise.tsx`) — le `onClick` (qui se déclenche aussi au tap)
prend seul le relais, donc **le premier tap déclenche directement la
révélation permanente**, l'option la plus naturelle vu qu'il n'y a pas de
survol à simuler. `prefers-reduced-motion` : la couche de flou n'est même
pas montée, l'image reste nette en toute circonstance.

### 4 — Portée d'application
Appliqué à 5 emplacements, tous des images sans lien ni destination
cliquable :
- Galerie avant/pendant/après (`app/realisations/[slug]/page.tsx`)
- Images de corps d'article (`components/ui/BlocsArticle.tsx`)
- Image de couverture d'article (`app/blog/[slug]/page.tsx`)
- Illustration de chaque mission (`app/services/page.tsx`)

**Portraits de l'équipe (`Equipe.tsx`) : volontairement non traité.** Ce
sont des monogrammes dessinés en CSS (pas de vraie photo, voir plus haut) —
appliquer un effet « flou qui se révèle » sur un bloc qui annonce déjà
lui-même « Portrait à venir » n'aurait rien à révéler. Un commentaire dans
le fichier indique comment brancher `<ImageHover>` le jour où de vraies
photos remplaceront ces monogrammes.

**Autres images sans lien, exclues avec leurs raisons :**
- Les trois usages d'`ImageParallax` (`AppelAction.tsx`, `Presentation.tsx`,
  `espace-ingenieurs/connexion/page.tsx`) portent déjà un effet propre
  (translation verticale liée au scroll) et, pour les deux premiers, du
  texte posé directement sur l'image. Superposer un second effet piloté par
  le curseur aurait fait concurrence à ce texte/CTA et surchargé une image
  qui bouge déjà pour une autre raison.
- `RecitDefilant.tsx` (récit défilant de la page À propos) : la visibilité
  de chaque image y est déjà pilotée par la position de scroll (fondu entre
  étapes) — y ajouter un état hover/clic serait entré en conflit avec cette
  logique d'étape active.

Aucun conflit détecté avec l'effet hover existant (zoom léger + badge
numéroté) des cartes de projets/articles déjà liées : ces cartes n'ont pas
été touchées, ImageHover n'est appliqué qu'aux images qui n'avaient
strictement aucun lien avant ce prompt.

### Vérifications effectuées
`npm install`, `npx tsc --noEmit`, `npm run build` (18/18 pages générées) et
`npm run lint` passent tous sans erreur ni avertissement.

## 4 fonds animés/gradients, par page et par couleur de section (dernière passe)

Répartition demandée : chaque page a 2 styles propres — un pour ses sections
à fond blanc, un pour ses sections à fond noir.

| Shader | Pages | Sections |
| --- | --- | --- |
| 1 — Mesh Drift (WebGL) | Accueil, Services, Actualités | fond blanc |
| 2 — Beams Background (canvas 2D) | Accueil, Services, Actualités | fond noir |
| 3 — Core Glow (CSS pur) | À propos, Réalisations, Contact | fond blanc |
| 4 — Background Paths (SVG) | À propos, Réalisations, Contact | fond noir |

### 1 — Fichiers
`components/ui/shader-background.tsx` reprend le composant React fourni à
l'identique (`ShaderBackground`) — sa palette de gris/blanc et `hue: 0` sont
déjà celles du fichier source, aucune adaptation de teinte n'était nécessaire.
Seule correction : une URL de référence en première ligne du fichier fourni
(hors commentaire) cassait la compilation ; commentée. `strictNullChecks` a
également nécessité quelques assertions `!` sur `canvas`/`gl` dans la boucle
de rendu (le rétrécissement de type de TypeScript ne traverse pas la fonction
imbriquée) — annotations de type uniquement, aucun changement de
comportement, GLSL et uniforms intacts.

`components/ui/beams-background.tsx` et `components/ui/background-paths.tsx`
adaptent les deux composants fournis : teinte HSL colorée → gris/blanc
uniquement (`rgba` directs), et on ne garde que la couche visuelle (canvas /
SVG), sans le texte de démo des composants sources. La bascule `dark:`
automatique du composant Beams source (détection d'une classe `dark`
globale) est retirée : ce site n'a pas de bascule de thème, ces deux
composants n'étant montés QUE sur des sections déjà à fond noir — une seule
palette suffit. Les deux se posent en pause dès qu'ils sortent du viewport
(`IntersectionObserver` pour Beams, `useInView` de framer-motion pour Paths),
même précaution que celle déjà présente dans le fichier Mesh Drift fourni :
plusieurs instances peuvent coexister sur une même page (une par section
concernée), pas seulement une par page entière.

`components/ui/fonds-page.tsx` expose `FondMeshDrift`/`FondBeams`/
`FondBackgroundPaths`, les enveloppes posées dans chaque section : chacune
gère `prefers-reduced-motion` (dégradé statique à la place du canvas/SVG animé
— même logique que `LiquidMetalSurface`) et se positionne en `-z-20` (sous le
`-z-10` déjà utilisé par `ImageParallax` sur les sections qui en ont une, ex.
`AppelAction`). Le Shader 3 (Core Glow) n'a pas d'enveloppe React : la classe
`.gradient-core-glow` (nouvelle règle dans `globals.css`, recopiée telle que
fournie) est posée directement sur la section — statique par nature, non
concernée par `prefers-reduced-motion`.

### 2 — Chargement conditionnel par page
`EnTetePage` et `AppelAction` sont communs aux deux groupes de pages et
choisissent entre deux fonds selon un nouveau prop `variante: 'principale' |
'secondaire'` — leur code source référence donc les 3 composants animés à la
fois. Pour éviter que cela fasse atterrir le poids des trois (WebGL + canvas
2D + SVG animé) dans le bundle de chaque page, `fonds-page.tsx` importe
`ShaderBackground`/`BeamsBackground`/`BackgroundPaths` via `next/dynamic`
(`ssr: false`) plutôt qu'en import statique : chacun devient un chunk séparé,
chargé uniquement quand la branche correspondante est effectivement montée —
donc uniquement sur les pages qui l'utilisent réellement.

### 3 — Compromis assumé : le plan de situation (Contact)
`CarteLocalisation.tsx` (le plan de situation en SVG) est le seul fond noir
dont le contenu est un unique `<svg>` avec son propre rectangle de fond opaque
(`#0A0A0A`) : posé strictement derrière (comme partout ailleurs), Background
Paths y serait invisible, entièrement recouvert. Il est ici superposé
au-dessus du plan à très faible opacité (`0.14`) en `mix-blend-screen` (qui
n'éclaircit que les zones sombres, jamais les zones déjà claires) : les
routes, le texte et le repère du plan restent lisibles. Le bandeau d'info en
bas de carte repasse en `z-10` pour rester cliquable au-dessus de cette
couche.

### 4 — Point de vigilance : contextes WebGL simultanés
Chaque bouton (`<Bouton>`) monte déjà son propre canvas WebGL
(`LiquidMetalSurface`). Les pages du groupe Accueil/Services/Actualités
peuvent désormais cumuler jusqu'à 5 instances de `ShaderBackground` (une par
section à fond blanc) en plus des boutons déjà présents. Chaque instance
coupe son rendu hors viewport (déjà intégré au fichier fourni), mais la
création du contexte WebGL lui-même a un coût même en pause. Aucun problème
constaté aux vérifications ci-dessous (Chrome), mais la limite de contextes
WebGL simultanés est plus basse sur certains navigateurs mobiles (Safari
notamment) — à surveiller si un test réel sur ces appareils montre un souci.

### Vérifications effectuées
`npm install`, `npx tsc --noEmit`, `npm run build` (18/18 pages générées) et
`npm run lint` passent tous sans erreur ni avertissement.

## Animations de texte (BlurReveal & TextEffect) + correction du flash blanc FAQ/shader

R�partition demandée, réutilisant exactement la même logique de groupes que
les fonds animés (prompt précédent) :

| Composant | Pages | Prop `variante` partagée |
| --- | --- | --- |
| BlurReveal (21st.dev/@badtzx0) | Accueil, Services, Actualités | `principale` |
| TextEffect « With Custom Delay » (21st.dev/@ibelick) | À propos, Réalisations, Contact | `secondaire` |

### 1 — BlurReveal : composant réel, deux adaptations assumées
`components/ui/blur-reveal.tsx` reprend tel quel le composant du registre
officiel (`badtz-ui.com/r/blur-reveal.json`), avec deux modifications :
- `useInView(..., { once: true })` → `once: false`. La source ne gère pas le
  rejeu : son `animate={isInView ? {...} : {}}` ne fait *rien* quand
  `isInView` redevient faux (`{}` = aucune cible, motion garde les
  dernières valeurs affichées) — en sortant du viewport, l'élément serait
  donc resté visible, sans rien à rejouer en revenant. Remplacé par une
  paire de variants `cache`/`visible` explicites, sur le modèle déjà en
  place dans `Apparition.tsx`.
- Ajout de `prefers-reduced-motion` (absent de la source).

`motion` (successeur de framer-motion, dépendance de la source) était déjà
installé depuis le Prompt G (icônes Lucide animées) et coexiste sans
conflit avec `framer-motion` — aucune bascule d'import n'a été nécessaire,
contrairement à l'hypothèse envisagée par le prompt.

`BlurRevealTitre` (même fichier) découpe un titre mot par mot en instances
`BlurReveal` à délai incrémental (`delay={0}`, `delay={0.08}`, …) —
exactement le motif de la démonstration officielle pour les titres — et
remplace l'ancienne implémentation manuelle du hero de l'accueil.

### 2 — TextEffect : point de vérification honnête
Le fichier source brut (`ibelick/motion-primitives`) n'a pas pu être
récupéré tel quel : `21st.dev/r/ibelick/text-effect` exige une clé API
21st.dev, et `motion-primitives.com` bloque l'accès automatisé à son
registre CLI. `components/ui/text-effect.tsx` reproduit le comportement à
partir de deux sources officielles vérifiées : la table des props
(`motion-primitives.com/docs/text-effect`) et la démonstration
`TextEffectWithCustomDelay` (21st.dev/@ibelick/components/text-effect),
reproduite ligne à ligne dans `EffetTexte.tsx` — mêmes noms de props, même
composition à trois blocs (amorce en `rotateX`, titre en préréglage par
défaut, corps en `preset="blur"`).

`TextEffect` ne détecte pas lui-même le viewport : son prop `trigger` est un
booléen piloté par l'appelant (voir la démo officielle
« TextEffectWithExit », qui bascule ce booléen pour montrer l'entrée ET la
sortie). `EffetTexte.tsx` fournit ce déclenchement via `useInView`.

### 3 — Rejeu au re-scroll
Les deux composants utilisent `useInView({ once: false })` : `BlurReveal`
en interne, `TextEffect` via le `trigger` fourni par `EffetTexte`. Quand
`trigger` repasse à `false`, `TextEffect` démonte son contenu par
`AnimatePresence` (variant `exit`) puis le remonte au passage suivant à
`true` — l'animation d'entrée se rejoue donc proprement à chaque fois, y
compris lors d'allers-retours rapides (chaque montage est indépendant, pas
de superposition possible). `prefers-reduced-motion` est respecté par les
deux (affichage direct, sans flou ni rotation).

### 4 — Portée d'application
Le titre du hero de chaque page reste découpé mot par mot (`BlurRevealTitre`
pour Accueil ; `TextEffect` avec `per="word"` — natif au composant — pour
les 5 autres, via `EnTetePage`). Convertis : `Hero.tsx`, `EnTetePage.tsx`,
`AppelAction.tsx`, `TitreSection.tsx` (nouveau prop `variante`, répercuté sur
ses 11 points d'appel), `Presentation.tsx`, `ProjetsALaUne.tsx`,
`Partenaires.tsx`, `Questions.tsx`, `Certifications.tsx`, `Equipe.tsx`,
`services/page.tsx`, `blog/[slug]/page.tsx`, `realisations/[slug]/page.tsx`.

**Volontairement laissés sur `Apparition`/inchangés, avec leurs raisons :**
- Boutons, liens de navigation/CTA, badges (`Etiquette`), listes de
  données (`<dl>`, clients/outils) : ce ne sont pas des titres ou des
  paragraphes au sens du prompt.
- Grilles de cartes (projets, articles, membres de l'équipe, galerie
  avant/pendant/après) : apparition de blocs structurés, pas de texte.
- `RecitDefilant.tsx` (À propos) : ses titres/paragraphes n'avaient déjà
  aucune animation d'entrée avant ce prompt (seule la position de scroll
  pilote l'étape active) — remplacer une animation de texte inexistante
  n'avait pas de sens, et ajouter `useInView` sur ce texte serait entré en
  conflit avec la logique d'étape déjà en place.
- `ChiffresCles.tsx`, `Temoignages.tsx` : seul `TitreSection` y porte du
  texte de titre ; le reste (compteurs, citations qui défilent) n'est pas
  concerné.

### 5 — Bug corrigé : flash blanc du shader au clic sur les FAQ
Diagnostic confirmé (le seul endroit du site combinant fond WebGL et FAQ est
`Questions.tsx`, sur l'accueil) : ni démontage du composant, ni `key`
changeante, ni prop `layout` de Framer Motion sur l'accordéon (qui anime sa
hauteur explicitement). La vraie cause : `FondMeshDrift` remplit toute la
section (`absolute inset-0`) ; quand l'accordéon s'ouvre ou se ferme
au-dessus, la hauteur de la section change en continu pendant toute la
transition. Affecter `canvas.width`/`canvas.height` **efface le framebuffer
WebGL immédiatement** (comportement natif du canvas) — répéter ce
redimensionnement à chaque frame de la transition efface le buffer plus vite
que la boucle de rendu ne peut le redessiner, et le fond blanc de la page
transparaît le temps d'une frame.

Correction dans `shader-background.tsx` : `resizeCanvas()` (déjà appelée à
chaque frame par la boucle de rendu) n'applique plus le redimensionnement
tant que la mesure n'est pas identique sur deux passages consécutifs.
Pendant une transition, la mesure change d'une frame à l'autre : le canvas
garde son ancienne résolution et le CSS (`width:100%;height:100%`) l'étire
sans accroc — flou d'une frame ou deux, imperceptible sur un fond animé, très
loin devant le flash blanc. Dès que l'accordéon a fini de bouger, le
redimensionnement s'applique proprement, une seule fois. Le canvas WebGL
reste monté et continue d'animer sans interruption du début à la fin —
aucune restructuration du DOM n'a été nécessaire. Deux appels de
`resizeCanvas()` à l'amorçage évitent qu'un montage normal (hors FAQ) perde
un frame le temps que la mesure se stabilise.

### Vérifications effectuées
`npm install`, `npx tsc --noEmit`, `npm run build` (18/18 pages générées) et
`npm run lint` passent tous sans erreur ni avertissement.
