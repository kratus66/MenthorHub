import { IsNumber, IsEnum, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  amount: number = 0;

  @IsString()
  currency: string = '';

  @IsEnum(['student_subscription', 'teacher_monthly_fee'])
  type: 'student_subscription' | 'teacher_monthly_fee' = 'student_subscription';
}
