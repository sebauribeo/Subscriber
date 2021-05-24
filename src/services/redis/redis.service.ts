import { Injectable } from '@nestjs/common';

const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();
 
client.on("error", function (error: string) {
    console.log("Error " + error);
});

@Injectable()
export class RedisService {
    async saveData(key: string, value: string){

        try {
            const data: string = await client.set(key, value); 
            return JSON.parse(data);
        } catch (error) {
            return null;
        }
    }
}