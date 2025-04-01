import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      checkAuth: async () => {
        // Check if Supabase client is available
        if (!supabase) {
          console.warn('Supabase client not available. Authentication is disabled.');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          return;
        }
        
        // First check if there's a session
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            });
            return;
          }
          
          // If there's a session, validate the user with getUser for security
          const { data: { user }, error } = await supabase.auth.getUser();
          
          if (error || !user) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            });
            return;
          }

          set({
            user: {
              id: user.id,
              email: user.email!,
              name: user.user_metadata.name,
              role: user.user_metadata.role,
            },
            token: session.access_token,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Error checking authentication:', error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      skipHydration: true, // Important: Let Supabase handle the initial hydration
    }
  )
); 