'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter, useParams } from 'next/navigation';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { COLLECTIONS, createProject } from '@/lib/firestore';

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface Project {
  id: string;
  name: string;
  key: string;
  description?: string;
  createdAt: any;
}

export default function OrganizationPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', key: '', description: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await loadOrganization(slug);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, slug]);

  const loadOrganization = async (slug: string) => {
    try {
      const q = query(collection(db, COLLECTIONS.ORGANIZATIONS), where('slug', '==', slug));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const orgData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Organization;
        setOrganization(orgData);
        await loadProjects(orgData.id);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error loading organization:', error);
    }
  };

  const loadProjects = async (orgId: string) => {
    try {
      const q = query(collection(db, COLLECTIONS.PROJECTS), where('organizationId', '==', orgId));
      const snapshot = await getDocs(q);
      const projectsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Project[];
      setProjects(projectsList);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !organization) return;

    setCreating(true);
    try {
      await createProject({
        organizationId: organization.id,
        name: formData.name,
        key: formData.key,
        description: formData.description,
        createdBy: user.uid,
      });

      setFormData({ name: '', key: '', description: '' });
      setShowCreateForm(false);
      await loadProjects(organization.id);
    } catch (error: any) {
      console.error('Error creating project:', error);
      alert('Hata: ' + error.message);
    } finally {
      setCreating(false);
    }
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

  if (!organization) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Geri
              </button>
              <h1 className="text-xl font-bold text-gray-900">{organization.name}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              {showCreateForm ? 'İptal' : '+ Yeni Project'}
            </button>
          </div>

          {/* Create Form */}
          {showCreateForm && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Yeni Project Oluştur</h3>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Adı
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
                    placeholder="Mobile App"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Key
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.key}
                    onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="mobile-app"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Açıklama (Opsiyonel)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Project açıklaması..."
                    rows={3}
                  />
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

          {/* Projects List */}
          {projects.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 mb-4">Henüz project oluşturmadınız.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                İlk project'inizi oluşturun →
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/dashboard/${slug}/projects/${project.key}`)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                      <p className="text-sm text-gray-500">{project.key}</p>
                      {project.description && (
                        <p className="text-sm text-gray-600 mt-2">{project.description}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {project.createdAt?.toDate?.()?.toLocaleDateString('tr-TR') || 'Yeni'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
