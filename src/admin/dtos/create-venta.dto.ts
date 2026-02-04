import { IsNumber, IsNotEmpty, IsArray, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateVentaDetalleDto } from './create-venta-detalle.dto';

export class CreateVentaDto {

  @IsNumber()
  @IsNotEmpty()
  idChofer: number;

  @IsNumber()
  @IsNotEmpty()
  idCliente: number;

  @IsNumber()
  @IsNotEmpty()
  idDespacho: number;

  @IsString()
  @IsNotEmpty()
  tipoPago: "contado" | "credito";

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVentaDetalleDto)
  detalles: CreateVentaDetalleDto[];
}
