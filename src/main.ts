import { NestFactory } from '@nestjs/core';
import * as momentTimeZone from 'moment-timezone';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TimeOutInterceptor }  from './interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor, new TimeOutInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  Date.prototype.toJSON = function (): any {
    return momentTimeZone(this).tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss.SSS');
  }

  await app.listen(8080);
}
bootstrap();
