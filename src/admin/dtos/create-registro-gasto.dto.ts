import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class GastoItemDto {
  @IsOptional()
  id?: string;

  @IsString()
  detalle!: string;

  @IsNumber()
  valor!: number;
}

export class UpsertGastoDespachoDto {
  @IsNumber()
  idDespacho!: number;

  @IsNumber()
  idChofer!: number;

  @ValidateNested({ each: true })
  @Type(() => GastoItemDto)
  gastos!: GastoItemDto[];
}

// Kept for backwards compatibility if used elsewhere
export class GastoDetalleItemDto {
  @IsNumber()
  idDespacho!: number;

  @IsNumber()
  idChofer!: number;

  @IsString()
  detalle!: string;

  @IsNumber()
  valor!: number;
}
