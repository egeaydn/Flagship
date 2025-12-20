import { useFlagshipContext } from './FlagshipProvider';
import type { FlagsResponse } from '@flagship/sdk';

export interface UseFlagsResult {
  flags: FlagsResponse | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useFlags(): UseFlagsResult {
  const { flags, loading, error, refresh } = useFlagshipContext();
  
  return {
    flags,
    loading,
    error,
    refresh,
  };
}
