import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsString()
  celular: string;

  @IsNotEmpty()
  @MinLength(6)
  pin: string;

  @IsString()
  rol?: string; // opcional, por defecto será 'vendedor'
}
