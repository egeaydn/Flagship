import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firestore';

// Request schema validation
const requestSchema = z.object({
  user: z.object({
    id: z.string().optional(),
    attributes: z.record(z.string(), z.any()).optional(),
  }).optional(),
});

// API key authentication
async function authenticateApiKey(apiKey: string | null) {
  if (!apiKey) {
    return { valid: false, environmentId: null };
  }

  const bcrypt = (await import('bcryptjs')).default;
  
  // Extract prefix (first 12 chars)
  const prefix = apiKey.substring(0, 12);
  
  // Find key by prefix
  const keysQuery = query(
    collection(db, COLLECTIONS.API_KEYS),
    where('keyPrefix', '==', prefix),
    where('revoked', '==', false)
  );
  
  const keysSnapshot = await getDocs(keysQuery);
  
  for (const keyDoc of keysSnapshot.docs) {
    const keyData = keyDoc.data();
    
    // Verify hash
    const isValid = await bcrypt.compare(apiKey, keyData.keyHash);
    
    if (isValid) {
      // TODO: Update last used timestamp (requires Admin SDK)
      // await updateDoc(doc(db, COLLECTIONS.API_KEYS, keyDoc.id), {
      //   lastUsedAt: new Date(),
      // });
      
      return {
        valid: true,
        environmentId: keyData.environmentId,
        keyType: keyData.keyType,
      };
    }
  }
  
  return { valid: false, environmentId: null };
}

// Get project from environment
async function getProjectFromEnvironment(environmentId: string) {
  const envsQuery = query(
    collection(db, COLLECTIONS.ENVIRONMENTS)
  );
  const envSnapshot = await getDocs(envsQuery);
  
  const envDoc = envSnapshot.docs.find(doc => doc.id === environmentId);
  
  if (!envDoc) return null;
  
  return envDoc.data().projectId;
}

// Fetch flags for project
async function getProjectFlags(projectId: string, environmentId: string) {
  // Get all flags for project
  const flagsQuery = query(
    collection(db, COLLECTIONS.FEATURE_FLAGS),
    where('projectId', '==', projectId)
  );
  const flagsSnapshot = await getDocs(flagsQuery);
  
  // Get flag values for environment
  const valuesQuery = query(
    collection(db, COLLECTIONS.FLAG_VALUES),
    where('environmentId', '==', environmentId)
  );
  const valuesSnapshot = await getDocs(valuesQuery);
  
  const flagValues = new Map();
  valuesSnapshot.docs.forEach(doc => {
    const data = doc.data();
    flagValues.set(data.flagId, data);
  });
  
  // Combine flags with values
  const flags: Record<string, any> = {};
  
  flagsSnapshot.docs.forEach(doc => {
    const flagData = doc.data();
    const flagValue = flagValues.get(doc.id);
    
    if (flagValue) {
      flags[flagData.key] = {
        enabled: flagValue.enabled || false,
        value: flagValue.value,
        type: flagData.flagType,
      };
    } else {
      // Default values if no flag_value exists
      flags[flagData.key] = {
        enabled: false,
        value: flagData.defaultValue,
        type: flagData.flagType,
      };
    }
  });
  
  return flags;
}

export async function POST(request: NextRequest) {
  try {
    // Extract API key from header
    const apiKey = request.headers.get('x-api-key') || 
                   request.headers.get('authorization')?.replace('Bearer ', '');
    
    // Authenticate
    const auth = await authenticateApiKey(apiKey);
    
    if (!auth.valid) {
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      );
    }
    
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    
    // Validate request
    const validation = requestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: validation.error },
        { status: 400 }
      );
    }
    
    // Get project from environment
    const projectId = await getProjectFromEnvironment(auth.environmentId!);
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Environment not found' },
        { status: 404 }
      );
    }
    
    // Fetch flags
    const flags = await getProjectFlags(projectId, auth.environmentId!);
    
    // Return response
    return NextResponse.json(
      {
        flags,
        user: validation.data.user,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=60, s-maxage=60',
          'Content-Type': 'application/json',
        },
      }
    );
    
  } catch (error: any) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

// GET method for health check
export async function GET() {
  return NextResponse.json({
    service: 'Flagship Feature Flags API',
    version: '1.0.0',
    status: 'operational',
  });
}
