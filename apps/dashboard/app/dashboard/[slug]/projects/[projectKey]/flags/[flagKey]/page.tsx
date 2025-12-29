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
        const data = { id: value.id, ...value.data() } as any;
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!flag) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push(`/dashboard/${params.slug}/projects/${params.projectKey}`)}
                className="flex items-center space-x-2 text-gray-600 hover:text-[#0066FF] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium">Back to Project</span>
              </button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-3 py-1.5 bg-gradient-to-r from-[#0066FF]/10 to-[#00B8D4]/10 rounded-lg">
                <span className="text-xs font-medium text-gray-700">Flag Details</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="mb-8 bg-gradient-to-r from-[#0066FF] to-[#00B8D4] rounded-2xl shadow-xl text-white p-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🚩</span>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold">{flag.name}</h1>
                  <p className="text-white/80 text-sm mt-1">Feature Flag Configuration</p>
                </div>
              </div>
              <p className="text-white/90 mt-4 text-lg">{flag.description || 'No description provided'}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm font-medium flex items-center space-x-2">
                  <span>🔑</span>
                  <span>{flag.key}</span>
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg text-sm font-medium flex items-center space-x-2">
                  <span>📝</span>
                  <span className="capitalize">{flag.flagType}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Environment Selector */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Environment
            </label>
            <select
              value={selectedEnv}
              onChange={(e) => setSelectedEnv(e.target.value)}
              className="w-full sm:w-auto px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all text-gray-900 font-medium"
            >
              {environments.map(env => (
                <option key={env.id} value={env.id}>
                  {env.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-md p-2 border border-gray-100">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-all duration-300 transform ${
                  activeTab === 'settings'
                    ? 'bg-gradient-to-r from-[#0066FF] to-[#00B8D4] text-white shadow-lg scale-105'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                ⚙️ Settings
              </button>
              <button
                onClick={() => setActiveTab('targeting')}
                className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-all duration-300 transform ${
                  activeTab === 'targeting'
                    ? 'bg-gradient-to-r from-[#0066FF] to-[#00B8D4] text-white shadow-lg scale-105'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                🎯 Targeting Rules
              </button>
            </div>
          </div>
        </div>

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Flag Status Card */}
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <span>⚡</span>
                    <span>Flag Status</span>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Enable or disable this feature flag</p>
                </div>
                <button
                  onClick={handleToggle}
                  className={`relative inline-flex h-10 w-20 items-center rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg ${
                    flagValue?.enabled 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-green-500/40' 
                      : 'bg-gray-300 shadow-gray-300/40'
                  }`}
                >
                  <span
                    className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                      flagValue?.enabled ? 'translate-x-11' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className={`p-4 rounded-lg ${
                flagValue?.enabled 
                  ? 'bg-gradient-to-r from-green-50 to-green-100 border border-green-200' 
                  : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    flagValue?.enabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                  <span className={`font-semibold ${
                    flagValue?.enabled ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {flagValue?.enabled ? 'Flag is Active' : 'Flag is Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Flag Value Card */}
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <span>📊</span>
                  <span>Current Value</span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">The value returned when this flag is evaluated</p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 p-6 rounded-xl">
                <pre className="text-sm text-gray-800 font-mono overflow-x-auto">
                  {JSON.stringify(flagValue?.value, null, 2)}
                </pre>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 font-medium mb-1">Type</p>
                  <p className="text-lg font-bold text-blue-900 capitalize">{flag.flagType}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-600 font-medium mb-1">Environment</p>
                  <p className="text-lg font-bold text-purple-900">
                    {environments.find(e => e.id === selectedEnv)?.name || 'Unknown'}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                  <p className="text-xs text-orange-600 font-medium mb-1">Status</p>
                  <p className="text-lg font-bold text-orange-900">
                    {flagValue?.enabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Targeting Tab */}
        {activeTab === 'targeting' && (
          <div className="space-y-6">
            {/* Enable Targeting Card */}
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <span>🎯</span>
                    <span>Enable Targeting</span>
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Use rules to target specific users and segments</p>
                </div>
                <button
                  onClick={() => setTargeting({ ...targeting, enabled: !targeting.enabled })}
                  className={`relative inline-flex h-10 w-20 items-center rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg ${
                    targeting.enabled 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-green-500/40' 
                      : 'bg-gray-300 shadow-gray-300/40'
                  }`}
                >
                  <span
                    className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                      targeting.enabled ? 'translate-x-11' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {targeting.enabled && (
              <>
                {/* Rules Section */}
                <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                        <span>📋</span>
                        <span>Targeting Rules</span>
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">Define conditions for user targeting</p>
                    </div>
                    <button
                      onClick={addRule}
                      className="px-6 py-3 bg-gradient-to-r from-[#0066FF] to-[#00B8D4] text-white rounded-lg hover:shadow-lg hover:shadow-[#0066FF]/40 font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      + Add Rule
                    </button>
                  </div>

                  {targeting.rules.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-4xl">🎯</span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">No targeting rules yet</h4>
                      <p className="text-gray-600 mb-6">Add a rule to start targeting specific users or segments</p>
                      <button
                        onClick={addRule}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0066FF] to-[#00B8D4] text-white rounded-lg hover:shadow-lg hover:shadow-[#0066FF]/40 font-semibold transition-all duration-300 transform hover:scale-105"
                      >
                        + Create Your First Rule
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {targeting.rules.map((rule, ruleIndex) => (
                        <div key={rule.id} className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6 space-y-5 hover:border-[#0066FF]/30 transition-all">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-5">
                              {/* Rule Description */}
                              <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2">
                                  Rule Description
                                </label>
                                <input
                                  type="text"
                                  value={rule.description}
                                  onChange={(e) => updateRule(rule.id, { description: e.target.value })}
                                  placeholder="e.g., Premium users rule"
                                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all font-medium"
                                />
                              </div>

                              {/* Conditions */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <label className="text-sm font-bold text-gray-900 flex items-center space-x-2">
                                    <span>🔧</span>
                                    <span>Conditions (ALL must match)</span>
                                  </label>
                                  <button
                                    onClick={() => addCondition(rule.id)}
                                    className="text-sm text-[#0066FF] hover:text-[#00B8D4] font-semibold transition-colors"
                                  >
                                    + Add Condition
                                  </button>
                                </div>

                                {rule.conditions.map((condition, condIndex) => (
                                  <div key={condIndex} className="flex gap-2 items-center bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-[#0066FF]/30 transition-all">
                                    <input
                                      type="text"
                                      value={condition.attribute}
                                      onChange={(e) => updateCondition(rule.id, condIndex, { attribute: e.target.value })}
                                      placeholder="attribute (e.g., plan)"
                                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF] font-medium"
                                    />
                                    <select
                                      value={condition.operator}
                                      onChange={(e) => updateCondition(rule.id, condIndex, { operator: e.target.value as any })}
                                      className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF] font-medium"
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
                                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF] font-medium"
                                    />
                                    <button
                                      onClick={() => removeCondition(rule.id, condIndex)}
                                      className="w-8 h-8 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                              </div>

                              {/* Rollout Percentage */}
                              <div className="bg-white p-5 rounded-lg border-2 border-gray-200">
                                <label className="flex text-sm font-bold text-gray-900 mb-3 items-center justify-between">
                                  <span className="flex items-center space-x-2">
                                    <span>📊</span>
                                    <span>Rollout Percentage</span>
                                  </span>
                                  <span className="text-2xl font-bold text-[#0066FF]">{rule.rolloutPercentage}%</span>
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={rule.rolloutPercentage}
                                  onChange={(e) => updateRule(rule.id, { rolloutPercentage: parseInt(e.target.value) })}
                                  className="w-full h-3 bg-gradient-to-r from-gray-200 via-[#0066FF]/30 to-[#00B8D4]/30 rounded-lg appearance-none cursor-pointer"
                                  style={{
                                    background: `linear-gradient(to right, #0066FF 0%, #00B8D4 ${rule.rolloutPercentage}%, #e5e7eb ${rule.rolloutPercentage}%, #e5e7eb 100%)`
                                  }}
                                />
                              </div>

                              {/* Rule Value */}
                              <div>
                                <label className="flex text-sm font-bold text-gray-900 mb-2 items-center space-x-2">
                                  <span>💎</span>
                                  <span>Return Value</span>
                                </label>
                                <input
                                  type="text"
                                  value={JSON.stringify(rule.value)}
                                  onChange={(e) => {
                                    try {
                                      updateRule(rule.id, { value: JSON.parse(e.target.value) });
                                    } catch {}
                                  }}
                                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-sm font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all"
                                />
                              </div>
                            </div>

                            <button
                              onClick={() => removeRule(rule.id)}
                              className="ml-4 w-10 h-10 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Default Rule Section */}
                <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                      <span>⚙️</span>
                      <span>Default Rule</span>
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Applied when no targeting rules match
                    </p>
                  </div>

                  <div className="space-y-5">
                    {/* Default Rollout */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border-2 border-gray-200">
                      <label className="flex text-sm font-bold text-gray-900 mb-3 items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <span>📊</span>
                          <span>Default Rollout</span>
                        </span>
                        <span className="text-2xl font-bold text-[#0066FF]">{targeting.defaultRule.rolloutPercentage}%</span>
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
                        className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #0066FF 0%, #00B8D4 ${targeting.defaultRule.rolloutPercentage}%, #e5e7eb ${targeting.defaultRule.rolloutPercentage}%, #e5e7eb 100%)`
                        }}
                      />
                    </div>

                    {/* Default Value */}
                    <div>
                      <label className="flex text-sm font-bold text-gray-900 mb-2 items-center space-x-2">
                        <span>💎</span>
                        <span>Default Value</span>
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
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={saveTargeting}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-xl hover:shadow-green-500/40 font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Save Targeting Rules</span>
                </button>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
