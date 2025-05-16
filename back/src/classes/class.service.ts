import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './class.entity';
import { User } from '../users/user.entity';
import { CreateClassDto } from '../dto/create-class.dto';
import { UpdateClassDto } from '../dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createDto: CreateClassDto): Promise<Class> {
    const { title, description, teacherId } = createDto;

    const teacher = await this.userRepository.findOne({
      where: { id: teacherId, role: 'teacher' },
    });

    if (!teacher) throw new NotFoundException('Profesor no encontrado');

    const newClass = this.classRepository.create({
      title,
      description,
      teacher,
    });

    return this.classRepository.save(newClass);
  }

  async update(id: string, updateDto: UpdateClassDto): Promise<Class> {
    const classToUpdate = await this.classRepository.findOne({ where: { id }, relations: ['teacher', 'category'] });

    if (!classToUpdate) throw new NotFoundException('Curso no encontrado');

    const { title, description, teacherId, categoryId } = updateDto;

    // Actualizar título y descripción si se proveen
    if (title) classToUpdate.title = title;
    if (description) classToUpdate.description = description;

    // Si se provee nuevo teacherId, buscarlo
    if (teacherId) {
      const newTeacher = await this.userRepository.findOne({ where: { id: teacherId } });

      if (!newTeacher) throw new NotFoundException('Nuevo profesor no encontrado');
      classToUpdate.teacher = newTeacher;
    }

    // Si se provee nuevo categoryId, buscarlo
    if (categoryId) {
      const newCategory = await this.categoryRepository.findOne({ where: { id: categoryId } });
      if (!newCategory) throw new NotFoundException('Nueva categoría no encontrada');
      classToUpdate.category = newCategory;
    }

    return await this.classRepository.save(classToUpdate);
  }

  async findAll(): Promise<Class[]> {
    return this.classRepository.find({ relations: ['teacher', 'students', 'tasks'] });
  }

  async findOne(id: string): Promise<Class> {
    const found = await this.classRepository.findOne({
      where: { id },
      relations: ['teacher', 'students', 'tasks'],
    });
    if (!found) throw new NotFoundException(`Clase con ID ${id} no encontrada`);
    return found;
  }

  async remove(id: string): Promise<void> {
    const result = await this.classRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Clase no encontrada');
  }
}
