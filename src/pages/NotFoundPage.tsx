import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <span className="text-6xl">404</span>
      <h1 className="text-xl font-semibold">Page introuvable</h1>
      <p className="text-sm text-muted-foreground">
        Cette page n'existe pas ou a été déplacée.
      </p>
      <Button onClick={() => navigate("/")}>Retour à l'accueil</Button>
    </div>
  );
}
