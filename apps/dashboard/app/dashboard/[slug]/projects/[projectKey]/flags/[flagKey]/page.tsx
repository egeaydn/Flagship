'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS, createAuditLog } from '@/lib/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface TargetingCondition {
  attribute: string;
  operator: 'eq' | 'ne' | 'contains' | 'in' | 'gt' | 'lt' | 'gte' | 'lte';
  value: any;
}

interface TargetingRule {
  id: string;
  description: string;
  conditions: TargetingCondition[];
  rolloutPercentage: number;
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

export default function FlagDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [flag, setFlag] = useState<any>(null);
  const [environments, setEnvironments] = useState<any[]>([]);
  const [selectedEnv, setSelectedEnv] = useState<string>('');
  const [flagValue, setFlagValue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'settings' | 'targeting'>('settings');
  const [targeting, setTargeting] = useState<Targeting>({
    enabled: false,
    rules: [],
    defaultRule: {
      rolloutPercentage: 100,
      value: true
    }
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    loadData();
  }, [params.flagKey]);

  useEffect(() => {
    if (selectedEnv && flag) {
      loadFlagValue();
    }
  }, [selectedEnv, flag]);

  async function loadData() {
    try {
      // Get flag
      const flagsQuery = query(
        collection(db, COLLECTIONS.FEATURE_FLAGS),
        where('key', '==', params.flagKey as string)
      );
      const flagSnapshot = await getDocs(flagsQuery);
      
      if (flagSnapshot.empty) {
        router.push(`/dashboard/${params.slug}/projects/${params.projectKey}`);
        return;
      }

      const flagDoc = flagSnapshot.docs[0];
      setFlag({ id: flagDoc.id, ...flagDoc.data() });

      // Get environments
      const envsQuery = query(
        collection(db, COLLECTIONS.ENVIRONMENTS)
      );
      const envsSnapshot = await getDocs(envsQuery);
      const envs = envsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEnvironments(envs);
      
      if (envs.length > 0) {
        setSelectedEnv(envs[0].id);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading flag:', error);
      setLoading(false);
    }
  }

  async function loadFlagValue() {
    try {
      const valuesQuery = query(
        collection(db, COLLECTIONS.FLAG_VALUES),
        where('flagId', '==', flag.id),
        where('environmentId', '==', selectedEnv)
      );
      const valuesSnapshot = await getDocs(valuesQuery);
      
      if (!valuesSnapshot.empty) {
        const value = valuesSnapshot.docs[0];
        const data = { id: value.id, ...value.data() };
        setFlagValue(data);
        
        // Load targeting if exists
        if (data.targeting) {
          setTargeting(data.targeting);
        }
      }
    } catch (error) {
      console.error('Error loading flag value:', error);
    }
  }

  async function handleToggle() {
    if (!flagValue) return;
    
    try {
      const newEnabled = !flagValue.enabled;
      await updateDoc(doc(db, COLLECTIONS.FLAG_VALUES, flagValue.id), {
        enabled: newEnabled,
        updatedAt: new Date(),
      });
      
      setFlagValue({ ...flagValue, enabled: newEnabled });
    } catch (error) {
      console.error('Error toggling flag:', error);
      alert('Failed to toggle flag');
    }
  }

  async function saveTargeting() {
    if (!flagValue || !user || !flag) return;
    
    try {
      const oldTargeting = flagValue.targeting;
      
      await updateDoc(doc(db, COLLECTIONS.FLAG_VALUES, flagValue.id), {
        targeting: targeting,
        updatedAt: new Date(),
      });
      
      // Create audit log
      await createAuditLog({
        organizationId: flag.organizationId || '',
        projectId: flag.projectId,
        environmentId: selectedEnv,
        userId: user.uid,
        userEmail: user.email || 'unknown',
        action: 'TARGETING_RULES_UPDATED',
        resourceType: 'flag',
        resourceId: flag.id,
        resourceName: flag.name,
        changes: {
          before: oldTargeting,
          after: targeting
        }
      });
      
      toast.success('✅ Targeting rules saved successfully!');
    } catch (error) {
      console.error('Error saving targeting:', error);
      toast.error('❌ Failed to save targeting rules');
    }
  }

  function addRule() {
    const newRule: TargetingRule = {
      id: `rule-${Date.now()}`,
      description: 'New rule',
      conditions: [],
      rolloutPercentage: 100,
      value: true,
      enabled: true
    };
    
    setTargeting({
      ...targeting,
      rules: [...targeting.rules, newRule]
    });
  }

  function removeRule(ruleId: string) {
    setTargeting({
      ...targeting,
      rules: targeting.rules.filter(r => r.id !== ruleId)
    });
  }

  function updateRule(ruleId: string, updates: Partial<TargetingRule>) {
    setTargeting({
      ...targeting,
      rules: targeting.rules.map(r => 
        r.id === ruleId ? { ...r, ...updates } : r
      )
    });
  }

  function addCondition(ruleId: string) {
    const newCondition: TargetingCondition = {
      attribute: 'plan',
      operator: 'eq',
      value: ''
    };
    
    setTargeting({
      ...targeting,
      rules: targeting.rules.map(r => 
        r.id === ruleId 
          ? { ...r, conditions: [...r.conditions, newCondition] }
          : r
      )
    });
  }

  function updateCondition(ruleId: string, conditionIndex: number, updates: Partial<TargetingCondition>) {
    setTargeting({
      ...targeting,
      rules: targeting.rules.map(r => 
        r.id === ruleId
          ? {
              ...r,
              conditions: r.conditions.map((c, i) => 
                i === conditionIndex ? { ...c, ...updates } : c
              )
            }
          : r
      )
    });
  }

  function removeCondition(ruleId: string, conditionIndex: number) {
    setTargeting({
      ...targeting,
      rules: targeting.rules.map(r => 
        r.id === ruleId
          ? { ...r, conditions: r.conditions.filter((_, i) => i !== conditionIndex) }
          : r
      )
    });
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!flag) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push(`/dashboard/${params.slug}/projects/${params.projectKey}`)}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2 font-medium"
          >
            ← Back to Project
          </button>
          
          <div className="flex items-start justify-between bg-white p-6 rounded-lg shadow">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{flag.name}</h1>
              <p className="text-gray-600 mt-2">{flag.description || 'No description'}</p>
              <div className="flex gap-2 mt-3">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  Key: {flag.key}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {flag.flagType}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Environment Selector */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Environment
          </label>
          <select
            value={selectedEnv}
            onChange={(e) => setSelectedEnv(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {environments.map(env => (
              <option key={env.id} value={env.id}>
                {env.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex gap-1 p-2">
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 px-4 py-2 font-medium rounded-lg transition-colors ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setActiveTab('targeting')}
              className={`flex-1 px-4 py-2 font-medium rounded-lg transition-colors ${
                activeTab === 'targeting'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              🎯 Targeting Rules
            </button>
          </div>
        </div>

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6 pb-6 border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Flag Status</h3>
                <p className="text-sm text-gray-600 mt-1">Enable or disable this flag</p>
              </div>
              <button
                onClick={handleToggle}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  flagValue?.enabled ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                    flagValue?.enabled ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Flag Value</h3>
              <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                <pre className="text-sm text-gray-800 font-mono">
                  {JSON.stringify(flagValue?.value, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Targeting Tab */}
        {activeTab === 'targeting' && (
          <div className="space-y-6">
            {/* Enable Targeting */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Enable Targeting</h3>
                  <p className="text-sm text-gray-600 mt-1">Use rules to target specific users</p>
                </div>
                <button
                  onClick={() => setTargeting({ ...targeting, enabled: !targeting.enabled })}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    targeting.enabled ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
                      targeting.enabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {targeting.enabled && (
              <>
                {/* Rules */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Targeting Rules</h3>
                    <button
                      onClick={addRule}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
                    >
                      + Add Rule
                    </button>
                  </div>

                  {targeting.rules.length === 0 ? (
                    <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      No rules yet. Add a rule to start targeting specific users.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {targeting.rules.map((rule, ruleIndex) => (
                        <div key={rule.id} className="border-2 border-gray-200 rounded-lg p-5 space-y-4 bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-4">
                              <input
                                type="text"
                                value={rule.description}
                                onChange={(e) => updateRule(rule.id, { description: e.target.value })}
                                placeholder="Rule description"
                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />

                              {/* Conditions */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <label className="text-sm font-semibold text-gray-900">
                                    Conditions (ALL must match)
                                  </label>
                                  <button
                                    onClick={() => addCondition(rule.id)}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                  >
                                    + Add Condition
                                  </button>
                                </div>

                                {rule.conditions.map((condition, condIndex) => (
                                  <div key={condIndex} className="flex gap-2 items-center bg-white p-3 rounded-lg border border-gray-300">
                                    <input
                                      type="text"
                                      value={condition.attribute}
                                      onChange={(e) => updateCondition(rule.id, condIndex, { attribute: e.target.value })}
                                      placeholder="attribute (e.g., plan)"
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900"
                                    />
                                    <select
                                      value={condition.operator}
                                      onChange={(e) => updateCondition(rule.id, condIndex, { operator: e.target.value as any })}
                                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900"
                                    >
                                      <option value="eq">equals</option>
                                      <option value="ne">not equals</option>
                                      <option value="contains">contains</option>
                                      <option value="in">in</option>
                                      <option value="gt">greater than</option>
                                      <option value="lt">less than</option>
                                      <option value="gte">≥</option>
                                      <option value="lte">≤</option>
                                    </select>
                                    <input
                                      type="text"
                                      value={condition.value}
                                      onChange={(e) => updateCondition(rule.id, condIndex, { value: e.target.value })}
                                      placeholder="value"
                                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900"
                                    />
                                    <button
                                      onClick={() => removeCondition(rule.id, condIndex)}
                                      className="text-red-600 hover:text-red-700 text-xl font-bold px-2"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>

                              {/* Rollout Percentage */}
                              <div className="bg-white p-4 rounded-lg border border-gray-300">
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                  Rollout: {rule.rolloutPercentage}%
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={rule.rolloutPercentage}
                                  onChange={(e) => updateRule(rule.id, { rolloutPercentage: parseInt(e.target.value) })}
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>

                              {/* Rule Value */}
                              <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                  Return Value
                                </label>
                                <input
                                  type="text"
                                  value={JSON.stringify(rule.value)}
                                  onChange={(e) => {
                                    try {
                                      updateRule(rule.id, { value: JSON.parse(e.target.value) });
                                    } catch {}
                                  }}
                                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-mono bg-white text-gray-900"
                                />
                              </div>
                            </div>

                            <button
                              onClick={() => removeRule(rule.id)}
                              className="ml-4 text-red-600 hover:text-red-700 text-2xl"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Default Rule */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Default Rule</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Applied when no rules match
                  </p>

                  <div className="space-y-5">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Rollout: {targeting.defaultRule.rolloutPercentage}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={targeting.defaultRule.rolloutPercentage}
                        onChange={(e) => setTargeting({
                          ...targeting,
                          defaultRule: {
                            ...targeting.defaultRule,
                            rolloutPercentage: parseInt(e.target.value)
                          }
                        })}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Default Value
                      </label>
                      <input
                        type="text"
                        value={JSON.stringify(targeting.defaultRule.value)}
                        onChange={(e) => {
                          try {
                            setTargeting({
                              ...targeting,
                              defaultRule: {
                                ...targeting.defaultRule,
                                value: JSON.parse(e.target.value)
                              }
                            });
                          } catch {}
                        }}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg font-mono bg-white text-gray-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={saveTargeting}
                  className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold shadow-lg text-lg"
                >
                  💾 Save Targeting Rules
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
