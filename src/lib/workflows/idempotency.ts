// Idempotency tracking to ensure actions do not run multiple times across retries

class IdempotencyTracker {
  private keys: Set<string> = new Set();

  /**
   * Generates a unique key for a workflow execution step
   */
  generateKey(executionId: string, nodeId: string): string {
    return `${executionId}::${nodeId}`;
  }

  /**
   * Attempts to lock the key. Returns true if lock was acquired (first execution).
   * Returns false if key already exists (has been executed).
   */
  async acquireLock(key: string): Promise<boolean> {
    // In production, this would be a Redis SETNX or Postgres unique insert
    if (this.keys.has(key)) {
      return false;
    }
    this.keys.add(key);
    return true;
  }

  /**
   * Releases a lock if an action failed and is safe to retry
   */
  async releaseLock(key: string): Promise<void> {
    this.keys.delete(key);
  }
}

export const idempotency = new IdempotencyTracker();
