import { IsEmail, IsString, MinLength, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail({}, { message: 'Correo no válido' })
  @ApiProperty({
    example:"pepitoperez@example.com",
    description: "ingrese un email"
  })
  email!: string;

  @Length(8, 20) // ✅ Ahora está correctamente importado
  @ApiProperty({
    example: "Contraseña123*",
    description: "La contraseña debe tener mínimo 8 caracteres, incluir una minúscula, una mayúscula, un número y un carácter especial."
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener mínimo 8 caracteres' })
  password!: string;
}
