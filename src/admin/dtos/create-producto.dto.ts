import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateProductoDto {
  @IsNotEmpty()
  @IsString()
  idCategoria!: string;

  @IsNotEmpty()
  @IsString()
  nombre!: string;

  @IsNotEmpty()
  @IsNumber()
  precioUnitario!: number;

  @IsNumber()
  precioUnitarioMin?: number;

  @IsNumber()
  costoUnitario?: number;
}