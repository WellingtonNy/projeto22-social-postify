import { IsNotEmpty, IsString } from 'class-validator'; //add url quando re-usar


export class CreateMediaDto {

    @IsString()
    @IsNotEmpty()
    title: string
    //IsUrl() 

    @IsString()
    @IsNotEmpty()
    username: string

    constructor(params?: Partial<CreateMediaDto>) {
        if (params) Object.assign(this, params);
      }

}