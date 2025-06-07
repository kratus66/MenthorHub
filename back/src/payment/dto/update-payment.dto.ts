// update-payment.dto.ts
import { IsEnum, IsOptional, IsNumber, IsString } from 'class-validator';
import { PaymentStatus, PaymentType } from '../payment.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePaymentDto {
  @ApiPropertyOptional({ example: 19.99 })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ enum: PaymentType, example: PaymentType.STUDENT_SUBSCRIPTION })
  @IsOptional()
  @IsEnum(PaymentType)
  type?: PaymentType;

  @ApiPropertyOptional({ enum: PaymentStatus, example: PaymentStatus.COMPLETED })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({
    example: 'paypal',
    description: 'Método de pago (solo paypal permitido)',
    enum: ['paypal'],
  })
  @IsOptional()
  @IsEnum(['paypal'])
  paymentMethod?: 'paypal';

  @ApiPropertyOptional({
    example: '2025-05',
    description: 'Mes del pago en formato YYYY-MM',
  })
  @IsOptional()
  @IsString()
  month?: string;
}
