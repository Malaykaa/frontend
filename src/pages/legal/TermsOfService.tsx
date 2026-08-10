import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";

const LAST_UPDATED  = "9 août 2026";
const VERSION       = "v1.0";
const COMPANY       = "Yalna Technologies";
const BRAND         = "Malayka";
const ADDRESS       = "13e Étage, Immeuble Postel 2001, Abidjan, Plateau, Côte d'Ivoire";
const EMAIL_CONTACT = "contact@malayka.co";
const MIN_AGE       = 16;

export default function TermsOfService() {
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
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Conditions Générales d'Utilisation</span>
          </div>
          <span className="ml-auto text-xs text-muted-foreground">{VERSION} · {LAST_UPDATED}</span>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-5 py-10 pb-20 space-y-10">

        {/* Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
            <FileText className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">Contrat d'utilisation</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Conditions Générales d'Utilisation</h1>
          <p className="text-muted-foreground">
            Les présentes Conditions Générales d'Utilisation (CGU) constituent un contrat juridiquement contraignant entre vous et <strong>{COMPANY}</strong>, éditeur de la plateforme <strong>{BRAND}</strong>. En créant un compte, vous déclarez les avoir lues, comprises et acceptées sans réserve.
          </p>
          <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
            <strong>Éditeur :</strong> {COMPANY} — {BRAND}<br />
            <strong>Adresse :</strong> {ADDRESS}<br />
            <strong>Contact :</strong> <a href={`mailto:${EMAIL_CONTACT}`} className="text-primary hover:underline">{EMAIL_CONTACT}</a>
          </div>
        </div>

        {/* Table of contents */}
        <nav className="rounded-xl border bg-muted/30 p-5 space-y-1.5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Sommaire</p>
          {[
            ["1", "Objet et champ d'application", "#art1"],
            ["2", "Accès au service et conditions d'éligibilité", "#art2"],
            ["3", "Création et gestion du compte", "#art3"],
            ["4", "Description des services", "#art4"],
            ["5", "Services d'intelligence artificielle — avertissements", "#art5"],
            ["6", "Obligations et responsabilités de l'utilisateur", "#art6"],
            ["7", "Utilisations prohibées", "#art7"],
            ["8", "Propriété intellectuelle", "#art8"],
            ["9", "Limitation de responsabilité", "#art9"],
            ["10", "Suspension et résiliation du compte", "#art10"],
            ["11", "Données personnelles", "#art11"],
            ["12", "Modifications des CGU", "#art12"],
            ["13", "Droit applicable et juridiction compétente", "#art13"],
            ["14", "Dispositions diverses", "#art14"],
          ].map(([num, label, href]) => (
            <a key={num} href={href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <span className="font-mono text-[10px] font-bold text-primary w-5">{num}.</span>
              {label}
            </a>
          ))}
        </nav>

        {/* Articles */}
        <article id="art1" className="space-y-3 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 1 — Objet et champ d'application</h2>
          <p className="text-sm text-muted-foreground">Les présentes CGU ont pour objet de définir les conditions et modalités d'accès et d'utilisation de la plateforme {BRAND}, accessible via l'application web et mobile, proposée par {COMPANY}, société de droit ivoirien dont le siège social est situé au {ADDRESS}.</p>
          <p className="text-sm text-muted-foreground">Elles s'appliquent à toute personne physique (ci-après « l'Utilisateur ») qui accède, s'inscrit ou utilise les services {BRAND}, à titre individuel ou dans le cadre d'une structure partenaire.</p>
        </article>

        <article id="art2" className="space-y-3 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 2 — Accès au service et conditions d'éligibilité</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong className="text-foreground">2.1 Âge minimum.</strong> L'accès à {BRAND} est réservé aux personnes âgées d'au moins <strong>{MIN_AGE} ans</strong>. En créant un compte, vous déclarez avoir atteint cet âge. {COMPANY} se réserve le droit de suspendre tout compte dont le titulaire s'avère mineur de moins de {MIN_AGE} ans et d'en informer le représentant légal le cas échéant.</p>
            <p><strong className="text-foreground">2.2 Capacité juridique.</strong> L'Utilisateur déclare avoir la pleine capacité juridique pour contracter. En cas d'utilisation par un mineur de {MIN_AGE} à 18 ans, le consentement du représentant légal est requis et réputé acquis par la création du compte.</p>
            <p><strong className="text-foreground">2.3 Accès technique.</strong> L'accès aux services nécessite une connexion Internet. {COMPANY} ne peut être tenu responsable de toute interruption liée aux infrastructures de télécommunications de l'Utilisateur.</p>
            <p><strong className="text-foreground">2.4 Disponibilité.</strong> {BRAND} s'efforce d'assurer une disponibilité continue du service mais ne garantit pas une disponibilité de 100%. Des interruptions pour maintenance, mise à jour ou cas de force majeure peuvent survenir, avec préavis autant que possible.</p>
          </div>
        </article>

        <article id="art3" className="space-y-3 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 3 — Création et gestion du compte</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong className="text-foreground">3.1 Unicité du compte.</strong> Chaque Utilisateur ne peut détenir qu'un seul compte. La création de comptes multiples est interdite.</p>
            <p><strong className="text-foreground">3.2 Exactitude des informations.</strong> L'Utilisateur s'engage à fournir des informations exactes, complètes et à jour lors de son inscription et à les maintenir à jour durant toute la durée d'utilisation du service.</p>
            <p><strong className="text-foreground">3.3 Confidentialité des identifiants.</strong> L'Utilisateur est seul responsable de la confidentialité de ses identifiants (numéro de téléphone, mot de passe). Tout accès au service via ses identifiants est présumé effectué par l'Utilisateur lui-même. En cas de compromission, l'Utilisateur doit en informer immédiatement {BRAND} à l'adresse <a href={`mailto:${EMAIL_CONTACT}`} className="text-primary hover:underline">{EMAIL_CONTACT}</a>.</p>
            <p><strong className="text-foreground">3.4 Non-cession.</strong> Le compte est strictement personnel et ne peut être cédé, vendu, prêté ou transféré à un tiers.</p>
          </div>
        </article>

        <article id="art4" className="space-y-3 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 4 — Description des services</h2>
          <p className="text-sm text-muted-foreground">{BRAND} propose une plateforme d'accompagnement professionnel et académique assistée par intelligence artificielle, comprenant notamment :</p>
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside pl-2">
            <li>La détection et le matching d'opportunités (emplois, bourses, appels à projets, subventions, formations) selon le profil de l'Utilisateur ;</li>
            <li>La génération assistée de documents professionnels (curriculum vitae, lettres de motivation, dossiers de candidature) ;</li>
            <li>L'élaboration de plans d'action personnalisés et le suivi d'objectifs ;</li>
            <li>Des notifications d'opportunités via WhatsApp ;</li>
            <li>Des fonctionnalités d'accompagnement B2B pour les structures éducatives et d'emploi partenaires.</li>
          </ul>
          <p className="text-sm text-muted-foreground">Les services peuvent évoluer. {COMPANY} informe les Utilisateurs de toute modification substantielle avec un préavis raisonnable.</p>
        </article>

        <article id="art5" className="space-y-3 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 5 — Services d'intelligence artificielle — Avertissements importants</h2>
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20 p-4 text-sm text-amber-800 dark:text-amber-200 space-y-2">
            <p className="font-bold">⚠ À lire attentivement avant toute utilisation</p>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong className="text-foreground">5.1 Nature des résultats IA.</strong> Les contenus produits par l'IA (scores de matching, recommandations, documents générés, analyses de profil) constituent des <strong>outils d'aide à la décision</strong> et non des garanties de résultat. Ils peuvent contenir des inexactitudes ou des incomplétudes.</p>
            <p><strong className="text-foreground">5.2 Responsabilité sur les documents générés.</strong> L'Utilisateur est seul responsable de la vérification, de la correction et de l'usage des documents générés par l'IA. {BRAND} ne saurait être tenu responsable des conséquences d'une utilisation non vérifiée de ces documents. L'Utilisateur est invité à déclarer l'assistance IA auprès des institutions destinataires lorsque leurs règles l'exigent.</p>
            <p><strong className="text-foreground">5.3 Absence de conseil juridique, financier ou médical.</strong> Les services {BRAND} ne constituent pas un conseil juridique, financier, fiscal ou médical. Pour ces matières, l'Utilisateur doit consulter un professionnel qualifié.</p>
            <p><strong className="text-foreground">5.4 Variabilité des résultats.</strong> Les scores de matching et délais indicatifs (ex. : délai moyen pour décrocher une opportunité) sont des statistiques agrégées et ne constituent pas une garantie individuelle de résultat.</p>
            <p><strong className="text-foreground">5.5 Contenu généré par l'Utilisateur.</strong> En interagissant avec l'IA, l'Utilisateur peut introduire dans la conversation des informations personnelles. Il est conseillé de ne partager que les informations nécessaires et de ne pas communiquer d'informations strictement confidentielles (secrets commerciaux, données de tiers non consentants).</p>
          </div>
        </article>

        <article id="art6" className="space-y-3 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 6 — Obligations et responsabilités de l'Utilisateur</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>L'Utilisateur s'engage à :</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Utiliser le service conformément à sa destination et aux présentes CGU ;</li>
              <li>Ne pas usurper l'identité d'une autre personne ;</li>
              <li>Ne pas introduire de virus, malwares ou tout code malveillant ;</li>
              <li>Respecter les droits des tiers, notamment les droits de propriété intellectuelle ;</li>
              <li>Ne pas perturber le fonctionnement de la plateforme ou de ses infrastructures ;</li>
              <li>Signaler à {BRAND} tout dysfonctionnement, faille de sécurité ou usage abusif dont il aurait connaissance.</li>
            </ul>
            <p>L'Utilisateur est responsable de tout préjudice causé à {COMPANY} ou à des tiers du fait du non-respect de ces obligations.</p>
          </div>
        </article>

        <article id="art7" className="space-y-3 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 7 — Utilisations prohibées</h2>
          <p className="text-sm text-muted-foreground">Sont expressément interdits, sous peine de suspension immédiate et sans préavis :</p>
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside pl-2">
            <li>L'utilisation du service à des fins illégales, frauduleuses ou contraires à l'ordre public ;</li>
            <li>La génération de faux documents destinés à tromper des institutions, employeurs ou organismes de financement ;</li>
            <li>Le scraping, l'extraction automatisée ou la reproduction non autorisée des contenus de la plateforme ;</li>
            <li>L'utilisation d'un compte pour le compte d'un tiers sans leur consentement explicite ;</li>
            <li>Toute tentative de contournement des mesures de sécurité, d'accès non autorisé aux systèmes, ou d'ingénierie inverse de l'IA ;</li>
            <li>La revente ou la commercialisation des services {BRAND} sans accord écrit préalable de {COMPANY} ;</li>
            <li>Toute utilisation visant à entraîner ou affiner des modèles d'IA concurrents à partir des sorties de {BRAND}.</li>
          </ul>
        </article>

        <article id="art8" className="space-y-3 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 8 — Propriété intellectuelle</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong className="text-foreground">8.1 Propriété de {COMPANY}.</strong> La plateforme {BRAND}, son code source, ses interfaces, ses algorithmes, ses marques, logos et tout contenu produit par {COMPANY} sont la propriété exclusive de {COMPANY} et protégés par le droit ivoirien et international de la propriété intellectuelle. Toute reproduction, représentation ou utilisation sans autorisation écrite est interdite.</p>
            <p><strong className="text-foreground">8.2 Contenu de l'Utilisateur.</strong> L'Utilisateur conserve la propriété des données et documents qu'il fournit à {BRAND} (CV uploadé, informations de profil, etc.). Il accorde à {COMPANY} une licence non exclusive, mondiale, gratuite, pour utiliser ces données aux seules fins de fourniture du service.</p>
            <p><strong className="text-foreground">8.3 Documents générés.</strong> Les documents générés par l'IA à partir des données de l'Utilisateur appartiennent à l'Utilisateur. {COMPANY} conserve le droit d'utiliser des données anonymisées et agrégées à des fins d'amélioration de ses services.</p>
          </div>
        </article>

        <article id="art9" className="space-y-3 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 9 — Limitation de responsabilité</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong className="text-foreground">9.1 Services fournis « en l'état ».</strong> {BRAND} est fourni tel quel, sans garantie d'exhaustivité, d'exactitude ou d'adéquation à un usage particulier.</p>
            <p><strong className="text-foreground">9.2 Exclusion de garantie de résultat.</strong> {COMPANY} ne garantit pas l'obtention d'un emploi, d'une bourse, d'un financement ou de tout autre résultat. Le succès dépend de nombreux facteurs indépendants de la plateforme.</p>
            <p><strong className="text-foreground">9.3 Plafond de responsabilité.</strong> La responsabilité de {COMPANY} est limitée aux dommages directs prouvés. Elle ne saurait être engagée pour des dommages indirects, immatériels, ou résultant d'une utilisation non conforme aux CGU. Le montant total de la responsabilité de {COMPANY} ne saurait excéder les sommes effectivement payées par l'Utilisateur au cours des 12 mois précédant le fait générateur.</p>
            <p><strong className="text-foreground">9.4 Force majeure.</strong> {COMPANY} ne peut être tenu responsable de l'inexécution de ses obligations en cas de force majeure au sens du droit ivoirien.</p>
          </div>
        </article>

        <article id="art10" className="space-y-3 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 10 — Suspension et résiliation du compte</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong className="text-foreground">10.1 Résiliation par l'Utilisateur.</strong> L'Utilisateur peut supprimer son compte à tout moment depuis les paramètres de l'application. La suppression entraîne l'effacement de ses données personnelles selon les délais prévus à l'Article 5 de la Politique de Confidentialité.</p>
            <p><strong className="text-foreground">10.2 Suspension par {COMPANY}.</strong> {COMPANY} se réserve le droit de suspendre ou résilier tout compte en cas de violation des présentes CGU, d'utilisation frauduleuse, ou de comportement portant atteinte aux intérêts de {COMPANY} ou de tiers. Une notification sera adressée à l'Utilisateur, sauf si la gravité des faits justifie une suspension immédiate.</p>
            <p><strong className="text-foreground">10.3 Effets de la résiliation.</strong> Toute résiliation entraîne la cessation immédiate du droit d'accès au service. Les données sont conservées selon les obligations légales applicables.</p>
          </div>
        </article>

        <article id="art11" className="space-y-3 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 11 — Données personnelles</h2>
          <p className="text-sm text-muted-foreground">Le traitement des données personnelles est régi par la <strong>Politique de Confidentialité</strong> de {BRAND}, accessible à tout moment depuis l'application et le site web. La Politique de Confidentialité fait partie intégrante des présentes CGU.</p>
        </article>

        <article id="art12" className="space-y-3 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 12 — Modifications des CGU</h2>
          <p className="text-sm text-muted-foreground">{COMPANY} se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs sont informés de toute modification substantielle par notification WhatsApp ou e-mail, avec un préavis de <strong>30 jours</strong> avant l'entrée en vigueur des modifications. La poursuite de l'utilisation du service après ce délai vaut acceptation des nouvelles CGU. En cas de refus, l'Utilisateur dispose du droit de résilier son compte sans frais.</p>
        </article>

        <article id="art13" className="space-y-3 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 13 — Droit applicable et juridiction compétente</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong className="text-foreground">13.1 Droit applicable.</strong> Les présentes CGU sont régies par le droit de la République de Côte d'Ivoire, notamment :</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>La Loi n° 2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel ;</li>
              <li>La Loi n° 2013-546 du 30 juillet 2013 relative aux transactions électroniques ;</li>
              <li>Le Code civil ivoirien et le Code de commerce.</li>
            </ul>
            <p><strong className="text-foreground">13.2 Résolution amiable.</strong> En cas de litige, les parties s'engagent à rechercher une solution amiable dans un délai de 30 jours à compter de la notification du différend.</p>
            <p><strong className="text-foreground">13.3 Juridiction compétente.</strong> À défaut de résolution amiable, tout litige relatif aux présentes CGU sera soumis à la compétence exclusive des tribunaux compétents d'<strong>Abidjan</strong>, République de Côte d'Ivoire.</p>
            <p>Pour les utilisateurs résidant dans l'Union Européenne, les droits impératifs conférés par la législation de leur État membre de résidence demeurent applicables.</p>
          </div>
        </article>

        <article id="art14" className="space-y-3 scroll-mt-16">
          <h2 className="text-xl font-bold border-b pb-2">Article 14 — Dispositions diverses</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong className="text-foreground">14.1 Divisibilité.</strong> Si une clause des présentes CGU est déclarée nulle ou inapplicable par une juridiction compétente, les autres clauses demeurent en vigueur.</p>
            <p><strong className="text-foreground">14.2 Non-renonciation.</strong> Le fait pour {COMPANY} de ne pas se prévaloir d'une disposition des CGU ne saurait constituer une renonciation à s'en prévaloir ultérieurement.</p>
            <p><strong className="text-foreground">14.3 Intégralité.</strong> Les présentes CGU, ensemble avec la Politique de Confidentialité, constituent l'intégralité de l'accord entre l'Utilisateur et {COMPANY} concernant l'utilisation du service {BRAND}.</p>
            <p><strong className="text-foreground">14.4 Langue.</strong> En cas de traduction des présentes CGU dans une autre langue, la version française fait foi en cas de contradiction.</p>
          </div>
        </article>

        <div className="border-t pt-6 text-center text-xs text-muted-foreground space-y-1">
          <p>{COMPANY} — {BRAND} · {ADDRESS}</p>
          <p>CGU {VERSION} · Entrée en vigueur le {LAST_UPDATED}</p>
          <p>Droit ivoirien · Loi n° 2013-546 et Loi n° 2013-450</p>
        </div>
      </main>
    </div>
  );
}
