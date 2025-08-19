import { create } from "zustand";
import { UserProfileInfo } from "@/types/global";
import { getUserDocData } from "../firebase/fireStore";

type AuthState = {
  user: UserProfileInfo | null;
  loading: boolean;
  emailProvider: string[] | null;
  isGoogleProvider: boolean;
  setUser: (user: UserProfileInfo | null) => void;
  getUser: () => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  emailProvider: null,
  isGoogleProvider: false,
  setUser: (user) =>
    set({
      user,
      emailProvider: user?.emailProvider ? user.emailProvider : null,
      isGoogleProvider:
        user?.emailProvider?.includes("google.com") &&
        user?.emailProvider?.length === 1,
    }),
  getUser: async () => {
    const user = await getUserDocData();
    set({ user });
  },
  clearUser: () => set({ user: null }),
  setLoading: (loading) => set({ loading }),
}));
