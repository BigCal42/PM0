/**
 * Simple logger with optional Sentry integration
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

class ConsoleLogger implements Logger {
  private shouldLog(level: LogLevel): boolean {
    if (import.meta.env.DEV) return true;
    return level !== 'debug';
  }

  debug(...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.debug('[DEBUG]', ...args);
    }
  }

  info(...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info('[INFO]', ...args);
    }
  }

  warn(...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn('[WARN]', ...args);
    }
  }

  error(...args: unknown[]): void {
    if (this.shouldLog('error')) {
      console.error('[ERROR]', ...args);
    }
  }
}

// Future: Integrate Sentry if env.sentryDsn is provided
export const logger = new ConsoleLogger();

