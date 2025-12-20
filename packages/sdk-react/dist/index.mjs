// src/FlagshipProvider.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
var FlagshipContext = createContext(void 0);
function FlagshipProvider({
  client,
  user,
  children,
  refreshInterval
}) {
  const [flags, setFlags] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchFlags = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await client.getFlags(user);
      setFlags(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch flags"));
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
  return /* @__PURE__ */ jsx(FlagshipContext.Provider, { value: { flags, loading, error, refresh: fetchFlags }, children });
}
function useFlagshipContext() {
  const context = useContext(FlagshipContext);
  if (!context) {
    throw new Error("useFlagshipContext must be used within FlagshipProvider");
  }
  return context;
}

// src/useFlags.ts
function useFlags() {
  const { flags, loading, error, refresh } = useFlagshipContext();
  return {
    flags,
    loading,
    error,
    refresh
  };
}

// src/useFlag.ts
function useFlag(flagKey, defaultValue) {
  const { flags, loading, error } = useFlagshipContext();
  if (!flags || loading) {
    return {
      enabled: false,
      value: defaultValue,
      loading,
      error
    };
  }
  const flag = flags.flags[flagKey];
  return {
    enabled: flag ? flag.enabled : false,
    value: flag?.enabled ? flag.value : defaultValue,
    loading: false,
    error
  };
}
export {
  FlagshipProvider,
  useFlag,
  useFlags
};
