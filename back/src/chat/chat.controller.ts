import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('class/:classId')
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
  findMessagesByClass(@Param('classId') classId: string) {
    return this.chatService.getMessagesByClass(classId);
  }
}
