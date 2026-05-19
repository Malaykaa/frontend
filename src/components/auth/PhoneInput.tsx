import { useState, useRef } from "react";
import { DEFAULT_COUNTRY, searchCountries, type Country } from "@/shared/data/countries";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface PhoneInputProps {
  value: string;
  onChange: (fullNumber: string, country: Country) => void;
  defaultCountry?: Country;
  error?: string;
  placeholder?: string;
}

export function PhoneInput({
  value,
  onChange,
  defaultCountry = DEFAULT_COUNTRY,
  error,
  placeholder = "07 00 00 00 00",
}: PhoneInputProps) {
  const [selected, setSelected] = useState<Country>(defaultCountry);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = searchCountries(search);

  const handleSelect = (country: Country) => {
    setSelected(country);
    setOpen(false);
    setSearch("");
    onChange(country.dialCode + value.replace(/^\+?\d+\s?/, ""), country);
    inputRef.current?.focus();
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d\s]/g, "");
    onChange(selected.dialCode + raw, selected);
  };

  const displayValue = value.startsWith(selected.dialCode)
    ? value.slice(selected.dialCode.length).trimStart()
    : value;

  return (
    <div className="relative">
      <div
        className={cn(
          "flex items-center rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          error && "border-destructive focus-within:ring-destructive"
        )}
      >
        {/* Country selector */}
        <button
          type="button"
          className="flex items-center gap-1.5 border-r px-3 py-2.5 text-sm hover:bg-muted/50 rounded-l-md transition-colors"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="text-base">{selected.flag}</span>
          <span className="text-xs text-muted-foreground">{selected.dialCode}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>

        {/* Number input */}
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          value={displayValue}
          onChange={handleNumberChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <div className="p-2">
            <div className="flex items-center gap-2 rounded-md border px-2">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un pays…"
                className="flex-1 bg-transparent py-1.5 text-xs outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="max-h-52 overflow-y-auto">
            {filtered.map((country) => (
              <button
                key={country.code}
                type="button"
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-muted/50 transition-colors",
                  selected.code === country.code && "bg-muted"
                )}
                onClick={() => handleSelect(country)}
              >
                <span className="text-base">{country.flag}</span>
                <span className="flex-1 text-left">{country.nameFr}</span>
                <span className="text-xs text-muted-foreground">{country.dialCode}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-center text-xs text-muted-foreground">
                Aucun résultat
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
