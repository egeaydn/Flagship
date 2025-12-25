(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/flagship/apps/dashboard/lib/webhooks.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatWebhookPayload",
    ()=>formatWebhookPayload,
    "sendWebhook",
    ()=>sendWebhook,
    "triggerWebhooks",
    ()=>triggerWebhooks
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/flagship/apps/dashboard/lib/firebase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$flagship$2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/flagship/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/flagship/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
;
;
function formatWebhookPayload(webhook, payload) {
    switch(webhook.provider){
        case 'slack':
            return formatSlackPayload(payload);
        case 'discord':
            return formatDiscordPayload(payload);
        case 'custom':
        default:
            return payload;
    }
}
// Slack message format
function formatSlackPayload(payload) {
    const { event, data, timestamp } = payload;
    const emoji = getEventEmoji(event);
    const color = getEventColor(event);
    return {
        text: `${emoji} Feature Flag Event: ${event}`,
        attachments: [
            {
                color: color,
                fields: [
                    {
                        title: 'Event',
                        value: event,
                        short: true
                    },
                    {
                        title: 'Flag',
                        value: data.flagKey || 'N/A',
                        short: true
                    },
                    {
                        title: 'Action',
                        value: data.action,
                        short: true
                    },
                    {
                        title: 'Actor',
                        value: data.actor || 'System',
                        short: true
                    },
                    ...data.changes ? [
                        {
                            title: 'Changes',
                            value: `\`\`\`${JSON.stringify(data.changes, null, 2)}\`\`\``,
                            short: false
                        }
                    ] : []
                ],
                footer: 'Flagship Feature Flags',
                ts: new Date(timestamp).getTime() / 1000
            }
        ]
    };
}
// Discord message format
function formatDiscordPayload(payload) {
    const { event, data, timestamp } = payload;
    const emoji = getEventEmoji(event);
    const color = getEventColorHex(event);
    return {
        content: `${emoji} **Feature Flag Event:** ${event}`,
        embeds: [
            {
                color: color,
                fields: [
                    {
                        name: 'Event',
                        value: event,
                        inline: true
                    },
                    {
                        name: 'Flag',
                        value: data.flagKey || 'N/A',
                        inline: true
                    },
                    {
                        name: 'Action',
                        value: data.action,
                        inline: true
                    },
                    {
                        name: 'Actor',
                        value: data.actor || 'System',
                        inline: true
                    },
                    ...data.changes ? [
                        {
                            name: 'Changes',
                            value: `\`\`\`json\n${JSON.stringify(data.changes, null, 2)}\n\`\`\``,
                            inline: false
                        }
                    ] : []
                ],
                footer: {
                    text: 'Flagship Feature Flags'
                },
                timestamp: timestamp
            }
        ]
    };
}
// Helper functions
function getEventEmoji(event) {
    switch(event){
        case 'flag.created':
            return '🎉';
        case 'flag.updated':
            return '✏️';
        case 'flag.deleted':
            return '🗑️';
        case 'flag.toggled':
            return '🔄';
        case 'targeting.updated':
            return '🎯';
        default:
            return '📢';
    }
}
function getEventColor(event) {
    switch(event){
        case 'flag.created':
            return 'good';
        case 'flag.updated':
            return 'warning';
        case 'flag.deleted':
            return 'danger';
        case 'flag.toggled':
            return '#36a64f';
        case 'targeting.updated':
            return '#439FE0';
        default:
            return '#808080';
    }
}
function getEventColorHex(event) {
    switch(event){
        case 'flag.created':
            return 0x36a64f; // Green
        case 'flag.updated':
            return 0xff9800; // Orange
        case 'flag.deleted':
            return 0xf44336; // Red
        case 'flag.toggled':
            return 0x2196f3; // Blue
        case 'targeting.updated':
            return 0x9c27b0; // Purple
        default:
            return 0x808080; // Gray
    }
}
async function sendWebhook(webhook, payload) {
    if (!webhook.enabled) {
        return {
            success: false,
            error: 'Webhook is disabled'
        };
    }
    try {
        const formattedPayload = formatWebhookPayload(webhook, payload);
        const headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'Flagship-Webhooks/1.0',
            ...webhook.headers || {}
        };
        // Add signature if secret is provided
        if (webhook.secret) {
            const signature = await generateSignature(JSON.stringify(formattedPayload), webhook.secret);
            headers['X-Flagship-Signature'] = signature;
        }
        const response = await fetch(webhook.url, {
            method: 'POST',
            headers,
            body: JSON.stringify(formattedPayload),
            signal: AbortSignal.timeout(10000)
        });
        const success = response.ok;
        const statusCode = response.status;
        // Log delivery
        await logWebhookDelivery({
            webhookId: webhook.id,
            event: payload.event,
            payload,
            status: success ? 'success' : 'failed',
            statusCode,
            response: success ? await response.text() : undefined,
            error: success ? undefined : `HTTP ${statusCode}: ${response.statusText}`,
            attemptCount: 1
        });
        return {
            success,
            statusCode
        };
    } catch (error) {
        // Log failed delivery
        await logWebhookDelivery({
            webhookId: webhook.id,
            event: payload.event,
            payload,
            status: 'failed',
            error: error.message,
            attemptCount: 1
        });
        return {
            success: false,
            error: error.message
        };
    }
}
// Generate HMAC signature
async function generateSignature(payload, secret) {
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const key = encoder.encode(secret);
    // Import key for HMAC
    const cryptoKey = await crypto.subtle.importKey('raw', key, {
        name: 'HMAC',
        hash: 'SHA-256'
    }, false, [
        'sign'
    ]);
    // Generate signature
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
    // Convert to hex
    return Array.from(new Uint8Array(signature)).map((b)=>b.toString(16).padStart(2, '0')).join('');
}
// Log webhook delivery
async function logWebhookDelivery(delivery) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'webhook_deliveries'), {
            ...delivery,
            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
            deliveredAt: delivery.status === 'success' ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["serverTimestamp"])() : null
        });
    } catch (error) {
        console.error('Failed to log webhook delivery:', error);
    }
}
async function triggerWebhooks(projectId, event, data) {
    const { collection: firestoreCollection, query, where, getDocs } = await __turbopack_context__.A("[project]/Desktop/flagship/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript, async loader)");
    try {
        // Get all enabled webhooks for this project that listen to this event
        const webhooksQuery = query(firestoreCollection(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'webhooks'), where('projectId', '==', projectId), where('enabled', '==', true), where('events', 'array-contains', event));
        const webhooksSnapshot = await getDocs(webhooksQuery);
        if (webhooksSnapshot.empty) {
            return;
        }
        const payload = {
            event,
            timestamp: new Date().toISOString(),
            projectId,
            data
        };
        // Send to all matching webhooks (in parallel)
        const promises = webhooksSnapshot.docs.map((doc)=>{
            const webhook = {
                id: doc.id,
                ...doc.data()
            };
            return sendWebhook(webhook, payload);
        });
        await Promise.allSettled(promises);
    } catch (error) {
        console.error('Failed to trigger webhooks:', error);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_flagship_apps_dashboard_lib_webhooks_ts_350f573f._.js.map