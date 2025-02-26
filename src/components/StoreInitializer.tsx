"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { useCartStore } from '@/lib/store/cartStore';

/**
 * Component to initialize the zustand stores on client side
 * Prevents hydration mismatch issues by deferring store hydration to client only
 */
export default function StoreInitializer() {
  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      // Manually rehydrate the auth store on client side
      useAuthStore.persist.rehydrate();
      
      // Manually rehydrate the cart store on client side
      useCartStore.persist.rehydrate();
      
      // Check auth status
      useAuthStore.getState().checkAuth();
    }
  }, []);
  
  // This component doesn't render anything
  return null;
} 