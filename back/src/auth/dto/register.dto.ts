import {
  IsEmail,
  IsString,
  MinLength,
  IsIn,
  IsNotEmpty,
  IsPhoneNumber,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  @IsString({ message: 'El nombre debe ser texto' })
  fullName!: string;

  @IsEmail({}, { message: 'Correo no válido' })
  email!: string;

  @IsPhoneNumber('DO', { message: 'Número telefónico no válido' })
  phoneNumber!: string;

  @IsString({ message: 'El país debe ser texto' })
  @IsNotEmpty({ message: 'El país es obligatorio' })
  country!: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener mínimo 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Debe incluir mayúscula, minúscula, número y símbolo',
  })
  password!: string;

  @IsIn(['admin', 'teacher', 'student'], { message: 'Rol inválido' })
  role!: 'admin' | 'teacher' | 'student';
}
