import { Controller } from '@nestjs/common';
import { LoggerService } from "./services/logger/logger.service";
import { ValidationDTO } from "./dto/validation.dto";
import { validate } from 'class-validator';
import { Message } from '@google-cloud/pubsub';
import * as circularJSON from "circular-json";
import { EventPattern } from '@nestjs/microservices';
import { RedisService } from "./services/redis/redis.service";

@Controller()
export class AppController {
  constructor(
    private loggerService: LoggerService,
    private redisService: RedisService,
    ){}
  

  @EventPattern(process.env.GCLOUD_SUBSCRIPTION_NAME)
  async messageHandler(message: Message){
  
    try {
      const data = message.data ? message.data.toString() : null;
      this.loggerService.customInfo({}, { 'Data from the server': circularJSON.parse(data) });
      const validationResult: ValidationDTO = JSON.parse(data); 
      const result = new ValidationDTO(validationResult);
      

      const validation = await validate(result);
      if (validation.length === 0) {
        await this.redisService.saveData(validationResult.id.toString(), JSON.stringify(validationResult));
        this.loggerService.customInfo({}, { 'Susbcribed message had been consumed': message.id });
        message.ack();
      } else {
        this.loggerService.customError(null, validation);
        this.loggerService.customError({}, { 'The Message is invalid': message.id });
      };
    } catch (error) {
      this.loggerService.customError(null, (error.response) ? error.response.data : error.message);
    };
  };
};