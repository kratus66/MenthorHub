import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Notificaciones')
@Controller('notifications')
export class NotificationsController {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Obtener notificaciones de un usuario' })
  @ApiParam({
    name: 'userId',
    description: 'UUID del usuario',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificaciones del usuario',
    type: [Notification],
  })
  async findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.notificationRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }
}

