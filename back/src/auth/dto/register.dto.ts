import {
  IsEmail,
  IsString,
  MinLength,
  IsIn,
  IsNotEmpty,
  IsPhoneNumber
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Pepito Perez',
    description: 'Nombre completo del usuario',
  })
  fullName!: string;

  @IsEmail()
  @ApiProperty({
    example: 'pepitoperez@example.com',
    description: 'Correo electrónico válido',
  })
  email!: string;

  @IsPhoneNumber(undefined)
  @ApiProperty({
    example: '+573214445577',
    description: 'Número de celular en formato internacional',
  })
  phoneNumber!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Colombia',
    description: 'País de residencia del usuario',
  })
  country!: string;

  @IsString()
  @MinLength(6, {
    message: 'La contraseña debe tener al menos 6 caracteres',
  })
  @ApiProperty({
    example: 'MiClave123',
    description: 'Contraseña de al menos 6 caracteres',
  })
  password!: string;

  @IsString()
  @IsIn(['user', 'admin'], {
    message: 'El rol debe ser "user" o "admin"',
  })
  @ApiProperty({
    example: 'user',
    description: 'Rol asignado al usuario (user o admin)',
    enum: ['user', 'admin'],
  })
  role!: string;
}
