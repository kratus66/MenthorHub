import { IsString, IsNotEmpty, IsDateString, IsUUID } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  instructions: string;

  @IsDateString()
  dueDate: string;

  @IsUUID()
  classId: string;
}
