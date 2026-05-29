/**
 * Templates d'interprétation — génère le texte "Ce que ça signifie / Ce que tu dois faire"
 * à partir des données brutes du backend, SANS LLM.
 *
 * Architecture évolutive : quand le LLM sera disponible, le backend pourra retourner
 * un champ `interpretation_text` optionnel qui remplacera ces templates.
 * Le frontend donne toujours priorité au texte LLM s'il existe.
 */

import type { TrendTendance, MonPays, Competence, VueGlobale } from "@/services/api/trends.api";

// ── Helpers ───────────────────────────────────────────────────────────────────

function variationWord(pct: number): string {
  if (pct > 30) return "très forte hausse";
  if (pct > 10) return "hausse notable";
  if (pct > 0)  return "légère hausse";
  if (pct < -10) return "recul";
  return "stabilité";
}

function pays(list: { pays: string }[]): string {
  if (!list.length) return "plusieurs pays africains";
  if (list.length === 1) return list[0].pays;
  return `${list.slice(0, 2).map(p => p.pays).join(" et ")}`;
}

// ── Bloc 1 : Cette semaine en Afrique ────────────────────────────────────────

export function interpretWeekTendance(t: TrendTendance, topPays: { pays: string }[]): {
  ce_qui_se_passe: string;
  signification: string;
  action: string;
} {
  const paysStr = pays(topPays);
  const variation = t.variation_pct;
  const label = t.label.toLowerCase();

  if (t.type === "job" || t.type === "opportunity") {
    return {
      ce_qui_se_passe: variation > 0
        ? `Les ${label} sont en ${variationWord(variation)} cette semaine, avec ${t.count} nouvelles offres publiées, particulièrement actives en ${paysStr}.`
        : `Le marché des ${label} reste actif cette semaine avec ${t.count} offres disponibles sur le continent.`,
      signification: variation > 15
        ? "Les entreprises recrutent activement. Ce pic de recrutement signifie que les décisions de recrutement se prennent maintenant — pas dans trois mois."
        : "Le marché reste porteur. Les offres publiées cette semaine ont généralement une fenêtre de candidature de 2 à 4 semaines.",
      action: "Identifie 3 offres qui correspondent à ton profil et soumets ta candidature avant la fin de la semaine. Les candidatures envoyées en début de période ont statistiquement plus de visibilité.",
    };
  }

  if (t.type === "scholarship") {
    return {
      ce_qui_se_passe: `${t.count} nouvelles bourses d'études sont disponibles cette semaine ${variation > 0 ? `(+${variation}% vs semaine précédente)` : ""}.`,
      signification: "Les bourses ont des délais stricts. Une bourse publiée cette semaine peut fermer dans 10 à 30 jours. Ne pas agir rapidement, c'est manquer l'opportunité.",
      action: "Consulte la liste des bourses disponibles, identifie celles qui correspondent à ton niveau et ton domaine, et prépare ton dossier immédiatement.",
    };
  }

  if (t.type === "grant" || t.type === "partnership") {
    return {
      ce_qui_se_passe: `${t.count} opportunités de financement ou de partenariat ont été publiées cette semaine en Afrique.`,
      signification: "Ces financements ciblent souvent des structures précises : startups, associations, PME, porteurs de projets. Si tu as un projet en cours, c'est le moment de vérifier l'éligibilité.",
      action: "Examine les critères d'éligibilité de chaque financement. Si tu réponds aux critères, prépare un résumé de projet de 2 pages — c'est souvent tout ce qu'il faut pour une première candidature.",
    };
  }

  if (t.type === "call_for_applications") {
    return {
      ce_qui_se_passe: `${t.count} appels à candidature sont actifs cette semaine sur le continent.`,
      signification: "Les appels à candidature (programmes, incubateurs, résidences, concours) ont des délais courts et des places limitées. Les candidats qui postulent en premier ont souvent l'avantage.",
      action: "Lis attentivement chaque appel et évalue honnêtement si tu corresponds. Mieux vaut postuler à 2 appels bien ciblés qu'à 10 appels sans préparation.",
    };
  }

  return {
    ce_qui_se_passe: `${t.count} nouvelles opportunités de type "${t.label}" sont disponibles cette semaine.`,
    signification: "Ces opportunités s'adressent à des profils variés sur le continent.",
    action: "Explore les offres disponibles et identifie celles qui correspondent à ta situation actuelle.",
  };
}

// ── Bloc 2 : Ton pays ce mois-ci ─────────────────────────────────────────────

export function interpretMonPays(data: MonPays): {
  emplois: string;
  financements: string;
  missions: string;
  appels_offre: string;
  bourses: string;
} {
  const { pays: country, emplois, financements, missions, appels_offre, bourses } = data;

  return {
    emplois: emplois > 0
      ? `${emplois} offres d'emploi actives ${emplois > 20 ? "— le marché local est dynamique en ce moment" : "— volume modéré mais des opportunités ciblées existent"}. Postule sur les offres les plus récentes en premier.`
      : `Peu d'offres d'emploi géolocalisées en ${country} ce mois-ci. Élargis ta recherche aux offres régionales ou remote pour ne pas manquer d'opportunités.`,

    financements: financements > 0
      ? `${financements} opportunités de financement disponibles. Vérifie les critères d'éligibilité — certains financements ciblent spécifiquement des projets dans ta région.`
      : `Pas de financement géolocalisé en ${country} ce mois-ci. Regarde les programmes internationaux ouverts aux candidats africains.`,

    missions: missions > 0
      ? `${missions} missions et opportunités de consulting actives. Le marché freelance est porteur — si tu as une expertise spécifique, c'est le moment de la valoriser.`
      : `Peu de missions freelance locales ce mois-ci. Les plateformes internationales (Upwork, Fiverr, Malt) restent accessibles pour compléter.`,

    appels_offre: appels_offre > 0
      ? `${appels_offre} appels à candidature ouverts. Ces processus ont des délais stricts — consulte-les maintenant et note les dates de clôture.`
      : `Aucun appel à candidature géolocalisé ce mois-ci. Surveille les plateformes d'organisations internationales présentes en ${country}.`,

    bourses: bourses > 0
      ? `${bourses} bourses disponibles. Certaines ferment dans moins de 30 jours — priorise celles dont la date limite approche.`
      : `Peu de bourses géolocalisées ce mois-ci. Les bourses internationales ouvertes à tous les Africains restent une option à explorer.`,
  };
}

// ── Bloc 3 : Compétences montantes ───────────────────────────────────────────

export function interpretCompetence(c: Competence): {
  pourquoi: string;
  si_tu_as: string;
  si_tu_nas_pas: string;
} {
  const { competence, pct_offres, variation_pts } = c;
  const hausse = variation_pts > 5;
  const forte = pct_offres > 30;

  return {
    pourquoi: forte
      ? `"${competence}" apparaît dans ${pct_offres}% des offres analysées${hausse ? `, en hausse de ${variation_pts} points` : ""}. Ce n'est plus un avantage — c'est un prérequis implicite que les recruteurs cherchent même quand ils ne le mentionnent pas explicitement.`
      : `"${competence}" est mentionné dans ${pct_offres}% des offres${hausse ? ` et progresse (+${variation_pts} pts)` : ""}. La demande est réelle et croissante dans ta région.`,

    si_tu_as: forte
      ? `Mets-la explicitement en avant dans ton profil et tes candidatures avec des exemples concrets. Ne la cite pas juste — prouve-la.`
      : `C'est une différenciation réelle. Mets-la en avant et cherche à l'approfondir pour consolider ton avantage.`,

    si_tu_nas_pas: hausse
      ? `La demande monte — c'est le bon moment pour l'acquérir avant que tout le monde l'ait. Une formation courte (2 à 6 semaines) peut suffire pour démarrer.`
      : `Évalue si cette compétence est stratégique pour ton parcours. Si oui, planifie une formation — mieux vaut commencer maintenant qu'attendre.`,
  };
}

// ── Bloc 4 : Vue Globale ──────────────────────────────────────────────────────

export function interpretVueGlobale(data: VueGlobale): {
  geographie: string;
  repartition: string;
  signal: string | null;
  action_globale: string;
} {
  const { total_offres, top_pays, par_type, signal_semaine } = data;
  const topPaysStr = top_pays.slice(0, 3).map(p => p.pays).join(", ");

  const typeLabels: Record<string, string> = {
    job: "emplois",
    scholarship: "bourses",
    grant: "financements",
    call_for_applications: "appels à candidature",
    opportunity: "opportunités",
    formation: "formations",
    partnership: "partenariats",
  };

  const topType = Object.entries(par_type).sort((a, b) => b[1] - a[1])[0];
  const topTypeLabel = topType ? typeLabels[topType[0]] || topType[0] : "opportunités";
  const topTypeCount = topType ? topType[1] : 0;

  return {
    geographie: top_pays.length > 0
      ? `Cette semaine, ${total_offres} opportunités ont été indexées sur le continent. Les marchés les plus actifs sont ${topPaysStr}. Ces pays concentrent l'essentiel de l'activité en ce moment — c'est là que les décisions se prennent.`
      : `Cette semaine, ${total_offres} opportunités ont été indexées sur l'ensemble du continent africain.`,

    repartition: topTypeCount > 0
      ? `Les ${topTypeLabel} dominent avec ${topTypeCount} offres, soit ${Math.round((topTypeCount / total_offres) * 100)}% du total. C'est le segment le plus actif du marché cette semaine.`
      : "La répartition des opportunités est équilibrée entre les différents types ce mois-ci.",

    signal: signal_semaine
      ? `Signal à surveiller : les "${signal_semaine.label}" progressent de ${signal_semaine.croissance_pct}% cette semaine avec ${signal_semaine.count} nouvelles occurrences. Un segment en accélération, souvent précurseur d'une tendance durable.`
      : null,

    action_globale: "Identifie le segment qui correspond le mieux à ton objectif du moment, et concentre ton énergie là-dessus cette semaine. La dispersion est l'ennemi de l'efficacité dans la recherche d'opportunités.",
  };
}
