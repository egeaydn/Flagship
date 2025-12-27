'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#001F4D] via-[#003D99] to-[#0066FF]">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001F4D] via-[#003D99] to-[#0066FF]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/10 backdrop-blur-md border-b border-white/20 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/FlagShip-logo-transparent.png" alt="Flagship" className="w-10 h-10 object-contain" />
              <span className="text-2xl font-bold text-white">Flagship</span>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/egeaydn/Flagship"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a
                href="/docs"
                className="text-white/80 hover:text-white transition-colors"
              >
                Docs
              </a>
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-white text-[#0066FF] rounded-lg font-medium hover:bg-gray-100 transition-all"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Feature Flags
              <br />
              <span className="bg-gradient-to-r from-[#00B8D4] to-[#3385FF] bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
              The open-source alternative to LaunchDarkly. Deploy features with confidence using advanced targeting and real-time analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/login')}
                className="px-8 py-4 bg-white text-[#0066FF] rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Get Started Free
              </button>
              <button
                onClick={() => window.open('https://flagships.netlify.app/dashboard', '_blank')}
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-lg font-semibold text-lg hover:bg-white/20 transition-all border border-white/30"
              >
                Live Demo →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 card-hover">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-white mb-3">Advanced Targeting</h3>
              <p className="text-white/70">
                Target users by attributes with 8+ operators. Percentage rollouts with deterministic hashing.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 card-hover">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-white mb-3">Real-time Analytics</h3>
              <p className="text-white/70">
                Track flag evaluations with beautiful charts. Auto-refresh dashboard with live insights.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 card-hover">
              <div className="text-4xl mb-4">🪝</div>
              <h3 className="text-2xl font-bold text-white mb-3">Webhook Integration</h3>
              <p className="text-white/70">
                Get notified on Slack, Discord, or custom endpoints when flags change.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 card-hover">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-3">Complete Audit Logs</h3>
              <p className="text-white/70">
                Track every change with full audit trail. Know who changed what and when.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 card-hover">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-white mb-3">Fast & Cached</h3>
              <p className="text-white/70">
                Edge-optimized API with 60s cache. Response times under 50ms globally.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 card-hover">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-2xl font-bold text-white mb-3">Type-safe SDKs</h3>
              <p className="text-white/70">
                React SDK with TypeScript support. Auto-completion and type checking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div>
                <div className="text-5xl font-bold text-white mb-2">41</div>
                <div className="text-white/70 text-lg">Tests Passing</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-2">&lt;50ms</div>
                <div className="text-white/70 text-lg">API Response Time</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-2">100%</div>
                <div className="text-white/70 text-lg">Open Source</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to ship features faster?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join developers using Flagship to control feature rollouts with confidence.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-8 py-4 bg-white text-[#0066FF] rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
          >
            Get Started Free →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-white/60">
          <p className="mb-4">
            Built with ❤️ by developers, for developers
          </p>
          <div className="flex justify-center space-x-6">
            <a href="https://github.com/egeaydn/Flagship" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href="/docs" className="hover:text-white transition-colors">
              Documentation
            </a>
            <a href="https://twitter.com" className="hover:text-white transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

