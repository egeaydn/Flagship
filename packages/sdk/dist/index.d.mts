interface FlagshipConfig {
    apiKey: string;
    apiUrl?: string;
    cacheTTL?: number;
}
interface UserContext {
    id?: string;
    attributes?: Record<string, any>;
}
interface FlagValue {
    enabled: boolean;
    value: any;
    type: 'boolean' | 'multivariate' | 'number' | 'json';
}
interface FlagsResponse {
    flags: Record<string, FlagValue>;
    user?: UserContext;
}
declare class FlagshipClient {
    private config;
    private cache;
    constructor(config: FlagshipConfig);
    getFlags(user?: UserContext): Promise<FlagsResponse>;
    isEnabled(flagKey: string, flags: FlagsResponse): boolean;
    getValue<T = any>(flagKey: string, flags: FlagsResponse, defaultValue: T): T;
    clearCache(): void;
}
declare function createClient(config: FlagshipConfig): FlagshipClient;

export { type FlagValue, type FlagsResponse, FlagshipClient, type FlagshipConfig, type UserContext, createClient };
