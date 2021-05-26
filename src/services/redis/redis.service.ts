import { Injectable } from '@nestjs/common';

const asyncRedis = require("async-redis");
const redisClient = asyncRedis.createClient();
 
redisClient.on("error", function (error: string) {
    console.log("Error " + error);
});

@Injectable()
export class RedisService {
    async saveData(key: any, value: any){
        try {
            const data: string = await redisClient.set(key, value);  
            return JSON.parse(data);
        } catch (error) {
            return null;
        };
    };
};