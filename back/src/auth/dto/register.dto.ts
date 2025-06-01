import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsNumber,
  IsIn,
  IsOptional,
  MaxLength,
  IsBoolean,
  ValidateIf,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';

export class RegisterDto {
  @ApiProperty({ example: 'Ana Martínez' })
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'El nombre debe tener mínimo 5 caracteres' })
  @MaxLength(50, { message: 'El nombre no debe superar 50 caracteres' })
  @Matches(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s']+$/, {
    message: 'El nombre solo puede contener letras y espacios',
  })
  name: string;

  @ApiProperty({ example: '+18095551122' })
  @IsString()
  @MinLength(10)
  @Matches(/^\+?[0-9]{10,15}$/, {
    message: 'Número de celular inválido',
  })
  phoneNumber: string;

  @IsEmail({}, { message: 'Correo electrónico inválido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: 'Contraseña débil',
  })
  password: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  confirmPassword: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  avatarId: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  profileImage?: any;

  @ApiPropertyOptional({ description: 'URL de imagen de perfil (opcional si se sube archivo)' })
  @IsOptional()
  @IsString()
  profileImageUrl?: string;

  @ApiProperty()
  @IsString()
  studies: string;

  @ApiProperty()
  @IsIn(['student', 'teacher', 'admin'])
  role: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  province: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @Type(() => Boolean)
  @IsBoolean()
  @IsNotEmpty()
  isOauth: boolean;

  @ApiPropertyOptional({ enum: ['google', 'github', 'no-provider'] })
  @IsOptional()
  @ValidateIf(o => o.isOauth === true)
  @IsIn(['google', 'github', 'no-provider'])
  oauthProvider?: 'google' | 'github' | 'no-provider';
}
