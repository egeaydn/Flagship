// Targeting Rule Types
export interface TargetingCondition {
  attribute: string; // User attribute to check (e.g., "email", "plan", "country")
  operator: 'eq' | 'ne' | 'contains' | 'in' | 'gt' | 'lt' | 'gte' | 'lte';
  value: any;
}

export interface TargetingRule {
  id: string;
  description: string;
  conditions: TargetingCondition[]; // AND logic - all conditions must match
  rolloutPercentage: number; // 0-100
  value: any; // Value to return if rule matches
  enabled: boolean;
}

export interface Targeting {
  enabled: boolean;
  rules: TargetingRule[]; // Evaluated in order
  defaultRule: {
    rolloutPercentage: number;
    value: any;
  };
}

export interface UserContext {
  id?: string;
  attributes?: Record<string, any>;
}

// Hash function for consistent percentage rollout
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) % 100; // Return 0-100
}

// Check if user falls within rollout percentage
export function isInRollout(userId: string, flagKey: string, percentage: number): boolean {
  if (percentage === 0) return false;
  if (percentage === 100) return true;

  const combinedStr = `${flagKey}:${userId}`;
  const bucket = hashString(combinedStr); // Already 0-100
  
  return bucket < percentage;
}

// Evaluate a single condition
export function evaluateCondition(
  userValue: any,
  operator: TargetingCondition['operator'],
  conditionValue: any
): boolean {
  if (userValue === undefined) {
    return false;
  }

  switch (operator) {
    case 'eq':
      return userValue === conditionValue;
    
    case 'ne':
      return userValue !== conditionValue;
    
    case 'contains':
      return String(userValue).includes(String(conditionValue));
    
    case 'in':
      // Handle both array and comma-separated string
      const values = Array.isArray(conditionValue) 
        ? conditionValue 
        : String(conditionValue).split(',').map(v => v.trim());
      return values.includes(userValue);
    
    case 'gt':
      return Number(userValue) > Number(conditionValue);
    
    case 'lt':
      return Number(userValue) < Number(conditionValue);
    
    case 'gte':
      return Number(userValue) >= Number(conditionValue);
    
    case 'lte':
      return Number(userValue) <= Number(conditionValue);
    
    default:
      return false;
  }
}

// Internal function for evaluating condition with user context
function evaluateConditionWithUser(condition: TargetingCondition, user: UserContext): boolean {
  const userValue = user.attributes?.[condition.attribute];
  return evaluateCondition(userValue, condition.operator, condition.value);
}

// Evaluate a targeting rule (all conditions must match - AND logic)
function evaluateRule(rule: TargetingRule, user: UserContext, flagKey: string): { matches: boolean; value: any } {
  if (!rule.enabled) {
    return { matches: false, value: undefined };
  }

  // Check all conditions
  const allConditionsMatch = rule.conditions.every(condition => 
    evaluateConditionWithUser(condition, user)
  );

  if (!allConditionsMatch) {
    return { matches: false, value: undefined };
  }

  // Conditions matched, now check rollout percentage
  if (!user.id) {
    // No user ID, use random rollout
    const randomBucket = Math.floor(Math.random() * 100);
    return {
      matches: randomBucket < rule.rolloutPercentage,
      value: rule.value
    };
  }

  const inRollout = isInRollout(user.id, flagKey, rule.rolloutPercentage);
  return {
    matches: inRollout,
    value: rule.value
  };
}

// Main evaluation function
export function evaluateTargeting(
  flagKey: string,
  targeting: Targeting | undefined,
  user: UserContext,
  defaultValue: any
): { enabled: boolean; value: any } {
  // If targeting is not configured or disabled, return default
  if (!targeting || !targeting.enabled) {
    return { enabled: true, value: defaultValue };
  }

  // Evaluate rules in order
  for (const rule of targeting.rules) {
    const result = evaluateRule(rule, user, flagKey);
    if (result.matches) {
      return { enabled: true, value: result.value };
    }
  }

  // No rules matched, use default rule
  const userId = user.id || `anon-${Math.random()}`;
  const inDefaultRollout = isInRollout(userId, flagKey, targeting.defaultRule.rolloutPercentage);
  
  return {
    enabled: inDefaultRollout,
    value: targeting.defaultRule.value
  };
}

// Helper: Create a simple percentage rollout targeting
export function createPercentageRollout(percentage: number, value: any): Targeting {
  return {
    enabled: true,
    rules: [],
    defaultRule: {
      rolloutPercentage: percentage,
      value: value
    }
  };
}

// Helper: Create attribute-based targeting
export function createAttributeTargeting(
  attribute: string,
  operator: TargetingCondition['operator'],
  value: any,
  targetValue: any
): Targeting {
  return {
    enabled: true,
    rules: [
      {
        id: `${attribute}-rule`,
        description: `Users where ${attribute} ${operator} ${value}`,
        conditions: [
          {
            attribute,
            operator,
            value
          }
        ],
        rolloutPercentage: 100,
        value: targetValue,
        enabled: true
      }
    ],
    defaultRule: {
      rolloutPercentage: 0,
      value: false
    }
  };
}
