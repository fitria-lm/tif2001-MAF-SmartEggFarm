import { createContext, useContext } from "react";

export const PengeluaranContext = createContext(null);

export function usePengeluaran() {
  const ctx = useContext(PengeluaranContext);
  if (!ctx) {
    throw new Error("usePengeluaran harus dipakai di dalam PengeluaranProvider");
  }
  return ctx;
}