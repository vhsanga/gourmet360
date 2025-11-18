import { IsArray, IsInt, IsNotEmpty, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DespachoDetalleDto {
  @IsInt()
  producto_id: number;

  @IsInt()
  cantidad: number;
}

export class CreateDespachoDto {
  @IsInt()
  camion_id: number;

  @IsInt()
  chofer_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DespachoDetalleDto)
  detalles: DespachoDetalleDto[];
}
