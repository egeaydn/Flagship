"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  FlagshipProvider: () => FlagshipProvider,
  useFlag: () => useFlag,
  useFlags: () => useFlags
});
module.exports = __toCommonJS(index_exports);

// src/FlagshipProvider.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var FlagshipContext = (0, import_react.createContext)(void 0);
function FlagshipProvider({
  client,
  user,
  children,
  refreshInterval
}) {
  const [flags, setFlags] = (0, import_react.useState)(null);
  const [loading, setLoading] = (0, import_react.useState)(true);
  const [error, setError] = (0, import_react.useState)(null);
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
  (0, import_react.useEffect)(() => {
    fetchFlags();
  }, [user?.id, JSON.stringify(user?.attributes)]);
  (0, import_react.useEffect)(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchFlags, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlagshipContext.Provider, { value: { flags, loading, error, refresh: fetchFlags }, children });
}
function useFlagshipContext() {
  const context = (0, import_react.useContext)(FlagshipContext);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FlagshipProvider,
  useFlag,
  useFlags
});
