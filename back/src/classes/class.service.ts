import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Class } from './class.entity';
import { User } from '../users/user.entity';
import { Category } from '../categorias/categorias.entity';
import { Materias } from '../materias/materias.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from '../dto/update-class.dto';
// import { cloudinary } from '../config/cloudinary.config'; // No longer needed for direct folder creation
import { Payment, PaymentStatus, PaymentType } from '../payment/payment.entity';
import { PaymentsService } from '../payment/payment.service';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service'; // Added CloudinaryService import

@Injectable()
export class ClassesService {
  constructor(
     @InjectRepository(Class)
     private readonly classRepository: Repository<Class>,
     @InjectRepository(User)
     private readonly userRepository: Repository<User>,
     @InjectRepository(Category)
     private readonly categoryRepository: Repository<Category>,
     @InjectRepository(Materias)
     private readonly materiaRepository: Repository<Materias>,
     @InjectRepository(Payment)
     private readonly paymentRepository: Repository<Payment>,
     private readonly paymentsService: PaymentsService,
     private cloudinaryService: CloudinaryService // Injected CloudinaryService
  ) {}

  async create(
     createDto: CreateClassDto,
     files?: Express.Multer.File[],
     userId?: string
  ): Promise<Class> {
     console.log('📥 Datos recibidos en create:', createDto);

     // 🔐 Validación para evitar uso de otro teacherId
     if (userId && createDto.teacherId !== userId) {
        console.log('⛔ Intento de crear clase con teacherId ajeno');
        throw new ForbiddenException(
           'No puedes crear clases a nombre de otro profesor'
        );
     }

     const { title, description, teacherId, categoryId, materiaId } =
        createDto;

     const teacher = await this.userRepository.findOne({
        where: { id: teacherId, role: 'teacher' },
     });
     if (!teacher) throw new NotFoundException('Profesor no encontrado');

     // 🚫 Si no ha pagado y ya tiene 1 clase, no puede crear más
     const teacherClassesCount = await this.classRepository.count({
        where: { teacher: { id: teacherId }, estado: true, isDeleted: false }, // Added isDeleted filter
     });
     if (!teacher.isPaid && teacherClassesCount >= 1) {
        throw new ForbiddenException(
           'Debes pagar el plan mensual para crear más de 1 clase'
        );
     }

     // 🔐 Si es usuario pago, valida el pago activo
     if (teacher.isPaid) {
        await this.paymentsService.validateUserPaid(
           teacherId,
           this.getCurrentMonth()
        );
     }

     const category = await this.categoryRepository.findOne({
        where: { id: categoryId },
     });
     if (!category) throw new NotFoundException('Categoría no encontrada');

     const materia = await this.materiaRepository.findOne({
        where: { id: materiaId },
     });
     if (!materia) throw new NotFoundException('Materia no encontrada');

     // Paso 1: Crear la clase sin multimedia inicialmente
     const newClass = this.classRepository.create({
        title,
        description,
        materia,
        multimedia: [], // Start with an empty multimedia array
        teacher,
        category,
        isDeleted: false, // Ensure new record is not deleted
     });

     const savedClass = await this.classRepository.save(newClass);
     console.log('✅ Clase guardada con ID:', savedClass.id);

     // Paso 2: Subir archivos a carpeta específica en Cloudinary
     const multimediaUrls: string[] = [];
     if (files && files.length > 0) {
        // Create a folder path based on class title and ID
        const folderPath = `mentorhub/clases/${savedClass.title.replace(/ /g, '_')}-${savedClass.id}`;

        for (const file of files) {
           try {
              const uploadResult = await this.cloudinaryService.uploadFile(file.buffer, {
                 folder: folderPath,
                 resource_type: file.mimetype.startsWith('video/') ? 'video' : 'auto',
                 public_id: `${Date.now()}-${file.originalname}`, // Generate a unique public_id
              });
              multimediaUrls.push(uploadResult.secure_url);
           } catch (uploadError) {
              console.error(`❌ Error uploading file ${file.originalname}:`, uploadError);
              // Decide how to handle upload errors: throw, log and continue, etc.
              // For now, we'll just log and continue with other files.
           }
        }
     }

     // Paso 3: Actualizar la clase con las URLs de multimedia obtenidas
     if (multimediaUrls.length > 0) {
         savedClass.multimedia = multimediaUrls;
         await this.classRepository.save(savedClass); // Save again to update multimedia URLs
         console.log(`🖼️ Clase ${savedClass.id} actualizada con ${multimediaUrls.length} archivos multimedia.`);
     }


     // Removed the old cloudinary.api.create_folder call as uploadFile handles folder creation

     return savedClass;
  }

  private getCurrentMonth(): string {
     const now = new Date();
     return `${now.getFullYear()}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;
  }

  async update(id: string, updateDto: UpdateClassDto): Promise<Class> {
     console.log('🛠️ Actualizando clase:', id);
     const classToUpdate = await this.classRepository.findOne({
        where: { id, isDeleted: false }, // Added isDeleted filter
     });
     if (!classToUpdate) throw new NotFoundException('Clase no encontrada');

     Object.assign(classToUpdate, updateDto);
     return this.classRepository.save(classToUpdate);
  }

  async findAll(): Promise<Class[]> {
     console.log('📚 Buscando todas las clases activas');
     return this.classRepository.find({
        where: { estado: true, isDeleted: false }, // Added isDeleted filter
        relations: ['teacher', 'students', 'tasks', 'category', 'reviews'],
     });
  }

  async findOne(id: string): Promise<Class> {
     console.log('🔍 Buscando clase por ID:', id);
     const found = await this.classRepository.findOne({
        where: { id, estado: true, isDeleted: false }, // Added isDeleted filter
        relations: ['teacher', 'students', 'tasks', 'category', 'reviews'],
     });
     if (!found)
        throw new NotFoundException(`Clase con ID ${id} no encontrada`);
     return found;
  }

  // Nuevo método para soft delete (borrado lógico)
  async softDelete(id: string): Promise<{ affected: number }> {
     console.log('🗑️ Borrado lógico (soft) de clase ID:', id);
     const classToDelete = await this.classRepository.findOne({
       where: { id, isDeleted: false },
     });
     if (!classToDelete) throw new NotFoundException('Clase no encontrada o ya eliminada');
     const result = await this.classRepository.update(id, {
       isDeleted: true,
       estado: false,
       fechaEliminado: new Date(),
     });
     console.log('Resultado softDelete:', result);
     return { affected: result.affected || 0 };
  }

  async remove(id: string): Promise<void> {
     console.log('🕵️ Buscando clase con ID:', id);
     const classToRemove = await this.classRepository.findOne({
        where: { id },
     });
     if (!classToRemove) throw new NotFoundException('Clase no encontrada');
     classToRemove.estado = false;
     classToRemove.fechaEliminado = new Date();
     await this.classRepository.save(classToRemove);
  }

  async restore(id: string, userId: string) {
    const clase = await this.classRepository.findOne({
      where: { id },
      withDeleted: true,
      relations: ['teacher'],
    });

    if (!clase || clase.teacher.id !== userId) {
      throw new ForbiddenException('No tienes permiso para restaurar esta clase');
    }

    await this.classRepository.restore(id);
    // Opcional: puedes devolver la clase restaurada si lo necesitas
    return this.classRepository.findOne({ where: { id }, relations: ['teacher'] });
  }

  async findDeleted(userId: string) {
    return this.classRepository.find({
      withDeleted: true,
      where: {
        teacher: { id: userId },
        isDeleted: true,
      },
      relations: ['category', 'teacher'],
    });
  }

  async findByTeacher(
     teacherId: string,
     page = 1,
     limit = 10
  ): Promise<{
     data: Class[];
     total: number;
     page: number;
     limit: number;
  }> {
     console.log('👨‍🏫 Buscando clases del profesor ID:', teacherId);

     const teacher = await this.userRepository.findOne({
        where: { id: teacherId, role: 'teacher' },
     });
     if (!teacher)
        throw new NotFoundException(
           `Profesor con ID ${teacherId} no encontrado`
        );

     const [data, total] = await this.classRepository.findAndCount({
        where: { teacher: { id: teacherId }, estado: true, isDeleted: false }, // Added isDeleted filter
        relations: ['category', 'students', 'tasks', 'reviews'],
        skip: (page - 1) * limit,
        take: limit,
     });

     return { data, total, page, limit };
  }

  async findByStudent(studentId: string): Promise<Class[]> {
     console.log('🎓 Buscando clases del estudiante ID:', studentId);
     const student = await this.userRepository.findOne({
        where: { id: studentId, role: 'student' },
     });
     if (!student)
        throw new NotFoundException(
           `Estudiante con ID ${studentId} no encontrado`
        );

     return this.classRepository
        .createQueryBuilder('class')
        .leftJoinAndSelect('class.teacher', 'teacher')
        .leftJoinAndSelect('class.students', 'students')
        .leftJoinAndSelect('class.tasks', 'tasks')
        .leftJoinAndSelect('class.category', 'category')
        .leftJoinAndSelect('class.reviews', 'reviews')
        .where('class.estado = :estado', { estado: true })
        .andWhere('class.isDeleted = :isDeleted', { isDeleted: false }) // Added isDeleted filter
        .andWhere('students.id = :studentId', { studentId })
        .getMany();
  }

  async enrollStudent(classId: string, studentId: string): Promise<Class> {
     console.log(
        '➕ Inscribiendo estudiante ID:',
        studentId,
        'a clase ID:',
        classId
     );

     const clase = await this.classRepository.findOne({
        where: { id: classId, estado: true, isDeleted: false }, // Added isDeleted filter
        relations: ['students', 'teacher'],
     });
     if (!clase) throw new NotFoundException('Clase no encontrada o inactiva');

     const student = await this.userRepository.findOne({
        where: { id: studentId, role: 'student' },
     });
     if (!student) throw new NotFoundException('Estudiante no encontrado');

     const alreadyEnrolled = clase.students.some((s) => s.id === studentId);
     if (alreadyEnrolled)
        throw new Error('El estudiante ya está inscrito en esta clase');

     // ✅ Si es usuario pago, acceso ilimitado
     if (student.isPaid) {
        clase.students.push(student);
        await this.classRepository.save(clase);
        return clase;
     }

     // 🚫 Si NO es pago, validar límite de 2 clases
     const enrolledCount = await this.classRepository
        .createQueryBuilder('class')
        .leftJoin('class.students', 'student')
        .where('student.id = :studentId', { studentId })
        .andWhere('class.isDeleted = :isDeleted', { isDeleted: false }) // Added isDeleted filter
        .getCount();

     if (enrolledCount >= 2) {
        console.log(
           '⛔ Estudiante excedió el límite sin plan mensual premium'
        );
        throw new ForbiddenException(
           'Debes pagar la suscripción mensual Premium para unirte a más de 2 clases'
        );
     }

     // Permitir inscribir dentro del límite
     clase.students.push(student);
     await this.classRepository.save(clase);
     return clase;
  }

  async unenrollStudent(classId: string, studentId: string): Promise<Class> {
     console.log(
        '➖ Desinscribiendo estudiante ID:',
        studentId,
        'de clase ID:',
        classId
     );

     const clase = await this.classRepository.findOne({
        where: { id: classId, estado: true, isDeleted: false }, // Added isDeleted filter
        relations: ['students'],
     });
     if (!clase) throw new NotFoundException('Clase no encontrada o inactiva');

     const studentIndex = clase.students.findIndex((s) => s.id === studentId);
     if (studentIndex === -1)
        throw new NotFoundException(
           'El estudiante no está inscrito en esta clase'
        );

     clase.students.splice(studentIndex, 1);
     return this.classRepository.save(clase);
  }
}
