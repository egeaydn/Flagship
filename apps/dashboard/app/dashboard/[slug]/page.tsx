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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center text-gray-600 hover:text-[#0066FF] transition-colors text-sm sm:text-base font-medium"
              >
                <span className="mr-2">←</span>
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <div className="h-8 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#0066FF] to-[#00B8D4] bg-clip-text text-transparent">
                  {organization.name}
                </h1>
                <p className="text-xs text-gray-500">Organization</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-[#0066FF]/10 to-[#00B8D4]/10 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-gray-700">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Projects</h2>
              <p className="text-gray-600">Manage your feature flag projects</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#0066FF] to-[#00B8D4] text-white rounded-lg hover:shadow-lg hover:shadow-[#0066FF]/40 font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105"
            >
              {showCreateForm ? '✕ Cancel' : '+ New Project'}
            </button>
          </div>

          {/* Create Form - Modern Glass Card */}
          {showCreateForm && (
            <div className="mb-8 animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Create New Project</h3>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleCreateProject} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Project Name
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
                        placeholder="Mobile App"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Project Key
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.key}
                        onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all text-gray-900 font-mono text-sm"
                        placeholder="mobile-app"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all text-gray-900"
                      placeholder="Describe your project..."
                      rows={3}
                    />
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
                      '✓ Create Project'
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Projects List - Modern Cards */}
          {projects.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#0066FF]/10 to-[#00B8D4]/10 rounded-full flex items-center justify-center">
                <span className="text-4xl">📦</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-6">Create your first project to start managing feature flags</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0066FF] to-[#00B8D4] text-white rounded-lg hover:shadow-lg hover:shadow-[#0066FF]/40 font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-2">+</span>
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => router.push(`/dashboard/${slug}/projects/${project.key}`)}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#0066FF]/30 cursor-pointer"
                >
                  {/* Card Header with Gradient */}
                  <div className="h-2 bg-gradient-to-r from-[#0066FF] to-[#00B8D4]"></div>
                  
                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors truncate mb-1">
                          {project.name}
                        </h3>
                        <code className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {project.key}
                        </code>
                      </div>
                      <div className="ml-3 flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#0066FF]/10 to-[#00B8D4]/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-2xl">🚀</span>
                      </div>
                    </div>

                    {project.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {project.description}
                      </p>
                    )}

                    {/* Card Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {project.createdAt?.toDate?.()?.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) || 'New'}
                      </span>
                      <div className="flex items-center text-[#0066FF] group-hover:translate-x-1 transition-transform">
                        <span className="text-sm font-medium mr-1">Open</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
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
