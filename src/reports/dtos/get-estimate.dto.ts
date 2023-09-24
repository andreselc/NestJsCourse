import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsLongitude,
  IsLatitude,
} from "class-validator";
import { Transform } from "class-transformer";

//Recuerda que creaste una Validation Pipe Globalmente, él se encargará de verificar que todo va en orden...
//con los datos de la entidad
export class GetEstimateDto{
  @IsString()
  make: string;

  @IsString()
  model: string;

  @Transform(({value}) => parseInt(value))
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @Transform(({value}) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @Transform(({value}) => parseFloat(value))
  @IsLongitude()
  lng: number;

  @Transform(({value}) => parseFloat(value))
  @IsLatitude()
  lat:number;

}