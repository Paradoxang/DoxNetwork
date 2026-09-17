import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/** Estado de interfaz compartido entre el nav y el resto: por ahora, el buscador. */
interface UIState {
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  /** Texto con el que abre el buscador (lo escrito en el buscador del hero). */
  searchSeed: string;
  openSearch: (q?: string) => void;
}

const UICtx = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchSeed, setSearchSeed] = useState("");
  const openSearch = useCallback((q = "") => {
    setSearchSeed(q);
    setSearchOpen(true);
  }, []);

  // Atajos globales: Ctrl/Cmd + K y "/" (si no se está escribiendo en un campo)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest?.("input, textarea, select, [contenteditable]");
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(
    () => ({
      searchOpen,
      setSearchOpen: (v: boolean) => {
        if (v) setSearchSeed("");
        setSearchOpen(v);
      },
      searchSeed,
      openSearch,
    }),
    [searchOpen, searchSeed, openSearch]
  );
  return <UICtx.Provider value={value}>{children}</UICtx.Provider>;
}

export function useUI() {
  const ctx = useContext(UICtx);
  if (!ctx) throw new Error("useUI debe usarse dentro de <UIProvider>");
  return ctx;
}

/** Normaliza para buscar sin tildes ni mayúsculas. */
export const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
