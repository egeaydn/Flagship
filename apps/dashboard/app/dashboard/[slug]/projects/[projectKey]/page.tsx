'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter, useParams } from 'next/navigation';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { COLLECTIONS, createFeatureFlag, createAuditLog } from '@/lib/firestore';
import toast from 'react-hot-toast';
import DashboardNav from '@/components/DashboardNav';

interface Project {
  id: string;
  name: string;
  key: string;
  organizationId: string;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface Environment {
  id: string;
  name: string;
  key: string;
}

interface FeatureFlag {
  id: string;
  name: string;
  key: string;
  description?: string;
  flagType: 'boolean' | 'multivariate' | 'number' | 'json';
  defaultValue: any;
  tags: string[];
}

interface FlagValue {
  id: string;
  flagId: string;
  environmentId: string;
  enabled: boolean;
  value: any;
}

export default function ProjectPage() {
  const params = useParams();
  const slug = params.slug as string;
  const projectKey = params.projectKey as string;
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [selectedEnv, setSelectedEnv] = useState<string>('');
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [flagValues, setFlagValues] = useState<FlagValue[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [togglingFlag, setTogglingFlag] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: '',
    flagType: 'boolean' as const,
    defaultValue: false,
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await loadProject();
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, projectKey]);

  const loadProject = async () => {
    try {
      const q = query(collection(db, COLLECTIONS.PROJECTS), where('key', '==', projectKey));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const projectData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Project;
        setProject(projectData);
        
        // Load organization
        const orgQ = query(collection(db, COLLECTIONS.ORGANIZATIONS), where('slug', '==', slug));
        const orgSnapshot = await getDocs(orgQ);
        if (!orgSnapshot.empty) {
          setOrganization({ id: orgSnapshot.docs[0].id, ...orgSnapshot.docs[0].data() } as Organization);
        }
        
        await loadEnvironments(projectData.id);
        await loadFlags(projectData.id);
      } else {
        router.push(`/dashboard/${slug}`);
      }
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };

  const loadEnvironments = async (projectId: string) => {
    try {
      const q = query(collection(db, COLLECTIONS.ENVIRONMENTS), where('projectId', '==', projectId));
      const snapshot = await getDocs(q);
      const envList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Environment[];
      setEnvironments(envList);
      if (envList.length > 0) {
        setSelectedEnv(envList[0].id);
      }
    } catch (error) {
      console.error('Error loading environments:', error);
    }
  };

  const loadFlags = async (projectId: string) => {
    try {
      const q = query(collection(db, COLLECTIONS.FEATURE_FLAGS), where('projectId', '==', projectId));
      const snapshot = await getDocs(q);
      const flagsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FeatureFlag[];
      setFlags(flagsList);
      
      // Load flag values
      const valuesQ = query(collection(db, COLLECTIONS.FLAG_VALUES));
      const valuesSnapshot = await getDocs(valuesQ);
      const valuesList = valuesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FlagValue[];
      setFlagValues(valuesList);
    } catch (error) {
      console.error('Error loading flags:', error);
    }
  };

  const handleCreateFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !project) return;

    setCreating(true);
    try {
      await createFeatureFlag({
        projectId: project.id,
        name: formData.name,
        key: formData.key,
        description: formData.description,
        flagType: formData.flagType,
        defaultValue: formData.defaultValue,
        createdBy: user.uid,
      });

      toast.success(`✅ Flag "${formData.name}" created successfully!`);
      setFormData({ name: '', key: '', description: '', flagType: 'boolean', defaultValue: false });
      setShowCreateForm(false);
      await loadFlags(project.id);
    } catch (error: any) {
      console.error('Error creating flag:', error);
      toast.error(`❌ Failed to create flag: ${error.message}`);
    } finally {
      setCreating(false);
    }
  };

  const toggleFlag = async (flagId: string, currentValue: boolean) => {
    if (!selectedEnv || !user || !project) return;

    setTogglingFlag(flagId);
    try {
      const flagValue = flagValues.find(fv => fv.flagId === flagId && fv.environmentId === selectedEnv);
      const flag = flags.find(f => f.id === flagId);
      
      const newValue = !currentValue;
      
      if (flagValue && flag) {
        
        // Update flag value
        await updateDoc(doc(db, COLLECTIONS.FLAG_VALUES, flagValue.id), {
          enabled: newValue,
          updatedAt: new Date(),
        });
        
        // Create audit log
        await createAuditLog({
          organizationId: project.organizationId,
          projectId: project.id,
          environmentId: selectedEnv,
          userId: user.uid,
          userEmail: user.email || 'unknown',
          action: newValue ? 'FLAG_ENABLED' : 'FLAG_DISABLED',
          resourceType: 'flag',
          resourceId: flagId,
          resourceName: flag.name,
          changes: {
            before: { enabled: currentValue },
            after: { enabled: newValue }
          }
        });
      }
      
      toast.success(`${newValue ? '✅ Flag enabled' : '⏸️ Flag disabled'}`);
      await loadFlags(project.id);
    } catch (error) {
      console.error('Error toggling flag:', error);
      toast.error('❌ Failed to toggle flag');
    } finally {
      setTogglingFlag(null);
    }
  };

  const getFlagValue = (flagId: string) => {
    return flagValues.find(fv => fv.flagId === flagId && fv.environmentId === selectedEnv);
  };

  const generateKey = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Dashboard Navigation */}
      <DashboardNav 
        user={user}
        organization={organization ? { name: organization.name, slug: organization.slug } : undefined}
        project={project ? { name: project.name, key: project.key } : undefined}
      />

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Environment Selector - Modern Pills */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Environment</label>
            <div className="flex flex-wrap gap-2">
              {environments.map((env) => (
                <button
                  key={env.id}
                  onClick={() => setSelectedEnv(env.id)}
                  className={`px-4 sm:px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${
                    selectedEnv === env.id
                      ? 'bg-gradient-to-r from-[#0066FF] to-[#00B8D4] text-white shadow-lg shadow-[#0066FF]/30'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#0066FF]/30 hover:shadow-md'
                  }`}
                >
                  {env.name}
                </button>
              ))}
            </div>
          </div>

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Feature Flags</h2>
              <p className="text-gray-600">Manage and control your feature flags</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#0066FF] to-[#00B8D4] text-white rounded-lg hover:shadow-lg hover:shadow-[#0066FF]/40 font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105"
            >
              {showCreateForm ? '✕ Cancel' : '+ New Flag'}
            </button>
          </div>

          {/* Create Form - Modern Glass Card */}
          {showCreateForm && (
            <div className="mb-8 animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Create New Feature Flag</h3>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleCreateFlag} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Flag Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            name: e.target.value,
                            key: generateKey(e.target.value),
                          });
                        }}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all text-gray-900"
                        placeholder="Dark Mode"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Flag Key
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.key}
                        onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all text-gray-900 font-mono text-sm"
                        placeholder="dark-mode"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all text-gray-900"
                      placeholder="Describe what this flag controls..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Flag Type
                    </label>
                    <select
                      value={formData.flagType}
                      onChange={(e) => setFormData({ ...formData, flagType: e.target.value as any })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all text-gray-900"
                    >
                      <option value="boolean">Boolean (true/false)</option>
                      <option value="number">Number</option>
                      <option value="json">JSON</option>
                      <option value="multivariate">Multivariate</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={creating}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/40 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    {creating ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      '✓ Create Flag'
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Flags List - Modern Card Grid */}
          {flags.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#0066FF]/10 to-[#00B8D4]/10 rounded-full flex items-center justify-center">
                <span className="text-4xl">🚩</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No feature flags yet</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first feature flag</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0066FF] to-[#00B8D4] text-white rounded-lg hover:shadow-lg hover:shadow-[#0066FF]/40 font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-2">+</span>
                Create Your First Flag
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {flags.map((flag) => {
                const flagValue = getFlagValue(flag.id);
                const isEnabled = flagValue?.enabled || false;
                
                return (
                  <div 
                    key={flag.id}
                    className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#0066FF]/30 cursor-pointer"
                  >
                    {/* Card Header */}
                    <div 
                      onClick={() => router.push(`/dashboard/${params.slug}/projects/${params.projectKey}/flags/${flag.key}`)}
                      className="p-6 pb-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors truncate mb-1">
                            {flag.name}
                          </h3>
                          {flag.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">{flag.description}</p>
                          )}
                        </div>
                        <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold ${
                          isEnabled 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {isEnabled ? '● Active' : '○ Inactive'}
                        </span>
                      </div>

                      {/* Flag Key */}
                      <div className="flex items-center space-x-2 mb-4">
                        <code className="text-xs font-mono text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                          {flag.key}
                        </code>
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded">
                          {flag.flagType}
                        </span>
                      </div>
                    </div>

                    {/* Card Footer - Toggle */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {togglingFlag === flag.id ? 'Updating...' : 'Toggle Flag'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFlag(flag.id, isEnabled);
                        }}
                        disabled={togglingFlag === flag.id}
                        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                          isEnabled 
                            ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg shadow-green-500/30' 
                            : 'bg-gray-300'
                        }`}
                      >
                        {togglingFlag === flag.id ? (
                          <span className="inline-block h-5 w-5 rounded-full bg-white animate-pulse mx-auto" />
                        ) : (
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${
                              isEnabled ? 'translate-x-8' : 'translate-x-1'
                            }`}
                          />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
