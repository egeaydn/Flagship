'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter, useParams } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { COLLECTIONS, createApiKey, revokeApiKey, getEnvironmentApiKeys } from '@/lib/firestore';

interface Project {
  id: string;
  name: string;
  key: string;
}

interface Environment {
  id: string;
  name: string;
  key: string;
}

interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  keyType: 'client' | 'server';
  createdAt: any;
  lastUsedAt: any;
}

export default function ApiKeysPage() {
  const params = useParams();
  const slug = params.slug as string;
  const projectKey = params.projectKey as string;
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [selectedEnv, setSelectedEnv] = useState<string>('');
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', keyType: 'server' as const });
  const [creating, setCreating] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string>('');
  const [copied, setCopied] = useState(false);

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

  useEffect(() => {
    if (selectedEnv) {
      loadApiKeys();
    }
  }, [selectedEnv]);

  const loadProject = async () => {
    try {
      const q = query(collection(db, COLLECTIONS.PROJECTS), where('key', '==', projectKey));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const projectData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Project;
        setProject(projectData);
        await loadEnvironments(projectData.id);
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

  const loadApiKeys = async () => {
    try {
      const keys = await getEnvironmentApiKeys(selectedEnv);
      setApiKeys(keys as ApiKey[]);
    } catch (error) {
      console.error('Error loading API keys:', error);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setCreating(true);
    try {
      const rawKey = await createApiKey({
        environmentId: selectedEnv,
        name: formData.name,
        keyType: formData.keyType,
        createdBy: user.uid,
      });

      setGeneratedKey(rawKey);
      setFormData({ name: '', keyType: 'server' });
      await loadApiKeys();
    } catch (error: any) {
      console.error('Error creating API key:', error);
      alert('Hata: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (keyId: string) => {
    if (!confirm('Bu API key\'i iptal etmek istediğinize emin misiniz?')) return;

    try {
      await revokeApiKey(keyId);
      await loadApiKeys();
    } catch (error) {
      console.error('Error revoking key:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const closeKeyModal = () => {
    setGeneratedKey('');
    setShowCreateForm(false);
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
                onClick={() => router.push(`/dashboard/${slug}/projects/${projectKey}`)}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Geri
              </button>
              <h1 className="text-xl font-bold text-gray-900">{project.name} - API Keys</h1>
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
            <h2 className="text-2xl font-bold text-gray-900">API Keys</h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              disabled={!!generatedKey}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {showCreateForm ? 'İptal' : '+ Yeni API Key'}
            </button>
          </div>

          {/* Generated Key Modal */}
          {generatedKey && (
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                ✅ API Key Oluşturuldu!
              </h3>
              <p className="text-sm text-green-800 mb-4">
                Bu key sadece bir kez gösterilecek. Lütfen güvenli bir yerde saklayın.
              </p>
              <div className="bg-white border border-green-300 rounded p-4 mb-4">
                <code className="text-sm text-gray-900 break-all">{generatedKey}</code>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                >
                  {copied ? '✓ Kopyalandı' : 'Kopyala'}
                </button>
                <button
                  onClick={closeKeyModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 font-medium"
                >
                  Kapat
                </button>
              </div>
            </div>
          )}

          {/* Create Form */}
          {showCreateForm && !generatedKey && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Yeni API Key Oluştur</h3>
              <form onSubmit={handleCreateKey} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Adı
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Production Mobile App"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Tipi
                  </label>
                  <select
                    value={formData.keyType}
                    onChange={(e) => setFormData({ ...formData, keyType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="server">Server-side (tam erişim)</option>
                    <option value="client">Client-side (sadece okuma)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.keyType === 'server' 
                      ? 'Backend uygulamalar için. Tüm flag bilgilerine erişir.'
                      : 'Frontend uygulamalar için. Sadece aktif flag değerlerini döner.'}
                  </p>
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

          {/* API Keys List */}
          {apiKeys.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 mb-4">Bu environment için henüz API key oluşturmadınız.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                İlk API key'inizi oluşturun →
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prefix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tip
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Son Kullanım
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {apiKeys.map((key) => (
                    <tr key={key.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{key.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {key.keyPrefix}...
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          key.keyType === 'server'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {key.keyType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {key.lastUsedAt?.toDate?.()?.toLocaleDateString('tr-TR') || 'Hiç kullanılmadı'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleRevoke(key.id)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          İptal Et
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
