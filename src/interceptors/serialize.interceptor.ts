import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from "@nestjs/common";
import { Observable } from "rxjs"; 
import { map } from "rxjs/operators";
import { plainToClass } from "class-transformer";

interface ClassConstructor {
  //Cualquier clase
  new (... args: any[]): {}
}

//Decorador
export function Serialize(dto: ClassConstructor){
  return UseInterceptors (new SerializeInterceptor(dto));
}

//Te ayudará a serializar los objetos interceptados.
//Serializar: Transportar un objeto determinado a través de la red.
//Puede haber objetos de una clase con diferentes atributos, eso es lo que se maneja al Serializar la Interceptación.
export class SerializeInterceptor implements NestInterceptor{

  constructor(private dto: any){}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data:any) => {
        return plainToClass(this.dto,data,{
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}