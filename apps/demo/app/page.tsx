'use client';

import { createClient } from '@flagship/sdk';
import { FlagshipProvider, useFlag, useFlags } from '@flagship/sdk-react';

const client = createClient({
  apiKey: process.env.NEXT_PUBLIC_FLAGSHIP_API_KEY!,
  apiUrl: process.env.NEXT_PUBLIC_FLAGSHIP_API_URL,
});

function DemoContent() {
  const { flags, loading, error, refresh } = useFlags();
  
  // Example flags
  const newFeature = useFlag('recep-tayyip-erdogan', false);
  const betaFeature = useFlag('gursel-tekin', false);

  if (loading) {
    return <div className="loading">🚀 Loading feature flags...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h2>❌ Error loading flags</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>🚩 Flagship Demo App</h1>
        <p>Feature Flags Platform - Live Demo</p>
      </header>

      <div className="grid">
        {/* Feature 1 */}
        <div className="card">
          <h2>
            <span className={`status-indicator ${newFeature.enabled ? 'status-enabled' : 'status-disabled'}`}></span>
            Recep Tayyip Erdoğan Feature
          </h2>
          <p>This feature is controlled by the "recep-tayyip-erdogan" flag.</p>
          {newFeature.loading ? (
            <span className="badge badge-warning">Loading...</span>
          ) : newFeature.enabled ? (
            <>
              <span className="badge badge-success">✓ Enabled</span>
              <p style={{ marginTop: '1rem', color: '#28a745', fontWeight: 'bold' }}>
                🎉 This premium feature is now available!
              </p>
            </>
          ) : (
            <span className="badge badge-danger">✗ Disabled</span>
          )}
        </div>

        {/* Feature 2 */}
        <div className="card">
          <h2>
            <span className={`status-indicator ${betaFeature.enabled ? 'status-enabled' : 'status-disabled'}`}></span>
            Gürsel Tekin Beta
          </h2>
          <p>Beta feature flag: "gursel-tekin"</p>
          {betaFeature.loading ? (
            <span className="badge badge-warning">Loading...</span>
          ) : betaFeature.enabled ? (
            <>
              <span className="badge badge-success">✓ Active</span>
              <p style={{ marginTop: '1rem', color: '#28a745' }}>
                🔬 Beta features unlocked!
              </p>
            </>
          ) : (
            <span className="badge badge-danger">✗ Inactive</span>
          )}
        </div>

        {/* Control Panel */}
        <div className="card">
          <h2>⚙️ Control Panel</h2>
          <p>Manage your feature flags in real-time.</p>
          <button className="button" onClick={refresh}>
            🔄 Refresh Flags
          </button>
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
            Cache refreshes automatically every 60 seconds
          </p>
        </div>
      </div>

      {/* All Flags Info */}
      <div className="info-box">
        <h3>📊 All Feature Flags</h3>
        <div className="flags-list">
          {flags && Object.entries(flags.flags).map(([key, value]) => (
            <div key={key} className="flag-item">
              <div>
                <span className={`status-indicator ${value.enabled ? 'status-enabled' : 'status-disabled'}`}></span>
                <strong>{key}</strong>
              </div>
              <span className={`badge ${value.enabled ? 'badge-success' : 'badge-danger'}`}>
                {value.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Example */}
      <div className="info-box">
        <h3>💻 Code Example</h3>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          This is how the flags are used in this demo:
        </p>
        <pre style={{ 
          background: '#f4f4f4', 
          padding: '1rem', 
          borderRadius: '8px',
          overflow: 'auto',
          fontSize: '0.875rem'
        }}>
{`const { useFlag, useFlags } = '@flagship/sdk-react';

// Get a single flag
const feature = useFlag('recep-tayyip-erdogan', false);

// Get all flags
const { flags, loading, refresh } = useFlags();

// Check if enabled
if (feature.enabled) {
  // Show feature
}`}
        </pre>
      </div>

      {/* User Context Info */}
      <div className="info-box">
        <h3>👤 User Context</h3>
        <p>
          User ID: <code>{flags?.user?.id || 'anonymous'}</code>
        </p>
        <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.875rem' }}>
          You can pass user attributes for targeting and segmentation.
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <FlagshipProvider 
      client={client}
      user={{ 
        id: 'demo-user-123',
        attributes: {
          plan: 'premium',
          country: 'TR'
        }
      }}
    >
      <DemoContent />
    </FlagshipProvider>
  );
}
