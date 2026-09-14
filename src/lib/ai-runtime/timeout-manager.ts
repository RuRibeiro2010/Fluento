/**
 * FLUENTO AI RUNTIME - TIMEOUT MANAGER
 * 
 * Enforces strict request execution timeouts to prevent hanging calls.
 */

export class TimeoutManager {
  /**
   * Wraps a promise with a timeout. Rejects if timeoutMs passes before completion.
   */
  public async executeWithTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number = 8000,
    errorMessage: string = 'Operation timed out'
  ): Promise<T> {
    let timer: NodeJS.Timeout;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(new Error(`${errorMessage} (${timeoutMs}ms)`));
      }, timeoutMs);
    });

    try {
      const result = await Promise.race([promise, timeoutPromise]);
      clearTimeout(timer!);
      return result;
    } catch (err) {
      clearTimeout(timer!);
      throw err;
    }
  }
}

export const timeoutManager = new TimeoutManager();
