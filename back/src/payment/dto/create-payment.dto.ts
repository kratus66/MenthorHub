import { IsNumber, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    example: 15000,
    description: 'Monto del pago',
  })
  @IsNumber()
  amount!: number;

  @ApiProperty({
    example: 'COP',
    description: 'Moneda del pago (ej. COP, USD)',
  })
  @IsString()
  currency!: string;

  @ApiProperty({
    example: 'student_subscription',
    description: 'Tipo de pago',
    enum: ['student_subscription', 'teacher_monthly_fee'],
  })
  @IsEnum(['student_subscription', 'teacher_monthly_fee'])
  type!: 'student_subscription' | 'teacher_monthly_fee';
}
