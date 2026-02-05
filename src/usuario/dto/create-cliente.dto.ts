import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsNumber, 
  Length, 
  IsDecimal, 
  IsBoolean
} from 'class-validator';

export class CreateClienteDto {
  
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

  @IsString()
  @IsOptional()
  lat?: string;

  @IsString()
  @IsOptional()
  lng?: string;

  // Datos para la tabla intermedia clientes_chofer
  
  @IsNumber({}, { message: 'El id_chofer debe ser un número entero' })
  @IsNotEmpty({ message: 'Debe asignar un chofer inicial' })
  id_chofer: number;

  @IsBoolean()
  especial: boolean;
}