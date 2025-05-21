import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  InternalServerErrorException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../decorator/role';
import { Role } from '../common/constants/roles.enum';

@ApiTags('Notificaciones')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RoleGuard)
export class NotificationsController {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  @Get(':userId')
  @Roles(Role.Admin)
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
    try {
      return await this.notificationRepo.find({
        where: { user: { id: userId } },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las notificaciones');
    }
  }
}
