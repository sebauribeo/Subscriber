import * as dotenv from 'dotenv';
dotenv.config();
import { Logger, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PubSubServer } from './services/transports/pubSub/pubSub.server';
import { AllExceptionsFilter } from './exception-filters/all-exceptions.filter';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    strategy: new PubSubServer(),
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.startAllMicroservicesAsync();
  const port = process.env.PORT;
  await app.listen(port);
  logger.log(`Server Start Port ${port}`);
};
bootstrap();

