import { ConsoleLoggerOptions } from '@nestjs/common';

export interface ICustomConsoleLoggerOptions extends ConsoleLoggerOptions {
  showDebugInfo?: boolean | undefined;
}
