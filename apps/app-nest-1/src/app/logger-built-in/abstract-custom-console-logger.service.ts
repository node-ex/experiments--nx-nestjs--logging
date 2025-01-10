import { ConsoleLogger, LogLevel } from '@nestjs/common';
import { isFunction, isPlainObject } from '@nestjs/common/utils/shared.utils';

export abstract class AbstractCustomConsoleLogger extends ConsoleLogger {
  /**
   * @param stackOrContext Do not use for the structured logging
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override error(message: any, stackOrContext?: string): void;
  /**
   * @param stack Do not use for the structured logging
   */
  // eslint-disable-next-line @typescript-eslint/unified-signatures, @typescript-eslint/no-explicit-any
  override error(message: any, stack?: string, context?: string): void;
  override error(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    message: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...optionalParams: [...any, string?, string?]
  ): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override error(message: any, ...optionalParams: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    super.error(message, ...optionalParams);
  }

  /**
   * Could be used for both the structured and unstructured logging
   */
  protected override getTimestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Built-in implementation should be used only for the unstructured logging
   */
  protected override printMessages(
    messages: unknown[],
    context = '',
    logLevel: LogLevel = 'log',
    writeStreamType?: 'stdout' | 'stderr',
  ): void {
    super.printMessages(messages, context, logLevel, writeStreamType);
  }

  /**
   * Should be used only for the unstructured logging in general
   */
  protected override formatPid(pid: number): string {
    return super.formatPid(pid);
  }

  /**
   * Should be used only for the unstructured logging in general
   */
  protected override formatContext(context: string): string {
    return super.formatContext(context);
  }

  /**
   * Should be used only for the unstructured logging in general
   */
  protected override formatMessage(
    logLevel: LogLevel,
    message: unknown,
    pidMessage: string,
    formattedLogLevel: string,
    contextMessage: string,
    timestampDiff: string,
  ): string {
    return super.formatMessage(
      logLevel,
      message,
      pidMessage,
      formattedLogLevel,
      contextMessage,
      timestampDiff,
    );
  }

  /**
   * Could be used for both the structured and unstructured logging, because
   * calls to the colorize method were removed.
   *
   * Otherwise a copy-paste of the built-in implementation:
   * https://github.com/nestjs/nest/blob/master/packages/common/services/console-logger.service.ts
   */
  protected override stringifyMessage(
    message: unknown,
    logLevel: LogLevel,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    if (isFunction(message)) {
      const messageAsStr = Function.prototype.toString.call(message);
      const isClass = messageAsStr.startsWith('class ');
      if (isClass) {
        // If the message is a class, we will display the class name.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.stringifyMessage(message.name, logLevel);
      }
      // If the message is a non-class function, call it and re-resolve its value.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.stringifyMessage(message(), logLevel);
    }

    return isPlainObject(message) || Array.isArray(message)
      ? `Object:\n${JSON.stringify(
          message,
          (_key, value) =>
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            typeof value === 'bigint' ? value.toString() : value,
          2,
        )}\n`
      : message;
  }

  /**
   * Built-in implementation should be used only for the unstructured logging
   */
  protected override colorize(message: string, logLevel: LogLevel): string {
    return super.colorize(message, logLevel);
  }

  /**
   * Built-in implementation should be used only for the unstructured logging
   */
  protected override printStackTrace(stack: string): void {
    super.printStackTrace(stack);
  }

  /**
   * Should be used only for the unstructured logging
   */
  protected override updateAndGetTimestampDiff(): string {
    return super.updateAndGetTimestampDiff();
  }

  /**
   * Should be used only for the unstructured logging
   */
  protected override formatTimestampDiff(timestampDiff: number) {
    return super.formatTimestampDiff(timestampDiff);
  }
}
