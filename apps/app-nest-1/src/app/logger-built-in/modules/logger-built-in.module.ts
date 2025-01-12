import { ConsoleLogger, Logger, Module } from '@nestjs/common';
import { LoggersBuiltInController } from '../controllers/loggers-built-in.controller';
import { CustomConsoleLoggerController } from '../controllers/custom-console-logger.controller';
import { CustomConsoleLoggerFactory } from '../services/custom-console-logger.factory';

@Module({
  controllers: [LoggersBuiltInController, CustomConsoleLoggerController],
  providers: [Logger, ConsoleLogger, CustomConsoleLoggerFactory],
})
export class LoggerBuiltInModule {}
