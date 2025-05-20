import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  Matches,
  IsNumber,
  IsIn,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  celular: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @MinLength(6)
  confirmPassword: string;

  @ApiProperty()
  @IsNumber()
  avatarId: number;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsOptional()
  profileImage?: any; // será manejado por interceptor

  @ApiProperty()
  @IsString()
  estudios: string;

  @ApiProperty()
  @IsIn(['student', 'teacher', 'admin'])
  rol: string;

  @ApiProperty()
  @IsString()
  pais: string;

  @ApiProperty()
  @IsString()
  provincia: string;

  @ApiProperty()
  @IsString()
  localidad: string;
}
