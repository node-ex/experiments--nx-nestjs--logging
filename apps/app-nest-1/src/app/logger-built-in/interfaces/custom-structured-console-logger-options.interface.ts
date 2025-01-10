import { ICustomConsoleLoggerOptions } from './custom-console-logger-options.interface';

export interface ICustomStructuredConsoleLoggerOptions
  extends ICustomConsoleLoggerOptions {
  prettyPrint?: boolean | undefined;
}
