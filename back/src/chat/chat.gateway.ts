import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    const history = await this.chatService.getMessagesByClass(room);
    client.emit('chatHistory', history);
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    data: { room: string; message: string; senderId: string },
  ) {
    const saved = await this.chatService.saveMessage({
      content: data.message,
      senderId: data.senderId,
      classId: data.room,
    });

    this.server.to(data.room).emit('message', saved);
  }
}
