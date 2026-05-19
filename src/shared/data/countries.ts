export interface Country {
  code: string;  // ISO 3166-1 alpha-2
  name: string;
  nameFr: string;
  dialCode: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  // Afrique de l'Ouest
  { code: "CI", name: "Côte d'Ivoire", nameFr: "Côte d'Ivoire", dialCode: "+225", flag: "🇨🇮" },
  { code: "SN", name: "Senegal", nameFr: "Sénégal", dialCode: "+221", flag: "🇸🇳" },
  { code: "ML", name: "Mali", nameFr: "Mali", dialCode: "+223", flag: "🇲🇱" },
  { code: "BF", name: "Burkina Faso", nameFr: "Burkina Faso", dialCode: "+226", flag: "🇧🇫" },
  { code: "GN", name: "Guinea", nameFr: "Guinée", dialCode: "+224", flag: "🇬🇳" },
  { code: "GH", name: "Ghana", nameFr: "Ghana", dialCode: "+233", flag: "🇬🇭" },
  { code: "NG", name: "Nigeria", nameFr: "Nigéria", dialCode: "+234", flag: "🇳🇬" },
  { code: "TG", name: "Togo", nameFr: "Togo", dialCode: "+228", flag: "🇹🇬" },
  { code: "BJ", name: "Benin", nameFr: "Bénin", dialCode: "+229", flag: "🇧🇯" },
  { code: "NE", name: "Niger", nameFr: "Niger", dialCode: "+227", flag: "🇳🇪" },
  { code: "MR", name: "Mauritania", nameFr: "Mauritanie", dialCode: "+222", flag: "🇲🇷" },
  { code: "GM", name: "Gambia", nameFr: "Gambie", dialCode: "+220", flag: "🇬🇲" },
  { code: "GW", name: "Guinea-Bissau", nameFr: "Guinée-Bissau", dialCode: "+245", flag: "🇬🇼" },
  { code: "SL", name: "Sierra Leone", nameFr: "Sierra Leone", dialCode: "+232", flag: "🇸🇱" },
  { code: "LR", name: "Liberia", nameFr: "Libéria", dialCode: "+231", flag: "🇱🇷" },
  // Afrique Centrale
  { code: "CM", name: "Cameroon", nameFr: "Cameroun", dialCode: "+237", flag: "🇨🇲" },
  { code: "CD", name: "DR Congo", nameFr: "RD Congo", dialCode: "+243", flag: "🇨🇩" },
  { code: "CG", name: "Congo", nameFr: "Congo", dialCode: "+242", flag: "🇨🇬" },
  { code: "GA", name: "Gabon", nameFr: "Gabon", dialCode: "+241", flag: "🇬🇦" },
  { code: "CF", name: "Central African Republic", nameFr: "Centrafrique", dialCode: "+236", flag: "🇨🇫" },
  { code: "TD", name: "Chad", nameFr: "Tchad", dialCode: "+235", flag: "🇹🇩" },
  { code: "GQ", name: "Equatorial Guinea", nameFr: "Guinée équatoriale", dialCode: "+240", flag: "🇬🇶" },
  // Afrique de l'Est
  { code: "ET", name: "Ethiopia", nameFr: "Éthiopie", dialCode: "+251", flag: "🇪🇹" },
  { code: "KE", name: "Kenya", nameFr: "Kenya", dialCode: "+254", flag: "🇰🇪" },
  { code: "TZ", name: "Tanzania", nameFr: "Tanzanie", dialCode: "+255", flag: "🇹🇿" },
  { code: "UG", name: "Uganda", nameFr: "Ouganda", dialCode: "+256", flag: "🇺🇬" },
  { code: "RW", name: "Rwanda", nameFr: "Rwanda", dialCode: "+250", flag: "🇷🇼" },
  { code: "BI", name: "Burundi", nameFr: "Burundi", dialCode: "+257", flag: "🇧🇮" },
  { code: "DJ", name: "Djibouti", nameFr: "Djibouti", dialCode: "+253", flag: "🇩🇯" },
  { code: "SO", name: "Somalia", nameFr: "Somalie", dialCode: "+252", flag: "🇸🇴" },
  // Afrique du Nord
  { code: "MA", name: "Morocco", nameFr: "Maroc", dialCode: "+212", flag: "🇲🇦" },
  { code: "DZ", name: "Algeria", nameFr: "Algérie", dialCode: "+213", flag: "🇩🇿" },
  { code: "TN", name: "Tunisia", nameFr: "Tunisie", dialCode: "+216", flag: "🇹🇳" },
  { code: "LY", name: "Libya", nameFr: "Libye", dialCode: "+218", flag: "🇱🇾" },
  { code: "EG", name: "Egypt", nameFr: "Égypte", dialCode: "+20", flag: "🇪🇬" },
  // Afrique Australe
  { code: "ZA", name: "South Africa", nameFr: "Afrique du Sud", dialCode: "+27", flag: "🇿🇦" },
  { code: "ZW", name: "Zimbabwe", nameFr: "Zimbabwe", dialCode: "+263", flag: "🇿🇼" },
  { code: "ZM", name: "Zambia", nameFr: "Zambie", dialCode: "+260", flag: "🇿🇲" },
  { code: "MG", name: "Madagascar", nameFr: "Madagascar", dialCode: "+261", flag: "🇲🇬" },
  // Europe
  { code: "FR", name: "France", nameFr: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "BE", name: "Belgium", nameFr: "Belgique", dialCode: "+32", flag: "🇧🇪" },
  { code: "CH", name: "Switzerland", nameFr: "Suisse", dialCode: "+41", flag: "🇨🇭" },
  { code: "CA", name: "Canada", nameFr: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { code: "US", name: "United States", nameFr: "États-Unis", dialCode: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", nameFr: "Royaume-Uni", dialCode: "+44", flag: "🇬🇧" },
  { code: "DE", name: "Germany", nameFr: "Allemagne", dialCode: "+49", flag: "🇩🇪" },
  { code: "ES", name: "Spain", nameFr: "Espagne", dialCode: "+34", flag: "🇪🇸" },
  { code: "IT", name: "Italy", nameFr: "Italie", dialCode: "+39", flag: "🇮🇹" },
  { code: "PT", name: "Portugal", nameFr: "Portugal", dialCode: "+351", flag: "🇵🇹" },
];

export const DEFAULT_COUNTRY = COUNTRIES.find((c) => c.code === "CI")!;

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code);
}

export function searchCountries(query: string): Country[] {
  const q = query.toLowerCase().trim();
  if (!q) return COUNTRIES;
  return COUNTRIES.filter(
    (c) =>
      c.nameFr.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.dialCode.includes(q) ||
      c.code.toLowerCase().includes(q)
  );
}

export const STUDY_LEVELS = [
  { value: "L1", label: "Licence 1" },
  { value: "L2", label: "Licence 2" },
  { value: "L3", label: "Licence 3" },
  { value: "M1", label: "Master 1" },
  { value: "M2", label: "Master 2" },
  { value: "PhD", label: "Doctorat" },
  { value: "BTS", label: "BTS / DUT" },
  { value: "other", label: "Autre" },
] as const;

export const DOMAIN_SUGGESTIONS = [
  "Informatique / Développement",
  "Marketing digital",
  "Finance & Comptabilité",
  "Droit",
  "Médecine & Santé",
  "Ingénierie",
  "Architecture",
  "Commerce & Vente",
  "Ressources humaines",
  "Communication",
  "Agriculture",
  "Éducation & Formation",
  "Logistique & Transport",
  "Tourisme & Hôtellerie",
  "Arts & Culture",
];
