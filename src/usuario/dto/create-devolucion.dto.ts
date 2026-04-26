import { IsArray, IsNumber } from "class-validator";

export class CreateDevolucionDto{
    @IsNumber()
    cantidad!: number; 
    
    @IsNumber()
    clienteId!: number;
    
    @IsNumber()
    choferId!:number;

    @IsNumber()
    despachoId!:number;

    @IsArray()
    detalles!:DetalleDevolucionDto[];
}

export class DetalleDevolucionDto{
    @IsNumber()
    productoId!: number;
    
    @IsNumber()
    cantidad!: number;
}