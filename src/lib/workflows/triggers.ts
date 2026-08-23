// Trigger registry

export interface WorkflowEvent {
  eventType: string; // e.g., 'employee.created'
  companyId: string;
  initiatingUserId: string;
  payload: Record<string, any>;
}

export class TriggerEngine {
  private listeners: Map<string, Array<(event: WorkflowEvent) => Promise<void>>> = new Map();

  /**
   * Fires an event into the trigger engine.
   * This evaluates any active workflow triggers listening for this eventType.
   */
  async fire(event: WorkflowEvent): Promise<void> {
    const handlers = this.listeners.get(event.eventType) || [];
    for (const handler of handlers) {
       // Fire and forget (queue based in production)
       handler(event).catch(console.error);
    }
  }

  /**
   * Registers an active workflow trigger listener
   */
  on(eventType: string, handler: (event: WorkflowEvent) => Promise<void>) {
      const existing = this.listeners.get(eventType) || [];
      this.listeners.set(eventType, [...existing, handler]);
  }
}

export const triggerEngine = new TriggerEngine();

// At boot time, this would load all ACTIVE workflows and register their TriggerNodes with `triggerEngine.on`
