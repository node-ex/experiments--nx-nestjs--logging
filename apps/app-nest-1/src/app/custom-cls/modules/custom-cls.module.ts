import { Global, Module } from '@nestjs/common';
import { CustomClsServiceProvider } from '../providers/custom-cls-service.provider';
import { ClsService } from 'nestjs-cls';

@Global()
@Module({
  providers: [
    {
      provide: CustomClsServiceProvider,
      useExisting: ClsService,
    },
  ],
  exports: [CustomClsServiceProvider],
})
export class CustomClsGlobalModule {}
