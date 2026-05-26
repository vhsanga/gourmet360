import { IsNumber, IsNotEmpty, IsArray, ValidateNested, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateVentaDetalleDto } from './create-venta-detalle.dto';

export class CreateVentaDto {

  @IsNumber()
  @IsNotEmpty()
  idChofer!: number;

  @IsNumber()
  @IsNotEmpty()
  idCliente!: number;

  @IsNumber()
  @IsNotEmpty()
  idDespacho!: number;


  @IsNumber()
  @IsNotEmpty()
  total!: number;

  @IsOptional()
  @IsString()
  tipoPago?: string;


  @IsOptional()
  @IsNumber()
  pagado?: number;


  @IsOptional()
  @IsNumber()
  efectivo?: number;


  @IsOptional()
  @IsNumber()
  transferencia?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVentaDetalleDto)
  detalles!: CreateVentaDetalleDto[];
}
