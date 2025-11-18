import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateChoferDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  pin: string;

  @IsEnum(['chofer', 'admin', 'supervisor'])
  rol: 'chofer' | 'admin' | 'supervisor';

  @IsString()
  @IsOptional()
  celular?: string;
}

export class CreateCamionDto {
  @IsString()
  @IsNotEmpty()
  placa: string;

  @IsString()
  @IsOptional()
  marca?: string;

  @IsString()
  @IsOptional()
  modelo?: string;

  @IsNumber()
  @IsOptional()
  capacidad?: number;

  @IsNotEmpty()
  chofer: CreateChoferDto;
}
