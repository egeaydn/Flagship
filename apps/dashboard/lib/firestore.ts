import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc, 
  setDoc,
  updateDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from './firebase';

// Collection names
export const COLLECTIONS = {
  ORGANIZATIONS: 'organizations',
  ORGANIZATION_MEMBERS: 'organization_members',
  PROJECTS: 'projects',
  ENVIRONMENTS: 'environments',
  FEATURE_FLAGS: 'feature_flags',
  FLAG_VALUES: 'flag_values',
  API_KEYS: 'api_keys',
  AUDIT_LOGS: 'audit_logs',
  FLAG_ANALYTICS: 'flag_analytics',
} as const;

// Organization functions
export async function createOrganization(data: {
  name: string;
  slug: string;
  createdBy: string;
}) {
  const orgRef = await addDoc(collection(db, COLLECTIONS.ORGANIZATIONS), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Auto-create owner membership
  await setDoc(doc(db, COLLECTIONS.ORGANIZATION_MEMBERS, `${data.createdBy}_${orgRef.id}`), {
    organizationId: orgRef.id,
    userId: data.createdBy,
    role: 'owner',
    createdAt: serverTimestamp(),
  });

  return orgRef.id;
}

export async function getUserOrganizations(userId: string) {
  const membersQuery = query(
    collection(db, COLLECTIONS.ORGANIZATION_MEMBERS),
    where('userId', '==', userId)
  );
  
  const membersSnap = await getDocs(membersQuery);
  const orgIds = membersSnap.docs.map(doc => doc.data().organizationId);
  
  if (orgIds.length === 0) return [];
  
  const orgsQuery = query(
    collection(db, COLLECTIONS.ORGANIZATIONS),
    where('__name__', 'in', orgIds)
  );
  
  const orgsSnap = await getDocs(orgsQuery);
  return orgsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Project functions
export async function createProject(data: {
  organizationId: string;
  name: string;
  key: string;
  description?: string;
  createdBy: string;
}) {
  const projectRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Auto-create default environments
  const environments = [
    { name: 'Development', key: 'dev' },
    { name: 'Staging', key: 'staging' },
    { name: 'Production', key: 'prod' },
  ];

  for (const env of environments) {
    await addDoc(collection(db, COLLECTIONS.ENVIRONMENTS), {
      projectId: projectRef.id,
      ...env,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  return projectRef.id;
}

// Feature flag functions
export async function createFeatureFlag(data: {
  projectId: string;
  name: string;
  key: string;
  description?: string;
  flagType: 'boolean' | 'multivariate' | 'number' | 'json';
  defaultValue: any;
  tags?: string[];
  createdBy: string;
}) {
  // Create the flag
  const flagRef = await addDoc(collection(db, COLLECTIONS.FEATURE_FLAGS), {
    ...data,
    tags: data.tags || [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Get all environments for this project
  const envsQuery = query(
    collection(db, COLLECTIONS.ENVIRONMENTS),
    where('projectId', '==', data.projectId)
  );
  const envsSnap = await getDocs(envsQuery);

  // Create flag_values for each environment
  for (const envDoc of envsSnap.docs) {
    await addDoc(collection(db, COLLECTIONS.FLAG_VALUES), {
      flagId: flagRef.id,
      environmentId: envDoc.id,
      enabled: false,
      value: data.defaultValue,
      updatedAt: serverTimestamp(),
    });
  }

  return flagRef;
}

// API Key functions
export async function createApiKey(data: {
  environmentId: string;
  name: string;
  keyType: 'client' | 'server';
  createdBy: string;
}) {
  const bcrypt = (await import('bcryptjs')).default;
  
  // Generate random key: fsk_{type}_{32-char-random}
  const randomPart = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  const rawKey = `fsk_${data.keyType}_${randomPart}`;
  
  // Hash for storage
  const keyHash = await bcrypt.hash(rawKey, 10);
  
  // Prefix for quick lookup (first 12 chars)
  const keyPrefix = rawKey.substring(0, 12);
  
  // Store in Firestore
  await addDoc(collection(db, COLLECTIONS.API_KEYS), {
    environmentId: data.environmentId,
    name: data.name,
    keyPrefix,
    keyHash,
    keyType: data.keyType,
    revoked: false,
    lastUsedAt: null,
    createdAt: serverTimestamp(),
    createdBy: data.createdBy,
  });
  
  // Return raw key (shown ONCE)
  return rawKey;
}

export async function revokeApiKey(keyId: string) {
  const keyRef = doc(db, COLLECTIONS.API_KEYS, keyId);
  await updateDoc(keyRef, {
    revoked: true,
    updatedAt: serverTimestamp(),
  });
}

export async function getEnvironmentApiKeys(environmentId: string) {
  const q = query(
    collection(db, COLLECTIONS.API_KEYS),
    where('environmentId', '==', environmentId),
    where('revoked', '==', false)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Audit Log functions (enhanced)
export async function createAuditLog(data: {
  organizationId?: string;
  projectId?: string;
  environmentId?: string;
  userId: string;
  userEmail?: string;
  action: string;
  targetType?: string;  // kept for backward compatibility
  resourceType: string;
  resourceId: string;
  resourceName?: string;
  changes?: {
    before?: any;
    after?: any;
  };
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}) {
  return await addDoc(collection(db, COLLECTIONS.AUDIT_LOGS), {
    ...data,
    timestamp: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
}

export async function getAuditLogs(organizationId: string, limit: number = 100) {
  const logsQuery = query(
    collection(db, COLLECTIONS.AUDIT_LOGS),
    where('organizationId', '==', organizationId)
  );
  
  const snapshot = await getDocs(logsQuery);
  const logs = snapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data() 
  }));
  
  // Sort by timestamp descending (newest first)
  return logs.sort((a: any, b: any) => {
    const aTime = a.timestamp?.toMillis() || a.createdAt?.toMillis() || 0;
    const bTime = b.timestamp?.toMillis() || b.createdAt?.toMillis() || 0;
    return bTime - aTime;
  }).slice(0, limit);
}

// Analytics functions
export async function recordFlagEvaluation(data: {
  flagKey: string;
  flagId: string;
  projectId: string;
  environmentId: string;
  userId?: string;
  result: boolean | string | number;
  targetingApplied?: boolean;
}) {
  return await addDoc(collection(db, COLLECTIONS.FLAG_ANALYTICS), {
    ...data,
    timestamp: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
}

export async function getFlagAnalytics(projectId: string, environmentId: string, days: number = 7) {
  const analyticsQuery = query(
    collection(db, COLLECTIONS.FLAG_ANALYTICS),
    where('projectId', '==', projectId),
    where('environmentId', '==', environmentId)
  );
  
  const snapshot = await getDocs(analyticsQuery);
  const analytics = snapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data() 
  }));
  
  // Filter by date range (last N days)
  const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
  
  return analytics.filter((a: any) => {
    const time = a.timestamp?.toMillis() || a.createdAt?.toMillis() || 0;
    return time >= cutoffTime;
  });
}

export async function getAggregatedAnalytics(projectId: string, environmentId: string, days: number = 7) {
  const analytics = await getFlagAnalytics(projectId, environmentId, days);
  
  // Aggregate by flag
  const aggregated: Record<string, any> = {};
  
  analytics.forEach((entry: any) => {
    const key = entry.flagKey;
    
    if (!aggregated[key]) {
      aggregated[key] = {
        flagKey: key,
        flagId: entry.flagId,
        evaluations: 0,
        uniqueUsers: new Set(),
        trueCount: 0,
        falseCount: 0,
        targetingAppliedCount: 0,
      };
    }
    
    aggregated[key].evaluations++;
    
    if (entry.userId) {
      aggregated[key].uniqueUsers.add(entry.userId);
    }
    
    if (entry.result === true) aggregated[key].trueCount++;
    if (entry.result === false) aggregated[key].falseCount++;
    if (entry.targetingApplied) aggregated[key].targetingAppliedCount++;
  });
  
  // Convert Set to count
  return Object.values(aggregated).map((item: any) => ({
    ...item,
    uniqueUsers: item.uniqueUsers.size,
  }));
}
