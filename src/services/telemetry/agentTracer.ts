export interface AgentTraceEvent {
  id: string;
  timestamp: string;
  action: 'check_status' | 'generate_quest' | 'validate_schema' | 'trigger_fallback' | 'adventure_completed';
  provider: 'gemma' | 'rule-based' | 'mock';
  modelName: string;
  durationMs?: number;
  success: boolean;
  errorType?: string;
  metadata?: Record<string, string | number | boolean>;
}

class AgentTracerService {
  private traces: AgentTraceEvent[] = [];
  private dsn: string;
  private isEnabled: boolean;

  constructor() {
    this.dsn = import.meta.env.VITE_SENTRY_DSN || '';
    this.isEnabled = !!this.dsn;
  }

  /**
   * Log an agent step trace safely without leaking user reflections or photos.
   */
  public logTrace(event: Omit<AgentTraceEvent, 'id' | 'timestamp'>): void {
    const trace: AgentTraceEvent = {
      ...event,
      id: `trace-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString()
    };

    this.traces.push(trace);
    // Keep last 50 in-memory traces for diagnostic display in settings
    if (this.traces.length > 50) {
      this.traces.shift();
    }

    // Diagnostic console output in development
    if (import.meta.env.DEV) {
      console.debug(`[AgentTracer] ${trace.action} (${trace.provider}:${trace.modelName}) - ${trace.success ? 'OK' : 'FAIL'} in ${trace.durationMs || 0}ms`, trace.metadata || '');
    }

    // If Sentry DSN is configured, dispatch telemetry (without PII)
    if (this.isEnabled) {
      this.dispatchToSentry(trace);
    }
  }

  private dispatchToSentry(trace: AgentTraceEvent) {
    try {
      // Safe non-blocking telemetry envelope (strictly anonymous metadata)
      const payload = {
        event_id: trace.id.replace(/[^a-f0-9]/gi, '').padEnd(32, '0').slice(0, 32),
        timestamp: trace.timestamp,
        level: trace.success ? 'info' : 'error',
        logger: 'wildquest.ai.agent_tracer',
        message: `Agent ${trace.action} using ${trace.provider} (${trace.modelName})`,
        tags: {
          action: trace.action,
          provider: trace.provider,
          model: trace.modelName,
          success: String(trace.success)
        },
        extra: {
          durationMs: trace.durationMs,
          errorType: trace.errorType,
          ...trace.metadata
        }
      };

      // Best effort telemetry if DSN endpoint exists
      if (this.dsn.startsWith('http')) {
        navigator.sendBeacon?.(this.dsn, JSON.stringify(payload));
      }
    } catch {
      // Telemetry should never crash the main application
    }
  }

  public getRecentTraces(): AgentTraceEvent[] {
    return [...this.traces];
  }
}

export const agentTracer = new AgentTracerService();
