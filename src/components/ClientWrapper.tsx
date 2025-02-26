"use client";

import { useState, useEffect } from "react";

/**
 * Wrapper component that only renders its children on the client side
 * to prevent hydration mismatches between server and client renders
 */
export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Return nothing during SSR or initial client render
  }

  return <>{children}</>;
} 