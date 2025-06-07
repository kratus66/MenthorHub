// create-payment.dto.ts
import { IsNumber, IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    example: 5.99,
    description: 'Monto del pago',
  })
  @IsNumber()
  amount!: number;

  @ApiProperty({
    example: 'USD',
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

  @ApiProperty({
    example: 'paypal',
    description: 'Método de pago (solo paypal permitido)',
    enum: ['paypal'],
  })
  @IsEnum(['paypal'])
  paymentMethod!: 'paypal';

  @ApiProperty({
    example: '2025-05',
    description: 'Mes del pago en formato YYYY-MM',
  })
  @IsString()
  @IsNotEmpty()
  month!: string;
}
