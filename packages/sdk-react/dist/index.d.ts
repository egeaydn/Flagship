import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';
import { FlagshipClient, UserContext, FlagsResponse } from '@flagship/sdk';

interface FlagshipProviderProps {
    client: FlagshipClient;
    user?: UserContext;
    children: ReactNode;
    refreshInterval?: number;
}
declare function FlagshipProvider({ client, user, children, refreshInterval }: FlagshipProviderProps): react_jsx_runtime.JSX.Element;

interface UseFlagsResult {
    flags: FlagsResponse | null;
    loading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
}
declare function useFlags(): UseFlagsResult;

interface UseFlagResult<T = any> {
    enabled: boolean;
    value: T;
    loading: boolean;
    error: Error | null;
}
declare function useFlag<T = any>(flagKey: string, defaultValue: T): UseFlagResult<T>;

export { FlagshipProvider, type FlagshipProviderProps, useFlag, useFlags };
