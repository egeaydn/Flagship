-- Targeting Rules Migration
-- Adds targeting rules support to flag_values

-- Note: This is a Firebase/Firestore reference schema
-- In Firestore, we'll add these fields to flag_values documents:

/*
flag_values document structure (updated):
{
  flagId: string,
  environmentId: string,
  enabled: boolean,
  value: any,
  
  // NEW: Targeting rules
  targeting: {
    enabled: boolean,  // Is targeting enabled?
    rules: [
      {
        id: string,
        description: string,
        conditions: [
          {
            attribute: string,  // e.g., "email", "plan", "country"
            operator: "eq" | "ne" | "contains" | "in" | "gt" | "lt",
            value: any
          }
        ],
        rolloutPercentage: number,  // 0-100
        value: any,  // Override value if rule matches
        enabled: boolean
      }
    ],
    defaultRule: {
      rolloutPercentage: number,  // Default rollout %
      value: any
    }
  },
  
  createdAt: timestamp,
  updatedAt: timestamp
}
*/

-- TypeScript interfaces for reference:

/*
interface TargetingCondition {
  attribute: string;
  operator: 'eq' | 'ne' | 'contains' | 'in' | 'gt' | 'lt' | 'gte' | 'lte';
  value: any;
}

interface TargetingRule {
  id: string;
  description: string;
  conditions: TargetingCondition[];
  rolloutPercentage: number; // 0-100
  value: any;
  enabled: boolean;
}

interface Targeting {
  enabled: boolean;
  rules: TargetingRule[];
  defaultRule: {
    rolloutPercentage: number;
    value: any;
  };
}

interface FlagValue {
  flagId: string;
  environmentId: string;
  enabled: boolean;
  value: any;
  targeting?: Targeting;
  createdAt: Date;
  updatedAt: Date;
}
*/

-- Example usage:

/*
// Flag with 50% rollout to all users
{
  targeting: {
    enabled: true,
    rules: [],
    defaultRule: {
      rolloutPercentage: 50,
      value: true
    }
  }
}

// Flag enabled only for premium users
{
  targeting: {
    enabled: true,
    rules: [
      {
        id: "premium-users",
        description: "Premium plan users",
        conditions: [
          {
            attribute: "plan",
            operator: "eq",
            value: "premium"
          }
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
  }
}

// Flag with staged rollout
{
  targeting: {
    enabled: true,
    rules: [
      {
        id: "beta-users",
        description: "Beta testers",
        conditions: [
          {
            attribute: "beta_tester",
            operator: "eq",
            value: true
          }
        ],
        rolloutPercentage: 100,
        value: true,
        enabled: true
      },
      {
        id: "tr-users",
        description: "Turkey users - 25% rollout",
        conditions: [
          {
            attribute: "country",
            operator: "eq",
            value: "TR"
          }
        ],
        rolloutPercentage: 25,
        value: true,
        enabled: true
      }
    ],
    defaultRule: {
      rolloutPercentage: 0,
      value: false
    }
  }
}
*/
