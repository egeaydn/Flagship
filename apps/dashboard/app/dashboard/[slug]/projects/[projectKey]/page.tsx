'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter, useParams } from 'next/navigation';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { COLLECTIONS, createFeatureFlag } from '@/lib/firestore';

interface Project {
  id: string;
  name: string;
  key: string;
  organizationId: string;
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
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [selectedEnv, setSelectedEnv] = useState<string>('');
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [flagValues, setFlagValues] = useState<FlagValue[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
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

      setFormData({ name: '', key: '', description: '', flagType: 'boolean', defaultValue: false });
      setShowCreateForm(false);
      await loadFlags(project.id);
    } catch (error: any) {
      console.error('Error creating flag:', error);
      alert('Hata: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  const toggleFlag = async (flagId: string, currentValue: boolean) => {
    if (!selectedEnv) return;

    try {
      const flagValue = flagValues.find(fv => fv.flagId === flagId && fv.environmentId === selectedEnv);
      
      if (flagValue) {
        await updateDoc(doc(db, COLLECTIONS.FLAG_VALUES, flagValue.id), {
          enabled: !currentValue,
          updatedAt: new Date(),
        });
      }
      
      await loadFlags(project!.id);
    } catch (error) {
      console.error('Error toggling flag:', error);
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push(`/dashboard/${slug}`)}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Geri
              </button>
              <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Environment Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Environment</label>
            <div className="flex space-x-2">
              {environments.map((env) => (
                <button
                  key={env.id}
                  onClick={() => setSelectedEnv(env.id)}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    selectedEnv === env.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {env.name}
                </button>
              ))}
            </div>
          </div>

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-gray-900">Feature Flags</h2>
              <button
                onClick={() => router.push(`/dashboard/${slug}/projects/${projectKey}/api-keys`)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-medium"
              >
                🔑 API Keys
              </button>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              {showCreateForm ? 'İptal' : '+ Yeni Flag'}
            </button>
          </div>

          {/* Create Form */}
          {showCreateForm && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Yeni Feature Flag Oluştur</h3>
              <form onSubmit={handleCreateFlag} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Flag Adı
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Dark Mode"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Flag Key
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="dark-mode"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Flag açıklaması..."
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tip
                  </label>
                  <select
                    value={formData.flagType}
                    onChange={(e) => setFormData({ ...formData, flagType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium disabled:opacity-50"
                >
                  {creating ? 'Oluşturuluyor...' : 'Oluştur'}
                </button>
              </form>
            </div>
          )}

          {/* Flags List */}
          {flags.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 mb-4">Henüz feature flag oluşturmadınız.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                İlk flag'inizi oluşturun →
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Flag
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Key
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tip
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {flags.map((flag) => {
                    const flagValue = getFlagValue(flag.id);
                    const isEnabled = flagValue?.enabled || false;
                    
                    return (
                      <tr key={flag.id} className="hover:bg-gray-50 cursor-pointer">
                        <td 
                          className="px-6 py-4 whitespace-nowrap"
                          onClick={() => router.push(`/dashboard/${params.slug}/projects/${params.projectKey}/flags/${flag.key}`)}
                        >
                          <div className="text-sm font-medium text-gray-900 hover:text-blue-600">{flag.name}</div>
                          {flag.description && (
                            <div className="text-sm text-gray-500">{flag.description}</div>
                          )}
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap"
                          onClick={() => router.push(`/dashboard/${params.slug}/projects/${params.projectKey}/flags/${flag.key}`)}
                        >
                          <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {flag.key}
                          </code>
                        </td>
                        <td 
                          className="px-6 py-4 whitespace-nowrap"
                          onClick={() => router.push(`/dashboard/${params.slug}/projects/${params.projectKey}/flags/${flag.key}`)}
                        >
                          <span className="text-sm text-gray-500">{flag.flagType}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFlag(flag.id, isEnabled);
                            }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              isEnabled ? 'bg-green-600' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                isEnabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span className="ml-3 text-sm text-gray-600">
                            {isEnabled ? 'Aktif' : 'Pasif'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
