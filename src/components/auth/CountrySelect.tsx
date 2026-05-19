import { useState } from "react";
import { COUNTRIES, searchCountries, type Country } from "@/shared/data/countries";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface CountrySelectProps {
  value: string;
  onChange: (code: string) => void;
  error?: string;
  placeholder?: string;
}

export function CountrySelect({
  value,
  onChange,
  error,
  placeholder = "Select a country",
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selected = COUNTRIES.find((c) => c.code === value);
  const filtered = searchCountries(search);

  return (
    <div className="relative">
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between rounded-md border bg-background px-3 py-2.5 text-sm hover:bg-muted/30 transition-colors",
          error && "border-destructive",
          !selected && "text-muted-foreground"
        )}
        onClick={() => setOpen((o) => !o)}
      >
        {selected ? (
          <span className="flex items-center gap-2">
            <span>{selected.flag}</span>
            <span>{selected.nameFr}</span>
          </span>
        ) : (
          <span>{placeholder}</span>
        )}
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}

      {open && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-lg">
          <div className="p-2">
            <div className="flex items-center gap-2 rounded-md border px-2">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher…"
                className="flex-1 bg-transparent py-1.5 text-xs outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.map((country: Country) => (
              <button
                key={country.code}
                type="button"
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-2.5 text-sm hover:bg-muted/50 transition-colors",
                  value === country.code && "bg-primary/10 font-medium"
                )}
                onClick={() => {
                  onChange(country.code);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <span>{country.flag}</span>
                <span>{country.nameFr}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">
                Aucun résultat
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
