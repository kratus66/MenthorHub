import { IsString, IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  instructions: string;

  @IsDateString()
  dueDate: string;

  classId: string; // Lo usamos para relacionarla con una clase existente
}
