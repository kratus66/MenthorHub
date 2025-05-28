import {
    IsString,
    IsNotEmpty,
    MinLength,
    Matches,
    IsNumber,
    IsIn,
    IsOptional,
    MaxLength,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class OAuthCompleteDto {
    @ApiProperty({ example: '+18095551122' })
    @IsString()
    @MinLength(10)
    @Matches(/^\+?[0-9]{10,15}$/, {
      message: 'Número de celular inválido',
    })
    phoneNumber: string;
  
    @ApiProperty()
    @IsNumber()
    avatarId: number;
  
    @ApiProperty({ type: 'string', format: 'binary' })
    @IsOptional()
    profileImage?: any;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    estudios: string;
  
    @ApiProperty({ example: 'student' })
    @IsIn(['student', 'teacher', 'admin'], {
      message: 'Rol inválido. Debe ser student, teacher o admin',
    })
    role: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    country: string;
    

  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    provincia: string;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    localidad: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    isOauth: string;
  }
  