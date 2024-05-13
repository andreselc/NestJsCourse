import {IsEmail, IsString} from "class-validator";

export class CreateUserDto{

  @IsString()
  name: string;

  @IsEmail({}, { each: true }) 
  emails: string[]; 

}