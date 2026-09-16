# Photos du site Malayka

Déposez vos photos **dans ce dossier**, en respectant exactement les noms de
fichiers ci-dessous. Le site les utilise immédiatement — aucun code à modifier.

Tant qu'un fichier est absent, une photo de secours s'affiche : vous pouvez
donc livrer les visuels un par un, sans jamais casser une page.

---

## Bannières — format paysage, 2000 px de large, < 600 Ko

| Fichier à déposer              | Où il s'affiche                        | Sujet suggéré |
| ------------------------------ | -------------------------------------- | ------------- |
| `accueil-hero.jpg`             | Bannière de la page d'accueil          | Jeunes professionnels / ingénieurs africains au travail |
| `data-hero.jpg`                | Bannière Malayka Data                  | Environnement technique, data, infrastructure |
| `entreprises-ia-hero.jpg`      | Bannière Entreprises d'IA              | Équipe technique, annotation, écrans |
| `gouvernements-hero.jpg`       | Bannière Gouvernements · ONG · Bailleurs | Institution, ville africaine, réunion de décideurs |
| `educative-hero.jpg`           | Bannière Malayka Éducative             | Enseignant devant sa classe |
| `etablissements-hero.jpg`      | Bannière Établissements & EdTech       | Amphithéâtre, centre de formation |
| `particuliers-hero.jpg`        | Bannière Particuliers                  | Étudiants, jeunes diplômés |
| `a-propos-hero.jpg`            | Bannière À propos                      | Abidjan, votre équipe, vos locaux |
| `comment-ca-marche-hero.jpg`   | Bannière Comment ça marche             | Supervision, écrans, travail de données |

## Photos de corps de page — portrait ou carré, 1200 px de large, < 400 Ko

| Fichier à déposer   | Où il s'affiche                                   | Sujet suggéré |
| ------------------- | ------------------------------------------------- | ------------- |
| `collecte.jpg`      | Accueil, carte « Collecter »                      | Veille, recherche de signaux |
| `annotation.jpg`    | Accueil, carte « Comprendre » + Data Engine       | Experts qui annotent et vérifient |
| `action.jpg`        | Accueil, carte « Agir » + traction                | Passage à l'action, entretien, candidature |
| `terrain.jpg`       | Recherches terrain                                | Enquête de terrain, communautés |
| `equipe.jpg`        | Équipe Malayka                                    | Votre équipe au travail |
| `ville.jpg`         | Ville et infrastructures                          | Abidjan ou autre ville africaine |
| `formation.jpg`     | Séances de formation                              | Atelier, salle de formation |

---

## Règles à respecter

- **Toute photo montrant des personnes montre des personnes africaines.**
- Format `.jpg` ou `.webp`. Éviter le `.png` pour les photos (fichiers trop lourds).
- Bannières en paysage : le texte se place à gauche, gardez donc le sujet
  principal plutôt à droite de l'image.
- Photos de corps en portrait ou carré.
- Elles sont affichées en noir et blanc, et reprennent leurs couleurs au
  survol : privilégiez des images avec un bon contraste.

## Pour changer un nom de fichier ou un cadrage

Un seul fichier à modifier :
`frontend/src/pages/site/_shared/media.ts`

## Photos actuellement en place (à remplacer)

- `abidjan-plateau.jpg` — Le Plateau, Abidjan · Edison McCullen · CC BY 4.0 · Wikimedia Commons
- `classe-afrique.jpg` — Students reading in a classroom · Bright Kwame Ayisi · CC0 · Wikimedia Commons

Ces deux photos sont sous licence libre. Si vous les gardez, conservez leurs
crédits (ils sont enregistrés dans `media.ts`, constante `PHOTO_CREDITS`).
