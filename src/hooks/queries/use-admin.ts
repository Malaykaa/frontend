import{useMutation,useQuery,useQueryClient}from"@tanstack/react-query";
import{toast}from"sonner";
import{deleteAdminOffer,deleteAdminThread,deleteAdminUser,fetchAdminDocuments,fetchAdminGoals,fetchAdminIntents,fetchAdminOffers,fetchAdminStats,fetchAdminThread,fetchAdminThreads,fetchAdminUser,fetchAdminUsers,fetchScrapingStats,runApifyScraping,runPerplexityScraping,updateAdminOffer,updateAdminUser}from"@/services/api/admin.api";
import type{AdminDocumentsParams,AdminGoalsParams,AdminIntentsParams,AdminOffersParams,AdminThreadsParams,AdminUsersParams}from"@/services/api/admin.api";
import type{AdminOfferUpdate,AdminUserUpdate}from"@/shared/types";
export const adminKeys={stats:["admin","stats"]as const,users:(p:AdminUsersParams)=>["admin","users",p]as const,user:(id:string)=>["admin","users",id]as const,offers:(p:AdminOffersParams)=>["admin","offers",p]as const,goals:(p:AdminGoalsParams)=>["admin","goals",p]as const,threads:(p:AdminThreadsParams)=>["admin","threads",p]as const,thread:(id:string)=>["admin","threads",id]as const,docs:(p:AdminDocumentsParams)=>["admin","documents",p]as const,intents:(p:AdminIntentsParams)=>["admin","intents",p]as const,scrapingStats:["admin","scraping","stats"]as const};
export const useAdminStats=()=>useQuery({queryKey:adminKeys.stats,queryFn:fetchAdminStats,staleTime:30000});
export const useAdminUsers=(p:AdminUsersParams={})=>useQuery({queryKey:adminKeys.users(p),queryFn:()=>fetchAdminUsers(p),staleTime:60000});
export const useAdminUser=(id:string)=>useQuery({queryKey:adminKeys.user(id),queryFn:()=>fetchAdminUser(id),enabled:!!id});
export const useAdminOffers=(p:AdminOffersParams={})=>useQuery({queryKey:adminKeys.offers(p),queryFn:()=>fetchAdminOffers(p),staleTime:60000});
export const useAdminGoals=(p:AdminGoalsParams={})=>useQuery({queryKey:adminKeys.goals(p),queryFn:()=>fetchAdminGoals(p),staleTime:60000});
export const useAdminThreads=(p:AdminThreadsParams={})=>useQuery({queryKey:adminKeys.threads(p),queryFn:()=>fetchAdminThreads(p),staleTime:60000});
export const useAdminThread=(id:string)=>useQuery({queryKey:adminKeys.thread(id),queryFn:()=>fetchAdminThread(id),enabled:!!id});
export const useAdminDocuments=(p:AdminDocumentsParams={})=>useQuery({queryKey:adminKeys.docs(p),queryFn:()=>fetchAdminDocuments(p),staleTime:60000});
export const useAdminIntents=(p:AdminIntentsParams={})=>useQuery({queryKey:adminKeys.intents(p),queryFn:()=>fetchAdminIntents(p),staleTime:60000});
export const useScrapingStats=()=>useQuery({queryKey:adminKeys.scrapingStats,queryFn:fetchScrapingStats,staleTime:60000});
export function useUpdateAdminUser(){const qc=useQueryClient();return useMutation({mutationFn:({userId,payload}:{userId:string;payload:AdminUserUpdate})=>updateAdminUser(userId,payload),onSuccess:(_,{userId})=>{qc.invalidateQueries({queryKey:["admin","users"]});qc.invalidateQueries({queryKey:adminKeys.user(userId)});toast.success("Utilisateur mis a jour.")},onError:()=>toast.error("Erreur.")})}
export function useDeleteAdminUser(){const qc=useQueryClient();return useMutation({mutationFn:(id:string)=>deleteAdminUser(id),onSuccess:()=>{qc.invalidateQueries({queryKey:["admin","users"]});qc.invalidateQueries({queryKey:adminKeys.stats});toast.success("Utilisateur supprime.")},onError:()=>toast.error("Erreur.")})}
export function useUpdateAdminOffer(){const qc=useQueryClient();return useMutation({mutationFn:({offerId,payload}:{offerId:string;payload:AdminOfferUpdate})=>updateAdminOffer(offerId,payload),onSuccess:()=>{qc.invalidateQueries({queryKey:["admin","offers"]});toast.success("Offre mise a jour.")},onError:()=>toast.error("Erreur.")})}
export function useDeleteAdminOffer(){const qc=useQueryClient();return useMutation({mutationFn:(id:string)=>deleteAdminOffer(id),onSuccess:()=>{qc.invalidateQueries({queryKey:["admin","offers"]});qc.invalidateQueries({queryKey:adminKeys.stats});toast.success("Offre supprimee.")},onError:()=>toast.error("Erreur.")})}
export function useDeleteAdminThread(){const qc=useQueryClient();return useMutation({mutationFn:(id:string)=>deleteAdminThread(id),onSuccess:()=>{qc.invalidateQueries({queryKey:["admin","threads"]});qc.invalidateQueries({queryKey:adminKeys.stats});toast.success("Thread supprime.")},onError:()=>toast.error("Erreur.")})}
export function useRunPerplexity(){const qc=useQueryClient();return useMutation({mutationFn:runPerplexityScraping,onSuccess:()=>{setTimeout(()=>qc.invalidateQueries({queryKey:adminKeys.scrapingStats}),5000);toast.success("Run Perplexity lancé — les résultats arrivent en arrière-plan.")},onError:()=>toast.error("Erreur lors du déclenchement Perplexity.")})}
export function useRunApify(){const qc=useQueryClient();return useMutation({mutationFn:runApifyScraping,onSuccess:()=>{setTimeout(()=>qc.invalidateQueries({queryKey:adminKeys.scrapingStats}),5000);toast.success("Run Apify lancé — les résultats arrivent en arrière-plan (peut prendre plusieurs minutes).")},onError:()=>toast.error("Erreur lors du déclenchement Apify.")})}

export function useCreateAdminOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: import("@/services/api/admin.api").AdminOfferCreate) =>
      import("@/services/api/admin.api").then(m => m.createAdminOffer(payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "offers"] });
      qc.invalidateQueries({ queryKey: adminKeys.stats });
      toast.success("Offre ajoutée. L'embedding sera généré au prochain run.");
    },
    onError: () => toast.error("Erreur lors de la création."),
  });
}

export function useCreateAdminUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: import("@/services/api/admin.api").AdminUserCreate) =>
      import("@/services/api/admin.api").then(m => m.createAdminUser(payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      qc.invalidateQueries({ queryKey: adminKeys.stats });
      toast.success("Utilisateur créé.");
    },
    onError: (err: unknown) => {
      const msg = (err as { data?: { detail?: string } })?.data?.detail ?? "Erreur lors de la création.";
      toast.error(msg);
    },
  });
}


export function useAdminDeliverables(p: import("@/services/api/admin.api").AdminDeliverablesParams = {}) {
  return useQuery({
    queryKey: ["admin", "deliverables", p] as const,
    queryFn: () => import("@/services/api/admin.api").then(m => m.fetchAdminDeliverables(p)),
    staleTime: 60_000,
  });
}

// ── Sources de scraping ───────────────────────────────────────────────────────

const SOURCES_KEY = ["admin", "scraping", "sources"] as const;

export function useScrapingSources() {
  return useQuery({
    queryKey: SOURCES_KEY,
    queryFn: () =>
      import("@/services/api/admin.api").then(m => m.fetchScrapingSources()),
    staleTime: 30_000,
  });
}

export function useCreateScrapingSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: import("@/services/api/admin.api").ScrapingSourceCreate) =>
      import("@/services/api/admin.api").then(m => m.createScrapingSource(payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SOURCES_KEY });
      toast.success("Source ajoutée. Elle sera prise en compte au prochain run heavy.");
    },
    onError: (err: unknown) => {
      const msg = (err as { data?: { detail?: string } })?.data?.detail ?? "Erreur.";
      toast.error(msg);
    },
  });
}

export function useUpdateScrapingSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: import("@/services/api/admin.api").ScrapingSourceUpdate }) =>
      import("@/services/api/admin.api").then(m => m.updateScrapingSource(id, payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SOURCES_KEY });
      toast.success("Source mise à jour.");
    },
    onError: () => toast.error("Erreur."),
  });
}

export function useDeleteScrapingSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      import("@/services/api/admin.api").then(m => m.deleteScrapingSource(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SOURCES_KEY });
      toast.success("Source supprimée.");
    },
    onError: () => toast.error("Erreur."),
  });
}

// ── Actors Apify ──────────────────────────────────────────────────────────────

const ACTORS_KEY = ["admin", "scraping", "actors"] as const;

export function useScrapingActors() {
  return useQuery({
    queryKey: ACTORS_KEY,
    queryFn: () => import("@/services/api/admin.api").then(m => m.fetchScrapingActors()),
    staleTime: 30_000,
  });
}

export function useCreateScrapingActor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: import("@/services/api/admin.api").ScrapingActorCreate) =>
      import("@/services/api/admin.api").then(m => m.createScrapingActor(payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ACTORS_KEY });
      toast.success("Actor ajouté. Il sera exécuté au prochain run.");
    },
    onError: (err: unknown) => {
      const msg = (err as { data?: { detail?: string } })?.data?.detail ?? "Erreur.";
      toast.error(msg);
    },
  });
}

export function useUpdateScrapingActor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: import("@/services/api/admin.api").ScrapingActorUpdate }) =>
      import("@/services/api/admin.api").then(m => m.updateScrapingActor(id, payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ACTORS_KEY });
      toast.success("Actor mis à jour.");
    },
    onError: () => toast.error("Erreur."),
  });
}

export function useDeleteScrapingActor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      import("@/services/api/admin.api").then(m => m.deleteScrapingActor(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ACTORS_KEY });
      toast.success("Actor supprimé.");
    },
    onError: () => toast.error("Erreur."),
  });
}
