import { IsArray, IsNumber, IsString } from 'class-validator';

export class CambioItemDto {
  @IsNumber()
  productoId: number;

  @IsNumber()
  cantidadDevuelta: number;
}

export class CreateCambioDto {

  @IsNumber()
  clienteId: number;

  @IsNumber()
  choferId: number;

  @IsString()
  observacion: string;  

  @IsArray()
  items: CambioItemDto[];
}
