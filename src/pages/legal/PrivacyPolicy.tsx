import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

const LAST_UPDATED = "9 août 2026";
const VERSION      = "v1.0";
const CONTROLLER   = "Yalna Technologies — Malayka";
const ADDRESS      = "13e Étage, Immeuble Postel 2001, Abidjan, Plateau, Côte d'Ivoire";
const EMAIL_DPO    = "privacy@malayka.co";
const EMAIL_CONTACT = "contact@malayka.co";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-5 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Politique de Confidentialité</span>
          </div>
          <span className="ml-auto text-xs text-muted-foreground">{VERSION} · {LAST_UPDATED}</span>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-5 py-10 pb-20 space-y-10">

        {/* Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">Protection des données</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Politique de Confidentialité</h1>
          <p className="text-muted-foreground">
            Conformément à la <strong>Loi n° 2013-450 du 19 juin 2013</strong> relative à la protection des données à caractère personnel en République de Côte d'Ivoire, et en référence au Règlement Général sur la Protection des Données (RGPD — UE 2016/679) pour les utilisateurs ressortissants de l'Union Européenne.
          </p>
          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
            <strong>Responsable du traitement :</strong> {CONTROLLER}<br />
            <strong>Adresse :</strong> {ADDRESS}<br />
            <strong>Contact DPD :</strong> <a href={`mailto:${EMAIL_DPO}`} className="text-primary hover:underline">{EMAIL_DPO}</a>
          </div>
        </div>

        {/* Table of contents */}
        <nav className="rounded-xl border bg-muted/30 p-5 space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Sommaire</p>
          {[
            ["1", "Données collectées", "#art1"],
            ["2", "Finalités et bases légales du traitement", "#art2"],
            ["3", "Traitement par intelligence artificielle", "#art3"],
            ["4", "Destinataires des données", "#art4"],
            ["5", "Durée de conservation", "#art5"],
            ["6", "Transferts internationaux", "#art6"],
            ["7", "Sécurité des données", "#art7"],
            ["8", "Droits des personnes concernées", "#art8"],
            ["9", "Cookies et traceurs", "#art9"],
            ["10", "Modifications de la présente politique", "#art10"],
            ["11", "Réclamations et contact", "#art11"],
          ].map(([num, label, href]) => (
            <a key={num} href={href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <span className="font-mono text-[10px] font-bold text-primary w-5">{num}.</span>
              {label}
            </a>
          ))}
        </nav>

        {/* Articles */}
        <section id="art1" className="space-y-4 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 1 — Données collectées</h2>
          <p className="text-sm text-muted-foreground">Dans le cadre de la fourniture de ses services, Malayka collecte les catégories de données suivantes :</p>
          <div className="space-y-3">
            <DataBlock title="Données d'identification et de contact">
              Numéro de téléphone, prénom, nom, genre, année de naissance, pays, ville, adresse e-mail (si fournie).
            </DataBlock>
            <DataBlock title="Données professionnelles et académiques">
              Rôle déclaré (étudiant, professionnel, demandeur d'emploi, entrepreneur), domaine d'activité, filière et niveau d'études, statut professionnel actuel, curriculum vitae (CV) téléchargé de manière optionnelle.
            </DataBlock>
            <DataBlock title="Données de navigation et d'usage">
              Journaux de connexion (date, heure, adresse IP), actions effectuées sur la plateforme, objectifs créés, documents générés, conversations avec l'IA.
            </DataBlock>
            <DataBlock title="Données de consentement">
              Date et heure d'acceptation des conditions, version du document accepté, adresse IP au moment du consentement.
            </DataBlock>
            <DataBlock title="Données sensibles">
              Malayka ne collecte intentionnellement <strong>aucune donnée sensible</strong> au sens de l'article 8 de la Loi 2013-450 (données de santé, opinions politiques, appartenance syndicale, données génétiques ou biométriques). Si vous communiquez de telles données dans vos échanges avec l'IA, elles sont traitées uniquement dans le contexte de votre demande et ne font l'objet d'aucun profilage.
            </DataBlock>
          </div>
        </section>

        <section id="art2" className="space-y-4 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 2 — Finalités et bases légales du traitement</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border px-3 py-2 text-left font-semibold">Finalité</th>
                  <th className="border px-3 py-2 text-left font-semibold">Base légale (Loi 2013-450 / RGPD)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Création et gestion du compte utilisateur", "Exécution du contrat (Art. 6 al.1 b RGPD / Art. 6 Loi CI)"],
                  ["Personnalisation de l'accompagnement par IA", "Consentement explicite (Art. 6 al.1 a RGPD / Art. 6 Loi CI)"],
                  ["Détection et matching des opportunités", "Consentement explicite"],
                  ["Génération de documents (CV, lettres, dossiers)", "Consentement explicite"],
                  ["Notifications WhatsApp sur les opportunités", "Consentement explicite"],
                  ["Amélioration des algorithmes et modèles IA", "Intérêt légitime — données anonymisées uniquement"],
                  ["Prévention de la fraude et sécurité de la plateforme", "Obligation légale / Intérêt légitime"],
                  ["Gestion des réclamations et support", "Exécution du contrat"],
                  ["Respect des obligations légales et fiscales", "Obligation légale"],
                ].map(([fin, base]) => (
                  <tr key={fin} className="even:bg-muted/20">
                    <td className="border px-3 py-2 text-muted-foreground">{fin}</td>
                    <td className="border px-3 py-2">{base}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="art3" className="space-y-4 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 3 — Traitement par intelligence artificielle</h2>
          <p className="text-sm text-muted-foreground">Malayka repose sur des modèles d'intelligence artificielle (IA) pour fournir ses services. Vous en êtes informé et y consentez expressément lors de votre inscription.</p>
          <div className="space-y-3 text-sm">
            <p><strong>3.1 Nature du traitement automatisé.</strong> L'IA analyse votre profil, vos objectifs et l'historique de vos interactions pour vous proposer des opportunités pertinentes, générer des documents personnalisés et adapter votre plan d'accompagnement.</p>
            <p><strong>3.2 Absence de décision entièrement automatisée à effet juridique.</strong> Conformément à l'article 22 du RGPD et au principe de proportionnalité de la Loi 2013-450, aucune décision produisant des effets juridiques significatifs à votre égard (refus d'embauche, refus de crédit, etc.) n'est prise par l'IA sans intervention humaine. Les scores de matching sont des indicateurs d'aide à la décision, non des décisions finales.</p>
            <p><strong>3.3 Droit d'opposition au traitement automatisé.</strong> Vous pouvez à tout moment demander une révision humaine de tout résultat ou scoring produit par l'IA en contactant <a href={`mailto:${EMAIL_CONTACT}`} className="text-primary hover:underline">{EMAIL_CONTACT}</a>.</p>
            <p><strong>3.4 Prestataires IA.</strong> Malayka utilise des modèles fournis par des tiers (notamment Anthropic). Ces prestataires sont liés par des accords de traitement des données conformes aux standards internationaux de protection des données. Ils n'utilisent pas vos données pour entraîner leurs modèles dans le cadre de nos contrats.</p>
            <p><strong>3.5 Documents générés par IA.</strong> Les documents produits (CV, lettres de motivation, dossiers) sont générés à titre d'assistance. Vous êtes seul responsable de leur vérification, de leur exactitude, et de leur présentation à des tiers. Malayka recommande de déclarer l'assistance IA lorsque cela est requis par l'institution destinataire.</p>
          </div>
        </section>

        <section id="art4" className="space-y-4 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 4 — Destinataires des données</h2>
          <p className="text-sm text-muted-foreground">Vos données ne sont jamais vendues à des tiers. Elles peuvent être transmises aux catégories de destinataires suivantes, dans la stricte limite des finalités définies :</p>
          <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
            <li><strong>Sous-traitants techniques :</strong> hébergement cloud, envoi de notifications WhatsApp (Meta), stockage de fichiers, modèles IA — tous liés par des accords de confidentialité et de traitement des données.</li>
            <li><strong>Structures partenaires (B2B) :</strong> si vous utilisez Malayka via une structure éducative ou d'emploi partenaire, cette structure accède à vos données de progression dans la limite du périmètre de votre relation avec elle. Vous en êtes informé lors de l'adhésion à la structure.</li>
            <li><strong>Autorités compétentes :</strong> sur réquisition judiciaire ou administrative légalement fondée.</li>
          </ul>
          <p className="text-sm text-muted-foreground">Malayka ne partage aucune donnée personnelle avec des annonceurs, courtiers en données ou plateformes publicitaires.</p>
        </section>

        <section id="art5" className="space-y-4 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 5 — Durée de conservation</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border px-3 py-2 text-left font-semibold">Type de données</th>
                  <th className="border px-3 py-2 text-left font-semibold">Durée de conservation</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Données du compte et du profil", "Durée de vie du compte + 3 ans après suppression définitive"],
                  ["Documents générés (CV, lettres, dossiers)", "3 ans à compter de la génération, ou jusqu'à suppression du compte"],
                  ["Journaux de connexion et logs techniques", "12 mois glissants"],
                  ["Conversations IA (threads)", "Durée du compte + 1 an après suppression"],
                  ["Données de consentement", "5 ans à compter du consentement (obligation de preuve)"],
                  ["Données de facturation (si applicable)", "10 ans (obligation comptable légale)"],
                  ["Données après exercice du droit à l'effacement", "Archivage sécurisé limité aux obligations légales résiduelles"],
                ].map(([type, duree]) => (
                  <tr key={type} className="even:bg-muted/20">
                    <td className="border px-3 py-2 text-muted-foreground">{type}</td>
                    <td className="border px-3 py-2">{duree}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">À l'expiration de ces délais, les données sont supprimées de façon irréversible ou anonymisées de manière à ne plus permettre l'identification.</p>
        </section>

        <section id="art6" className="space-y-4 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 6 — Transferts internationaux de données</h2>
          <p className="text-sm text-muted-foreground">Malayka opère dans plusieurs pays africains et peut recourir à des sous-traitants situés en dehors de la Côte d'Ivoire, y compris dans des pays membres de l'UE ou aux États-Unis.</p>
          <div className="space-y-2 text-sm">
            <p>Tout transfert de données vers un pays tiers est encadré par l'un des mécanismes suivants, conformément aux articles 34 à 38 de la Loi 2013-450 :</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-2">
              <li>Clauses contractuelles types approuvées par l'ARTCI ou la Commission Européenne ;</li>
              <li>Décision d'adéquation reconnaissant un niveau de protection suffisant ;</li>
              <li>Règles d'entreprise contraignantes (Binding Corporate Rules) du sous-traitant.</li>
            </ul>
            <p>La liste des sous-traitants et leur localisation est disponible sur demande à <a href={`mailto:${EMAIL_DPO}`} className="text-primary hover:underline">{EMAIL_DPO}</a>.</p>
          </div>
        </section>

        <section id="art7" className="space-y-4 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 7 — Sécurité des données</h2>
          <p className="text-sm text-muted-foreground">Malayka met en œuvre des mesures techniques et organisationnelles appropriées conformément aux articles 28 à 33 de la Loi 2013-450 :</p>
          <ul className="text-sm space-y-1.5 list-disc list-inside text-muted-foreground">
            <li>Chiffrement des données en transit (TLS 1.2+) et au repos ;</li>
            <li>Hachage irréversible des mots de passe (bcrypt) ;</li>
            <li>Authentification par jeton JWT avec rotation régulière ;</li>
            <li>Accès aux données de production limité au personnel habilité ;</li>
            <li>Journalisation des accès aux données sensibles ;</li>
            <li>Politique de sauvegarde et de reprise après sinistre ;</li>
            <li>Revue de sécurité périodique du code et des infrastructures.</li>
          </ul>
          <p className="text-sm text-muted-foreground">En cas de violation de données susceptible d'engendrer un risque élevé pour vos droits, Malayka vous en informera dans les meilleurs délais conformément à l'article 32 de la Loi 2013-450.</p>
        </section>

        <section id="art8" className="space-y-4 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 8 — Droits des personnes concernées</h2>
          <p className="text-sm text-muted-foreground">Conformément aux articles 15 à 23 de la Loi 2013-450 et aux articles 15 à 22 du RGPD, vous disposez des droits suivants :</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { title: "Droit d'accès (Art. 15)", desc: "Obtenir confirmation du traitement de vos données et en recevoir une copie." },
              { title: "Droit de rectification (Art. 16)", desc: "Faire corriger toute donnée inexacte ou incomplète." },
              { title: "Droit à l'effacement (Art. 17)", desc: "Demander la suppression de vos données dans les conditions prévues par la loi." },
              { title: "Droit à la limitation (Art. 18)", desc: "Demander la suspension temporaire du traitement dans certains cas." },
              { title: "Droit à la portabilité (Art. 20)", desc: "Recevoir vos données dans un format structuré et lisible par machine." },
              { title: "Droit d'opposition (Art. 21)", desc: "Vous opposer au traitement basé sur l'intérêt légitime ou à des fins de prospection." },
              { title: "Retrait du consentement", desc: "Retirer votre consentement à tout moment, sans affecter la licéité du traitement antérieur." },
              { title: "Opposition au profilage automatisé", desc: "Demander une intervention humaine sur toute décision automatisée vous concernant." },
            ].map(({ title, desc }) => (
              <div key={title} className="rounded-lg border bg-muted/20 p-3 space-y-1">
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm space-y-1">
            <p><strong>Pour exercer vos droits :</strong></p>
            <p>Contactez notre Délégué à la Protection des Données (DPD) : <a href={`mailto:${EMAIL_DPO}`} className="text-primary hover:underline">{EMAIL_DPO}</a></p>
            <p className="text-muted-foreground">Nous vous répondrons dans un délai maximum de <strong>30 jours</strong>. Une pièce d'identité peut être demandée pour vérifier votre identité avant de traiter votre demande.</p>
          </div>
        </section>

        <section id="art9" className="space-y-4 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 9 — Cookies et traceurs</h2>
          <p className="text-sm text-muted-foreground">Malayka utilise uniquement des cookies strictement nécessaires au fonctionnement de la plateforme (gestion de session, sécurité CSRF). Aucun cookie publicitaire ou de traçage tiers n'est utilisé. Aucun consentement supplémentaire n'est requis pour ces cookies essentiels, conformément à la directive ePrivacy.</p>
        </section>

        <section id="art10" className="space-y-4 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 10 — Modifications de la présente politique</h2>
          <p className="text-sm text-muted-foreground">Malayka se réserve le droit de modifier la présente politique à tout moment pour refléter l'évolution de ses pratiques ou des obligations légales. En cas de modification substantielle affectant vos droits, vous serez notifié par WhatsApp ou par e-mail avec un préavis de <strong>30 jours</strong>. La poursuite de l'utilisation du service après ce délai vaut acceptation de la politique révisée. Les versions antérieures sont archivées et disponibles sur demande.</p>
        </section>

        <section id="art11" className="space-y-4 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 11 — Réclamations et contact</h2>
          <div className="text-sm space-y-3">
            <p><strong>Contact :</strong> Pour toute question relative à vos données, contactez <a href={`mailto:${EMAIL_DPO}`} className="text-primary hover:underline">{EMAIL_DPO}</a>.</p>
            <p><strong>Réclamation auprès de l'ARTCI :</strong> Si vous estimez que le traitement de vos données viole la Loi 2013-450, vous avez le droit de déposer une réclamation auprès de l'<strong>Autorité de Régulation des Télécommunications/TIC de Côte d'Ivoire (ARTCI)</strong>, autorité de contrôle compétente :</p>
            <div className="rounded-lg border bg-muted/20 p-3 text-muted-foreground">
              <p>ARTCI — Direction de la Protection des Données Personnelles</p>
              <p>Site web : <span className="font-mono">www.artci.ci</span></p>
            </div>
            <p className="text-muted-foreground">Pour les utilisateurs ressortissants de l'Union Européenne, vous pouvez également saisir l'autorité de protection des données de votre État membre de résidence.</p>
          </div>
        </section>

        <div className="border-t pt-6 text-center text-xs text-muted-foreground space-y-1">
          <p>Yalna Technologies — Malayka · {ADDRESS}</p>
          <p>Politique de Confidentialité {VERSION} · Entrée en vigueur le {LAST_UPDATED}</p>
          <p>Loi n° 2013-450 du 19 juin 2013 · RGPD UE 2016/679</p>
        </div>
      </main>
    </div>
  );
}

function DataBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-muted/20 p-4 space-y-1">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
