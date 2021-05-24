import { Injectable } from '@nestjs/common';

const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();
 
client.on("error", function (error) {
    console.log("Error " + error);
});

@Injectable()
export class RedisService {
    async postData(key: string, value: string){

        try {
            const dataString: string = await client.set(key, value); 
            return JSON.parse(dataString);
        } catch (error) {
            return null;
        }
    }
}