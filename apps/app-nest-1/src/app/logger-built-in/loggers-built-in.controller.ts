import { ConsoleLogger, Controller, Get, Logger } from '@nestjs/common';

@Controller('loggers/built-in')
export class LoggersBuiltInController {
  private readonly localLogger = new Logger(this.constructor.name);
  private readonly localConsoleLogger = new ConsoleLogger(
    this.constructor.name,
  );

  constructor(
    private readonly injectedLogger: Logger,
    private readonly injectedConsoleLogger: ConsoleLogger,
  ) {}

  @Get('logger/global')
  useGlobalLogger() {
    Logger.log('static method of Logger class', this.constructor.name);
  }

  @Get('logger/local')
  useLocalLogger() {
    this.localLogger.log('local Logger instance');
  }

  @Get('console-logger/local')
  useLocalConsoleLogger() {
    this.localConsoleLogger.log('local ConsoleLogger instance');
  }

  @Get('logger/injected')
  useInjectedLogger() {
    this.injectedLogger.log('injected Logger instance');
  }

  @Get('console-logger/injected')
  useInjectedConsoleLogger() {
    this.injectedConsoleLogger.log('injected ConsoleLogger instance');
  }
}
