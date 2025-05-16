import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './class.entity';
import { User } from '../users/user.entity';
import { Category } from '../entities/categorias.entities';
import { CreateClassDto } from '../dto/CreateClassDto';
import { UpdateClassDto } from '../dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createDto: CreateClassDto): Promise<Class> {
    const { title, description, teacherId, categoryId } = createDto;

    // Buscar el profesor real
    const teacher = await this.userRepository.findOne({ where: { id: teacherId as string } });

    if (!teacher) {
      throw new NotFoundException('Profesor no encontrado');
    }
    
    // Buscar la categoría real
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }

    // Crear la nueva clase usando el repositorio
    const newClass = this.classRepository.create({
      title,
      description,
      teacher,
      category,
      students: [],
      tasks: [],
    });

    return await this.classRepository.save(newClass);
  }

  async update(id: number, updateDto: UpdateClassDto): Promise<Class> {
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
    // Incluye relaciones para devolver datos completos
    return await this.classRepository.find({ relations: ['teacher', 'category', 'students', 'tasks'] });
  }

  async findOne(id: number): Promise<Class> {
    const found = await this.classRepository.findOne({
      where: { id },
      relations: ['teacher', 'category', 'students', 'tasks'],
    });
    if (!found) throw new NotFoundException(`Curso con ID ${id} no encontrado`);
    return found;
  }

  async remove(id: number): Promise<void> {
    const result = await this.classRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Curso no encontrado');
  }
}
