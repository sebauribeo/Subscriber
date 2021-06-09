import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
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

        if (!data){
            this.loggerService.error({}, {message: 'Data Error!...', id: key});
            throw new HttpException({
                status: HttpStatus.CONFLICT,
            }, HttpStatus.CONFLICT);
        } else {
            this.loggerService.info({}, { message: 'Data send to Redis' });
            return (data)
        };
    };
}; 