import {
  IsEmail,
  IsString,
  MinLength,
  IsIn,
  IsNotEmpty,
  IsPhoneNumber,
  Matches
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Ana Martínez',
    description: 'Nombre completo del usuario',
  })
  @IsNotEmpty()
  @IsString()
  nombre!: string;

  @ApiProperty({
    example: 'ana@example.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '+573004567890',
    description: 'Número de teléfono en formato internacional',
  })
  @IsPhoneNumber(undefined)
  phoneNumber!: string;

  @ApiProperty({
    example: 'Colombia',
    description: 'País de residencia del usuario',
  })
  @IsString()
  @IsNotEmpty()
  country!: string;

  @ApiProperty({
    example: 'ClaveSegura123',
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener mínimo 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Debe incluir mayúscula, minúscula, número y símbolo',
  })
  password!: string;

  @ApiProperty({
    example: 'student',
    description: 'Rol asignado al usuario',
    enum: ['admin', 'teacher', 'student'],
  })
  @IsIn(['admin', 'teacher', 'student'])
  role!: 'admin' | 'teacher' | 'student';
}
