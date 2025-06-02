// ✅ Código completo actualizado — con roles agregados, sin alterar la lógica

import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  InternalServerErrorException,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Payment, PaymentStatus, PaymentType } from './payment.entity';
import axios from 'axios';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { RoleGuard } from '../common/guards/role.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/role';
import { Role } from '../common/constants/roles.enum';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { Response } from 'express';
import { Header, Res } from '@nestjs/common';



@ApiTags('Pagos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('user/:userId')
  @Roles(Role.Admin, Role.Teacher, Role.Student)
  @ApiOperation({ summary: 'Obtener todos los pagos de un usuario con paginación' })
  @ApiParam({ name: 'userId', description: 'UUID del usuario', type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de pagos del usuario', type: [Payment] })
  async findByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    try {
      const result = await this.paymentsService.findByUser(userId, Number(page), Number(limit));
      if (result.data.length === 0) return { message: 'No se encontraron pagos', ...result };
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los pagos del usuario');
    }
  }
 

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Obtener todos los pagos con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista completa de pagos', type: [Payment] })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    try {
      const result = await this.paymentsService.findAll(Number(page), Number(limit));
      if (result.data.length === 0) return { message: 'No se encontraron pagos', ...result };
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los pagos');
    }
  }

  @Put(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Actualizar un pago por ID' })
  @ApiParam({ name: 'id', description: 'UUID del pago', type: String })
  @ApiBody({ type: UpdatePaymentDto })
  @ApiResponse({ status: 200, description: 'Pago actualizado correctamente', type: Payment })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePaymentDto,
  ) {
    try {
      return await this.paymentsService.update(id, dto);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el pago');
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Eliminar un pago por ID' })
  @ApiParam({ name: 'id', description: 'UUID del pago', type: String })
  @ApiResponse({ status: 200, description: 'Pago eliminado correctamente' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    try {
      await this.paymentsService.remove(id);
      return { message: 'Pago eliminado correctamente' };
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar el pago');
    }
  }

  @Get('paypal-config')
  @Roles(Role.Admin, Role.Teacher, Role.Student)
  @ApiOperation({ summary: 'Obtener la configuración de PayPal' })
  @ApiResponse({ status: 200, description: 'Configuración de PayPal obtenida correctamente', type: Object })
  async getPaypalConfig() {
    return {
      clientId: process.env.PAYPAL_CLIENT_ID,
    };
  }

  @Post('create-paypal-payment')
  @Roles(Role.Teacher, Role.Student)
  @ApiOperation({ summary: 'Simular creación de pago con PayPal (sandbox)' })
  @ApiResponse({ status: 201, description: 'URL de aprobación de PayPal devuelta' })
  async createPaypalPayment(@Body() dto: CreatePaymentDto) {
    try {
      const approvalUrl = await this.paymentsService.simulatePaypal(dto);
      return { url: approvalUrl };
    } catch (error) {
      throw new InternalServerErrorException('Error al simular pago PayPal');
    }
  }

  @Post('paypal/capture/:orderId')
  @Roles(Role.Teacher, Role.Student)
  @ApiOperation({ summary: 'Capturar orden de PayPal (manual desde backend)' })
  @ApiParam({ name: 'orderId', description: 'ID de la orden PayPal (token)' })
  async capturePaypalOrder(@Param('orderId') orderId: string, @CurrentUser() user: User) {
    try {
      const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64');

      const { data: tokenRes } = await axios.post(
        `${process.env.PAYPAL_API_URL}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const { data: captureRes } = await axios.post(
        `${process.env.PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${(tokenRes as any).access_token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const amount = parseFloat((captureRes as any).purchase_units[0].payments.captures[0].amount.value);
      const currency = (captureRes as any).purchase_units[0].payments.captures[0].amount.currency_code;
      const month = new Date().toISOString().slice(0, 7); // 'YYYY-MM'

      // Define startDate and endDate (example: subscription for 1 month)
     const startDate = new Date(month + '-01');
     const endDate = new Date(startDate);
     endDate.setMonth(endDate.getMonth() + 1);

      console.log('🎯 Usuario logueado para asociar pago:', user.email);

      await this.paymentsService.savePayment({
        amount,
        currency,
        type: user.role === 'teacher' ? PaymentType.TEACHER_SUBSCRIPTION : PaymentType.STUDENT_SUBSCRIPTION,
        paymentMethod: 'paypal',
        status: PaymentStatus.COMPLETED,
        month,
        startDate,
        endDate,
        user,
      });

      user.isPaid = true;
      await this.paymentsService.saveUser(user);

      return { message: 'Pago registrado y orden capturada correctamente', captureRes };
    } catch (error) {
      console.log('❌ Error en capturePaypalOrder:', error);
      if (typeof error === 'object' && error !== null) {
        const err = error as any;
        console.log('❌ ERROR al capturar orden PayPal:', err.response?.data || err.message);
      } else {
        console.log('❌ ERROR al capturar orden PayPal:', error);
      }
      throw new InternalServerErrorException('Error al capturar la orden de PayPal');
    }
  }
}
