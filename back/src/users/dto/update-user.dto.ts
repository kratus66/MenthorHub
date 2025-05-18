import {
  IsEmail,
  IsString,
  MinLength,
  IsIn,
  IsOptional,
  IsPhoneNumber,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Correo no válido' })
  email?: string;

  @IsOptional()
  @IsPhoneNumber('DO', { message: 'Número telefónico no válido' })
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener mínimo 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Debe incluir mayúscula, minúscula, número y símbolo',
  })
  password?: string;

  @IsOptional()
  @IsIn(['admin', 'teacher', 'student'], { message: 'Rol inválido' })
  role?: 'admin' | 'teacher' | 'student';
}
