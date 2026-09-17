/**
 * Visuels du site public.
 *
 * Règles tenues ici :
 *  · chaque photo n'apparaît qu'à UN seul endroit du site ;
 *  · tout visuel montrant des personnes montre des personnes africaines ;
 *  · deux variantes existent pour chaque fichier : `nom.webp` (2000 px, pour
 *    les bannières) et `nom@sm.webp` (1100 px, pour les photos de corps).
 *    `light()` bascule automatiquement sur la variante légère ;
 *  · le texte alternatif est fourni dans les deux langues du site.
 *
 * Ajouter une photo : la déposer dans `public/media/`, lancer
 * `node scripts/optimize-media.mjs` (compression + variantes), puis l'ajouter ici.
 */

export type SiteImage = {
  src: string;
  /** Texte alternatif français. */
  alt: string;
  /** Texte alternatif anglais : `SitePhoto` choisit selon la langue active. */
  altEn: string;
  position?: string;
};

const p = (file: string) => `/media/${file}.webp`;

export const MEDIA = {
  /* ── Bannières de page ─────────────────────────────────────────────── */

  /** Accueil : équipe d'ingénieurs devant leurs écrans */
  home: {
    src: p("teamworking-engineers-talking-server-room-doin"),
    alt: "Équipe d'ingénieurs africains en échange devant leurs écrans",
    altEn: "African engineering team talking in front of their screens",
    position: "center 40%",
  },
  /** Malayka Data : supervision d'infrastructure */
  data: {
    src: p("data-center-expert-doing-software-updates-veri"),
    alt: "Experts supervisant une infrastructure de données",
    altEn: "Experts overseeing a data infrastructure",
    position: "center 45%",
  },
  /** Entreprises d'IA : réseaux de neurones à l'écran */
  aiCompanies: {
    src: p("black-person-programming-neural-network-code-w"),
    alt: "Développeur travaillant sur un réseau de neurones",
    altEn: "Developer working on a neural network",
    position: "center 45%",
  },
  /** Gouvernements, ONG, bailleurs : quartier d'affaires */
  governments: {
    src: p("hight-rise-condominium-office-buildings"),
    alt: "Quartier d'affaires vu du ciel",
    altEn: "Business district seen from above",
    position: "center 55%",
  },
  /** Malayka Éducative : groupe d'étude */
  education: {
    src: p("study-group-african-people"),
    alt: "Groupe d'étudiants travaillant ensemble",
    altEn: "Group of students working together",
    position: "center 40%",
  },
  /** Établissements & EdTech : étudiantes sur le campus */
  institutions: {
    src: p("three-african-students-female-posed-with-backp"),
    alt: "Étudiantes dans la cour de leur université",
    altEn: "Students in their university courtyard",
    position: "center 35%",
  },
  /** Particuliers : jeune professionnelle en ville */
  individuals: {
    src: p("positive-young-woman-holds-digital-tablet-uses"),
    alt: "Jeune professionnelle avec sa tablette en ville",
    altEn: "Young professional with a tablet in the city",
    position: "center 30%",
  },
  /** À propos : Abidjan, Le Plateau */
  about: {
    src: "/media/abidjan-plateau.jpg",
    alt: "Le Plateau, quartier d'affaires d'Abidjan",
    altEn: "Le Plateau, the business district of Abidjan",
    position: "center 45%",
  },
  /** Comment ça marche : supervision d'un système d'IA */
  howItWorks: {
    src: p("tech-support-oversees-ai-neural-network"),
    alt: "Supervision d'un système d'intelligence artificielle",
    altEn: "Overseeing an artificial intelligence system",
    position: "center 40%",
  },

  /* ── Photos de corps de page ───────────────────────────────────────── */

  /** Veille et collecte des signaux */
  collecte: {
    src: p("forex-trader-analyzing-market-growth"),
    alt: "Analyse de flux de données sur plusieurs écrans",
    altEn: "Analysing data streams across several screens",
    position: "center 45%",
  },
  /** Annotation et vérification humaine */
  annotation: {
    src: p("annotation"),
    alt: "Travail d'annotation et de classification",
    altEn: "Annotation and classification work",
    position: "center 30%",
  },
  /** Passage à l'action après une recommandation */
  action: {
    src: p("woman-using-her-smartphone-talk-with-someone-1"),
    alt: "Recevoir une opportunité sur son téléphone",
    altEn: "Receiving an opportunity on your phone",
    position: "center 35%",
  },
  /** Recherches et remontées terrain */
  terrain: {
    src: p("multiethnic-team-friends-chatting-bridge"),
    alt: "Échanges de terrain avec une communauté",
    altEn: "Field conversations with a community",
    position: "center 40%",
  },
  /** Équipe Malayka */
  equipe: {
    src: p("startup-colleagues-reviewing-data-improve-cust"),
    alt: "Revue de données en équipe",
    altEn: "Reviewing data as a team",
    position: "center 40%",
  },
  /** Ville et infrastructures */
  ville: {
    src: p("no-people-contemporary-building-exterior-skysc"),
    alt: "Architecture urbaine contemporaine",
    altEn: "Contemporary urban architecture",
    position: "center 50%",
  },
  /** Salle de formation */
  formation: {
    src: p("shooting-range-safety-officer-ensuring-clients"),
    alt: "Séance de formation en petit groupe",
    altEn: "Small-group training session",
    position: "center 40%",
  },

  /* ── Compositions et séquences ─────────────────────────────────────── */

  /** Observatoire : données démographiques à l'écran */
  observatoire: {
    src: p("governmental-hacker-woman-working-with-tablet-"),
    alt: "Analyste consultant un tableau de bord démographique",
    altEn: "Analyst reviewing a demographic dashboard",
    position: "center 35%",
  },
  /** Restitution d'un tableau de bord */
  restitution: {
    src: p("dashboard-future"),
    alt: "Présentation d'un tableau de bord d'indicateurs",
    altEn: "Presentation of an indicator dashboard",
    position: "center 40%",
  },
  /** Rapport annuel, redevabilité */
  rapport: {
    src: p("financial-advisor-expert-highlighting-importan"),
    alt: "Présentation d'un rapport d'indicateurs annuels",
    altEn: "Presenting a report of annual indicators",
    position: "center 40%",
  },
  /** Pilotage sur plusieurs écrans */
  pilotage: {
    src: p("man-with-clipboard-trading-office"),
    alt: "Pilotage d'indicateurs sur plusieurs écrans",
    altEn: "Steering indicators across several screens",
    position: "center 45%",
  },
  /** Travail de fond sur les modèles */
  modeles: {
    src: p("it-professional-listening-music-working-with-a"),
    alt: "Travail sur des modèles d'apprentissage profond",
    altEn: "Working on deep learning models",
    position: "center 40%",
  },
  /** Compétences techniques de terrain */
  competences: {
    src: p("black-engineering-team-reviewing-solar-panels-"),
    alt: "Ingénieurs examinant une installation solaire",
    altEn: "Engineers inspecting a solar installation",
    position: "center 40%",
  },
  /** Recherche à plusieurs sur un même appareil */
  recherche: {
    src: p("people-browsing-laptop-tablet"),
    alt: "Recherche collective sur ordinateur et tablette",
    altEn: "Searching together on laptop and tablet",
    position: "center 50%",
  },
  /** Entraide entre pairs */
  entraide: {
    src: p("group-male-friends-looking-device"),
    alt: "Trois jeunes consultant une opportunité ensemble",
    altEn: "Three young people looking at an opportunity together",
    position: "center 35%",
  },
  /** Réussite collective */
  reussite: {
    src: p("group-cheerful-friends-with-facemasks-taking-s"),
    alt: "Groupe de jeunes célébrant une réussite",
    altEn: "Group of young people celebrating a success",
    position: "center 35%",
  },
  /** Entrepreneur en mouvement */
  entrepreneur: {
    src: p("urban-shot-confident-african-american-business"),
    alt: "Entrepreneur consultant son téléphone en ville",
    altEn: "Entrepreneur checking their phone in the city",
    position: "center 35%",
  },
  /** Vue aérienne de ville */
  ciel: {
    src: p("bird-city"),
    alt: "Ville africaine vue du ciel",
    altEn: "African city seen from the sky",
    position: "center 45%",
  },
  /** Données urbaines en composition circulaire */
  circulaire: {
    src: p("cityscape-with-little-planet-effect"),
    alt: "Représentation circulaire d'une ville connectée",
    altEn: "Circular rendering of a connected city",
    position: "center center",
  },
  /** Territoire, échelle continentale */
  territoire: {
    src: p("landscape-field-covered-greenery-water-cloudy-"),
    alt: "Paysage de plaine et cours d'eau",
    altEn: "Plains and waterway landscape",
    position: "center 55%",
  },
  /** Horizon, projection dans le temps */
  horizon: {
    src: p("mesmerizing-scenery-jungles-south-africa"),
    alt: "Savane au coucher du soleil",
    altEn: "Savannah at sunset",
    position: "center 50%",
  },
  /** Long terme, vision */
  vision: {
    src: p("view-quiver-trees-forest-with-beautiful-sky-su"),
    alt: "Forêt d'arbres-quivers au crépuscule",
    altEn: "Quiver tree forest at dusk",
    position: "center 50%",
  },
  /** Apprentissage en classe */
  classe: {
    src: "/media/classe-afrique.jpg",
    alt: "Élèves travaillant ensemble en classe",
    altEn: "Pupils working together in class",
    position: "center 40%",
  },

  /* ── Manifeste « IA spécialisées » (accueil) ───────────────────────── */

  /** Celle qui façonne : technicienne devant un modèle en cours d'entraînement */
  iaPortrait: {
    src: p("ia-visualisation-portrait"),
    alt: "Technicienne devant la visualisation d'un modèle en cours d'entraînement",
    altEn: "Technician in front of a model being trained",
    position: "center 35%",
  },
  /** Le façonnage : manipulation d'un modèle en immersion */
  iaImmersion: {
    src: p("ia-immersion-vr"),
    alt: "Ingénieure manipulant un réseau de neurones en réalité virtuelle",
    altEn: "Engineer shaping a neural network in virtual reality",
    position: "center 40%",
  },
  /** La spécialisation : une IA appliquée à un secteur réel */
  iaSecteur: {
    src: p("ia-energie-terrain"),
    alt: "Ingénieure pilotant une IA appliquée à une installation énergétique",
    altEn: "Engineer running an AI applied to an energy plant",
    position: "center 45%",
  },

  /* ── Manifeste « infrastructure » (à propos) ───────────────────────── */

  /** Former : lecture d'un parcours à trois */
  infraFormer: {
    src: p("ia-analyse-donnees-equipe"),
    alt: "Trois professionnels analysant ensemble un dossier de parcours",
    altEn: "Three professionals reviewing a learning pathway together",
    position: "center 40%",
  },
  /** Orienter : décision collective devant les modèles */
  infraOrienter: {
    src: p("ia-modeles-presentation"),
    alt: "Réunion de décision autour de modèles projetés",
    altEn: "Decision meeting around projected models",
    position: "center 45%",
  },
  /** Insérer : revue d'indicateurs avant décision */
  infraInserer: {
    src: p("ia-supervision-tablette"),
    alt: "Revue d'indicateurs devant une infrastructure de calcul",
    altEn: "Reviewing indicators in front of a compute infrastructure",
    position: "center 40%",
  },
} satisfies Record<string, SiteImage>;

/** Compatibilité avec les anciens noms d'emplacements. */
export const MEDIA_ALIASES = {
  governments: MEDIA.governments,
  institutions: MEDIA.institutions,
  individuals: MEDIA.individuals,
  about: MEDIA.about,
  howItWorks: MEDIA.howItWorks,
  community: MEDIA.action,
  focus: MEDIA.collecte,
  research: MEDIA.annotation,
  workspace: MEDIA.equipe,
  craft: MEDIA.terrain,
} satisfies Record<string, SiteImage>;

/**
 * Variante légère (1100 px) produite par `scripts/optimize-media.mjs` : une
 * photo affichée en carte n'a pas besoin de la résolution d'une bannière.
 */
export function light(image: SiteImage): SiteImage {
  return { ...image, src: image.src.replace(/\.webp$/, "@sm.webp") };
}

/** Crédits des photos sous licence libre que nous hébergeons. */
export const PHOTO_CREDITS = [
  {
    file: "/media/abidjan-plateau.jpg",
    title: "Le Plateau depuis le Pont ADO, Abidjan",
    author: "Edison McCullen",
    license: "CC BY 4.0",
    source: "Wikimedia Commons",
  },
  {
    file: "/media/classe-afrique.jpg",
    title: "Students reading in a classroom",
    author: "Bright Kwame Ayisi",
    license: "CC0",
    source: "Wikimedia Commons",
  },
];

/** Organisations qui utilisent déjà Malayka ou collaborent avec nous. */
export const PARTNERS = [
  "Genoskul",
  "Eltange",
  "Yalna Technologie",
  "Payiskoul",
  "Cayvay",
  "DaSur",
  "Monrecru",
  "Jobbiman",
];
