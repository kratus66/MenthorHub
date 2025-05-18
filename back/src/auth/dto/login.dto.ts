import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Correo no válido' })
  email!: string;

  @Length(8,20)
  @ApiProperty({
    example:"Contraseña123*",
    description:"La contraseña debe de ser minimo de 8 caracteres, minimo una minuscula, uno mayuscula un numero y caracter especial."
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener mínimo 8 caracteres' })
  password!: string;
}
