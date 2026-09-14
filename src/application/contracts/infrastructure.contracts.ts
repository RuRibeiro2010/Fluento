export interface IClockProvider {
  now(): Date;
  timestampMs(): number;
}

export interface ILogger {
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: unknown, context?: Record<string, unknown>): void;
  debug(message: string, context?: Record<string, unknown>): void;
}

export interface IUuidGenerator {
  generate(prefix?: string): string;
}

export interface INotificationProvider {
  sendNotification(recipientId: string, title: string, body: string, payload?: Record<string, unknown>): Promise<void>;
}

export interface IStorageProvider {
  saveFile(key: string, data: Uint8Array | Buffer, mimeType: string): Promise<string>;
  getFile(key: string): Promise<Uint8Array | null>;
  deleteFile(key: string): Promise<void>;
}

export interface IEventPublisher {
  publish(event: { eventName: string; aggregateId: string; occurredOn: Date; payload: unknown }): Promise<void>;
  publishAll(events: { eventName: string; aggregateId: string; occurredOn: Date; payload: unknown }[]): Promise<void>;
}
