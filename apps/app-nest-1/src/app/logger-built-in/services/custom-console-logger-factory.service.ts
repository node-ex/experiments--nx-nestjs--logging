import { ConsoleLoggerOptions, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StructuredCustomConsoleLogger } from './structured-custom-console-logger.service';
import { UnstructuredCustomConsoleLogger } from './unstructured-custom-console-logger.service';
import { AbstractCustomConsoleLogger } from './abstract-custom-console-logger.service';

@Injectable()
export class CustomConsoleLoggerFactoryService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Signature copied from the NestJS ConsoleLogger constructor:
   * https://github.com/nestjs/nest/blob/master/packages/common/services/console-logger.service.ts
   */
  createLogger(): AbstractCustomConsoleLogger;
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  createLogger(context: string): AbstractCustomConsoleLogger;
  createLogger(
    context: string,

    // eslint-disable-next-line @typescript-eslint/unified-signatures
    options: ConsoleLoggerOptions,
  ): AbstractCustomConsoleLogger;
  createLogger(
    context?: string,
    options: ConsoleLoggerOptions = {
      timestamp: true,
    },
  ): AbstractCustomConsoleLogger {
    const showDebugInfo =
      this.configService.get<string>('LOGGER_BUILT_IN__SHOW_DEBUG_INFO') ===
      'true';
    const isStructuredLoggingEnabled =
      this.configService.get<string>(
        'LOGGER_BUILT_IN__STRUCTURED_LOGGING__IS_ENABLED',
      ) === 'true';
    const prettyPrint =
      this.configService.get<string>(
        'LOGGER_BUILT_IN__STRUCTURED_LOGGING__PRETTY_PRINT',
      ) === 'true';

    if (isStructuredLoggingEnabled) {
      return new StructuredCustomConsoleLogger(context ?? '', {
        ...options,
        showDebugInfo,
        prettyPrint,
      });
    }

    return new UnstructuredCustomConsoleLogger(context ?? '', {
      ...options,
      showDebugInfo,
    });
  }
}
