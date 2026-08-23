export interface ApiKey {
    id: string;
    companyId: string;
    name: string;
    keyHash: string; // Never store the plain key
    scopes: string[]; // e.g., 'employees:read', 'payroll:write'
    ipRestrictions?: string[];
    expiresAt?: Date;
    lastUsedAt?: Date;
    status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
    createdAt: Date;
    createdBy: string;
}

export interface WebhookSubscription {
    id: string;
    companyId: string;
    name: string;
    endpointUrl: string;
    events: string[]; // e.g., 'employee.created', 'payroll.finalized'
    secret: string; // Used to sign the payload (HMAC)
    status: 'ACTIVE' | 'INACTIVE' | 'FAILING';
    retryPolicy: {
        maxRetries: number;
        backoffMultiplier: number;
    };
    createdAt: Date;
}

export interface WebhookDelivery {
    id: string;
    subscriptionId: string;
    eventId: string;
    eventType: string;
    payload: any;
    status: 'PENDING' | 'SUCCESS' | 'FAILED';
    attempts: number;
    nextAttemptAt?: Date;
    lastError?: string;
    createdAt: Date;
}

export interface IntegrationMapping {
    id: string;
    companyId: string;
    system: string; // e.g., 'WORKDAY', 'OKTA'
    direction: 'INBOUND' | 'OUTBOUND';
    entityType: string; // e.g., 'Employee'
    fieldMappings: {
        internalField: string; // e.g., 'firstName'
        externalField: string; // e.g., 'given_name'
        transform?: string; // e.g., 'UPPERCASE', 'DATE_ISO'
    }[];
}

export interface OAuthClient {
    id: string;
    companyId: string;
    name: string;
    clientId: string;
    clientSecretHash: string;
    redirectUris: string[];
    allowedScopes: string[];
    status: 'ACTIVE' | 'REVOKED';
}
