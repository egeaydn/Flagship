export interface FlagshipConfig {
  apiKey: string;
  apiUrl?: string;
  cacheTTL?: number; // milliseconds
}

export interface UserContext {
  id?: string;
  attributes?: Record<string, any>;
}

export interface FlagValue {
  enabled: boolean;
  value: any;
  type: 'boolean' | 'multivariate' | 'number' | 'json';
}

export interface FlagsResponse {
  flags: Record<string, FlagValue>;
  user?: UserContext;
}

interface CacheEntry {
  data: FlagsResponse;
  timestamp: number;
}

export class FlagshipClient {
  private config: Required<FlagshipConfig>;
  private cache: CacheEntry | null = null;

  constructor(config: FlagshipConfig) {
    this.config = {
      apiKey: config.apiKey,
      apiUrl: config.apiUrl || 'http://localhost:3000/api/v1',
      cacheTTL: config.cacheTTL || 60000, // 1 minute default
    };
  }

  async getFlags(user?: UserContext): Promise<FlagsResponse> {
    // Check cache
    if (this.cache && Date.now() - this.cache.timestamp < this.config.cacheTTL) {
      return this.cache.data;
    }

    // Fetch from API
    const response = await fetch(`${this.config.apiUrl}/flags`, {
      method: 'POST',
      headers: {
        'x-api-key': this.config.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user: user || {} }),
    });

    if (!response.ok) {
      const error: any = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Flagship API error: ${error.error || response.statusText}`);
    }

    const data = await response.json() as FlagsResponse;

    // Update cache
    this.cache = {
      data,
      timestamp: Date.now(),
    };

    return data;
  }

  isEnabled(flagKey: string, flags: FlagsResponse): boolean {
    const flag = flags.flags[flagKey];
    return flag ? flag.enabled : false;
  }

  getValue<T = any>(flagKey: string, flags: FlagsResponse, defaultValue: T): T {
    const flag = flags.flags[flagKey];
    if (!flag || !flag.enabled) {
      return defaultValue;
    }
    return flag.value as T;
  }

  clearCache(): void {
    this.cache = null;
  }
}

export function createClient(config: FlagshipConfig): FlagshipClient {
  return new FlagshipClient(config);
}
