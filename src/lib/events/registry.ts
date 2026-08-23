import { DomainEvent, EventHandler } from './types';

export class EventRegistry {
    private handlers: Map<string, EventHandler[]> = new Map();

    /**
     * Subscribes a projection/intelligence handler to a specific event type.
     */
    subscribe(eventType: string, handler: EventHandler): void {
        const existing = this.handlers.get(eventType) || [];
        existing.push(handler);
        this.handlers.set(eventType, existing);
    }

    /**
     * Publishes a domain event to all subscribed projections.
     * In a real system, this would push to Kafka/SQS to guarantee delivery.
     * For now, it executes synchronously in memory.
     */
    async publish(event: DomainEvent): Promise<void> {
        const handlers = this.handlers.get(event.type) || [];
        
        for (const handler of handlers) {
            try {
                await handler(event);
            } catch (error) {
                console.error(`Projection failed for event ${event.eventId}:`, error);
                // In production, send to Dead Letter Queue (DLQ)
            }
        }
    }
}

export const eventRegistry = new EventRegistry();
