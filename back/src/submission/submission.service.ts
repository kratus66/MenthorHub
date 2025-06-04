import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './submission.entity';
import { CreateSubmissionDto } from './dto/CreateSubmissions.dto';
import { UpdateSubmissionDto } from './dto/updatesubmission.dto';
import { User } from '../users/user.entity';
import { Task } from '../task/task.entity';
import { Class } from '../classes/class.entity';
import { PaymentsService } from '../payment/payment.service';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
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
  
    // Validar que la tarea exista y pertenezca a la clase especificada (opcional)
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ['classRef'], // asumiendo que Task tiene relación con Class
    });
    if (!task) throw new NotFoundException('Tarea no encontrada');
  
    if (task.classRef.id !== classId) {
      throw new BadRequestException('La tarea no pertenece a la clase especificada');
    }
  
    // Crear la entrega con la URL ya subida
    const newSubmission = this.submissionsRepo.create({
      task,
      student,
      content: fileUrl,  // <--- aquí asignas la URL directamente
      createdAt: new Date(),
      isGraded: false,
      estado: true,
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
      where: { estado: true },
      relations: ['student', 'task'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findEliminadas(page = 1, limit = 10) {
    const [data, total] = await this.submissionsRepo.findAndCount({
      where: { estado: false },
      relations: ['student', 'task'],
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOne(id: string) {
    return this.submissionsRepo.findOne({
      where: { id },
      relations: ['student', 'task'],
    });
  }

  async findByStudent(studentId: string) {
    return this.submissionsRepo.find({
      where: { student: { id: studentId }, estado: true },
      relations: ['task'],
    });
  }

  async findByTask(taskId: string) {
    return this.submissionsRepo.find({
      where: { task: { id: taskId } },
      relations: ['student'],
    });
  }

  async update(id: string, dto: UpdateSubmissionDto) {
    const submission = await this.submissionsRepo.findOne({ where: { id } });
    if (!submission) throw new NotFoundException('Submission not found');
    Object.assign(submission, dto);
    return this.submissionsRepo.save(submission);
  }

  async remove(id: string) {
    const submission = await this.submissionsRepo.findOne({ where: { id } });
    if (!submission) {
      throw new NotFoundException(`Submission with id ${id} not found`);
    }
    submission.estado = false;
    submission.fechaEliminado = new Date();
    return this.submissionsRepo.save(submission);
  }

  async restore(id: string): Promise<Submission> {
    const submission = await this.submissionsRepo.findOne({ where: { id } });
    if (!submission) {
      throw new NotFoundException(`Submission con id ${id} no encontrada`);
    }
    submission.estado = true;
    submission.fechaEliminado = null;
    return this.submissionsRepo.save(submission);
  }
}
