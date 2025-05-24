// src/submission/submission.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './submission.entity';
import { CreateSubmissionDto } from './dto/CreateSubmissions.dto';
import { UpdateSubmissionDto } from './dto/updatesubmission.dto';
import { User } from '../users/user.entity';
import { Task } from '../task/task.entity';
import { cloudinary } from '../config/cloudinary.config';
import { Class } from '../classes/class.entity';

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
    private ClassRepo: Repository<Class>
  ) {}

  async create(dto: CreateSubmissionDto, studentId: string) {
    const student = await this.userRepo.findOne({ where: { id: studentId } });
    const task = await this.taskRepo.findOne({ where: { id: dto.taskId.toString() } });
    const clase = await this.ClassRepo.findOne({where: {id:dto.classId.toString()}})

    if (!student || !task || !clase) {
      throw new NotFoundException('Estudiante o tarea no encontrados');
    }

      
    // ⏬ Cargar a Cloudinary en la carpeta adecuada
    const folderName = `classes/${clase.title.replace(/ /g, '_')}-${clase.id}`;
    const uploaded = await cloudinary.uploader.upload(dto.content, {
      folder: folderName,
      resource_type: 'auto',
    });

    const submission = this.submissionsRepo.create({
      content: uploaded.secure_url, // viene como file.path desde Cloudinary
      student,
      task,
    });

    return this.submissionsRepo.save(submission);
  }

  findAll() {
  return this.submissionsRepo.find({
    where: { estado: true },
    relations: ['student', 'task'],
  });
}


  findOne(id: string) {
    return this.submissionsRepo.findOne({ where: { id }, relations: ['student', 'task'] });
  }

  async update(id: string, dto: UpdateSubmissionDto) {
    const submission = await this.submissionsRepo.findOne({ where: { id } });
    if (!submission) throw new NotFoundException('Submission not found');

    Object.assign(submission, dto);
    return this.submissionsRepo.save(submission);
  }

  

  async findByStudent(studentId: string) {
  return this.submissionsRepo.find({
    where: { student: { id: studentId }, estado: true },
    relations: ['task'],
  });
}


  async findByTask(taskId: string) {
    return this.submissionsRepo.find({
      where: { task: { id: taskId.toString() } },
      relations: ['student'],
    });
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

  async findEliminadas(): Promise<Submission[]> {
  return this.submissionsRepo.find({
    where: { estado: false },
    relations: ['student', 'task'],
  });
}

}
