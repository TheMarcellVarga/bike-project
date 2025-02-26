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
      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),
      clearAuth: async () => {
        await supabase.auth.signOut();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      checkAuth: async () => {
        // First check if there's a session
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
      },
    }),
    {
      name: 'auth-storage',
    }
  )
); 