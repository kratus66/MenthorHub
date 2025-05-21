import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
import { Role } from '../../common/constants/roles.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsPhoneNumber(undefined)
  phoneNumber!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country!: string;

  @ApiProperty({
    minLength: 8,
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).+$',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message: 'Contraseña débil',
  })
  password!: string;

  @ApiProperty({ enum: ['admin', 'teacher', 'student'] })
  @IsIn(['admin', 'teacher', 'student'])
  role!: 'admin' | 'teacher' | 'student';

  @ApiPropertyOptional()
  @IsOptional()
  estudios?: string;

  @ApiPropertyOptional()
  @IsOptional()
  provincia?: string;

  @ApiPropertyOptional()
  @IsOptional()
  localidad?: string;

  @ApiPropertyOptional()
  @IsOptional()
  avatarId?: number;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  profileImage?: string;
}
