import { ConsoleLogger, Controller, Get, Logger } from '@nestjs/common';

@Controller('logger/built-in')
export class LoggerBuiltInController {
  private readonly localLogger = new Logger(this.constructor.name);
  private readonly localConsoleLogger = new ConsoleLogger(
    this.constructor.name,
  );

  constructor(
    private readonly injectedLogger: Logger,
    private readonly injectedConsoleLogger: ConsoleLogger,
  ) {}

  @Get()
  getData() {
    Logger.log('global Logger instance', this.constructor.name);

    this.localLogger.log('provider specific Logger instance');
    this.localConsoleLogger.log('provider specific ConsoleLogger instance');
    this.injectedLogger.log(
      'injected LoggerService instance',
      this.constructor.name,
    );
    this.injectedConsoleLogger.log(
      'injected ConsoleLoggerService instance',
      this.constructor.name,
    );

    return { message: this.constructor.name };
  }
}
