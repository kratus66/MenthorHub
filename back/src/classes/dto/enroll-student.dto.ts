import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnrollStudentDto {
  @ApiProperty({ example: 'uuid-del-estudiante' })
  @IsUUID()
  studentId: string;
}
