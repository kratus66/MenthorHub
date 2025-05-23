import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './class.entity';
import { User } from '../users/user.entity';
import { Category } from '../entities/categorias.entities';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from '../dto/update-class.dto';
import { cloudinary } from '../config/cloudinary.config';
import { isInstance } from 'class-validator';
import { InternalServerErrorException } from '@nestjs/common';

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
  
    // Creamos la clase en base de datos
    const newClass = this.classRepository.create({
      title,
      description,
      materia,
      multimedia: multimediaUrls,
      teacher,
      category,
    });
  
    const savedClass = await this.classRepository.save(newClass); // 👈 Ya tiene ID
  
    try {
      await cloudinary.api.create_folder(`classes/${savedClass.title.replace(/ /g, '_')}-${savedClass.id}`);
    } catch (error) {
      if (error instanceof Error) {
        console.warn(`⚠️ La carpeta ya existe o no se pudo crear: ${savedClass.title.replace(/ /g, '_')}-${savedClass.id}`, error.message);
      } else {
        console.warn(`⚠️ La carpeta ya existe o no se pudo crear: ${savedClass.title.replace(/ /g, '_')}-${savedClass.id}`, 'Error desconocido');
      }
    }
    return savedClass;
  }

  async update(id: string, updateDto: UpdateClassDto): Promise<Class> {
    const classToUpdate = await this.classRepository.findOne({ where: { id } });
    if (!classToUpdate) throw new NotFoundException('Clase no encontrada');
    Object.assign(classToUpdate, updateDto);
    return this.classRepository.save(classToUpdate);
  }

  async findAll(): Promise<Class[]> {
  return this.classRepository.find({
    where: { estado: true },
    relations: ['teacher', 'students', 'tasks', 'category'],
  });
  }

  async findOne(id: string): Promise<Class> {
  const found = await this.classRepository.findOne({
    where: { id, estado: true },
    relations: ['teacher', 'students', 'tasks', 'category'],
  });

  if (!found) {
    throw new NotFoundException(`Clase con ID ${id} no encontrada`);
  }

  return found;
}

  async remove(id: string): Promise<void> {
  console.log('🕵️ Buscando clase con ID:', id);

  const classToRemove = await this.classRepository.findOne({
    where: { id },
    loadRelationIds: false, // 👈 importante: evita problemas con relaciones
  });

  if (!classToRemove) {
    console.warn('❌ Clase no encontrada en la base de datos');
    throw new NotFoundException('Clase no encontrada');
  }

  classToRemove.estado = false;
  classToRemove.fechaEliminado = new Date();

  try {
    await this.classRepository.save(classToRemove);
  } catch (error) {
    console.error('❌ Error al guardar la clase eliminada:', error);
    throw new InternalServerErrorException('Error al eliminar la clase');
  }
}

  async findDeleted(): Promise<Class[]> {
  return this.classRepository.find({
    where: { estado: false },
    relations: ['teacher', 'students', 'tasks', 'category'],
  });
}

async restore(id: string): Promise<Class> {
  const classToRestore = await this.classRepository.findOne({ where: { id } });

  if (!classToRestore) {
    throw new NotFoundException('Clase no encontrada');
  }

  classToRestore.estado = true;
  classToRestore.fechaEliminado = undefined; // ← esto corrige el segundo error

  return this.classRepository.save(classToRestore);
}

  async findByTeacher(teacherId: string): Promise<Class[]> {
  const teacher = await this.userRepository.findOne({ where: { id: teacherId, role: 'teacher' } });

  if (!teacher) {
    throw new NotFoundException(`Profesor con ID ${teacherId} no encontrado`);
  }

  return this.classRepository.find({
    where: { teacher: { id: teacherId }, estado: true },
    relations: ['category', 'students', 'tasks'],
  });
}

  async findByStudent(studentId: string): Promise<Class[]> {
  const student = await this.userRepository.findOne({ where: { id: studentId, role: 'student' } });

  if (!student) {
    throw new NotFoundException(`Estudiante con ID ${studentId} no encontrado`);
  }

    return this.classRepository
    .createQueryBuilder('class')
    .leftJoinAndSelect('class.teacher', 'teacher')
    .leftJoinAndSelect('class.students', 'students')
    .leftJoinAndSelect('class.tasks', 'tasks')
    .leftJoinAndSelect('class.category', 'category')
    .where('class.estado = :estado', { estado: true })
    .andWhere('students.id = :studentId', { studentId })
    .getMany();
  }

  async enrollStudent(classId: string, studentId: string): Promise<Class> {
  const clase = await this.classRepository.findOne({
    where: { id: classId, estado: true },
    relations: ['students'],
  });

  if (!clase) {
    throw new NotFoundException('Clase no encontrada o inactiva');
  }

  const student = await this.userRepository.findOne({ where: { id: studentId, role: 'student' } });

  if (!student) {
    throw new NotFoundException('Estudiante no encontrado');
  }

  const alreadyEnrolled = clase.students.some((s) => s.id === studentId);
  if (alreadyEnrolled) {
    throw new Error('El estudiante ya está inscrito en esta clase');
  }

  clase.students.push(student);

  return this.classRepository.save(clase);
}

  async unenrollStudent(classId: string, studentId: string): Promise<Class> {
  const clase = await this.classRepository.findOne({
    where: { id: classId, estado: true },
    relations: ['students'],
  });

  if (!clase) {
    throw new NotFoundException('Clase no encontrada o inactiva');
  }

  const studentIndex = clase.students.findIndex((s) => s.id === studentId);

  if (studentIndex === -1) {
    throw new NotFoundException('El estudiante no está inscrito en esta clase');
  }

  clase.students.splice(studentIndex, 1); // ❌ Remueve del array

  return this.classRepository.save(clase);
}


}
