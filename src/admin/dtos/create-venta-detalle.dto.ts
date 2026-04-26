import { IsNumber, IsPositive, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateVentaDetalleDto {
  @IsNumber()
  @IsNotEmpty()
  idProducto!: number;

  @IsNumber()
  @IsPositive()
  cantidad!: number;

  @IsNumber()
  precioUnitario!: number;

  @IsNumber()
  @IsOptional()
  precioCliente?: number;
}