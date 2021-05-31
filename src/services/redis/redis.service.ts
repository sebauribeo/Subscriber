import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

const asyncRedis = require("async-redis");
const redisClient = asyncRedis.createClient();
 
redisClient.on("error", function (error: string) {
    console.log("Error " + error);
});

@Injectable()
export class RedisService {
    constructor(private readonly loggerService: LoggerService){}
    
    async saveData(key: any, value: any){
        const data: any = await redisClient.set(key, value);
        if (data === null){
            this.loggerService.customError({}, {message: 'Data Error!', id: key});
            return (Error);
        } else {
            this.loggerService.customInfo({}, {message: 'Message sent!'});
            return (data) 
        }
    };
}; 