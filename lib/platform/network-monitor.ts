/**
 * Network Monitor Module (Production & Reliability Platform - Phase 14)
 * Monitors connection status, latency, and throughput to adapt media quality,
 * speech synthesis bitrate, or switch to low-bandwidth text modes.
 */

export interface NetworkState {
  isOnline: boolean;
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  recommendedAudioQuality: 'low' | 'medium' | 'high';
  shouldUseTextFallback: boolean;
}

export function getCurrentNetworkState(): NetworkState {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      isOnline: true,
      effectiveType: '4g',
      recommendedAudioQuality: 'high',
      shouldUseTextFallback: false,
    };
  }

  const isOnline = navigator.onLine;
  const navAny = navigator as unknown as { connection?: { effectiveType?: string } };
  const effectiveType = (navAny.connection?.effectiveType as NetworkState['effectiveType']) || '4g';

  let recommendedAudioQuality: NetworkState['recommendedAudioQuality'] = 'high';
  let shouldUseTextFallback = false;

  if (!isOnline || effectiveType === 'slow-2g' || effectiveType === '2g') {
    recommendedAudioQuality = 'low';
    shouldUseTextFallback = true;
  } else if (effectiveType === '3g') {
    recommendedAudioQuality = 'medium';
  }

  return {
    isOnline,
    effectiveType,
    recommendedAudioQuality,
    shouldUseTextFallback,
  };
}

export function subscribeToNetworkChanges(callback: (state: NetworkState) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleStatusChange = () => {
    callback(getCurrentNetworkState());
  };

  window.addEventListener('online', handleStatusChange);
  window.addEventListener('offline', handleStatusChange);

  return () => {
    window.removeEventListener('online', handleStatusChange);
    window.removeEventListener('offline', handleStatusChange);
  };
}
