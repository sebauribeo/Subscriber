import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerService } from './services/logger/logger.service';
import { PubSubService } from './services/pubSub/pubSub.service';
import { RedisService } from "./services/redis/redis.service";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PubSubService, LoggerService, RedisService], 
})
export class AppModule {}