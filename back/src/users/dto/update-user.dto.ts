import {
  IsEmail,
  IsString,
  MinLength,
  IsIn,
  IsOptional,
  IsPhoneNumber,
  Matches,
  MaxLength,
  IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario',
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  @MinLength(5, { message: 'El nombre debe tener mínimo 5 caracteres' })
  @MaxLength(50, { message: 'El nombre no debe exceder 50 caracteres' })
  @Matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s']+$/, {
    message: 'El nombre solo puede contener letras y espacios',
  })
  name?: string;

  @ApiPropertyOptional({
    example: 'juan@example.com',
    description: 'Correo electrónico del usuario',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Correo no válido' })
  email?: string;

  @ApiPropertyOptional({
    example: '+573001112233',
    description: 'Número de teléfono en formato internacional',
  })
  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Número telefónico no válido' })
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: 'Colombia',
    description: 'País de residencia',
  })
  @IsOptional()
  @IsString({ message: 'El país debe ser texto' })
  country?: string;

  @ApiPropertyOptional({
    example: 'MiClaveSegura123!',
    description: 'Contraseña del usuario (mínimo 8 caracteres)',
  })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener mínimo 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: 'Debe incluir mayúscula, minúscula, número y símbolo',
  })
  password?: string;

  @ApiPropertyOptional({
    example: 'student',
    description: 'Rol asignado al usuario',
    enum: ['admin', 'teacher', 'student'],
  })
  @IsOptional()
  @IsIn(['admin', 'teacher', 'student'], { message: 'Rol inválido' })
  role?: 'admin' | 'teacher' | 'student';

  @ApiPropertyOptional({
    example: true,
    description: 'Estado del usuario (activo/inactivo)',
  })
  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}

