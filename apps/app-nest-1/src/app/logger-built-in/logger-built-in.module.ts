import { ConsoleLogger, Logger, Module } from '@nestjs/common';

import { LoggerBuiltInController } from './logger-built-in.controller';

@Module({
  controllers: [LoggerBuiltInController],
  providers: [Logger, ConsoleLogger],
})
export class LoggerBuiltInModule {}
