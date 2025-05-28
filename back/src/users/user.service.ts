import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.usersRepository.findAndCount({
      where: { estado: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id, estado: true } });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new Error('Usuario no encontrado');

    if (data.estado !== undefined && data.estado !== user.estado) {
      data.fechaCambioEstado = new Date();
    }

    await this.usersRepository.update(id, data);

    const updated = await this.usersRepository.findOne({ where: { id } });
    if (!updated) throw new Error('No se pudo recuperar el usuario actualizado');
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.update(id, {
      estado: false,
      fechaCambioEstado: new Date(),
    });
  }

  async getTeachers(page = 1, limit = 10) {
    const [data, total] = await this.usersRepository.findAndCount({
      where: { role: 'teacher', estado: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async getStudents(page = 1, limit = 10) {
    const [data, total] = await this.usersRepository.findAndCount({
      where: { role: 'student', estado: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }
}

