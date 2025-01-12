import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StructuredCustomConsoleLogger } from './structured-custom-console-logger.service';
import { UnstructuredCustomConsoleLogger } from './unstructured-custom-console-logger.service';
import { AbstractCustomConsoleLogger } from './abstract-custom-console-logger.service';
import { ICustomConsoleLoggerOptions } from '../interfaces/custom-console-logger-options.interface';
import { CustomClsServiceProvider } from '../../custom-cls/providers/custom-cls-service.provider';

@Injectable()
export class CustomConsoleLoggerFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly clsService: CustomClsServiceProvider,
  ) {}

  /**
   * Signature is based on the built-in ConsoleLogger's constructor signature:
   * https://github.com/nestjs/nest/blob/master/packages/common/services/console-logger.service.ts
   */
  createLogger(
    context?: string,
    options: ICustomConsoleLoggerOptions = {},
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
      return new StructuredCustomConsoleLogger(this.clsService, context ?? '', {
        ...options,
        showDebugInfo,
        prettyPrint,
      });
    }

    return new UnstructuredCustomConsoleLogger(this.clsService, context ?? '', {
      ...options,
      showDebugInfo,
    });
  }
}
