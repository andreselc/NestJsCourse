import { Expose, Transform } from "class-transformer";

export class ReportDto{
  @Expose()
  id:number;
  @Expose()
  price:number;
  @Expose()
  year: number;
  @Expose()
  lng:number;
  @Expose()
  lat:number;
  @Expose()
  make:string;
  @Expose()
  model:string;
  @Expose()
  mileage:number;
  @Expose()
  approved:boolean;

  //Decorador que me ayuda a obtener el ID del usuario, asignando un objeto tipo Report a una función como argumento
  @Transform(({ obj }) => obj.user.id) 
  @Expose()
  userId: number;
}