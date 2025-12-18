import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc, 
  setDoc,
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

// Audit log function
export async function createAuditLog(data: {
  organizationId: string;
  projectId?: string;
  environmentId?: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  return await addDoc(collection(db, COLLECTIONS.AUDIT_LOGS), {
    ...data,
    createdAt: serverTimestamp(),
  });
}
