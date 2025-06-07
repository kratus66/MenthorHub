import { Controller, Post, Body, InternalServerErrorException } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { AskBotDto } from '../chatbot/dto/ask-bot.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('ask')
  @ApiOperation({ summary: 'Enviar mensaje al chatbot' })
  @ApiResponse({
    status: 201,
    description: 'Respuesta generada por el chatbot',
    schema: {
      example: {
        response: 'La capital de Colombia es Bogotá.',
      },
    },
  })
  @ApiBody({ type: AskBotDto })
  async askBot(@Body() askBotDto: AskBotDto) {
    try {
      const response = await this.chatbotService.getBotResponse(askBotDto.message);
      return { response };
    } catch (error) {
      throw new InternalServerErrorException('Error al procesar la respuesta del chatbot');
    }
  }
}
