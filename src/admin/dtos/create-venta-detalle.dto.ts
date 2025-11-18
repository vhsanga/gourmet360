import { IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateVentaDetalleDto {
  @IsNumber()
  @IsNotEmpty()
  idProducto: number;

  @IsNumber()
  @IsPositive()
  cantidad: number;

  @IsNumber()
  @IsPositive()
  precioUnitario: number;
}