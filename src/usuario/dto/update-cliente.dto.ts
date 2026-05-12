import { IsString, IsOptional, IsNumber, IsNotEmpty, Length } from 'class-validator';

export class UpdateClienteDto {
  @IsNumber({}, { message: 'El id_cliente debe ser un número entero' })
  @IsNotEmpty({ message: 'El id_cliente es obligatorio' })
  id_cliente: number;

  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @Length(1, 150, { message: 'El nombre no puede exceder los 150 caracteres' })
  nombre: string;

  @IsString()
  @IsOptional()
  @Length(0, 250)
  direccion?: string;

  @IsString()
  @IsOptional()
  @Length(0, 150)
  contacto?: string;

  @IsString()
  @IsOptional()
  @Length(0, 10, { message: 'El teléfono no puede tener más de 10 dígitos' })
  telefono?: string;
}
