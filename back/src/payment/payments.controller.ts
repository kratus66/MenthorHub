import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { Payment } from './payment.entity';

@ApiTags('Pagos')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Crear un nuevo pago para un usuario' })
  @ApiParam({ name: 'userId', description: 'UUID del usuario', type: String })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({ status: 201, description: 'Pago creado exitosamente', type: Payment })
  create(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: CreatePaymentDto,
  ) {
    return this.paymentsService.create(userId, dto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener todos los pagos de un usuario' })
  @ApiParam({ name: 'userId', description: 'UUID del usuario', type: String })
  @ApiResponse({ status: 200, description: 'Lista de pagos del usuario', type: [Payment] })
  findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.paymentsService.findByUser(userId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los pagos' })
  @ApiResponse({ status: 200, description: 'Lista completa de pagos', type: [Payment] })
  findAll() {
    return this.paymentsService.findAll();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un pago por ID' })
  @ApiParam({ name: 'id', description: 'UUID del pago', type: String })
  @ApiBody({ type: UpdatePaymentDto })
  @ApiResponse({ status: 200, description: 'Pago actualizado correctamente', type: Payment })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un pago por ID' })
  @ApiParam({ name: 'id', description: 'UUID del pago', type: String })
  @ApiResponse({ status: 200, description: 'Pago eliminado correctamente' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.remove(id);
  }
}

