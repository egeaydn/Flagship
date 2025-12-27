'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001F4D] via-[#003D99] to-[#0066FF] flex items-center justify-center p-4">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-[#0066FF] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-[#00B8D4] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <div className="absolute top-0 left-0 right-0 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img src="/FlagShip-logo-transparent.png" alt="Flagship" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold gradient-text">Flagship</span>
          </Link>
        </div>
      </div>

      {/* Login/Register Form */}
      <div className="relative w-full max-w-md animate-fadeIn">
        <div className="glass p-8 rounded-2xl shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
              <img src="/FlagShip-logo-transparent.png" alt="Flagship" className="w-16 h-16 object-contain" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-white/70">
              {isSignup ? 'Start managing feature flags today' : 'Sign in to your account'}
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-300 p-4 rounded-lg text-sm animate-fadeIn">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all"
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all"
                  placeholder="••••••••"
                  minLength={6}
                />
                {isSignup && (
                  <p className="mt-2 text-sm text-white/60">
                    Must be at least 6 characters
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#0066FF] to-[#00B8D4] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#0066FF]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                isSignup ? 'Create Account' : 'Sign In'
              )}
            </button>

            {/* Toggle Sign In/Sign Up */}
            <div className="text-center pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError('');
                }}
                className="text-white/90 hover:text-white transition-colors"
              >
                {isSignup ? (
                  <span>
                    Already have an account?{' '}
                    <span className="font-semibold gradient-text">Sign In</span>
                  </span>
                ) : (
                  <span>
                    Don't have an account?{' '}
                    <span className="font-semibold gradient-text">Create Account</span>
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Features for Sign Up */}
          {isSignup && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-start space-x-2">
                  <span className="text-[#00B8D4]">✓</span>
                  <span className="text-white/70">Real-time flags</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#00B8D4]">✓</span>
                  <span className="text-white/70">Advanced targeting</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#00B8D4]">✓</span>
                  <span className="text-white/70">Free forever</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#00B8D4]">✓</span>
                  <span className="text-white/70">Open source</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-white/70 hover:text-white transition-colors text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
