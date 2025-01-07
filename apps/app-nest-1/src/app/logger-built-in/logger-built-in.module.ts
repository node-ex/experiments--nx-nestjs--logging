import { ConsoleLogger, Logger, Module } from '@nestjs/common';
import { LoggersBuiltInController } from './loggers-built-in.controller';

@Module({
  controllers: [LoggersBuiltInController],
  providers: [Logger, ConsoleLogger],
})
export class LoggerBuiltInModule {}
