'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { getUserOrganizations, createOrganization } from '@/lib/firestore';

interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: any;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await loadOrganizations(user.uid);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadOrganizations = async (userId: string) => {
    try {
      const orgs = await getUserOrganizations(userId);
      setOrganizations(orgs as Organization[]);
    } catch (error) {
      console.error('Error loading organizations:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setCreating(true);
    try {
      await createOrganization({
        name: formData.name,
        slug: formData.slug,
        createdBy: user.uid,
      });

      setFormData({ name: '', slug: '' });
      setShowCreateForm(false);
      await loadOrganizations(user.uid);
    } catch (error: any) {
      console.error('Error creating organization:', error);
      alert('Hata: ' + error.message);
    } finally {
      setCreating(false);
    }
  };

  const generateSlug = (name: string) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Top Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0066FF] to-[#00B8D4] rounded-lg flex items-center justify-center">
                <span className="text-xl">🚩</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#0066FF] to-[#00B8D4] bg-clip-text text-transparent">
                  Flagship
                </h1>
                <p className="text-xs text-gray-500">Feature Flags Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-[#0066FF]/10 to-[#00B8D4]/10 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-gray-700 truncate max-w-[150px]">{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg hover:shadow-red-500/40 rounded-lg transition-all duration-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-[#0066FF] to-[#00B8D4] rounded-2xl shadow-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back! 👋</h2>
                <p className="text-white/90">Manage your organizations and feature flags</p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-4xl">🚀</span>
                </div>
              </div>
            </div>
          </div>

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Organizations</h2>
              <p className="text-gray-600">Select or create an organization to get started</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#0066FF] to-[#00B8D4] text-white rounded-lg hover:shadow-lg hover:shadow-[#0066FF]/40 font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105"
            >
              {showCreateForm ? '✕ Cancel' : '+ New Organization'}
            </button>
          </div>

          {/* Create Form - Modern Glass Card */}
          {showCreateForm && (
            <div className="mb-8 animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Create New Organization</h3>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleCreateOrg} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({
                          name: e.target.value,
                          slug: generateSlug(e.target.value),
                        });
                      }}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all text-gray-900"
                      placeholder="Acme Inc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Slug (URL)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all text-gray-900 font-mono text-sm"
                      placeholder="acme-inc"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                      <span className="mr-1">🔗</span>
                      URL: <code className="ml-1 text-[#0066FF]">flagship.com/{formData.slug || 'slug'}</code>
                    </p>
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
                      '✓ Create Organization'
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Organizations List - Modern Cards */}
          {organizations.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#0066FF]/10 to-[#00B8D4]/10 rounded-full flex items-center justify-center">
                <span className="text-4xl">🏢</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No organizations yet</h3>
              <p className="text-gray-600 mb-6">Create your first organization to start managing feature flags</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0066FF] to-[#00B8D4] text-white rounded-lg hover:shadow-lg hover:shadow-[#0066FF]/40 font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-2">+</span>
                Create Your First Organization
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  onClick={() => router.push(`/dashboard/${org.slug}`)}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#0066FF]/30 cursor-pointer"
                >
                  {/* Card Header with Gradient */}
                  <div className="h-2 bg-gradient-to-r from-[#0066FF] to-[#00B8D4]"></div>
                  
                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors truncate mb-2">
                          {org.name}
                        </h3>
                        <div className="flex items-center text-xs text-gray-500 space-x-1">
                          <span>🔗</span>
                          <code className="font-mono bg-gray-100 px-2 py-1 rounded">
                            /{org.slug}
                          </code>
                        </div>
                      </div>
                      <div className="ml-3 flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#0066FF]/10 to-[#00B8D4]/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-2xl">🏢</span>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {org.createdAt?.toDate?.()?.toLocaleDateString('en-US', {
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
