import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './chat.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { User } from '../users/user.entity';
import { Class } from '../classes/class.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatRepo: Repository<ChatMessage>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,
  ) {}

  async saveMessage(dto: CreateChatDto): Promise<ChatMessage> {
    const sender = await this.userRepo.findOneBy({ id: dto.senderId });
    const classRoom = await this.classRepo.findOneBy({ id: dto.classId });

    if (!sender || !classRoom) {
      throw new Error('Usuario o clase no encontrados');
    }

    const message = this.chatRepo.create({
      content: dto.content,
      sender,
      classRoom,
    });

    return this.chatRepo.save(message);
  }

  async getMessagesByClass(classId: string): Promise<ChatMessage[]> {
    return this.chatRepo.find({
      where: { classRoom: { id: classId } },
      order: { createdAt: 'ASC' },
    });
  }
}
