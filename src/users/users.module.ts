import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from "./user.entity";
import { CurrentUserMiddleware } from './middlewares/current-user.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService, 
    AuthService, 
  ],
})

export class UsersModule {
  configure(consumer: MiddlewareConsumer){
    //Para que corra en todas las rutas. Si el usuario está con la sesión iniciada o es current, queremos saber quién es.
    //Para eso es el "*"
    consumer.apply(CurrentUserMiddleware).forRoutes("*");
  }
}
