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
      const metaLine = this.formatAndColorizeMetaLine(logLevel);
      const debugLine = this.formatAndColorizeDebugLine();
      const messageLine = this.formatAndColorizeMessageLine(
        logLevel,
        context,
        message,
      );

      const output = this.formatAndColorizeOutput(
        metaLine,
        debugLine,
        messageLine,
      );

      process[writeStreamType ?? 'stdout'].write(output);
    });
  }

  protected formatAndColorizeMetaLine(logLevel: LogLevel): string {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const entryMode = this.clsService.get('entryMode') ?? 'system';
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const correlationId = this.clsService.getId() ?? null;

    const formattedLogLevel = logLevel.toUpperCase().padEnd(7, ' ');
    const formattedTimestamp = this.getTimestamp();
    const formattedPid = process.pid.toString().padStart(7, ' ');
    const formattedEntryMode = entryMode.padEnd(6, ' ');
    const formattedCorrelationId = String(correlationId).padEnd(36, ' ');
    const formattedTimestampDiff = this.updateAndGetTimestampDiff();

    const colorizedLogLevel = this.colorize(formattedLogLevel, logLevel);
    const colorizedTimestamp = this.colorize(formattedTimestamp, logLevel);
    const colorizedPid = this.colorize(formattedPid, logLevel);
    const colorizedEntryMode = this.colorize(formattedEntryMode, logLevel);
    const colorizedCorrelationId = this.colorize(
      formattedCorrelationId,
      logLevel,
    );
    const colorizedTimestampDiff = formattedTimestampDiff;

    const line = `${colorizedLogLevel} ${colorizedTimestamp} ${colorizedPid} ${colorizedEntryMode} ${colorizedCorrelationId} ${colorizedTimestampDiff}`;

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
    logLevel: LogLevel,
    context: string,
    message: unknown,
  ): string {
    const formattedContext = context;
    const formattedMessage = this.stringifyMessage(message, logLevel) as string;

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
