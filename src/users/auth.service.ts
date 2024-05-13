import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto"; //scrypt es la función hashing (asíncrono por naturaleza).
import { promisify } from "util"; //Función que tomará otra que hace uso de llamadas, para retornar otras promesas.

const scrypt =promisify(_scrypt);

@Injectable()
export class AuthService{
  constructor(private usersService: UsersService){}

  async signup(email: string, password: string){
    //Ver si el email está ya en uso
    const users= await this.usersService.find(email);
    if (users.length){
      throw new BadRequestException("email in use");
    } 
    //Encriptar la contraseña del usuario dentro de la b/d (Hash password)
    //Generar Salt. Generará 16 caracteres
    const salt = randomBytes(8).toString("hex");

    //Encriptar Salt y contraseña juntas. Scrypt realmente retorna un Buffer
    const hash = (await scrypt(password, salt, 32)) as Buffer; 

    //Unir el resultado encriptado y la sal.
    const result =salt + "." +hash.toString("hex");

    //Crear nuevo usuario y guardarlo
    const user = await this.usersService.create(email, result);

    //Retornar el usuario
    return user;
  }

  async signin(email: string, password: string){
    //Desestructuración
    const [user] = await this.usersService.find(email);
    if(!user){
      throw new NotFoundException ("User not found");
    }

    const [salt, storedHash] = user.password.split(".");
    const hash =(await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString("hex")){
      throw new BadRequestException("bad password");
    }
    return user;
  }
}