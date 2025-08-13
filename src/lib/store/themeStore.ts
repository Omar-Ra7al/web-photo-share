import { create } from "zustand";

type Theme = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
};

export const useTheme = create<Theme>((set) => ({
  theme: "dark",
  setTheme: (theme) => set({ theme }),
}));
