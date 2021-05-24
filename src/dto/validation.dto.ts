import { IsBoolean, IsDefined, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ValidationDTO{
    constructor(
        data: ValidationDTO
    ){
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.price = data.price;
        this.commercialName = data.commercialName;
        this.photoUrls = data.photoUrls;
        this.status = data.status
    }

    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;
    
    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsString()
    commercialName: string;

    @IsString({each: true})
    photoUrls: Array<string>;

    @IsEnum(["available", "pending", "sold"],{
        message: 'Status is not valid [available, pending, sold]'
    })
    status: string;

    data:any;
}