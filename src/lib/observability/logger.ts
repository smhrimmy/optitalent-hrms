/**
 * Centralized Structured Logger for Enterprise Observability.
 * Ensures consistent log formats for easy ingestion into Datadog/Splunk/CloudWatch.
 */

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
export type LogCategory = 'SECURITY' | 'API' | 'WORKFLOW' | 'AI_AGENT' | 'DATABASE' | 'SYSTEM';

export interface LogEvent {
    timestamp: string;
    level: LogLevel;
    category: LogCategory;
    companyId?: string;
    userId?: string;
    message: string;
    metadata?: Record<string, any>;
    latencyMs?: number;
}

export class ObservabilityLogger {
    // MOCK in-memory storage for the Admin Dashboard to read from.
    // In production, this would stream to stdout or a logging sidecar.
    private static recentLogs: LogEvent[] = [];
    private static readonly MAX_LOGS = 1000;

    static log(
        level: LogLevel, 
        category: LogCategory, 
        message: string, 
        context: { companyId?: string, userId?: string, metadata?: Record<string, any>, latencyMs?: number } = {}
    ) {
        const event: LogEvent = {
            timestamp: new Date().toISOString(),
            level,
            category,
            message,
            ...context
        };

        // Output structured JSON
        console.log(JSON.stringify(event));

        // Store for UI dashboard
        this.recentLogs.unshift(event);
        if (this.recentLogs.length > this.MAX_LOGS) {
            this.recentLogs.pop();
        }
    }

    static info(category: LogCategory, message: string, context?: any) {
        this.log('INFO', category, message, context);
    }

    static error(category: LogCategory, message: string, context?: any) {
        this.log('ERROR', category, message, context);
    }

    static getRecentLogs(limit: number = 50, categoryFilter?: LogCategory): LogEvent[] {
        if (categoryFilter) {
            return this.recentLogs.filter(l => l.category === categoryFilter).slice(0, limit);
        }
        return this.recentLogs.slice(0, limit);
    }
}
