import { useState } from "react";
import { MessageCircle, Phone, Mail, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const FAQ = [
  {
    q: "Comment créer un objectif ?",
    a: "Va dans l'onglet « Pour Moi », clique sur « Nouvel objectif », choisis un thème et configure tes préférences de notification. L'IA créera automatiquement un plan d'action pour toi.",
  },
  {
    q: "Comment fonctionne l'IA mentor ?",
    a: "L'IA analyse ton profil, tes objectifs et tes conversations pour te proposer des recommandations personnalisées. Elle peut générer des documents, répondre à tes questions et t'aider à préparer tes candidatures.",
  },
  {
    q: "Comment générer un CV ou une lettre de motivation ?",
    a: "Va dans l'onglet « Actions », choisis « Analyse CV » ou un autre livrable. L'IA utilisera ton profil pour générer un document professionnel que tu pourras éditer et télécharger.",
  },
  {
    q: "Comment recevoir des recommandations d'opportunités ?",
    a: "Crée un objectif et discute avec l'IA. Elle extrait ton intention et fait correspondre ton profil avec des offres d'emploi, bourses ou financements pertinents dans l'onglet « Pour Moi ».",
  },
  {
    q: "Les notifications WhatsApp sont-elles incluses ?",
    a: "Oui ! Tu peux activer les alertes WhatsApp pour recevoir les meilleures opportunités directement sur ton téléphone. Configure cela dans tes préférences de notification.",
  },
  {
    q: "Comment fonctionne le système de crédits ?",
    a: "Les crédits permettent de générer des documents avancés et d'accéder aux fonctionnalités premium. Tu reçois des crédits gratuits à l'inscription. Tu pourras en acheter des packs supplémentaires.",
  },
  {
    q: "Puis-je modifier un document généré par l'IA ?",
    a: "Oui, tous les documents générés sont éditables. Clique sur le document dans le chat, modifie le contenu, puis télécharge-le en PDF ou partage un lien.",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Toutes les communications sont chiffrées (SSL 256-bit). Tes données personnelles ne sont jamais partagées avec des tiers. Tu peux demander la suppression de ton compte à tout moment.",
  },
  {
    q: "Comment installer l'app sur mon téléphone ?",
    a: "Malayka est une PWA. Sur Android : clique sur « Ajouter à l'écran d'accueil » dans le menu de Chrome. Sur iOS : ouvre dans Safari, clique sur Partager → « Sur l'écran d'accueil ».",
  },
  {
    q: "Comment signaler un problème ?",
    a: "Contacte-nous via WhatsApp ou email (ci-dessous). Décris le problème avec une capture d'écran si possible. Notre équipe répond en moins de 24h.",
  },
  {
    q: "L'app fonctionne-t-elle hors ligne ?",
    a: "Les pages déjà visitées sont disponibles hors ligne grâce au cache PWA. La génération de documents et l'IA nécessitent une connexion internet.",
  },
  {
    q: "Comment changer la langue ?",
    a: "Va dans Paramètres (ton avatar) → Langue → Français ou Anglais. Le changement est immédiat.",
  },
  {
    q: "Puis-je partager un document généré ?",
    a: "Oui ! Dans le visualiseur de document, clique sur l'icône Partager. Un lien est généré automatiquement. Toute personne ayant le lien peut le consulter sans se connecter.",
  },
  {
    q: "Comment activer le mode sombre ?",
    a: "Va dans Paramètres → Préférences → bascule le switch Thème. Le choix est sauvegardé automatiquement.",
  },
  {
    q: "Mes documents générés sont-ils sauvegardés ?",
    a: "Oui, tous les documents générés sont associés à tes conversations et restent accessibles depuis le chat correspondant. Tu peux les éditer, exporter en PDF ou partager à tout moment.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <button
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-sm font-medium leading-snug">{q}</span>
        {open
          ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
          : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
      </button>
      {open && (
        <div className="border-t bg-muted/20 px-4 py-3">
          <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function AideTab() {
  return (
    <div className="flex flex-col px-4 py-5 space-y-6">
      <div>
        <h1 className="text-lg font-bold">Aide & Support</h1>
        <p className="text-sm text-muted-foreground">
          Notre équipe répond en moins de 24h
        </p>
      </div>

      {/* Contacts */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Nous contacter
        </h2>

        {/* WhatsApp — bloc principal pleine largeur */}
        <a
          href="https://wa.me/2250141112792"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 transition-colors p-4 text-white"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-sm">WhatsApp</p>
            <p className="text-xs text-white/80 mt-0.5">+225 01 41 11 27 92</p>
            <p className="text-[10px] text-white/60 mt-0.5">Réponse en moins de 24h</p>
          </div>
          <ChevronDown className="ml-auto h-5 w-5 rotate-[-90deg] text-white/70" />
        </a>

        {/* Email + Téléphone — côte à côte */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href="mailto:contact@99eange.com"
            className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 hover:bg-muted/30 transition-colors text-center"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
              <Mail className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-semibold">Email</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                contact@99eange.com
              </p>
            </div>
          </a>

          <a
            href="tel:+2250141112792"
            className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 hover:bg-muted/30 transition-colors text-center"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100">
              <Phone className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <p className="text-sm font-semibold">Téléphone</p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                +225 01 41 11 27 92
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Questions fréquentes
          </h2>
        </div>
        <div className="space-y-2">
          {FAQ.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="rounded-xl border bg-muted/30 p-4 text-center space-y-1">
        <p className="text-sm font-medium">Malayka</p>
        <p className="text-xs text-muted-foreground">
          Fait avec ❤️ pour l'Afrique · © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
