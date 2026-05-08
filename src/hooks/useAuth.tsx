import { authService, UserProfile } from "@/src/services/auth.service";
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  register: (data: any) => Promise<any>;
  login: (data: any) => Promise<any>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync with Firebase and LocalStorage
  useEffect(() => {
    // 1. Check persistence
    const saved = localStorage.getItem('finflex_user');
    if (saved) {
      setUser(JSON.parse(saved));
      setLoading(false);
    }

    // 2. Subscribe to Firebase Auth
    const unsubscribe = authService.subscribeToAuth(async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await authService.ensureUserProfile(firebaseUser);
        setUser(profile);
        localStorage.setItem('finflex_user', JSON.stringify(profile));
      } else {
        // Only clear if not using legacy custom token
        if (!localStorage.getItem('finflex_token')) {
          setUser(null);
          localStorage.removeItem('finflex_user');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = useCallback(async (data: any) => {
  try {
    const result = await authService.registerWithEmail(
      data.email,
      data.password,
      data.name
    );

    return {
      success: true,
      user: result
    };
  } catch (error: any) {
    return {
      error: error.message || "Registration failed"
    };
  }
}, []);
        

  const login = useCallback(async (data: any) => {
    const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.token) {
        localStorage.setItem('finflex_token', result.token);
        localStorage.setItem('finflex_user', JSON.stringify(result.user));
        setUser(result.user);
    }
    return result;
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    localStorage.removeItem('finflex_token');
    localStorage.removeItem('finflex_user');
    setUser(null);
  }, []);

  const signInWithGoogle = useCallback(() => authService.signInWithGoogle(), []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, register, login, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
