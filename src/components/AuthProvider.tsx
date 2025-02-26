"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { supabase } from "@/lib/supabase";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    // Mark that we're on the client
    setIsClient(true);
    
    // Initial auth check
    const initializeAuth = async () => {
      await checkAuth();
    };
    initializeAuth();

    // Subscribe to auth changes
    let subscription;
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await checkAuth();
        } else if (event === 'SIGNED_OUT') {
          useAuthStore.getState().clearAuth();
        }
      });
      subscription = data.subscription;
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, [checkAuth]);

  // Return the children directly, hydration will be managed by StoreInitializer
  return <>{children}</>;
} 