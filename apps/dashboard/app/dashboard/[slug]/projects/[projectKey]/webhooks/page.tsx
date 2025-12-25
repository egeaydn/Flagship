'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { Webhook, WebhookEvent, WebhookProvider } from '@/lib/webhooks';

export default function WebhooksPage() {
  const params = useParams();
  const projectKey = params.projectKey as string;
  
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null);

  useEffect(() => {
    loadWebhooks();
  }, [projectKey]);

  async function loadWebhooks() {
    try {
      setLoading(true);
      
      // Get project ID from project key
      const projectsQuery = query(
        collection(db, 'projects'),
        where('key', '==', projectKey)
      );
      const projectSnapshot = await getDocs(projectsQuery);
      
      if (projectSnapshot.empty) return;
      
      const projectId = projectSnapshot.docs[0].id;
      
      // Get webhooks
      const webhooksQuery = query(
        collection(db, 'webhooks'),
        where('projectId', '==', projectId)
      );
      const webhooksSnapshot = await getDocs(webhooksQuery);
      
      const webhooksData = webhooksSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Webhook[];
      
      setWebhooks(webhooksData);
    } catch (error) {
      console.error('Error loading webhooks:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleWebhook(webhookId: string, enabled: boolean) {
    try {
      await updateDoc(doc(db, 'webhooks', webhookId), {
        enabled,
        updatedAt: serverTimestamp(),
      });
      
      setWebhooks(prev =>
        prev.map(w => (w.id === webhookId ? { ...w, enabled } : w))
      );
    } catch (error) {
      console.error('Error toggling webhook:', error);
    }
  }

  async function deleteWebhook(webhookId: string) {
    if (!confirm('Are you sure you want to delete this webhook?')) return;
    
    try {
      await deleteDoc(doc(db, 'webhooks', webhookId));
      setWebhooks(prev => prev.filter(w => w.id !== webhookId));
    } catch (error) {
      console.error('Error deleting webhook:', error);
    }
  }

  async function testWebhook(webhook: Webhook) {
    setTestingWebhook(webhook.id);
    
    try {
      const response = await fetch('/api/webhooks/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookId: webhook.id }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('✅ Webhook test successful!');
      } else {
        alert(`❌ Webhook test failed: ${result.error}`);
      }
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setTestingWebhook(null);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Webhooks</h1>
            <p className="text-gray-600 mt-1">
              Get notified when flags change
            </p>
          </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Create Webhook
        </button>
      </div>

      {webhooks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No webhooks</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new webhook.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Webhook
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Events
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {webhooks.map(webhook => (
                <tr key={webhook.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {webhook.name}
                    </div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {webhook.url}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                      {webhook.provider}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map(event => (
                        <span
                          key={event}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {event}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={webhook.enabled}
                        onChange={e => toggleWebhook(webhook.id, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => testWebhook(webhook)}
                      disabled={testingWebhook === webhook.id}
                      className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                    >
                      {testingWebhook === webhook.id ? 'Testing...' : 'Test'}
                    </button>
                    <button
                      onClick={() => deleteWebhook(webhook.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreateModal && (
        <CreateWebhookModal
          projectKey={projectKey}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            loadWebhooks();
            setShowCreateModal(false);
          }}
        />
      )}
      </div>
    </div>
  );
}

function CreateWebhookModal({
  projectKey,
  onClose,
  onSuccess,
}: {
  projectKey: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [provider, setProvider] = useState<WebhookProvider>('custom');
  const [selectedEvents, setSelectedEvents] = useState<WebhookEvent[]>([]);
  const [secret, setSecret] = useState('');
  const [creating, setCreating] = useState(false);

  const availableEvents: WebhookEvent[] = [
    'flag.created',
    'flag.updated',
    'flag.deleted',
    'flag.toggled',
    'targeting.updated',
  ];

  function toggleEvent(event: WebhookEvent) {
    setSelectedEvents(prev =>
      prev.includes(event)
        ? prev.filter(e => e !== event)
        : [...prev, event]
    );
  }

  async function handleCreate() {
    if (!name || !url || selectedEvents.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    setCreating(true);

    try {
      // Get project ID
      const projectsQuery = query(
        collection(db, 'projects'),
        where('key', '==', projectKey)
      );
      const projectSnapshot = await getDocs(projectsQuery);
      
      if (projectSnapshot.empty) {
        throw new Error('Project not found');
      }
      
      const projectId = projectSnapshot.docs[0].id;

      await addDoc(collection(db, 'webhooks'), {
        projectId,
        name,
        url,
        provider,
        events: selectedEvents,
        enabled: true,
        secret: secret || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      onSuccess();
    } catch (error) {
      console.error('Error creating webhook:', error);
      alert('Failed to create webhook');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Webhook</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Production Slack Notifications"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provider *
            </label>
            <select
              value={provider}
              onChange={e => setProvider(e.target.value as WebhookProvider)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="custom">Custom</option>
              <option value="slack">Slack</option>
              <option value="discord">Discord</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Webhook URL *
            </label>
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://hooks.slack.com/services/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Events to Listen *
            </label>
            <div className="space-y-2">
              {availableEvents.map(event => (
                <label key={event} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(event)}
                    onChange={() => toggleEvent(event)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{event}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secret (optional)
            </label>
            <input
              type="text"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Used to sign webhook payloads"
            />
            <p className="text-xs text-gray-500 mt-1">
              If provided, payloads will be signed with HMAC-SHA256
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            disabled={creating}
            className="px-4 py-2 text-gray-700 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {creating ? 'Creating...' : 'Create Webhook'}
          </button>
        </div>
      </div>
    </div>
  );
}
