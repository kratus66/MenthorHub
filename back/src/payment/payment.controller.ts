import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':userId')
  create(@Param('userId') userId: number, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(userId, dto);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: number) {
    return this.paymentsService.findByUser(userId);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }
}
