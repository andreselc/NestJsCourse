import {
  createParamDecorator,
  ExecutionContext
} from "@nestjs/common";

//Aquí customizamos un decorador para usarlo en el controlador
export const CurrentUser = createParamDecorator(
  //ExecutionContext sirve para trabajar con solicitudes entrantes  (WebSockets, http, entre otros protocolos de comunicación)
  //data contiene los datos que le mandemos al decorador.
  (data:never, context:ExecutionContext) =>{
    const request =context.switchToHttp().getRequest();
    return request.CurrentUser;
  },
);
