module.exports = [
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/process [external] (process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/dns [external] (dns, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("dns", () => require("dns"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/lib/firebase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auth",
    ()=>auth,
    "db",
    ()=>db,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$firebase$2f$app$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Proje Klosörü/React/flagship/node_modules/firebase/app/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Proje Klosörü/React/flagship/node_modules/@firebase/app/dist/esm/index.esm.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Proje Klosörü/React/flagship/node_modules/firebase/auth/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Proje Klosörü/React/flagship/node_modules/@firebase/auth/dist/node-esm/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Proje Klosörü/React/flagship/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Proje Klosörü/React/flagship/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
;
;
;
const firebaseConfig = {
    apiKey: ("TURBOPACK compile-time value", "AIzaSyA38tq9hBov0OvDf0WkIO2EMQaG81ZtmEQ"),
    authDomain: ("TURBOPACK compile-time value", "flagship-2bd6d.firebaseapp.com"),
    projectId: ("TURBOPACK compile-time value", "flagship-2bd6d"),
    storageBucket: ("TURBOPACK compile-time value", "flagship-2bd6d.firebasestorage.app"),
    messagingSenderId: ("TURBOPACK compile-time value", "964714466914"),
    appId: ("TURBOPACK compile-time value", "1:964714466914:web:2a23c52c90f096203e4b3b")
};
// Initialize Firebase (singleton pattern)
const app = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApps"])().length === 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["initializeApp"])(firebaseConfig) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApps"])()[0];
const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuth"])(app);
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFirestore"])(app);
const __TURBOPACK__default__export__ = app;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/lib/firestore.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COLLECTIONS",
    ()=>COLLECTIONS,
    "createApiKey",
    ()=>createApiKey,
    "createAuditLog",
    ()=>createAuditLog,
    "createFeatureFlag",
    ()=>createFeatureFlag,
    "createOrganization",
    ()=>createOrganization,
    "createProject",
    ()=>createProject,
    "getAggregatedAnalytics",
    ()=>getAggregatedAnalytics,
    "getAuditLogs",
    ()=>getAuditLogs,
    "getEnvironmentApiKeys",
    ()=>getEnvironmentApiKeys,
    "getFlagAnalytics",
    ()=>getFlagAnalytics,
    "getUserOrganizations",
    ()=>getUserOrganizations,
    "recordFlagEvaluation",
    ()=>recordFlagEvaluation,
    "revokeApiKey",
    ()=>revokeApiKey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Proje Klosörü/React/flagship/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Proje Klosörü/React/flagship/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/lib/firebase.ts [app-ssr] (ecmascript)");
;
;
const COLLECTIONS = {
    ORGANIZATIONS: 'organizations',
    ORGANIZATION_MEMBERS: 'organization_members',
    PROJECTS: 'projects',
    ENVIRONMENTS: 'environments',
    FEATURE_FLAGS: 'feature_flags',
    FLAG_VALUES: 'flag_values',
    API_KEYS: 'api_keys',
    AUDIT_LOGS: 'audit_logs',
    FLAG_ANALYTICS: 'flag_analytics'
};
async function createOrganization(data) {
    const orgRef = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], COLLECTIONS.ORGANIZATIONS), {
        ...data,
        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
        updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])()
    });
    // Auto-create owner membership
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], COLLECTIONS.ORGANIZATION_MEMBERS, `${data.createdBy}_${orgRef.id}`), {
        organizationId: orgRef.id,
        userId: data.createdBy,
        role: 'owner',
        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])()
    });
    return orgRef.id;
}
async function getUserOrganizations(userId) {
    const membersQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], COLLECTIONS.ORGANIZATION_MEMBERS), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])('userId', '==', userId));
    const membersSnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDocs"])(membersQuery);
    const orgIds = membersSnap.docs.map((doc)=>doc.data().organizationId);
    if (orgIds.length === 0) return [];
    const orgsQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], COLLECTIONS.ORGANIZATIONS), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])('__name__', 'in', orgIds));
    const orgsSnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDocs"])(orgsQuery);
    return orgsSnap.docs.map((doc)=>({
            id: doc.id,
            ...doc.data()
        }));
}
async function createProject(data) {
    const projectRef = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], COLLECTIONS.PROJECTS), {
        ...data,
        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
        updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])()
    });
    // Auto-create default environments
    const environments = [
        {
            name: 'Development',
            key: 'dev'
        },
        {
            name: 'Staging',
            key: 'staging'
        },
        {
            name: 'Production',
            key: 'prod'
        }
    ];
    for (const env of environments){
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], COLLECTIONS.ENVIRONMENTS), {
            projectId: projectRef.id,
            ...env,
            createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
    }
    return projectRef.id;
}
async function createFeatureFlag(data) {
    // Create the flag
    const flagRef = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], COLLECTIONS.FEATURE_FLAGS), {
        ...data,
        tags: data.tags || [],
        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
        updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])()
    });
    // Get all environments for this project
    const envsQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], COLLECTIONS.ENVIRONMENTS), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])('projectId', '==', data.projectId));
    const envsSnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDocs"])(envsQuery);
    // Create flag_values for each environment
    for (const envDoc of envsSnap.docs){
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], COLLECTIONS.FLAG_VALUES), {
            flagId: flagRef.id,
            environmentId: envDoc.id,
            enabled: false,
            value: data.defaultValue,
            updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])()
        });
    }
    return flagRef;
}
async function createApiKey(data) {
    const bcrypt = (await __turbopack_context__.A("[project]/Desktop/Proje Klosörü/React/flagship/node_modules/bcryptjs/index.js [app-ssr] (ecmascript, async loader)")).default;
    // Generate random key: fsk_{type}_{32-char-random}
    const randomPart = Array.from(crypto.getRandomValues(new Uint8Array(16))).map((b)=>b.toString(16).padStart(2, '0')).join('');
    const rawKey = `fsk_${data.keyType}_${randomPart}`;
    // Hash for storage
    const keyHash = await bcrypt.hash(rawKey, 10);
    // Prefix for quick lookup (first 12 chars)
    const keyPrefix = rawKey.substring(0, 12);
    // Store in Firestore
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], COLLECTIONS.API_KEYS), {
        environmentId: data.environmentId,
        name: data.name,
        keyPrefix,
        keyHash,
        keyType: data.keyType,
        revoked: false,
        lastUsedAt: null,
        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
        createdBy: data.createdBy
    });
    // Return raw key (shown ONCE)
    return rawKey;
}
async function revokeApiKey(keyId) {
    const keyRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], COLLECTIONS.API_KEYS, keyId);
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateDoc"])(keyRef, {
        revoked: true,
        updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])()
    });
}
async function getEnvironmentApiKeys(environmentId) {
    const q = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], COLLECTIONS.API_KEYS), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])('environmentId', '==', environmentId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])('revoked', '==', false));
    const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDocs"])(q);
    return snapshot.docs.map((doc)=>({
            id: doc.id,
            ...doc.data()
        }));
}
async function createAuditLog(data) {
    const logRef = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], COLLECTIONS.AUDIT_LOGS), {
        ...data,
        timestamp: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])()
    });
    // Trigger webhooks asynchronously (don't await to avoid slowing down audit log creation)
    if (data.projectId && data.action) {
        const { triggerWebhooks, WebhookEvent } = await __turbopack_context__.A("[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/lib/webhooks.ts [app-ssr] (ecmascript, async loader)");
        // Map audit log actions to webhook events
        const eventMap = {
            'FLAG_CREATED': 'flag.created',
            'FLAG_UPDATED': 'flag.updated',
            'FLAG_DELETED': 'flag.deleted',
            'FLAG_TOGGLED': 'flag.toggled',
            'TARGETING_RULES_UPDATED': 'targeting.updated'
        };
        const event = eventMap[data.action];
        if (event) {
            triggerWebhooks(data.projectId, event, {
                flagKey: data.metadata?.flagKey || data.resourceName,
                flagName: data.resourceName,
                action: data.action,
                actor: data.userEmail || 'Unknown',
                changes: data.changes,
                before: data.changes?.before,
                after: data.changes?.after
            }).catch((err)=>console.error('Webhook trigger error:', err));
        }
    }
    return logRef;
}
async function getAuditLogs(organizationId, limit = 100) {
    const logsQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], COLLECTIONS.AUDIT_LOGS), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])('organizationId', '==', organizationId));
    const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDocs"])(logsQuery);
    const logs = snapshot.docs.map((doc)=>({
            id: doc.id,
            ...doc.data()
        }));
    // Sort by timestamp descending (newest first)
    return logs.sort((a, b)=>{
        const aTime = a.timestamp?.toMillis() || a.createdAt?.toMillis() || 0;
        const bTime = b.timestamp?.toMillis() || b.createdAt?.toMillis() || 0;
        return bTime - aTime;
    }).slice(0, limit);
}
async function recordFlagEvaluation(data) {
    return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], COLLECTIONS.FLAG_ANALYTICS), {
        ...data,
        timestamp: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])(),
        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["serverTimestamp"])()
    });
}
async function getFlagAnalytics(projectId, environmentId, days = 7) {
    const analyticsQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], COLLECTIONS.FLAG_ANALYTICS), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])('projectId', '==', projectId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["where"])('environmentId', '==', environmentId));
    const snapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDocs"])(analyticsQuery);
    const analytics = snapshot.docs.map((doc)=>({
            id: doc.id,
            ...doc.data()
        }));
    // Filter by date range (last N days)
    const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
    return analytics.filter((a)=>{
        const time = a.timestamp?.toMillis() || a.createdAt?.toMillis() || 0;
        return time >= cutoffTime;
    });
}
async function getAggregatedAnalytics(projectId, environmentId, days = 7) {
    const analytics = await getFlagAnalytics(projectId, environmentId, days);
    // Aggregate by flag
    const aggregated = {};
    analytics.forEach((entry)=>{
        const key = entry.flagKey;
        if (!aggregated[key]) {
            aggregated[key] = {
                flagKey: key,
                flagId: entry.flagId,
                evaluations: 0,
                uniqueUsers: new Set(),
                trueCount: 0,
                falseCount: 0,
                targetingAppliedCount: 0
            };
        }
        aggregated[key].evaluations++;
        if (entry.userId) {
            aggregated[key].uniqueUsers.add(entry.userId);
        }
        if (entry.result === true) aggregated[key].trueCount++;
        if (entry.result === false) aggregated[key].falseCount++;
        if (entry.targetingApplied) aggregated[key].targetingAppliedCount++;
    });
    // Convert Set to count
    return Object.values(aggregated).map((item)=>({
            ...item,
            uniqueUsers: item.uniqueUsers.size
        }));
}
}),
"[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/lib/animations.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Client-side only anime.js wrapper with dynamic imports
__turbopack_context__.s([
    "animateGradient",
    ()=>animateGradient,
    "animateNumber",
    ()=>animateNumber,
    "bounceIn",
    ()=>bounceIn,
    "buttonRipple",
    ()=>buttonRipple,
    "cardHover",
    ()=>cardHover,
    "cardHoverEnd",
    ()=>cardHoverEnd,
    "fadeIn",
    ()=>fadeIn,
    "fadeInLeft",
    ()=>fadeInLeft,
    "fadeInRight",
    ()=>fadeInRight,
    "pageTransition",
    ()=>pageTransition,
    "pulse",
    ()=>pulse,
    "rotate",
    ()=>rotate,
    "scaleIn",
    ()=>scaleIn,
    "shake",
    ()=>shake,
    "slideInBottom",
    ()=>slideInBottom,
    "staggerFadeIn",
    ()=>staggerFadeIn,
    "waveText",
    ()=>waveText
]);
const isBrowser = ("TURBOPACK compile-time value", "undefined") !== 'undefined';
// Dynamically import anime.js v3 only on client side
let animePromise = null;
const loadAnime = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return animePromise;
};
const fadeIn = (targets, delay = 0)=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
};
const fadeInLeft = (targets, delay = 0)=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
};
const fadeInRight = (targets, delay = 0)=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
};
const scaleIn = (targets, delay = 0)=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
};
const staggerFadeIn = (targets)=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
};
const cardHover = (element)=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
};
const cardHoverEnd = (element)=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
};
const pulse = (targets)=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
};
const rotate = (targets)=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
};
const slideInBottom = (targets, delay = 0)=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
};
const bounceIn = (targets, delay = 0)=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
};
const shake = (targets)=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
};
const waveText = (targets)=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    const textWrapper = undefined;
};
const pageTransition = (targets)=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
};
const buttonRipple = (e)=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    const button = undefined;
    const rect = undefined;
    const x = undefined;
    const y = undefined;
    const ripple = undefined;
};
const animateNumber = (element, target, duration = 2000)=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    const obj = undefined;
};
const animateGradient = (targets)=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
};
}),
"[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Proje Klosörü/React/flagship/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Proje Klosörü/React/flagship/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Proje Klosörü/React/flagship/node_modules/firebase/auth/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Proje Klosörü/React/flagship/node_modules/@firebase/auth/dist/node-esm/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/lib/firebase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Proje Klosörü/React/flagship/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firestore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/lib/firestore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$animations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/lib/animations.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function DashboardPage() {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [organizations, setOrganizations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showCreateForm, setShowCreateForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        name: '',
        slug: ''
    });
    const [creating, setCreating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const navRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const welcomeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const contentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        document.title = 'Organizations | Flagship';
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Initial page animations
        if (!loading && user) {
            if (navRef.current) (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$animations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fadeIn"])(navRef.current, 0);
            if (welcomeRef.current) (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$animations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["slideInBottom"])(welcomeRef.current, 200);
            if (contentRef.current) (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$animations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fadeIn"])(contentRef.current, 400);
            // Stagger organization cards
            setTimeout(()=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$animations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["staggerFadeIn"])('.org-card');
            }, 600);
        }
    }, [
        loading,
        user
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["onAuthStateChanged"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auth"], async (user)=>{
            if (user) {
                setUser(user);
                await loadOrganizations(user.uid);
            } else {
                router.push('/login');
            }
            setLoading(false);
        });
        return ()=>unsubscribe();
    }, [
        router
    ]);
    const loadOrganizations = async (userId)=>{
        try {
            const orgs = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firestore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getUserOrganizations"])(userId);
            setOrganizations(orgs);
        } catch (error) {
            console.error('Error loading organizations:', error);
        }
    };
    const handleLogout = async ()=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signOut"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auth"]);
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };
    const handleCreateOrg = async (e)=>{
        e.preventDefault();
        if (!user) return;
        setCreating(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$firestore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createOrganization"])({
                name: formData.name,
                slug: formData.slug,
                createdBy: user.uid
            });
            setFormData({
                name: '',
                slug: ''
            });
            setShowCreateForm(false);
            await loadOrganizations(user.uid);
        } catch (error) {
            console.error('Error creating organization:', error);
            alert('Hata: ' + error.message);
        } finally{
            setCreating(false);
        }
    };
    const generateSlug = (name)=>{
        return name.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-gray-600",
                children: "Yükleniyor..."
            }, void 0, false, {
                fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                lineNumber: 118,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
            lineNumber: 117,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gradient-to-br from-gray-50 to-gray-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                ref: navRef,
                className: "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50 opacity-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center h-16",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: "/FlagShip-logo-transparent.png",
                                        alt: "Flagship Logo",
                                        className: "w-14 h-14 object-contain"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                        lineNumber: 130,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "text-lg sm:text-xl font-bold bg-gradient-to-r from-[#0066FF] to-[#00B8D4] bg-clip-text text-transparent",
                                                children: "Flagship"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                lineNumber: 136,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-gray-500",
                                                children: "Feature Flags Platform"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                lineNumber: 139,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                        lineNumber: 135,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                lineNumber: 129,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-[#0066FF]/10 to-[#00B8D4]/10 rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-2 h-2 bg-green-500 rounded-full animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                lineNumber: 144,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs font-medium text-gray-700 truncate max-w-[150px]",
                                                children: user?.email
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                lineNumber: 145,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                        lineNumber: 143,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: (e)=>{
                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$animations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buttonRipple"])(e);
                                            handleLogout();
                                        },
                                        className: "px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:shadow-lg hover:shadow-red-500/40 rounded-lg transition-all duration-300",
                                        children: "Sign Out"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                        lineNumber: 147,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                lineNumber: 142,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                        lineNumber: 128,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                    lineNumber: 127,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "max-w-7xl mx-auto py-8 sm:px-6 lg:px-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-4 sm:px-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            ref: welcomeRef,
                            className: "mb-8 p-6 bg-gradient-to-r from-[#0066FF] to-[#00B8D4] rounded-2xl shadow-xl text-white opacity-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-2xl sm:text-3xl font-bold mb-2",
                                                children: "Welcome back! 👋"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                lineNumber: 167,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white/90",
                                                children: "Manage your organizations and feature flags"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                lineNumber: 168,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                        lineNumber: 166,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hidden md:block",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-4xl",
                                                children: "🚀"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                lineNumber: 172,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                            lineNumber: 171,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                        lineNumber: 170,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                lineNumber: 165,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                            lineNumber: 164,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            ref: contentRef,
                            className: "flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 opacity-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-2xl sm:text-3xl font-bold text-gray-900 mb-2",
                                            children: "Organizations"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                            lineNumber: 181,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-600",
                                            children: "Select or create an organization to get started"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                            lineNumber: 182,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                    lineNumber: 180,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowCreateForm(!showCreateForm),
                                    className: "w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#0066FF] to-[#00B8D4] text-white rounded-lg hover:shadow-lg hover:shadow-[#0066FF]/40 font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105",
                                    children: showCreateForm ? '✕ Cancel' : '+ New Organization'
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                    lineNumber: 184,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                            lineNumber: 179,
                            columnNumber: 11
                        }, this),
                        showCreateForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-8 animate-fadeIn",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl font-bold text-gray-900",
                                                children: "Create New Organization"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                lineNumber: 197,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowCreateForm(false),
                                                className: "text-gray-400 hover:text-gray-600 transition-colors",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-6 h-6",
                                                    fill: "none",
                                                    stroke: "currentColor",
                                                    viewBox: "0 0 24 24",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M6 18L18 6M6 6l12 12"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                        lineNumber: 203,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                    lineNumber: 202,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                lineNumber: 198,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                        lineNumber: 196,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: handleCreateOrg,
                                        className: "space-y-5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-semibold text-gray-700 mb-2",
                                                        children: "Organization Name"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                        lineNumber: 209,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        required: true,
                                                        value: formData.name,
                                                        onChange: (e)=>{
                                                            setFormData({
                                                                name: e.target.value,
                                                                slug: generateSlug(e.target.value)
                                                            });
                                                        },
                                                        className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all text-gray-900",
                                                        placeholder: "Acme Inc."
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                        lineNumber: 212,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                lineNumber: 208,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-sm font-semibold text-gray-700 mb-2",
                                                        children: "Slug (URL)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                        lineNumber: 227,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        required: true,
                                                        value: formData.slug,
                                                        onChange: (e)=>setFormData({
                                                                ...formData,
                                                                slug: e.target.value
                                                            }),
                                                        className: "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all text-gray-900 font-mono text-sm",
                                                        placeholder: "acme-inc"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                        lineNumber: 230,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-500 mt-2 flex items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "mr-1",
                                                                children: "🔗"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                                lineNumber: 239,
                                                                columnNumber: 23
                                                            }, this),
                                                            "URL: ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                className: "ml-1 text-[#0066FF]",
                                                                children: [
                                                                    "flagship.com/",
                                                                    formData.slug || 'slug'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                                lineNumber: 240,
                                                                columnNumber: 28
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                        lineNumber: 238,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                lineNumber: 226,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "submit",
                                                disabled: creating,
                                                className: "w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/40 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]",
                                                children: creating ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex items-center justify-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "animate-spin -ml-1 mr-3 h-5 w-5 text-white",
                                                            xmlns: "http://www.w3.org/2000/svg",
                                                            fill: "none",
                                                            viewBox: "0 0 24 24",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                    className: "opacity-25",
                                                                    cx: "12",
                                                                    cy: "12",
                                                                    r: "10",
                                                                    stroke: "currentColor",
                                                                    strokeWidth: "4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                                    lineNumber: 251,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    className: "opacity-75",
                                                                    fill: "currentColor",
                                                                    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                                    lineNumber: 252,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                            lineNumber: 250,
                                                            columnNumber: 25
                                                        }, this),
                                                        "Creating..."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                    lineNumber: 249,
                                                    columnNumber: 23
                                                }, this) : '✓ Create Organization'
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                lineNumber: 243,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                        lineNumber: 207,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                lineNumber: 195,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                            lineNumber: 194,
                            columnNumber: 13
                        }, this),
                        organizations.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#0066FF]/10 to-[#00B8D4]/10 rounded-full flex items-center justify-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-4xl",
                                        children: "🏢"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                        lineNumber: 269,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                    lineNumber: 268,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-xl font-bold text-gray-900 mb-2",
                                    children: "No organizations yet"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                    lineNumber: 271,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-600 mb-6",
                                    children: "Create your first organization to start managing feature flags"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                    lineNumber: 272,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowCreateForm(true),
                                    className: "inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#0066FF] to-[#00B8D4] text-white rounded-lg hover:shadow-lg hover:shadow-[#0066FF]/40 font-semibold transition-all duration-300 transform hover:scale-105",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "mr-2",
                                            children: "+"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                            lineNumber: 277,
                                            columnNumber: 17
                                        }, this),
                                        "Create Your First Organization"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                    lineNumber: 273,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                            lineNumber: 267,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                            children: organizations.map((org)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    onClick: ()=>router.push(`/dashboard/${org.slug}`),
                                    onMouseEnter: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$animations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cardHover"])(e.currentTarget),
                                    onMouseLeave: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$apps$2f$dashboard$2f$lib$2f$animations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cardHoverEnd"])(e.currentTarget),
                                    className: "org-card group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#0066FF]/30 cursor-pointer opacity-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-2 bg-gradient-to-r from-[#0066FF] to-[#00B8D4]"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                            lineNumber: 292,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between mb-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 min-w-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "text-lg font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors truncate mb-2",
                                                                    children: org.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                                    lineNumber: 298,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center text-xs text-gray-500 space-x-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: "🔗"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                                            lineNumber: 302,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                                            className: "font-mono bg-gray-100 px-2 py-1 rounded",
                                                                            children: [
                                                                                "/",
                                                                                org.slug
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                                            lineNumber: 303,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                                    lineNumber: 301,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                            lineNumber: 297,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "ml-3 flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#0066FF]/10 to-[#00B8D4]/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-2xl",
                                                                children: "🏢"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                                lineNumber: 309,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                            lineNumber: 308,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                    lineNumber: 296,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between pt-4 border-t border-gray-100",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-gray-500",
                                                            children: org.createdAt?.toDate?.()?.toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            }) || 'New'
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                            lineNumber: 315,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center text-[#0066FF] group-hover:translate-x-1 transition-transform",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm font-medium mr-1",
                                                                    children: "Open"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                                    lineNumber: 323,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "w-4 h-4",
                                                                    fill: "none",
                                                                    stroke: "currentColor",
                                                                    viewBox: "0 0 24 24",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Proje__Klos$f6$r$fc2f$React$2f$flagship$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        strokeLinecap: "round",
                                                                        strokeLinejoin: "round",
                                                                        strokeWidth: 2,
                                                                        d: "M9 5l7 7-7 7"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                                        lineNumber: 325,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                                    lineNumber: 324,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                            lineNumber: 322,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                                    lineNumber: 314,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                            lineNumber: 295,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, org.id, true, {
                                    fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                                    lineNumber: 284,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                            lineNumber: 282,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                    lineNumber: 162,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
                lineNumber: 161,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Proje Klosörü/React/flagship/apps/dashboard/app/dashboard/page.tsx",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a4e792bc._.js.map