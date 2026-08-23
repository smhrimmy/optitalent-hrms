export interface DomainEvent<T = any> {
    eventId: string;
    companyId: string;
    type: string;
    actorId: string;
    entityType: string;
    entityId: string;
    timestamp: string;
    version: number;
    payload: T;
}

export type EventHandler = (event: DomainEvent) => Promise<void>;
