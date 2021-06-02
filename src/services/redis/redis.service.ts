import { HttpException, Injectable, HttpStatus, Response } from '@nestjs/common';
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
    
    async saveData(key: any, value: any, @Response() response){
        const data: any = await redisClient.set(key, value);
        const validationResult: ValidationDTO = data; 
        const result = new ValidationDTO(validationResult);
        const validation = await validate(result);

        if (data === null){
            this.loggerService.customError(null, validation);
            this.loggerService.customError({}, {message: 'Data Error!...', id: key});
            throw new HttpException({
                status: HttpStatus.NOT_FOUND,
                error: 'Data Redis Not Found',
            }, HttpStatus.NOT_FOUND);
        } else {
            this.loggerService.customInfo({}, {message: 'Message sent!...'});
            this.loggerService.customInfo({}, { message: 'The subscribed message has been consumed...' });
            return response.status(HttpStatus.OK).data
        };
    };
}; 