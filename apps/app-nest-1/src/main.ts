/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from './app/app.module';
import { CustomConsoleLoggerFactoryService } from './app/logger-built-in/services/custom-console-logger-factory.service';

async function bootstrap() {
  await ConfigModule.envVariablesLoaded;
  // console.log(process.env['GREETING']);

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  /* Setup custom logger */
  const customConsoleLoggerFactoryService = app.get(
    CustomConsoleLoggerFactoryService,
  );
  app.useLogger(customConsoleLoggerFactoryService.createLogger());

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const port = Number(process.env['PORT']) || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port.toString()}/${globalPrefix}`,
  );
}

void bootstrap();
