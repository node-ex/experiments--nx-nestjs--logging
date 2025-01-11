import { LogLevel, Optional } from '@nestjs/common';
import { AbstractCustomConsoleLogger } from './abstract-custom-console-logger.service';
import { ICustomStructuredConsoleLoggerOptions } from '../interfaces/custom-structured-console-logger-options.interface';
import { CallSitesUtils } from '../utils/call-sites.utils';

interface IStructuredConsoleLoggerOutputDebugInfo {
  codeLocation: string;
  typeName: string;
  callableName: string;
}

interface IStructuredConsoleLoggerOutput {
  timestamp: string;
  timestampDiff: string;
  pid: number;
  level: LogLevel;
  debug?: IStructuredConsoleLoggerOutputDebugInfo;
  context: string;
  message: string;
}

export class StructuredCustomConsoleLogger extends AbstractCustomConsoleLogger {
  /**
   * Modified to include structured logging options
   */
  constructor();
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  constructor(context: string);
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  constructor(context: string, options: ICustomStructuredConsoleLoggerOptions);
  constructor(
    @Optional()
    context?: string,
    @Optional()
    protected override options: ICustomStructuredConsoleLoggerOptions = {},
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
      const debug = this.getDebugInfo();

      const messageObject: IStructuredConsoleLoggerOutput = {
        timestamp: this.getTimestamp(),
        timestampDiff: this.updateAndGetTimestampDiff(),
        pid: process.pid,
        level: logLevel,
        ...(debug && { debug }),
        context,
        message: this.stringifyMessage(message, logLevel) as string,
      };

      let serializedMessage = '';
      if (this.options.prettyPrint) {
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

  protected printMessage(
    message: string,
    writeStreamType?: 'stdout' | 'stderr',
  ): void {
    process[writeStreamType ?? 'stdout'].write(message + '\n');
  }

  protected getDebugInfo(): IStructuredConsoleLoggerOutputDebugInfo | null {
    if (!this.options.showDebugInfo) {
      return null;
    }

    const codeLocation = CallSitesUtils.getCodeLocation(
      this.options.debugStackLevel,
    );
    const typeName = CallSitesUtils.getTypeName(this.options.debugStackLevel);
    const callableName = CallSitesUtils.getCallableName(
      this.options.debugStackLevel,
    );

    return {
      codeLocation,
      typeName,
      callableName,
    };
  }
}
