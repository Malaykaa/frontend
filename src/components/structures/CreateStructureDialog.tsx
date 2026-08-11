import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Loader2, School, UserSquare2, Building2, GraduationCap, MoreHorizontal } from "lucide-react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/shared/lib/utils";
import { useRequestStructure } from "@/hooks/queries/use-structure";
import type { StructureType } from "@/services/api/structure.api";

const TYPE_OPTIONS: { value: StructureType; labelKey: string; Icon: typeof Building2 }[] = [
  { value: "training_center",     labelKey: "structures.type_training_center",     Icon: Building2 },
  { value: "independent_trainer", labelKey: "structures.type_independent_trainer", Icon: UserSquare2 },
  { value: "school",              labelKey: "structures.type_school",              Icon: School },
  { value: "university",          labelKey: "structures.type_university",          Icon: GraduationCap },
  { value: "other",                labelKey: "structures.type_other",               Icon: MoreHorizontal },
];

interface CreateStructureDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateStructureDialog({ open, onClose }: CreateStructureDialogProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<1 | 2>(1);
  const [type, setType] = useState<StructureType | null>(null);
  const [typeOther, setTypeOther] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  const requestStructure = useRequestStructure();

  const resetAndClose = () => {
    setStep(1);
    setType(null);
    setTypeOther("");
    setName("");
    setCountry("");
    setAddress("");
    setEmail("");
    onClose();
  };

  const canGoNext = !!type && (type !== "other" || typeOther.trim().length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !type) return;
    try {
      await requestStructure.mutateAsync({
        name: name.trim(),
        country: country.trim() || undefined,
        structure_type: type,
        structure_type_other: type === "other" ? typeOther.trim() : undefined,
        address: address.trim() || undefined,
        email: email.trim() || undefined,
      });
      resetAndClose();
    } catch {
      /* toast d'erreur déjà géré par le hook */
    }
  };

  return (
    <BottomSheet
      open={open}
      onClose={resetAndClose}
      title={step === 1 ? t("structures.create_dialog_title") : t("structures.create_dialog_details_title")}
      description={step === 1 ? t("structures.create_dialog_hint") : undefined}
      maxHeight="max-h-[85vh]"
      locked={requestStructure.isPending}
    >
      {step === 1 ? (
        <div className="space-y-4">
          <div className="space-y-2">
            {TYPE_OPTIONS.map(({ value, labelKey, Icon }) => (
              <button
                key={value}
                type="button"
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all",
                  type === value ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-input hover:bg-muted/40"
                )}
                onClick={() => setType(value)}
              >
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", type === value ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{t(labelKey)}</span>
                {type === value && <Check className="ml-auto h-4 w-4 shrink-0 text-primary" />}
              </button>
            ))}
          </div>

          {type === "other" && (
            <div className="space-y-1.5">
              <Label>{t("structures.type_other_label")}</Label>
              <Input
                autoFocus
                placeholder={t("structures.type_other_placeholder")}
                value={typeOther}
                onChange={(e) => setTypeOther(e.target.value)}
              />
            </div>
          )}

          <Button className="w-full" disabled={!canGoNext} onClick={() => setStep(2)}>
            {t("common.next")}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label>{t("settings.structure_name_label")} *</Label>
            <Input autoFocus value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t("settings.structure_country_label")}</Label>
            <Input value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t("structures.create_address_label")}</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>{t("structures.create_email_label")}</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)} disabled={requestStructure.isPending}>
              {t("common.back")}
            </Button>
            <Button type="submit" className="flex-1" disabled={requestStructure.isPending || !name.trim()}>
              {requestStructure.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t("settings.structure_submit")}
            </Button>
          </div>
        </form>
      )}
    </BottomSheet>
  );
}
