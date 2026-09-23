import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu, X, ChevronDown, Sparkles, GraduationCap, Database, Cpu, Landmark,
  Users, Building2, Radar, Network, ArrowRight, Wrench, Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { mailto } from "./ui";
import { LangSwitch, useT, type Translate } from "./lang";

/* Structure des menus */

type MenuEntry = {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  to: string;
  badge?: string;
};

type MenuDef = {
  key: string;
  label: string;
  entries: MenuEntry[];
  footer: { label: string; to?: string; href?: string };
};

const buildMenus = (t: Translate): MenuDef[] => [
  {
    key: "produits",
    label: t("Produits", "Products"),
    entries: [
      {
        Icon: Sparkles,
        title: "Malayka IA",
        desc: t(
          "L'agent IA personnel pour apprendre, évoluer et saisir les bonnes opportunités.",
          "The personal AI agent to learn, grow and seize the right opportunities.",
        ),
        to: "/produits/malayka-ia",
      },
      {
        Icon: GraduationCap,
        title: "Malayka Éducative",
        desc: t(
          "L'IA qui augmente les capacités des enseignants et accompagne chaque étudiant.",
          "The AI that extends what teachers can do and supports every student.",
        ),
        to: "/produits/malayka-educative",
      },
      {
        Icon: Database,
        title: "Malayka Data",
        desc: t(
          "L'infrastructure de données et d'intelligence du capital humain africain.",
          "The data and intelligence infrastructure for African human capital.",
        ),
        to: "/produits/malayka-data",
      },
      {
        Icon: Wrench,
        title: "Malayka Services",
        desc: t(
          "Données, IA et solutions sur mesure pour votre organisation.",
          "Data, AI and bespoke solutions for your organisation.",
        ),
        to: "/produits/malayka-services",
      },
    ],
    footer: {
      label: t(
        "Comment ça marche : Data → Intelligence → Action",
        "How it works: Data → Intelligence → Action",
      ),
      to: "/comment-ca-marche",
    },
  },
  {
    key: "solutions",
    label: "Solutions",
    entries: [
      {
        Icon: Cpu,
        title: t("Entreprises d'IA", "AI companies"),
        desc: t(
          "Datasets africains annotés pour entraîner, évaluer et ancrer vos modèles.",
          "Annotated African datasets to train, evaluate and ground your models.",
        ),
        to: "/solutions/entreprises-ia",
        badge: t("Data d'entraînement", "Training data"),
      },
      {
        Icon: Landmark,
        title: t("Gouvernements, ONG & bailleurs", "Governments, NGOs & funders"),
        desc: t(
          "Observer les variations du marché du travail en temps réel et décider sur du réel.",
          "Watch the labour market shift in real time and decide on what is actually happening.",
        ),
        to: "/solutions/gouvernements",
        badge: t("Temps réel", "Real time"),
      },
      {
        Icon: Building2,
        title: t("Établissements & EdTech", "Institutions & EdTech"),
        desc: t(
          "Aligner les formations sur l'évolution réelle des métiers et des compétences.",
          "Align your programmes with how occupations and skills actually evolve.",
        ),
        to: "/solutions/etablissements",
      },
      {
        Icon: Users,
        title: t("Particuliers", "Individuals"),
        desc: t(
          "Étudiants, diplômés, chercheurs d'emploi, freelances, professionnels.",
          "Students, graduates, job seekers, freelancers, professionals.",
        ),
        to: "/solutions/particuliers",
      },
      {
        Icon: Boxes,
        title: t("Autres services", "Other services"),
        desc: t(
          "Annotation de données, IA sur mesure et déploiement pour entreprises, organisations, cabinets et consultants.",
          "Data annotation, bespoke AI and deployment for companies, organisations, firms and consultants.",
        ),
        to: "/produits/malayka-services",
      },
    ],
    footer: { label: t("Parler à notre équipe", "Talk to our team"), href: mailto("Solutions Malayka") },
  },
  {
    key: "data",
    label: t("Data & Intelligence", "Data & Intelligence"),
    entries: [
      {
        Icon: Network,
        title: t("Notre Data Engine", "Our Data Engine"),
        desc: t(
          "Collecte, structuration, annotation humaine, validation, historisation.",
          "Collection, structuring, human annotation, validation, historisation.",
        ),
        to: "/produits/malayka-data#data-engine",
      },
      {
        Icon: Cpu,
        title: "AI Training Data",
        desc: t(
          "Entraînement, évaluation, RAG, matching, classification, agents IA.",
          "Training, evaluation, RAG, matching, classification, AI agents.",
        ),
        to: "/solutions/entreprises-ia",
        badge: t("Pour les entreprises d'IA", "For AI companies"),
      },
      {
        Icon: Database,
        title: "Datasets & API",
        desc: "Jobs, Skills, Training, Opportunities, Labor Market, African AI Dataset.",
        to: "/produits/malayka-data#datasets",
      },
      {
        Icon: Radar,
        title: t("Observatoire temps réel", "Real-time observatory"),
        desc: t(
          "Suivre les variations des métiers, compétences et secteurs au fil de l'eau.",
          "Track how occupations, skills and sectors shift as it happens.",
        ),
        to: "/solutions/gouvernements#observatoire",
      },
    ],
    footer: { label: t("Explorer Malayka Data", "Explore Malayka Data"), to: "/produits/malayka-data" },
  },
];

const buildSimpleLinks = (t: Translate) => [
  { label: t("Tarification", "Pricing"), to: "/tarification" },
  { label: t("Ressources", "Resources"), to: "/ressources" },
  { label: t("À propos", "About"), to: "/a-propos" },
];

/* Mega-menu */

function MegaPanel({ menu, onNavigate }: { menu: MenuDef; onNavigate: () => void }) {
  return (
    <div className="absolute inset-x-5 top-full z-50 pt-3 sm:inset-x-6">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-[#121212] shadow-2xl shadow-black/50">
        <div className="grid gap-1 p-3 sm:grid-cols-2">
          {menu.entries.map((entry) => (
            <Link
              key={entry.title}
              to={entry.to}
              onClick={onNavigate}
              className="group flex items-start gap-3.5 rounded-xl p-4 transition-colors hover:bg-card"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                <entry.Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-[15px] font-bold text-foreground">{entry.title}</span>
                  {entry.badge && (
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-primary">
                      {entry.badge}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[13px] leading-snug text-muted-foreground">{entry.desc}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="border-t border-border bg-card px-6 py-3.5">
          {menu.footer.href ? (
            <a
              href={menu.footer.href}
              onClick={onNavigate}
              className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary hover:text-primary/80"
            >
              {menu.footer.label}
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          ) : (
            <Link
              to={menu.footer.to!}
              onClick={onNavigate}
              className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-primary hover:text-primary/80"
            >
              {menu.footer.label}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* Nav */

export function SiteNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const t = useT();
  const MENUS = buildMenus(t);
  const SIMPLE_LINKS = buildSimpleLinks(t);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fermer les menus à chaque changement de page
  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
    setMobileGroup(null);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenMenu(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    const onClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [openMenu]);

  const cancelClose = () => closeTimer.current && clearTimeout(closeTimer.current);
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };

  return (
    <header
      className={cn(
        "on-dark fixed inset-x-0 top-0 z-50 bg-[#0a0a0a] text-foreground transition-shadow duration-300",
        scrolled && "border-b border-border shadow-lg shadow-black/30",
      )}
    >
      <div
        ref={navRef}
        className="relative mx-auto max-w-6xl px-5 sm:px-6"
        onMouseLeave={scheduleClose}
      >
        <div className="flex items-center justify-between gap-4 py-3.5">
        {/* Logo : la barre est toujours noire, d'où l'inversion.
            `invert` SEUL : il échange le noir et le blanc et préserve donc
            les deux carrés imbriqués de l'icône. Y ajouter `brightness-0`
            aplatissait toute la matière en noir AVANT l'inversion, et le
            logo se retrouvait réduit à un pavé blanc sans relief. */}
        <Link to="/" className="shrink-0">
          <img src="/logo.png" alt="Malayka" className="h-7 w-auto invert" />
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {MENUS.map((menu) => (
            <button
              key={menu.key}
              onMouseEnter={() => { cancelClose(); setOpenMenu(menu.key); }}
              onClick={() => setOpenMenu(menu.key)}
              onFocus={() => setOpenMenu(menu.key)}
              aria-expanded={openMenu === menu.key}
              className={cn(
                "flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-2 text-[13.5px] font-medium transition-colors",
                openMenu === menu.key ? "bg-card text-foreground" : "text-muted-foreground hover:bg-card hover:text-foreground",
              )}
            >
              {menu.label}
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", openMenu === menu.key && "rotate-180")} />
            </button>
          ))}
          {SIMPLE_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-[13.5px] font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA desktop */}
        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          <LangSwitch className="mr-1" />
          <button
            onClick={() => navigate("/login")}
            className="rounded-lg px-3 py-2 text-[13.5px] font-medium text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          >
            {t("Se connecter", "Log in")}
          </button>
          <Button
            size="sm"
            className="h-9 gap-1.5 rounded-lg px-4 text-[13px] font-semibold"
            onClick={() => navigate("/onboarding")}
          >
            {t("Commencer", "Get started")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Langue + burger (mobile) */}
        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <LangSwitch />
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={t("Menu", "Menu")}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-card"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        </div>

        {/* Panneau mega-menu, ancré au conteneur, jamais clippé */}
        {openMenu && (
          <div onMouseEnter={cancelClose}>
            <MegaPanel
              menu={MENUS.find((m) => m.key === openMenu)!}
              onNavigate={() => setOpenMenu(null)}
            />
          </div>
        )}
      </div>

      {/* Mobile */}
      {mobileOpen && (
        <div className="max-h-[calc(100dvh-60px)] overflow-y-auto border-t border-border bg-[#0a0a0a] px-5 pb-8 lg:hidden">
          {MENUS.map((menu) => (
            <div key={menu.key} className="border-b border-border">
              <button
                onClick={() => setMobileGroup((v) => (v === menu.key ? null : menu.key))}
                aria-expanded={mobileGroup === menu.key}
                className="flex w-full items-center justify-between py-4 text-sm font-semibold text-foreground"
              >
                {menu.label}
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", mobileGroup === menu.key && "rotate-180")} />
              </button>
              {mobileGroup === menu.key && (
                <div className="space-y-1 pb-3">
                  {menu.entries.map((entry) => (
                    <Link
                      key={entry.title}
                      to={entry.to}
                      className="flex items-start gap-3 rounded-lg px-2 py-2.5 hover:bg-card"
                    >
                      <entry.Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <div>
                        <p className="text-[13px] font-semibold text-foreground">{entry.title}</p>
                        <p className="mt-0.5 text-[11.5px] leading-snug text-muted-foreground">{entry.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {SIMPLE_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block border-b border-border py-4 text-sm font-semibold text-foreground"
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-6 space-y-3">
            <Button className="w-full gap-2 font-semibold" onClick={() => navigate("/onboarding")}>
              {t("Commencer avec Malayka", "Get started with Malayka")}
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full !border-border !bg-transparent !text-foreground hover:!bg-card"
              onClick={() => navigate("/login")}
            >
              {t("Se connecter", "Log in")}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
