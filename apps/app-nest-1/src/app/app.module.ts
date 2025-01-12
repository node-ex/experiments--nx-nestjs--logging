import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { v4 as uuid } from 'uuid';
import { CustomClsServiceProvider } from './custom-cls/providers/custom-cls-service.provider';
import { LoggerBuiltInModule } from './logger-built-in/modules/logger-built-in.module';
import { CustomClsGlobalModule } from './custom-cls/modules/custom-cls.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // No need to import in other modules
      isGlobal: true,
      expandVariables: true,
      // cache: true,
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: () => uuid(),
        setup(cls) {
          const clsService = cls as CustomClsServiceProvider;
          clsService.set('entryMode', 'http');
        },
      },
    }),
    CustomClsGlobalModule,
    LoggerBuiltInModule,
  ],
})
export class AppModule {}
