import { Compass, Target, Gem } from "lucide-react";

/**
 * À propos — Mission, Vision, Valeurs.
 *
 * Ces trois blocs n'existaient nulle part : la page unique parlait de ce que
 * fait Malayka, jamais de pourquoi. C'est pourtant ce que lit un partenaire,
 * un établissement ou un bailleur avant de s'engager.
 *
 * Les valeurs reprennent celles déjà inscrites dans les garde-fous de l'IA
 * (cf. app/agents/guardrails.py côté backend) plutôt que d'en inventer de
 * nouvelles : ce sont les mêmes principes qui gouvernent chaque réponse du
 * produit, ce qui les rend vérifiables au lieu d'être déclaratives.
 */

const VALEURS = [
  {
    titre: "Honnêteté radicale",
    texte:
      "Malayka dit la vérité, même inconfortable. Aucune validation creuse, aucune promesse que le produit ne peut pas tenir. Une offre qui n'existe pas n'est jamais affichée.",
  },
  {
    titre: "Excellence sans arrogance",
    texte:
      "Le meilleur accompagnement possible, sans jamais faire croire à un résultat garanti. Nous préférons annoncer une limite que la masquer.",
  },
  {
    titre: "Respect profond",
    texte:
      "Chaque utilisateur mérite une attention pleine, quels que soient son niveau, son pays ou son orthographe. Nous ne corrigeons personne.",
  },
  {
    titre: "Autonomisation",
    texte:
      "Notre but n'est pas de créer une dépendance, mais de rendre chacun capable d'avancer seul. Un utilisateur qui n'a plus besoin de nous est une réussite.",
  },
  {
    titre: "Pragmatisme africain",
    texte:
      "Nos conseils tiennent compte des réalités du terrain : contraintes administratives, accès limité aux ressources, contextes locaux. Pas de recette importée.",
  },
];

export default function AProposPage() {
  return (
    <div className="pt-28 pb-20 md:pt-36">
      <div className="mx-auto max-w-3xl px-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          À propos
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          Ce qui nous fait avancer
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Malayka est né d'un constat simple : les opportunités existent, mais elles
          n'atteignent pas ceux qui en ont le plus besoin. Ce n'est pas un problème
          de talent, c'est un problème d'accès.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-3xl space-y-12 px-5">
        <section className="border-t pt-10">
          <div className="flex items-baseline gap-3">
            <Target className="h-5 w-5 shrink-0 translate-y-0.5 text-muted-foreground" />
            <h2 className="text-2xl font-semibold tracking-tight">Notre mission</h2>
          </div>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Mettre entre les mains de chaque jeune africain un accompagnement qui le
            connaît vraiment : qui cherche pour lui pendant qu'il dort, qui lui dit ce
            qui lui manque pour atteindre son objectif, et qui lui donne les documents
            prêts à l'emploi pour y arriver. Pas une liste de liens à trier seul.
          </p>
        </section>

        <section className="border-t pt-10">
          <div className="flex items-baseline gap-3">
            <Compass className="h-5 w-5 shrink-0 translate-y-0.5 text-muted-foreground" />
            <h2 className="text-2xl font-semibold tracking-tight">Notre vision</h2>
          </div>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Un continent où l'origine, le réseau ou le hasard ne décident plus de qui
            accède à une bourse, un stage ou un financement. Où un étudiant de Bouaké
            voit passer les mêmes opportunités qu'un étudiant d'Abidjan — et sait
            exactement quoi faire pour les décrocher.
          </p>
        </section>

        <section className="border-t pt-10">
          <div className="flex items-baseline gap-3">
            <Gem className="h-5 w-5 shrink-0 translate-y-0.5 text-muted-foreground" />
            <h2 className="text-2xl font-semibold tracking-tight">Nos valeurs</h2>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Ce ne sont pas des intentions affichées : ces cinq principes sont inscrits
            dans le système lui-même et gouvernent chaque réponse que Malayka produit.
          </p>

          <dl className="mt-8 space-y-8">
            {VALEURS.map((v) => (
              <div key={v.titre} className="border-l-2 pl-5">
                <dt className="font-semibold">{v.titre}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {v.texte}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
