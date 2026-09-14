/**
 * State Synchronization Module (Production & Reliability Platform - Phase 14)
 * Manages cross-device state checksums, optimistic UI updates,
 * and background conflict resolution for seamless switching between mobile and desktop.
 */

export interface SyncStatePayload {
  userId: string;
  version: number;
  profileData: Record<string, unknown>;
  progressData: Record<string, unknown>;
  checksum: string;
}

export function generateStateChecksum(data: Record<string, unknown>): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return `chk_${Math.abs(hash)}`;
}

export function synchronizeLocalAndRemoteState(
  localPayload: SyncStatePayload,
  remotePayload?: SyncStatePayload
): SyncStatePayload {
  if (!remotePayload) return localPayload;

  // Favor higher state version
  if (remotePayload.version > localPayload.version) {
    return remotePayload;
  }

  return localPayload;
}
