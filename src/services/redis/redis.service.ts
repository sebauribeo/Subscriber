import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { ValidationDTO } from 'src/dto/validation.dto';
import { LoggerService } from '../logger/logger.service';

const asyncRedis = require("async-redis");
const redisClient = asyncRedis.createClient();
 
redisClient.on("error", function (error: string) {
    console.log("Error " + error);
});

@Injectable()
export class RedisService {
    constructor(
        private readonly loggerService: LoggerService,
    ){}
    
    async saveData(key: any, value: any){
        const data: any = await redisClient.set(key, value);
        const validationResult: ValidationDTO = data; 
        const result = new ValidationDTO(validationResult);
        const validation = await validate(result);

        if (data === null){
            this.loggerService.customError(null, validation);
            this.loggerService.customError({}, {message: 'Data Error!...', id: key});
            return (Error);
        } else {
            this.loggerService.customInfo({}, { message: 'The subscribed message has been consumed...' });
            this.loggerService.customInfo({}, {message: 'Message sent!...'});
            return (data) 
        }
    };
}; 