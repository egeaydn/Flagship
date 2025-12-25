'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit as firestoreLimit,
} from 'firebase/firestore';
import { WebhookDelivery } from '@/lib/webhooks';

export default function WebhookLogsPage() {
  const params = useParams();
  const projectKey = params.projectKey as string;
  
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [selectedWebhook, setSelectedWebhook] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWebhooksAndDeliveries();
  }, [projectKey, selectedWebhook]);

  async function loadWebhooksAndDeliveries() {
    try {
      setLoading(true);
      
      // Get project ID
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
      }));
      setWebhooks(webhooksData);
      
      // Get deliveries
      let deliveriesQuery;
      if (selectedWebhook === 'all') {
        deliveriesQuery = query(
          collection(db, 'webhook_deliveries'),
          where('webhookId', 'in', webhooksData.length > 0 ? webhooksData.map(w => w.id) : ['none']),
          orderBy('createdAt', 'desc'),
          firestoreLimit(100)
        );
      } else {
        deliveriesQuery = query(
          collection(db, 'webhook_deliveries'),
          where('webhookId', '==', selectedWebhook),
          orderBy('createdAt', 'desc'),
          firestoreLimit(100)
        );
      }
      
      if (webhooksData.length > 0) {
        const deliveriesSnapshot = await getDocs(deliveriesQuery);
        const deliveriesData = deliveriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          deliveredAt: doc.data().deliveredAt?.toDate(),
        })) as WebhookDelivery[];
        setDeliveries(deliveriesData);
      } else {
        setDeliveries([]);
      }
    } catch (error) {
      console.error('Error loading webhook logs:', error);
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(status: string) {
    const styles = {
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return styles[status as keyof typeof styles] || styles.pending;
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
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Webhook Delivery Logs</h1>
            <p className="text-gray-600 mt-1">
              View webhook delivery history and status
            </p>
          </div>
          
          <select
            value={selectedWebhook}
            onChange={e => setSelectedWebhook(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Webhooks</option>
            {webhooks.map(webhook => (
              <option key={webhook.id} value={webhook.id}>
                {webhook.name}
              </option>
            ))}
          </select>
        </div>

      {deliveries.length === 0 ? (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No delivery logs</h3>
          <p className="mt-1 text-sm text-gray-500">
            Webhook deliveries will appear here when events are triggered.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Webhook
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attempts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveries.map(delivery => {
                  const webhook = webhooks.find(w => w.id === delivery.webhookId);
                  return (
                    <tr key={delivery.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {delivery.event}
                          </span>
                        </div>
                        {delivery.payload?.data?.flagKey && (
                          <div className="text-sm text-gray-500">
                            {delivery.payload.data.flagKey}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {webhook?.name || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                            delivery.status
                          )}`}
                        >
                          {delivery.status}
                        </span>
                        {delivery.statusCode && (
                          <span className="ml-2 text-xs text-gray-500">
                            HTTP {delivery.statusCode}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {delivery.attemptCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {delivery.createdAt?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => {
                            alert(
                              delivery.error ||
                                delivery.response ||
                                JSON.stringify(delivery.payload, null, 2)
                            );
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
