import { create } from "zustand";
import { UserProfileInfo } from "@/types/global";
import { getUserDocData } from "../firebase/fireStore";

type AuthState = {
  user: UserProfileInfo | null;
  loading: boolean;
  setUser: (user: UserProfileInfo | null) => void;
  getUser: () => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  user: null,
  loading: true,

  // Actions
  setUser: (user) => set({ user }),
  getUser: async () => {
    const user = await getUserDocData();
    set({ user });
  },
  clearUser: () => set({ user: null }),
  setLoading: (loading) => set({ loading }),
}));
