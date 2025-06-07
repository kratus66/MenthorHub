import {
  IsOptional,
  IsString,
  IsUUID,
  IsInt,
  Min,
  Max,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    example: 5,
    description: 'Calificación del curso o estudiante. 1-5 si es review, 0-100 si es grade',
  })
  @IsInt()
  @ValidateIf((o) => o.type === 'review' || !o.type)
  @Min(1)
  @Max(5)
  @ValidateIf((o) => o.type === 'grade')
  @Min(0)
  @Max(100)
  rating: number;

  @ApiPropertyOptional({
    example: 'Muy buena clase, el profesor explica excelente.',
    description: 'Comentario opcional sobre el curso o estudiante',
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({
    example: 'c5f4b7d2-1e3e-4b1b-99ee-2e93c9e221a5',
    description: 'UUID del curso a evaluar (si aplica)',
  })
  @IsOptional()
  @IsUUID()
  courseId?: string;

  @ApiPropertyOptional({
    example: 'f9c77f1b-8e0e-4b2b-8101-25f76f6d22bc',
    description: 'UUID del estudiante a evaluar (si aplica)',
  })
  @IsOptional()
  @IsUUID()
  targetStudentId?: string;

  @IsUUID()
  studentId: string;

  @ApiPropertyOptional({
    example: 'review',
    description: 'Tipo de entrada: "review" para reseña, "grade" para calificación',
    default: 'review',
  })
  @IsOptional()
  @IsEnum(['review', 'grade'])
  type?: 'review' | 'grade';
}