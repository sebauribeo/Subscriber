import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { LoggerService } from "./services/logger/logger.service";
import { ValidationDTO } from "./dto/validation.dto";
import { Message } from '@google-cloud/pubsub';
import * as circularJSON from "circular-json";
import { EventPattern } from '@nestjs/microservices';
import { RedisService } from "./services/redis/redis.service";
import { validate } from 'class-validator';

@Controller()
export class AppController {
  constructor(
    private loggerService: LoggerService,
    private redisService: RedisService,
    ){};
    
    @EventPattern(process.env.GCLOUD_SUBSCRIPTION_NAME)
    async messageHandler(message: Message){

      try {
        const data = message.data ? message.data.toString() : null;
        const validationResult: ValidationDTO = JSON.parse(data); 
        const result = new ValidationDTO(validationResult);
        const validation = await validate(result);
        
        if (validation.length === 0) {
          this.loggerService.customInfo({}, { 'Data send to Redis, id': message.id });
          this.loggerService.customInfo({}, { 'Data from the server...': circularJSON.parse(data)});
          await this.redisService.saveData(validationResult.id.toString(), JSON.stringify(validationResult));
          message.ack();

        } else {
          this.loggerService.customError({}, {message: 'Validation failed!...'});
          this.loggerService.customError(null, validation);
          throw new HttpException({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            statusMessage: 'Data not found!...'
          }, HttpStatus.INTERNAL_SERVER_ERROR);
        };
      } catch (error) {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          statusMessage: 'Data not found!...'
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      };
    }; 

}; 