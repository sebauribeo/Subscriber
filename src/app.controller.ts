import { Controller } from '@nestjs/common';
import { LoggerService } from "./services/logger/logger.service";
import { ValidationDTO } from "./dto/validation.dto";
import { Message } from '@google-cloud/pubsub';
import * as circularJSON from "circular-json";
import { EventPattern } from '@nestjs/microservices';
import { RedisService } from "./services/redis/redis.service";
import { response } from 'express';

@Controller()
export class AppController {
  constructor(
    private loggerService: LoggerService,
    private redisService: RedisService,
    ){};
    
    @EventPattern(process.env.GCLOUD_SUBSCRIPTION_NAME)
    async messageHandler(message: Message){
        const data = message.data ? message.data.toString() : null;
        const validationResult: ValidationDTO = JSON.parse(data); 

        this.loggerService.customInfo({}, { 'Data send to Redis, id': message.id });
        this.loggerService.customInfo({}, { 'Data from the server...': circularJSON.parse(data)});
        await this.redisService.saveData(validationResult.id.toString(), JSON.stringify(validationResult), response);

        message.ack();
    };
}; 