// create-class.dto.ts
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  teacherId!: number;
}
