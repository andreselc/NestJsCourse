import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { UsersService } from "../users.service";
import { User } from "../user.entity";

declare global {
  namespace Express{
    interface Request {
      CurrentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware{
  //DI: Hay que acceder al Servicio del usuario para acceder luego al repositorio y buscar datos de un usuario determinado
  constructor(private usersService: UsersService){

  }

  async use(req: Request, res: Response, next: NextFunction){
    const { userId } = req.session || {};

    if (userId){
      const user = await this.usersService.findOne(userId);
      req.CurrentUser=user;
    }
    //Ejecuta el Middleware
    next();
  }
}