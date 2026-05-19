import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <span className="text-6xl">404</span>
      <h1 className="text-xl font-semibold">{t("not_found.title")}</h1>
      <p className="text-sm text-muted-foreground">
        {t("not_found.hint")}
      </p>
      <Button onClick={() => navigate("/")}>{t("not_found.back_home")}</Button>
    </div>
  );
}
