import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { COLLECTIONS, recordFlagEvaluation } from '@/lib/firestore';
import { evaluateTargeting, UserContext } from '@/lib/targeting';

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

// Fetch flags for project with targeting evaluation
async function getProjectFlags(projectId: string, environmentId: string, user?: UserContext) {
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
  
  // Combine flags with values and evaluate targeting
  const flags: Record<string, any> = {};
  
  flagsSnapshot.docs.forEach(doc => {
    const flagData = doc.data();
    const flagValue = flagValues.get(doc.id);
    
    if (flagValue) {
      // Evaluate targeting rules if present
      const targeting = flagValue.targeting;
      let targetingApplied = false;
      
      if (targeting && targeting.enabled && user) {
        const result = evaluateTargeting(
          flagData.key,
          targeting,
          user,
          flagValue.value
        );
        
        targetingApplied = true;
        
        flags[flagData.key] = {
          enabled: result.enabled,
          value: result.value,
          type: flagData.flagType,
          _analytics: {
            flagId: doc.id,
            targetingApplied,
          },
        };
        
        // Record analytics (async, don't await to avoid slowing down response)
        recordFlagEvaluation({
          flagKey: flagData.key,
          flagId: doc.id,
          projectId,
          environmentId,
          userId: user.id,
          result: result.enabled,
          targetingApplied,
        }).then(() => {
          console.log('✅ Analytics recorded:', { flagKey: flagData.key, projectId, environmentId, userId: user.id });
        }).catch(err => console.error('❌ Analytics error:', err));
        
      } else {
        // No targeting or targeting disabled
        flags[flagData.key] = {
          enabled: flagValue.enabled || false,
          value: flagValue.value,
          type: flagData.flagType,
          _analytics: {
            flagId: doc.id,
            targetingApplied,
          },
        };
        
        // Record analytics
        recordFlagEvaluation({
          flagKey: flagData.key,
          flagId: doc.id,
          projectId,
          environmentId,
          userId: user?.id,
          result: flagValue.enabled || false,
          targetingApplied,
        }).catch(err => console.error('Analytics error:', err));
      }
    } else {
      // Default values if no flag_value exists
      flags[flagData.key] = {
        enabled: false,
        value: flagData.defaultValue,
        type: flagData.flagType,
        _analytics: {
          flagId: doc.id,
          targetingApplied: false,
        },
      };
      
      // Record analytics for default values too
      recordFlagEvaluation({
        flagKey: flagData.key,
        flagId: doc.id,
        projectId,
        environmentId,
        userId: user?.id,
        result: false,
        targetingApplied: false,
      }).catch(err => console.error('Analytics error:', err));
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
    const auth = await authenticateApiKey(apiKey ?? null);
    
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
    
    // Fetch flags with targeting evaluation
    const flags = await getProjectFlags(
      projectId, 
      auth.environmentId!,
      validation.data.user
    );
    
    // Return response
    return NextResponse.json(
      {
        flags,
        user: validation.data.user,
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
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

// OPTIONS method for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
    },
  });
}

// GET method for flag evaluation with query parameters
export async function GET(request: NextRequest) {
  try {
    // Extract API key from header
    const apiKey = request.headers.get('x-api-key') || 
                   request.headers.get('authorization')?.replace('Bearer ', '');
    
    // Authenticate
    const auth = await authenticateApiKey(apiKey ?? null);
    
    if (!auth.valid) {
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
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
    
    // Extract user context from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || searchParams.get('user_id');
    
    let userContext: UserContext | undefined;
    
    if (userId) {
      const attributes: Record<string, any> = {};
      
      // Extract all query parameters as user attributes
      searchParams.forEach((value, key) => {
        if (key !== 'userId' && key !== 'user_id') {
          attributes[key] = value;
        }
      });
      
      userContext = {
        id: userId,
        attributes,
      };
    }
    
    // Fetch flags with targeting evaluation
    const flags = await getProjectFlags(
      projectId, 
      auth.environmentId!,
      userContext
    );
    
    // Convert flags object to array format for easier consumption
    const flagsArray = Object.entries(flags).map(([key, value]) => ({
      key,
      ...value,
    }));
    
    // Return response
    return NextResponse.json(
      {
        flags: flagsArray,
        user: userContext,
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, x-api-key, Authorization',
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
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
