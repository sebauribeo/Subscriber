import { Injectable } from '@nestjs/common';

const asyncRedis = require("async-redis");
const redisClient = asyncRedis.createClient();
 
redisClient.on("error", function (error: string) {
    console.log("Error " + error);
});

@Injectable()
export class RedisService {
    async saveData(key: any, value: any){
        const data: any = await redisClient.set(key, value);
        if (key && value === redisClient){
            return JSON.parse(data)
        } else {
            return (Error);
        }
    };
};