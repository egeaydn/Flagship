import { useFlagshipContext } from './FlagshipProvider';

export interface UseFlagResult<T = any> {
  enabled: boolean;
  value: T;
  loading: boolean;
  error: Error | null;
}

export function useFlag<T = any>(
  flagKey: string, 
  defaultValue: T
): UseFlagResult<T> {
  const { flags, loading, error } = useFlagshipContext();

  if (!flags || loading) {
    return {
      enabled: false,
      value: defaultValue,
      loading,
      error,
    };
  }

  const flag = flags.flags[flagKey];
  
  return {
    enabled: flag ? flag.enabled : false,
    value: flag?.enabled ? (flag.value as T) : defaultValue,
    loading: false,
    error,
  };
}
