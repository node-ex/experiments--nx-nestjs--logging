import { LogLevel } from '@nestjs/common';
import { clc } from '@nestjs/common/utils/cli-colors.util';
import { AbstractCustomConsoleLogger } from './abstract-custom-console-logger.service';
import { CallSitesUtils } from '../utils/call-sites.utils';

export class UnstructuredCustomConsoleLogger extends AbstractCustomConsoleLogger {
  /**
   * Modified to use a custom logging format
   *
   * Format:
   * Meta line: timestamp, pid, context, log level
   * Message line: context, message
   * Empty line
   */
  protected override printMessages(
    messages: unknown[],
    context = '',
    logLevel: LogLevel = 'log',
    writeStreamType?: 'stdout' | 'stderr',
  ) {
    messages.forEach((message) => {
      const formattedTimestamp = this.getTimestamp();
      const formattedPid = process.pid.toString().padStart(7, ' ');
      const formattedLogLevel = logLevel.toUpperCase().padEnd(7, ' ');
      const formattedTimestampDiff = this.updateAndGetTimestampDiff();

      const formattedContext = context;
      const formattedMessage = this.stringifyMessage(
        message,
        logLevel,
      ) as string;

      const metaLine = this.formatAndColorizeMetaLine(
        logLevel,
        formattedTimestamp,
        formattedPid,
        formattedLogLevel,
        formattedTimestampDiff,
      );

      const debugLine = this.formatAndColorizeDebugLine();

      const messageLine = this.formatAndColorizeMessageLine(
        formattedContext,
        formattedMessage,
      );

      const output = this.formatAndColorizeOutput(
        metaLine,
        debugLine,
        messageLine,
      );

      process[writeStreamType ?? 'stdout'].write(output);
    });
  }

  protected formatAndColorizeMetaLine(
    logLevel: LogLevel,
    formattedTimestamp: string,
    formattedPid: string,
    formattedLogLevel: string,
    formattedTimestampDiff: string,
  ): string {
    const colorizedTimestamp = this.colorize(formattedTimestamp, logLevel);
    const colorizedPid = this.colorize(formattedPid, logLevel);
    const colorizedLogLevel = this.colorize(formattedLogLevel, logLevel);
    const colorizedTimestampDiff = formattedTimestampDiff;

    const line = `${colorizedTimestamp} ${colorizedPid} ${colorizedLogLevel} ${colorizedTimestampDiff}`;

    return line;
  }

  protected formatAndColorizeDebugLine(): string | null {
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

    if (typeName) {
      return clc.bold(`${codeLocation}/${typeName}.${callableName}()`);
    }

    return clc.bold(`${codeLocation}/${callableName}()`);
  }

  protected formatAndColorizeMessageLine(
    formattedContext: string,
    formattedMessage: string,
  ): string {
    if (formattedContext) {
      const colorizedContext = clc.bold(formattedContext);
      return `${colorizedContext}: ${formattedMessage}`;
    }

    return formattedMessage;
  }

  protected formatAndColorizeOutput(
    metaLine: string,
    debugLine: string | null,
    messageLine: string,
  ): string {
    if (debugLine) {
      return `${metaLine}\n${debugLine}\n${messageLine}\n\n`;
    }

    return `${metaLine}\n${messageLine}\n\n`;
  }
}
