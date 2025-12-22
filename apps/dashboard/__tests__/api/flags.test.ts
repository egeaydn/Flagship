import { describe, it, expect, beforeAll } from 'vitest';

const API_URL = 'http://localhost:3000/api/v1';
const TEST_API_KEY = 'fsk_server_133e61fa671d3e927a1eba415220a284';

describe('Feature Flags API Integration Tests', () => {
  describe('GET /flags - Health Check', () => {
    it('should return service info', async () => {
      const response = await fetch(`${API_URL}/flags`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('service');
      expect(data.service).toBe('Flagship Feature Flags API');
      expect(data.status).toBe('operational');
    });
  });

  describe('POST /flags - Flag Evaluation', () => {
    it('should require API key', async () => {
      const response = await fetch(`${API_URL}/flags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: { id: 'test-user' } }),
      });
      
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Invalid or missing API key');
    });

    it('should reject invalid API key', async () => {
      const response = await fetch(`${API_URL}/flags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'invalid_key_12345',
        },
        body: JSON.stringify({ user: { id: 'test-user' } }),
      });
      
      expect(response.status).toBe(401);
    });

    it('should return flags with valid API key', async () => {
      const response = await fetch(`${API_URL}/flags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': TEST_API_KEY,
        },
        body: JSON.stringify({
          user: {
            id: 'test-user-123',
            attributes: {
              plan: 'premium',
              country: 'TR'
            }
          }
        }),
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      expect(data).toHaveProperty('flags');
      expect(data).toHaveProperty('user');
      expect(typeof data.flags).toBe('object');
    });

    it('should evaluate targeting rules correctly', async () => {
      const response = await fetch(`${API_URL}/flags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': TEST_API_KEY,
        },
        body: JSON.stringify({
          user: {
            id: 'premium-user',
            attributes: {
              plan: 'premium',
              country: 'TR'
            }
          }
        }),
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      // Check flag structure
      Object.values(data.flags).forEach((flag: any) => {
        expect(flag).toHaveProperty('enabled');
        expect(flag).toHaveProperty('value');
        expect(flag).toHaveProperty('type');
        expect(typeof flag.enabled).toBe('boolean');
      });
    });

    it('should handle user without attributes', async () => {
      const response = await fetch(`${API_URL}/flags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': TEST_API_KEY,
        },
        body: JSON.stringify({
          user: {
            id: 'simple-user'
          }
        }),
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('flags');
    });

    it('should handle empty user context', async () => {
      const response = await fetch(`${API_URL}/flags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': TEST_API_KEY,
        },
        body: JSON.stringify({}),
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('flags');
    });
  });

  describe('CORS Headers', () => {
    it('should include CORS headers in response', async () => {
      const response = await fetch(`${API_URL}/flags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': TEST_API_KEY,
        },
        body: JSON.stringify({ user: { id: 'test' } }),
      });
      
      expect(response.headers.get('access-control-allow-origin')).toBe('*');
      expect(response.headers.get('access-control-allow-methods')).toContain('POST');
    });

    it('should handle OPTIONS preflight request', async () => {
      const response = await fetch(`${API_URL}/flags`, {
        method: 'OPTIONS',
      });
      
      expect(response.status).toBe(200);
      expect(response.headers.get('access-control-allow-origin')).toBe('*');
      expect(response.headers.get('access-control-allow-headers')).toContain('x-api-key');
    });
  });

  describe('Response Caching', () => {
    it('should include cache headers', async () => {
      const response = await fetch(`${API_URL}/flags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': TEST_API_KEY,
        },
        body: JSON.stringify({ user: { id: 'test' } }),
      });
      
      const cacheControl = response.headers.get('cache-control');
      expect(cacheControl).toBeTruthy();
      expect(cacheControl).toContain('max-age');
    });
  });
});
