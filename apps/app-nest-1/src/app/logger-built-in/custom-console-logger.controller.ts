import { Controller, Get } from '@nestjs/common';
import { AbstractCustomConsoleLogger } from './abstract-custom-console-logger.service';
import { CustomConsoleLoggerFactoryService } from './custom-console-logger-factory.service';

const LOREM_IPSUM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam aliquam mi dictum, sagittis neque ut, fringilla nunc. Nam venenatis ac ante sed gravida. Duis sit amet commodo ligula, vitae mollis enim. Suspendisse potenti. Integer semper sapien non fringilla laoreet. Pellentesque porttitor vulputate libero sed auctor. Donec consectetur sem vel erat auctor, eu porta ex luctus.

Proin lacus enim, sollicitudin bibendum velit et, cursus consequat erat. Nam ornare pulvinar ullamcorper. Nam dui diam, accumsan eget dapibus vel, congue nec tellus. Nullam ac porta magna. Donec at tincidunt risus, at viverra ex. Sed vel diam a libero dignissim aliquam. In cursus ligula eget rhoncus aliquet. Nunc enim ipsum, hendrerit id tempus in, consequat ut sapien.`;

@Controller('custom-console-logger')
export class CustomConsoleLoggerController {
  private readonly logger: AbstractCustomConsoleLogger;

  constructor(
    customConsoleLoggerFactoryService: CustomConsoleLoggerFactoryService,
  ) {
    this.logger = customConsoleLoggerFactoryService.createLogger(
      CustomConsoleLoggerController.name,
    );
  }

  @Get()
  use() {
    const error = new Error('error');

    this.logger.verbose('verbose');
    this.logger.debug('debug');
    this.logger.log('log');
    this.logger.warn('warn');
    this.logger.error('error');
    this.logger.fatal('fatal');

    // this.logger.log(LOREM_IPSUM);

    // this.logger.log('CustomConsoleLogger instance');
    // this.logger.log(`multi
    //   line
    //   message`);
    // this.logger.log({ message: 'CustomConsoleLogger instance' });
    // this.logger.log(['CustomConsoleLogger instance']);
    // this.logger.error(error.stack);
  }
}
