import { ConsoleLogger, Logger, Module } from '@nestjs/common';
import { LoggersBuiltInController } from './loggers-built-in.controller';
import { CustomConsoleLoggerController } from './custom-console-logger.controller';
import { CustomConsoleLoggerFactoryService } from './custom-console-logger-factory.service';

@Module({
  controllers: [LoggersBuiltInController, CustomConsoleLoggerController],
  providers: [Logger, ConsoleLogger, CustomConsoleLoggerFactoryService],
})
export class LoggerBuiltInModule {}
