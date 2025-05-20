import {
  IsEmail,
  IsString,
  MinLength,
  IsIn,
  IsNotEmpty,
  IsPhoneNumber,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsPhoneNumber(undefined)
  phoneNumber!: string;

  @IsString()
  @IsNotEmpty()
  country!: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: 'Contraseña débil',
  })
  password!: string;

  @IsIn(['admin', 'teacher', 'student'])
  role!: 'admin' | 'teacher' | 'student';

  @IsOptional()
  estudios?: string;

  @IsOptional()
  provincia?: string;

  @IsOptional()
  localidad?: string;

  @IsOptional()
  avatarId?: number;

  @IsOptional()
  profileImage?: string;
}
