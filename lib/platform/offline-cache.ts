/**
 * Offline Cache Module (Production & Reliability Platform - Phase 14)
 * Provides local storage caching for downloaded lesson assets, vocabulary lists,
 * and audio resources to ensure seamless continuity under spotty connectivity.
 */

export interface CachedAsset {
  key: string;
  data: unknown;
  timestampMs: number;
  expiresInMs: number;
}

const CACHE_PREFIX = 'fluento_offline_cache_';

export function setCachedData<T>(key: string, data: T, ttlMs: number = 3600000 * 24): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const entry: CachedAsset = {
        key,
        data,
        timestampMs: Date.now(),
        expiresInMs: ttlMs,
      };
      localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
    }
  } catch (error) {
    console.warn('[OfflineCache] Cache storage failed:', error);
  }
}

export function getCachedData<T>(key: string): T | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = localStorage.getItem(`${CACHE_PREFIX}${key}`);
      if (!raw) return null;
      const entry: CachedAsset = JSON.parse(raw);
      const isExpired = Date.now() - entry.timestampMs > entry.expiresInMs;
      if (isExpired) {
        localStorage.removeItem(`${CACHE_PREFIX}${key}`);
        return null;
      }
      return entry.data as T;
    }
  } catch (error) {
    console.warn('[OfflineCache] Cache retrieval failed:', error);
  }
  return null;
}

export function clearExpiredCache(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith(CACHE_PREFIX)) {
          const raw = localStorage.getItem(k);
          if (raw) {
            const entry: CachedAsset = JSON.parse(raw);
            if (Date.now() - entry.timestampMs > entry.expiresInMs) {
              localStorage.removeItem(k);
            }
          }
        }
      });
    }
  } catch (error) {
    console.warn('[OfflineCache] Clear expired cache failed:', error);
  }
}
