/**
 * FLUENTO AI RUNTIME - STREAMING MANAGER
 * 
 * Manages streaming subscriptions, buffer aggregation, and stream completion events.
 */

import { StreamChunk, SupportedProvider } from './types';

export class StreamingManager {
  /**
   * Aggregates chunks into a complete string while passing each delta to a subscriber.
   */
  public createStreamAggregator(onChunk?: (chunk: StreamChunk) => void): {
    handleChunk: (chunk: StreamChunk) => void;
    getAccumulatedContent: () => string;
  } {
    let accumulated = '';

    const handleChunk = (chunk: StreamChunk) => {
      if (chunk.delta) {
        accumulated += chunk.delta;
      }
      if (onChunk) {
        onChunk(chunk);
      }
    };

    const getAccumulatedContent = () => accumulated;

    return {
      handleChunk,
      getAccumulatedContent
    };
  }

  /**
   * Formats a stream chunk into a Server-Sent Events (SSE) data frame string.
   */
  public formatSseFrame(chunk: StreamChunk): string {
    return `data: ${JSON.stringify(chunk)}\n\n`;
  }
}

export const streamingManager = new StreamingManager();
