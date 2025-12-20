import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { FlagshipClient, FlagsResponse, UserContext } from '@flagship/sdk';

export interface FlagshipProviderProps {
  client: FlagshipClient;
  user?: UserContext;
  children: ReactNode;
  refreshInterval?: number; // Auto-refresh interval in ms
}

interface FlagshipContextValue {
  flags: FlagsResponse | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

const FlagshipContext = createContext<FlagshipContextValue | undefined>(undefined);

export function FlagshipProvider({ 
  client, 
  user, 
  children,
  refreshInterval 
}: FlagshipProviderProps) {
  const [flags, setFlags] = useState<FlagsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFlags = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await client.getFlags(user);
      setFlags(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch flags'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, [user?.id, JSON.stringify(user?.attributes)]);

  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchFlags, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);

  return (
    <FlagshipContext.Provider value={{ flags, loading, error, refresh: fetchFlags }}>
      {children}
    </FlagshipContext.Provider>
  );
}

export function useFlagshipContext() {
  const context = useContext(FlagshipContext);
  if (!context) {
    throw new Error('useFlagshipContext must be used within FlagshipProvider');
  }
  return context;
}
