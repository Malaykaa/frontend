import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, Section, Steps, FeatureGrid } from "../ui";

/**
 * Malayka Éducative — écoles, universités, formateurs, centres de formation.
 *
 * Le contenu décrit uniquement des mécanismes réellement implémentés côté
 * Institution : classes, envoi de cours, QCM corrigés de façon déterministe,
 * rapport de difficulté par notion, plan d'accompagnement déclenché sous 50 %,
 * archivage réversible, rapports d'impact.
 *
 * Rien n'est promis ici qui n'existe pas — c'est ce qui permet de soutenir la
 * page en démonstration devant un établissement.
 */

const PARCOURS = [
  {
    title: "L'établissement crée ses salles",
    text: "Un responsable ouvre une salle par classe ou par promotion, y rattache ses enseignants nommément, et chaque salle reçoit un lien d'invitation que les apprenants utilisent pour la rejoindre. Un nom qui ne correspond à rien passe en validation manuelle plutôt que d'entrer sans contrôle.",
  },
  {
    title: "L'enseignant dépose un cours",
    text: "Il soumet son contenu — texte ou document — et Malayka en tire un programme de travail en étapes concrètes, exploitable en autonomie. Chaque apprenant reçoit sa propre copie de la progression : elle lui reste acquise, même s'il quitte la classe ensuite.",
  },
  {
    title: "Il génère une évaluation en quelques minutes",
    text: "À partir d'une simple consigne, Malayka produit un questionnaire complet — questions, propositions, bonne réponse, explication. L'enseignant relit et corrige avant l'envoi. Rien ne part sans validation humaine.",
  },
  {
    title: "L'apprenant compose, la correction est immédiate",
    text: "La note est calculée par comparaison directe à la réponse attendue, sans passer par un modèle de langage. Une évaluation ne compte qu'une seule tentative, et la clé de correction reste inaccessible tant que la copie n'est pas rendue.",
  },
  {
    title: "L'accompagnement se déclenche tout seul",
    text: "Sous la moitié des points, l'objectif n'est pas atteint : un plan personnalisé est généré et envoyé automatiquement, construit sur la progression réelle de l'apprenant et sur les notions qu'il a effectivement manquées.",
  },
  {
    title: "L'enseignant voit où sa classe bloque",
    text: "Un tableau de bord agrège les échecs par notion, à partir des réponses réellement données — pas d'un taux de complétion. L'enseignant sait quel chapitre reprendre, pas seulement qui a terminé.",
  },
];

const CAPACITES = [
  {
    title: "Correction sans intervention de l'IA",
    text: "À l'ère des modèles génératifs, une note doit rester défendable. La correction repose sur une comparaison déterministe, jamais sur un jugement automatique : le même rendu donne toujours le même résultat.",
  },
  {
    title: "Diagnostic par notion, pas par élève",
    text: "Le système regroupe les erreurs par concept — « dérivées composées », « accord du participe » — et signale ce qui résiste à la classe entière. Les variantes d'écriture d'une même notion sont réconciliées automatiquement.",
  },
  {
    title: "L'apprenant voit sa notion, pas seulement sa note",
    text: "Il consulte les concepts sur lesquels il bute et les ressources de formation qui y correspondent. Un résultat devient une action, au lieu de rester un constat.",
  },
  {
    title: "Plans d'évolution individualisés",
    text: "Générés à partir de la progression réelle de chaque apprenant dans chaque matière. Deux élèves d'une même classe ne reçoivent pas le même plan.",
  },
  {
    title: "Rien n'est jamais détruit",
    text: "Un cours envoyé par erreur, une classe terminée, un apprenant qui part : tout s'archive de façon réversible. Les progressions, les résultats et l'historique restent intacts.",
  },
  {
    title: "Rapports d'impact exportables",
    text: "Statistiques agrégées par classe et par matière, destinées à vos bailleurs ou à votre dossier d'accréditation. Strictement limitées à votre établissement.",
  },
];

export default function EducativePage() {
  const navigate = useNavigate();

  return (
    <>
      <PageHero
        eyebrow="Solutions · Malayka Éducative"
        title="Chaque apprenant accompagné. Chaque enseignant outillé."
        intro="Pour les écoles, universités, formateurs indépendants et centres de formation. Vos enseignants créent cours et évaluations en quelques minutes ; vos apprenants reçoivent un accompagnement individualisé ; vous gardez une vision précise de ce que votre cohorte maîtrise réellement."
        actions={
          <>
            <Button size="lg" className="gap-2 font-semibold" onClick={() => navigate("/onboarding")}>
              Demander une démonstration
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/a-propos")}>
              En savoir plus
            </Button>
          </>
        }
        footnote="Mise en place en 48 h · Aucune installation requise"
      />

      <Section
        eyebrow="Le parcours"
        title="De la création du cours à la remédiation, sans rupture"
        intro="Six étapes, dont deux se déclenchent sans intervention humaine."
        muted
      >
        <Steps items={PARCOURS} />
      </Section>

      <Section
        eyebrow="Ce que vous obtenez"
        title="Des mécanismes conçus pour tenir en conditions réelles"
      >
        <FeatureGrid items={CAPACITES} />
      </Section>

      <Section eyebrow="Intégrité des évaluations" title="Une note qui reste défendable" muted>
        <div className="max-w-3xl space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            L'arrivée des modèles génératifs a fragilisé l'évaluation à distance. Nous
            avons construit la nôtre en conséquence.
          </p>
          <p>
            La correction ne fait jamais appel à un modèle de langage : elle compare la
            réponse choisie à la réponse attendue. Le résultat est reproductible et
            auditable. Une évaluation notée n'autorise qu'une seule tentative, et le
            corrigé demeure inaccessible tant que la copie n'a pas été rendue.
          </p>
          <p>
            Nous restons transparents sur la limite : une évaluation à distance ne
            remplace pas un examen surveillé. Elle mesure fidèlement ce qu'elle peut
            mesurer, et nous préférons le dire plutôt que de laisser croire l'inverse.
          </p>
        </div>
      </Section>
    </>
  );
}
