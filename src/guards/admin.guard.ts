import { CanActivate, ExecutionContext } from "@nestjs/common";

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext){
    const request = context.switchToHttp().getRequest();
    if(!request.CurrentUser){ //Asegurarse de que el usuario está con la sesión iniciada.
      return false;
    }
    return request.CurrentUser.admin;
  }
}