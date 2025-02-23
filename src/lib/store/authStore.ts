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
      clearAuth: async () => {
        await supabase.auth.signOut();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      checkAuth: async () => {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error || !session) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            });
            return;
          }

          set({
            user: {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata.name || '',
              role: session.user.user_metadata.role || 'USER',
            },
            token: session.access_token,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Error checking auth:', error);
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