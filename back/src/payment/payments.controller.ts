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
import { Payment } from './payment.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role';
import { Role } from '../common/constants/roles.enum';

@ApiTags('Pagos')
@ApiBearerAuth('JWT-auth')
// @UseGuards(JwtAuthGuard, RoleGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':userId')
  // @Roles(Role.Admin, Role.Teacher, Role.Student)
  @ApiOperation({ summary: 'Crear un nuevo pago para un usuario' })
  @ApiParam({ name: 'userId', description: 'UUID del usuario', type: String })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({ status: 201, description: 'Pago creado exitosamente', type: Payment })
  async create(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: CreatePaymentDto,
    @Req() req: Request,
  ) {
    try {
      return await this.paymentsService.create(userId, dto);
    } catch (error) {
      const message =
      error instanceof Error ? error.message : 'Error al crear el pago';
      throw new InternalServerErrorException(message);
}

  }

  @Get('user/:userId')
  // @Roles(Role.Admin)
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
  // @Roles(Role.Admin)
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
  // @Roles(Role.Admin)
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
  // @Roles(Role.Admin)
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
}
