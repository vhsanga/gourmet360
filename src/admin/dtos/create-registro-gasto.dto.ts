import { IsNumber } from 'class-validator';

export class GastoDetalleItemDto {

  @IsNumber()
  idDespacho!:number;

  @IsNumber()
  idChofer!:number; 

  @IsNumber()
  detalle!: string;

  @IsNumber()
  valor!: number;
}


