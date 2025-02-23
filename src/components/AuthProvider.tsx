"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { supabase } from "@/lib/supabase";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Initial auth check
    const initializeAuth = async () => {
      await checkAuth();
    };
    initializeAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        await checkAuth();
      } else if (event === 'SIGNED_OUT') {
        useAuthStore.getState().clearAuth();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAuth]);

  return <>{children}</>;
} 