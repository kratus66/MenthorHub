import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './class.entity';
import { User } from '../users/user.entity';
import { Category } from '../entities/categorias.entities';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from '../dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class) private readonly classRepository: Repository<Class>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
  ) {}

  async create(createDto: CreateClassDto, files?: Express.Multer.File[]): Promise<Class> {
    const { title, description, teacherId, categoryId, materia } = createDto;

    const teacher = await this.userRepository.findOne({ where: { id: teacherId, role: 'teacher' } });
    if (!teacher) throw new NotFoundException('Profesor no encontrado');

    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) throw new NotFoundException('Categoría no encontrada');

    const multimediaUrls = files?.map((file) => file.path) ?? [];

    const newClass = this.classRepository.create({
      title,
      description,
      materia,
      multimedia: multimediaUrls,
      teacher,
      category
    });

    return this.classRepository.save(newClass);
  }

  async update(id: string, updateDto: UpdateClassDto): Promise<Class> {
    const classToUpdate = await this.classRepository.findOne({ where: { id } });
    if (!classToUpdate) throw new NotFoundException('Clase no encontrada');
    Object.assign(classToUpdate, updateDto);
    return this.classRepository.save(classToUpdate);
  }

  async findAll(): Promise<Class[]> {
    return this.classRepository.find({ relations: ['teacher', 'students', 'tasks', 'category'] });
  }

  async findOne(id: string): Promise<Class> {
    const found = await this.classRepository.findOne({
      where: { id },
      relations: ['teacher', 'students', 'tasks', 'category']
    });
    if (!found) throw new NotFoundException(`Clase con ID ${id} no encontrada`);
    return found;
  }

  async remove(id: string): Promise<void> {
    const result = await this.classRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Clase no encontrada');
  }
}
