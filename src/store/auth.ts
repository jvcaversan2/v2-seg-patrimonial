import { create } from "zustand";

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem("token"),
  user: (() => {
    const token = localStorage.getItem("token");
    return token ? decodeJwt(token) : null;
  })(),

  login: (token: string) => {
    localStorage.setItem("token", token);
    const payload = decodeJwt(token);
    set({ token: token, user: payload });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
  },
}));

function decodeJwt(token: string): User | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
