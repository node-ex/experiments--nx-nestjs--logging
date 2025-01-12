/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppModule } from './app/app.module';
import { CustomConsoleLoggerFactory } from './app/logger-built-in/services/custom-console-logger.factory';

async function bootstrap() {
  await ConfigModule.envVariablesLoaded;
  // console.log(process.env['GREETING']);

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  /* Setup custom logger */
  const customConsoleLoggerFactory = app.get(CustomConsoleLoggerFactory);
  app.useLogger(
    customConsoleLoggerFactory.createLogger('', {
      debugStackLevel: 8,
    }),
  );

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
