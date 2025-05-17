import { IsString, IsUUID } from 'class-validator';

export class CreateSubmissionDto {
  @IsString()
  content: string;

  @IsUUID()
  taskId: string;
}
