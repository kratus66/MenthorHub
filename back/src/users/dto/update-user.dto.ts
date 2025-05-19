import {
  IsEmail,
  IsString,
  MinLength,
  IsIn,
  IsOptional,
  IsPhoneNumber,
  Matches
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario',
  })
  @IsOptional()
  @IsString()
  fullName?: string;

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
  @IsPhoneNumber('DO', { message: 'Número telefónico no válido' })
  phoneNumber?: string;

  @ApiPropertyOptional({
    example: 'Colombia',
    description: 'País de residencia',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    example: 'MiClaveSegura123',
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
  })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener mínimo 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Debe incluir mayúscula, minúscula, número y símbolo',
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
}

