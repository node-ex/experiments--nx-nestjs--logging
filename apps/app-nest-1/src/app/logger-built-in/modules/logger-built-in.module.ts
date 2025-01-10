import { ConsoleLogger, Logger, Module } from '@nestjs/common';
import { LoggersBuiltInController } from '../controllers/loggers-built-in.controller';
import { CustomConsoleLoggerController } from '../controllers/custom-console-logger.controller';
import { CustomConsoleLoggerFactoryService } from '../services/custom-console-logger-factory.service';

@Module({
  controllers: [LoggersBuiltInController, CustomConsoleLoggerController],
  providers: [Logger, ConsoleLogger, CustomConsoleLoggerFactoryService],
})
export class LoggerBuiltInModule {}
