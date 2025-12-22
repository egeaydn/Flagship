import { describe, it, expect } from 'vitest';
import { evaluateTargeting, evaluateCondition, hashString, isInRollout } from '@/lib/targeting';

describe('Targeting Engine Unit Tests', () => {
  describe('evaluateCondition', () => {
    it('should evaluate eq (equals) operator', () => {
      expect(evaluateCondition('premium', 'eq', 'premium')).toBe(true);
      expect(evaluateCondition('free', 'eq', 'premium')).toBe(false);
    });

    it('should evaluate ne (not equals) operator', () => {
      expect(evaluateCondition('free', 'ne', 'premium')).toBe(true);
      expect(evaluateCondition('premium', 'ne', 'premium')).toBe(false);
    });

    it('should evaluate contains operator', () => {
      expect(evaluateCondition('hello world', 'contains', 'world')).toBe(true);
      expect(evaluateCondition('hello', 'contains', 'world')).toBe(false);
    });

    it('should evaluate in operator (array)', () => {
      expect(evaluateCondition('TR', 'in', ['TR', 'US', 'UK'])).toBe(true);
      expect(evaluateCondition('DE', 'in', ['TR', 'US', 'UK'])).toBe(false);
    });

    it('should evaluate in operator (comma-separated)', () => {
      expect(evaluateCondition('TR', 'in', 'TR,US,UK')).toBe(true);
      expect(evaluateCondition('DE', 'in', 'TR,US,UK')).toBe(false);
    });

    it('should evaluate gt (greater than)', () => {
      expect(evaluateCondition(30, 'gt', 25)).toBe(true);
      expect(evaluateCondition(20, 'gt', 25)).toBe(false);
    });

    it('should evaluate lt (less than)', () => {
      expect(evaluateCondition(20, 'lt', 25)).toBe(true);
      expect(evaluateCondition(30, 'lt', 25)).toBe(false);
    });

    it('should evaluate gte (greater than or equal)', () => {
      expect(evaluateCondition(25, 'gte', 25)).toBe(true);
      expect(evaluateCondition(30, 'gte', 25)).toBe(true);
      expect(evaluateCondition(20, 'gte', 25)).toBe(false);
    });

    it('should evaluate lte (less than or equal)', () => {
      expect(evaluateCondition(25, 'lte', 25)).toBe(true);
      expect(evaluateCondition(20, 'lte', 25)).toBe(true);
      expect(evaluateCondition(30, 'lte', 25)).toBe(false);
    });
  });

  describe('hashString', () => {
    it('should generate consistent hash', () => {
      const hash1 = hashString('test-user-123');
      const hash2 = hashString('test-user-123');
      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different strings', () => {
      const hash1 = hashString('user-1');
      const hash2 = hashString('user-2');
      expect(hash1).not.toBe(hash2);
    });

    it('should generate number between 0 and 100', () => {
      const hash = hashString('test');
      expect(hash).toBeGreaterThanOrEqual(0);
      expect(hash).toBeLessThanOrEqual(100);
    });
  });

  describe('isInRollout', () => {
    it('should return true for 100% rollout', () => {
      expect(isInRollout('any-user', 'any-flag', 100)).toBe(true);
    });

    it('should return false for 0% rollout', () => {
      expect(isInRollout('any-user', 'any-flag', 0)).toBe(false);
    });

    it('should be deterministic for same user/flag combo', () => {
      const result1 = isInRollout('user-123', 'flag-abc', 50);
      const result2 = isInRollout('user-123', 'flag-abc', 50);
      expect(result1).toBe(result2);
    });

    it('should distribute users across percentage', () => {
      // Test with many users - roughly 50% should be included
      let includedCount = 0;
      const totalUsers = 100;
      
      for (let i = 0; i < totalUsers; i++) {
        if (isInRollout(`user-${i}`, 'test-flag', 50)) {
          includedCount++;
        }
      }
      
      // Allow 20% margin of error (40-60%)
      expect(includedCount).toBeGreaterThan(30);
      expect(includedCount).toBeLessThan(70);
    });
  });

  describe('evaluateTargeting', () => {
    const mockTargeting = {
      enabled: true,
      rules: [
        {
          id: 'rule-1',
          description: 'Premium users',
          conditions: [
            { attribute: 'plan', operator: 'eq' as const, value: 'premium' }
          ],
          rolloutPercentage: 100,
          value: true,
          enabled: true
        }
      ],
      defaultRule: {
        rolloutPercentage: 0,
        value: false
      }
    };

    it('should return enabled=true when targeting matches', () => {
      const user = {
        id: 'user-123',
        attributes: { plan: 'premium' }
      };

      const result = evaluateTargeting('test-flag', mockTargeting, user, false);
      expect(result.enabled).toBe(true);
      expect(result.value).toBe(true);
    });

    it('should return default when no rules match', () => {
      const user = {
        id: 'user-123',
        attributes: { plan: 'free' }
      };

      const result = evaluateTargeting('test-flag', mockTargeting, user, false);
      expect(result.enabled).toBe(false);
      expect(result.value).toBe(false);
    });

    it('should skip disabled rules', () => {
      const targetingWithDisabledRule = {
        ...mockTargeting,
        rules: [
          {
            ...mockTargeting.rules[0],
            enabled: false
          }
        ]
      };

      const user = {
        id: 'user-123',
        attributes: { plan: 'premium' }
      };

      const result = evaluateTargeting('test-flag', targetingWithDisabledRule, user, false);
      expect(result.enabled).toBe(false); // Should use default
    });

    it('should require all conditions to match (AND logic)', () => {
      const multiConditionTargeting = {
        enabled: true,
        rules: [
          {
            id: 'rule-1',
            description: 'Premium Turkish users',
            conditions: [
              { attribute: 'plan', operator: 'eq' as const, value: 'premium' },
              { attribute: 'country', operator: 'eq' as const, value: 'TR' }
            ],
            rolloutPercentage: 100,
            value: true,
            enabled: true
          }
        ],
        defaultRule: { rolloutPercentage: 0, value: false }
      };

      // Both match
      expect(
        evaluateTargeting('test-flag', multiConditionTargeting, {
          id: 'user-1',
          attributes: { plan: 'premium', country: 'TR' }
        }, false).enabled
      ).toBe(true);

      // Only one matches
      expect(
        evaluateTargeting('test-flag', multiConditionTargeting, {
          id: 'user-2',
          attributes: { plan: 'premium', country: 'US' }
        }, false).enabled
      ).toBe(false);
    });

    it('should respect rollout percentage', () => {
      const percentageTargeting = {
        enabled: true,
        rules: [
          {
            id: 'rule-1',
            description: '50% rollout',
            conditions: [],
            rolloutPercentage: 50,
            value: true,
            enabled: true
          }
        ],
        defaultRule: { rolloutPercentage: 0, value: false }
      };

      // Test distribution
      let enabledCount = 0;
      for (let i = 0; i < 100; i++) {
        const result = evaluateTargeting('test-flag', percentageTargeting, {
          id: `user-${i}`
        }, false);
        if (result.enabled) enabledCount++;
      }

      // Should be roughly 50% (allow 20% margin)
      expect(enabledCount).toBeGreaterThan(30);
      expect(enabledCount).toBeLessThan(70);
    });
  });
});
