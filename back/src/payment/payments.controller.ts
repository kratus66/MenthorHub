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
} from '@nestjs/swagger';
import { Payment } from './payment.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../decorator/role';
import { Role } from '../common/constants/roles.enum';

@ApiTags('Pagos')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':userId')
  @Roles(Role.Admin, Role.Teacher, Role.Student)
  @ApiOperation({ summary: 'Crear un nuevo pago para un usuario' })
  @ApiParam({ name: 'userId', description: 'UUID del usuario', type: String })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({ status: 201, description: 'Pago creado exitosamente', type: Payment })
  async create(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: CreatePaymentDto,
    @Req() req: Request,
  ) {
    console.log('PaymentsController.create -> user:', req.user);
    console.log('PaymentsController.create -> userId:', userId, 'dto:', dto);
    try {
      return await this.paymentsService.create(userId, dto);
    } catch (error) {
      console.error('Error en create payment:', error);
      throw new InternalServerErrorException('Error al crear el pago');
    }
  }

  @Get('user/:userId')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Obtener todos los pagos de un usuario' })
  @ApiParam({ name: 'userId', description: 'UUID del usuario', type: String })
  @ApiResponse({ status: 200, description: 'Lista de pagos del usuario', type: [Payment] })
  async findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    console.log('PaymentsController.findByUser -> userId:', userId);
    try {
      return await this.paymentsService.findByUser(userId);
    } catch (error) {
      console.error('Error en findByUser:', error);
      throw new InternalServerErrorException('Error al obtener los pagos del usuario');
    }
  }

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Obtener todos los pagos' })
  @ApiResponse({ status: 200, description: 'Lista completa de pagos', type: [Payment] })
  async findAll() {
    console.log('PaymentsController.findAll');
    try {
      return await this.paymentsService.findAll();
    } catch (error) {
      console.error('Error en findAll:', error);
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
    console.log('PaymentsController.update -> id:', id, 'dto:', dto);
    try {
      return await this.paymentsService.update(id, dto);
    } catch (error) {
      console.error('Error en update payment:', error);
      throw new InternalServerErrorException('Error al actualizar el pago');
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Eliminar un pago por ID' })
  @ApiParam({ name: 'id', description: 'UUID del pago', type: String })
  @ApiResponse({ status: 200, description: 'Pago eliminado correctamente' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    console.log('PaymentsController.remove -> id:', id);
    try {
      return await this.paymentsService.remove(id);
    } catch (error) {
      console.error('Error en remove payment:', error);
      throw new InternalServerErrorException('Error al eliminar el pago');
    }
  }
}
