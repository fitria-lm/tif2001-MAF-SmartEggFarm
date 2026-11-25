import { createContext, useContext } from "react";

export const StokContext = createContext(null);

export function useStok() {
  const ctx = useContext(StokContext);
  if (!ctx) {
    throw new Error("useStok harus dipakai di dalam StokProvider");
  }
  return ctx;
}