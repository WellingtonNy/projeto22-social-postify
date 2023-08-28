import { IsNotEmpty, IsString } from 'class-validator'; //add url quando re-usar


export class UpdateMediaDto {

    @IsNotEmpty()
    @IsString()
    title: string
    //IsUrl() 

    @IsNotEmpty()
    @IsString()
    username: string

}