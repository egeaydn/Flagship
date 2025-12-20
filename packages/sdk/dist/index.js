"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  FlagshipClient: () => FlagshipClient,
  createClient: () => createClient
});
module.exports = __toCommonJS(index_exports);
var FlagshipClient = class {
  constructor(config) {
    this.cache = null;
    this.config = {
      apiKey: config.apiKey,
      apiUrl: config.apiUrl || "http://localhost:3000/api/v1",
      cacheTTL: config.cacheTTL || 6e4
      // 1 minute default
    };
  }
  async getFlags(user) {
    if (this.cache && Date.now() - this.cache.timestamp < this.config.cacheTTL) {
      return this.cache.data;
    }
    const response = await fetch(`${this.config.apiUrl}/flags`, {
      method: "POST",
      headers: {
        "x-api-key": this.config.apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ user: user || {} })
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(`Flagship API error: ${error.error || response.statusText}`);
    }
    const data = await response.json();
    this.cache = {
      data,
      timestamp: Date.now()
    };
    return data;
  }
  isEnabled(flagKey, flags) {
    const flag = flags.flags[flagKey];
    return flag ? flag.enabled : false;
  }
  getValue(flagKey, flags, defaultValue) {
    const flag = flags.flags[flagKey];
    if (!flag || !flag.enabled) {
      return defaultValue;
    }
    return flag.value;
  }
  clearCache() {
    this.cache = null;
  }
};
function createClient(config) {
  return new FlagshipClient(config);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FlagshipClient,
  createClient
});
