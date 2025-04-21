
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  username: string | null;
  avatar_url: string | null;
}

export function useAuthProfile() {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to auth state changes and get session initially
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user?.id) {
        setTimeout(() => fetchProfile(session.user.id), 0);
      } else setProfile(null);
      setLoading(false);
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user?.id) fetchProfile(session.user.id);
      setLoading(false);
    });

    function fetchProfile(id: string) {
      supabase
        .from("profiles")
        .select("username,avatar_url")
        .eq("id", id)
        .maybeSingle()
        .then(({ data }) => setProfile(data ?? null));
    }

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/auth";
  }

  return { user, profile, signOut, loading };
}
