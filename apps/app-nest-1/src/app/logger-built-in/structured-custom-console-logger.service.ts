import { ConsoleLoggerOptions, LogLevel, Optional } from '@nestjs/common';
import { AbstractCustomConsoleLogger } from './abstract-custom-console-logger.service';

export interface StructuredConsoleLoggerOutput {
  timestamp: string;
  pid: number;
  context: string;
  level: LogLevel;
  message: string;
}

export interface StructuredLoggingOptions {
  prettyPrint?: boolean | undefined;
}

export class StructuredCustomConsoleLogger extends AbstractCustomConsoleLogger {
  /**
   * Modified to include the structured logging options
   *
   * Otherwise a copy-paste of the built-in implementation:
   * https://github.com/nestjs/nest/blob/master/packages/common/services/console-logger.service.ts
   */
  constructor();
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  constructor(context: string);
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  constructor(context: string, options: ConsoleLoggerOptions);
  constructor(
    context: string,
    options: ConsoleLoggerOptions,
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    structuredLoggingOptions: StructuredLoggingOptions,
  );
  constructor(
    @Optional()
    context?: string,
    @Optional()
    options: ConsoleLoggerOptions = {},
    @Optional()
    protected structuredLoggingOptions: StructuredLoggingOptions = {},
  ) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    super(context!, options);
  }

  /**
   * Modified for the structured logging
   */
  protected override printMessages(
    messages: unknown[],
    context = '',
    logLevel: LogLevel = 'log',
    writeStreamType?: 'stdout' | 'stderr',
  ): void {
    messages.forEach((message) => {
      const messageObject: StructuredConsoleLoggerOutput = {
        timestamp: this.getTimestamp(),
        pid: process.pid,
        context,
        level: logLevel,
        message: this.stringifyMessage(message, logLevel) as string,
      };

      let serializedMessage = '';
      if (this.structuredLoggingOptions.prettyPrint) {
        serializedMessage = JSON.stringify(messageObject, null, 2);
      } else {
        serializedMessage = JSON.stringify(messageObject);
      }

      this.printMessage(serializedMessage, writeStreamType);
    });
  }

  /**
   * Modified so that it does not colorize the message
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected override colorize(message: string, _logLevel: LogLevel): string {
    return message;
  }

  /**
   * New method
   */
  protected printMessage(
    message: string,
    writeStreamType?: 'stdout' | 'stderr',
  ): void {
    process[writeStreamType ?? 'stdout'].write(message + '\n');
  }
}
