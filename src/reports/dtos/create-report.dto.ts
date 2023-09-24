import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from "class-validator";

//Recuerda que creaste una Validation Pipe Globalmente, él se encargará de verificar que todo va en orden...
//con los datos de la entidad
export class CreateReportDto{
  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @IsLongitude()
  lng: number;

  @IsLatitude()
  lat:number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;
}