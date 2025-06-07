import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  InternalServerErrorException,
  UseGuards,
  // Req, // Req is imported but not used in the provided snippet, can be removed if not used elsewhere
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
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role';
import { Role } from '../common/constants/roles.enum';
import { CronService } from "../notifications/cron.service";

@ApiTags('Notificaciones')
@ApiBearerAuth('JWT-auth')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RoleGuard)
export class NotificationsController {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly cronService: CronService, // Inject CronService
  ) {}

  @Get(':userId')
  @Roles(Role.Admin, Role.Student)
  @ApiOperation({ summary: 'Obtener notificaciones de un usuario, incluyendo tareas pendientes' })
  @ApiParam({
    name: 'userId',
    description: 'UUID del usuario',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificaciones del usuario (incluye recordatorios de tareas pendientes)',
    type: [Notification], // Note: Task-based notifications will be shaped like Notification entities
  })
  async findByUser(@Param('userId', ParseUUIDPipe) userId: string): Promise<Notification[]> {
    try {
      // 1. Fetch existing notifications from the database
      const existingNotifications = await this.notificationRepo.find({
        where: { user: { id: userId } },
        // order: { createdAt: 'DESC' }, // We will sort combined results later
      });

      // 2. Fetch pending task messages
      const pendingTaskMessages = await this.cronService.getPendingTaskMessagesForUser(userId);

      const taskBasedNotifications: Notification[] = pendingTaskMessages.map(taskMsg => {
        const notification = new Notification(); // Assumes Notification entity can be instantiated
        notification.message = taskMsg.message;

        notification.createdAt = new Date();
  
        return notification;
      });

      // 4. Combine existing notifications with task-based notifications
      const allNotifications = [...taskBasedNotifications, ...existingNotifications];

      // 5. Sort all notifications by createdAt in descending order
      allNotifications.sort((a, b) => {
        const dateA = a.createdAt || new Date(0); // Fallback for safety, though createdAt should be set
        const dateB = b.createdAt || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      return allNotifications;
    } catch (error) {
      // It's good practice to log the actual error for debugging purposes
      console.error(`Error in findByUser for userId ${userId}:`, error);
      throw new InternalServerErrorException('Error al obtener las notificaciones');
    }
  }
}
