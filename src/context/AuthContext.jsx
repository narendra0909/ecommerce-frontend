import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  fetchMyProfile,
  loginAdmin,
  loginUser,
  logoutRequest,
} from "../api/auth";
import { setAccessToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchMyProfile();
        if (!cancelled) setUser(data.data?.user ?? null);
      } catch {
        // Not authenticated; refresh cookie is absent/invalid.
      } finally {
        if (!cancelled) setInitializing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      isAdmin: user?.role === "ADMIN",
      async login(credentials) {
        const loggedIn = await loginUser(credentials);
        setUser(loggedIn);
        return loggedIn;
      },
      async loginAdmin(credentials) {
        const loggedIn = await loginAdmin(credentials);
        setUser(loggedIn);
        return loggedIn;
      },
      async logout() {
        const isAdmin = user?.role === "ADMIN";
        try {
          await logoutRequest(isAdmin);
        } finally {
          setAccessToken(null);
          setUser(null);
        }
      },
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
