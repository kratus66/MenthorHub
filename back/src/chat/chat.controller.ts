import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateChatDto } from './dto/create-chat.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role';
import { Role } from '../common/constants/roles.enum';

@ApiTags('Chat')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('class/:classId')
  @Roles(Role.Teacher, Role.Student)
  @ApiOperation({ summary: 'Obtener mensajes de una clase por ID' })
  @ApiParam({
    name: 'classId',
    description: 'UUID de la clase para obtener sus mensajes',
    example: 'fe342f1e-cd78-4aa2-9034-b1a12e7c6a7d',
  })
  @ApiResponse({
    status: 200,
    description: 'Mensajes encontrados',
    schema: {
      example: [
        {
          id: 'msg-123',
          classId: 'fe342f1e-cd78-4aa2-9034-b1a12e7c6a7d',
          sender: 'Juan Pérez',
          content: 'Hola, ¿cuándo es la próxima clase?',
          timestamp: '2025-05-18T11:23:00.000Z',
        },
      ],
    },
  })
  async findMessagesByClass(@Param('classId') classId: string) {
    return this.chatService.getMessagesByClass(classId);
  }

  @Post('send')
  @Roles(Role.Teacher, Role.Student)
  @ApiOperation({ summary: 'Enviar un mensaje a una clase' })
  @ApiBody({
    description: 'Datos del mensaje',
    schema: {
      example: {
        classId: '9d49ff99-8e60-48a6-93c7-96b1c77d13a2',
        senderId: '02f40a4a-ee82-4aeb-80ea-e671a6994c12',
        content: '¡Hola! ¿Ya comenzó la clase?',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Mensaje guardado exitosamente',
  })
  async sendMessage(@Body() body: CreateChatDto) {
    try {
      return await this.chatService.saveMessage(body);
    } catch (error) {
      throw new InternalServerErrorException('Error al guardar el mensaje');
    }
  }
}