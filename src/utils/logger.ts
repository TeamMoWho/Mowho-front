/**
 * Logger Utility
 * 개발 환경에서만 로그를 출력합니다
 */

enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

class Logger {
  private isDevelopment: boolean = __DEV__;

  private formatLog(level: LogLevel, message: string, data?: any): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;

    if (data) {
      console.log(logMessage, data);
    } else {
      console.log(logMessage);
    }
  }

  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      this.formatLog(LogLevel.DEBUG, message, data);
    }
  }

  info(message: string, data?: any): void {
    this.formatLog(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any): void {
    console.warn(`[WARN] ${message}`, data);
  }

  error(message: string, error?: Error | any): void {
    console.error(`[ERROR] ${message}`, error);
  }
}

export const logger = new Logger();
