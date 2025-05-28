import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubmissionDto {
  @ApiProperty({
    example: 'f3b8c7ee-212d-45cd-aacc-c6fbb989c4a9',
    description: 'UUID de la tarea a la que corresponde la entrega',
  })
  @IsUUID('4', { message: 'taskId debe ser un UUID válido' })
  taskId: string;

  @ApiProperty({
    example: 'c1e3fa2e-15d1-402d-bbd6-34e7f3a456f7',
    description: 'UUID de la clase a la que pertenece la entrega',
  })
  @IsUUID('4', { message: 'classId debe ser un UUID válido' })
  classId: string;
}

