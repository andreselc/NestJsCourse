import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";

@Injectable()
export class UsersService {

  //InjectRepository(): Le decimos al sistema de DI que necesitamos usar el reporistorio de "User".
  //DI usa esta notación (Repository<User>) para avaeriguar cuál instancia necesita "inyectar" a esta clase en tiempo de ejecución.
  //Se usa el decorador porque Repository<User> tiene un parámetro genérico
  constructor(@InjectRepository(User) private repo: Repository<User>){}

  create(email: string, password: string){
    const user = this.repo.create({email,password}); //Crea la intancia del usuario
    return this.repo.save(user); //Guarda la instancia en la BD.
  }

  findOne(id:number) {
    //Un criterio: return this.repo.findOneBy({ email: "asdf@asdf.com"});
    if (!id){
      return null;
    }
    return this.repo.findOneBy({ id });
  }

  find(email:string){
    //Devuelve un array de muchos registros que cumplan un criterio
    //El criterio es el email.
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>){
    //attrs: Partial<User> te permite colocar la cantidad de parámetros que quieras del objeto User, hacíendolo más flexible. 
    //Puedes pasar un objeto vacío, con email, con el password o con los dos: va a funcionar.
    const user = await this.findOne(id);
    if (!user){
      throw new NotFoundException("user not found");
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number){
    const user = await this.findOne(id);
    if (!user){
      throw new NotFoundException("user not found");
    }
    return this.repo.remove(user);
  }

}

