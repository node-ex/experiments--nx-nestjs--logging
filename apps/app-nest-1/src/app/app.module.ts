import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerBuiltInModule } from './logger-built-in/modules/logger-built-in.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // No need to import in other modules
      isGlobal: true,
      expandVariables: true,
      // cache: true,
    }),
    LoggerBuiltInModule,
  ],
})
export class AppModule {}
