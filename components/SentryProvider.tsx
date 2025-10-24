"use client";

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { setUserContext } from '@/lib/monitoring';

export default function SentryProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      setUserContext({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        isSeller: user.publicMetadata?.isSeller as boolean || false,
      });
    }
  }, [user, isLoaded]);

  return <>{children}</>;
}

