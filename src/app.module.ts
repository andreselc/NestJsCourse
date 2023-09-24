import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config"
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { dataSourceOptions } from '../db/data-source';
const cookieSession = require("cookie-session");

@Module({
  imports: [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `.env.${process.env.NODE_ENV}` //Para Development
  }),
  TypeOrmModule.forRoot(dataSourceOptions),
  UsersModule, 
  ReportsModule],
  controllers: [AppController],
  providers: [
    AppService,
    { //Global Pipe
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist:true,
      })
    }
  ],
})
export class AppModule {

  constructor(private configService: ConfigService){

  }

  configure(consumer: MiddlewareConsumer){
    consumer.apply(cookieSession({
      keys:[this.configService.get("COOKIE_KEY")],
    }),
    ).forRoutes("*"); //Que queremos aplicar este método en cualquier consulta de nuestra app. ES GLOBAL
  }
}
