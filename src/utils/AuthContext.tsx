import supabase from "../database/supabase_client";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  session: any | null;
  user: any | null;
  loading: any | null;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any | null>(null);
  const [user, setuser] = useState<any | null>(null);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setuser(data.session?.user ?? null);
      setloading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setuser(session?.user ?? null);
        setloading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const contex = useContext(AuthContext);
  if (!contex) {
    throw new Error("useBox must be used within a BoxcontexProvider");
  }
  return contex;
}
