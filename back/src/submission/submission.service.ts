import { BadRequestException, ForbiddenException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './submission.entity';
import { CreateSubmissionDto } from './dto/CreateSubmissions.dto';
import { UpdateSubmissionDto } from './dto/updatesubmission.dto';
import { User } from '../users/user.entity';
import { Task } from '../task/task.entity'; // Asegúrate de que la ruta sea correcta si es diferente
import { Class } from '../classes/class.entity'; // Asegúrate de que la ruta sea correcta si es diferente
import { PaymentsService } from '../payment/payment.service'; // Asegúrate de que la ruta sea correcta si es diferente
import { CloudinaryService } from '../common/cloudinary/cloudinary.service'; // Asegúrate de que la ruta sea correcta si es diferente

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private submissionsRepo: Repository<Submission>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
    @InjectRepository(Class)
    private classRepo: Repository<Class>,
    private readonly paymentsService: PaymentsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createSubmission(
    createDto: CreateSubmissionDto,
    fileUrl: string,
    userId: string,
  ): Promise<Submission> {
    console.log('📥 Datos recibidos en createSubmission:', createDto);

    const { taskId, classId } = createDto;

    if (!userId) {
      throw new ForbiddenException('No se ha especificado el usuario que entrega');
    }

    // Obtener estudiante y validar rol
    const student = await this.userRepo.findOne({
      where: { id: userId, role: 'student' },
    });
    if (!student) throw new NotFoundException('Estudiante no encontrado');

    // Validar que la tarea exista y pertenezca a la clase especificada
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ['classRef'], // asumiendo que Task tiene relación con Class
    });
    if (!task) throw new NotFoundException('Tarea no encontrada');

    if (task.classRef.id !== classId) {
      throw new BadRequestException('La tarea no pertenece a la clase especificada');
    }

    // Opcional: Verificar si el estudiante ya ha enviado una entrega para esta tarea
    const existingSubmission = await this.submissionsRepo.findOne({
      where: { task: { id: taskId }, student: { id: userId } },
    });
    if (existingSubmission) {
       // Puedes decidir si lanzar un error o actualizar la entrega existente.
       // Si decides actualizar, necesitarías lógica adicional aquí.
       throw new BadRequestException('Ya has enviado una entrega para esta tarea.');
    }


    // Crear la entrega con la URL ya subida
    const newSubmission = this.submissionsRepo.create({
      task,
      student,
      content: fileUrl,
      createdAt: new Date(),
      isGraded: false, // Inicialmente no calificada
      estado: true, // Asumo que estado true significa activa/visible
      // grade se inicializa como null por defecto en la entidad si está definida
    });

    const savedSubmission = await this.submissionsRepo.save(newSubmission);
    console.log('✅ Entrega guardada con ID:', savedSubmission.id);

    return savedSubmission;
  }


  private getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  }

  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.submissionsRepo.findAndCount({
      where: { estado: true }, // Asumo que estado true significa no eliminada lógicamente
      relations: ['student', 'task'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findEliminadas(page = 1, limit = 10) {
    const [data, total] = await this.submissionsRepo.findAndCount({
      where: { estado: false }, // Asumo que estado false significa eliminada lógicamente
      relations: ['student', 'task'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    const submission = await this.submissionsRepo.findOne({
      where: { id, estado: true }, // Asumo que solo buscas activas por defecto
      relations: ['student', 'task'],
    });
     if (!submission) {
       throw new NotFoundException(`Submission with id ${id} not found or is not active`);
     }
     return submission;
  }

  async findByStudent(studentId: string) {
    return this.submissionsRepo.find({
      where: { student: { id: studentId }, estado: true }, // Asumo que solo buscas activas
      relations: ['task', 'task.classRef'], // Incluir relación con la clase si es útil en el frontend
      order: { createdAt: 'DESC' }, // Opcional: ordenar por fecha
    });
  }

  async findByTask(taskId: string) {
    // Este método ya lo tenías y es el que necesita el endpoint /task/:taskId
    return this.submissionsRepo.find({
      where: { task: { id: taskId }, estado: true }, // Asumo que solo buscas activas
      relations: ['student', 'task'], // Incluir estudiante para mostrar quién entregó
      order: { createdAt: 'ASC' }, // Opcional: ordenar por fecha
    });
  }

  async update(id: string, dto: UpdateSubmissionDto) {
    const submission = await this.submissionsRepo.findOne({ where: { id, estado: true } }); // Solo actualizar si está activa
    if (!submission) throw new NotFoundException('Submission not found or is not active');

    // Aquí podrías añadir validaciones adicionales, por ejemplo,
    // si solo se permite actualizar ciertos campos o por ciertos roles.

    Object.assign(submission, dto);

    // Si el DTO incluye 'grade', actualiza 'isGraded'
    if (dto.grade !== undefined) {
        submission.isGraded = dto.grade !== null; // Marca como calificada si grade no es null
    }


    return this.submissionsRepo.save(submission);
  }

  // NUEVO MÉTODO: Actualizar calificaciones para múltiples entregas de una tarea
  async updateGrades(
    taskId: string,
    submissionsToGrade: Array<{ id: string; grade: number | null }>,
    // Opcional: teacherId para validar permisos
    // teacherId: string
  ): Promise<Submission[]> {
    const updatedSubmissions: Submission[] = [];

    // Opcional: Validar que la tarea existe y pertenece al profesor (si teacherId se pasa)
    // if (teacherId) {
    //   const task = await this.taskRepo.findOne({
    //     where: { id: taskId, teacher: { id: teacherId } }, // Asumiendo relación Task -> Teacher
    //   });
    //   if (!task) {
    //     throw new ForbiddenException('No tienes permiso para calificar entregas de esta tarea.');
    //   }
    // }


    for (const submissionData of submissionsToGrade) {
      // Buscar la entrega asegurándose de que pertenece a la tarea correcta y está activa
      const submission = await this.submissionsRepo.findOne({
        where: { id: submissionData.id, task: { id: taskId }, estado: true },
      });

      if (!submission) {
        console.warn(`Entrega con ID ${submissionData.id} no encontrada, no activa o no pertenece a la tarea ${taskId}. Saltando.`);
        continue; // Saltar esta entrega si no se encuentra o no coincide
      }

      // Actualizar la calificación y marcar como calificada si se asigna una calificación
      submission.grade = submissionData.grade;
      submission.isGraded = submissionData.grade !== null; // Marca como calificada si grade no es null

      try {
        const updated = await this.submissionsRepo.save(submission);
        updatedSubmissions.push(updated);
      } catch (error) {
         console.error(`Error al guardar la entrega ${submissionData.id}:`, error);
         // Decide cómo manejar errores individuales: lanzar excepción, log y continuar, etc.
         // Por ahora, logueamos y continuamos.
      }
    }

    // Puedes decidir si devolver todas las entregas de la tarea después de actualizar,
    // o solo las que fueron actualizadas. Devolver las actualizadas es más directo.
    // Si necesitas devolver todas, llama a this.findByTask(taskId) aquí.

    return updatedSubmissions; // Devuelve las entregas que se actualizaron con éxito
  }


  async remove(id: string) {
    const submission = await this.submissionsRepo.findOne({ where: { id, estado: true } }); // Solo eliminar si está activa
    if (!submission) {
      throw new NotFoundException(`Submission with id ${id} not found or is not active`);
    }
    // Realizar soft-delete actualizando el estado y fechaEliminado
    submission.estado = false;
    submission.fechaEliminado = new Date(); // Asegúrate de que tu entidad Submission tenga este campo
    return this.submissionsRepo.save(submission);
  }

  async restore(id: string): Promise<Submission> {
    const submission = await this.submissionsRepo.findOne({ where: { id, estado: false } }); // Solo restaurar si está inactiva
    if (!submission) {
      throw new NotFoundException(`Submission con id ${id} no encontrada o no está eliminada`);
    }
    // Restaurar
    submission.estado = true;
    submission.fechaEliminado = null; // Limpiar la fecha de eliminación
    return this.submissionsRepo.save(submission);
  }
}
