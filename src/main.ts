import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

import helmet from 'helmet';

import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/exceptions';
import { Environment } from './common/enums';

const getAllowedOrigins = (environment: Environment) => {
  //TODO: add origins for staging and production environments
  return environment === Environment.DEVELOPMENT;
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    bufferLogs: true,
  });

  const configService = app.get(ConfigService)

  const port = configService.get('SERVER_PORT');

  const environment = configService.get('NODE_ENV');

  app.use(helmet({ noSniff: true }))

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: getAllowedOrigins(environment),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );

  await app.listen(port, () => Logger.debug(`Server listening on port ${port}`));
}

bootstrap();
