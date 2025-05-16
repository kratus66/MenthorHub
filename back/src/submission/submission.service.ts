import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './submission.entity';
import { CreateSubmissionDto } from './dto/CreateSubmissions.dto';
import { UpdateSubmissionDto } from './dto/updatesubmission.dto';
import { User } from '../users/user.entity';
import { Task } from '../task/task.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private submissionsRepo: Repository<Submission>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
  ) {}

  async create(dto: CreateSubmissionDto, studentId: number) {
const student = await this.userRepo.findOne({ where: { id: String(studentId) } });
    const task = await this.taskRepo.findOne({ where: { id: dto.taskId } });

    if (!student || !task) {
      throw new NotFoundException('Estudiante o tarea no encontrados');
    }

    const submission = this.submissionsRepo.create({
      content: dto.content,
      student,
      task,
    });

    return this.submissionsRepo.save(submission);
  }

  findAll() {
    return this.submissionsRepo.find({ relations: ['student', 'task'] });
  }

  findOne(id: number) {
    return this.submissionsRepo.findOne({ where: { id }, relations: ['student', 'task'] });
  }

  async update(id: number, dto: UpdateSubmissionDto) {
    const submission = await this.submissionsRepo.findOne({ where: { id } });
    if (!submission) throw new NotFoundException('Submission not found');

    Object.assign(submission, dto);
    return this.submissionsRepo.save(submission);
  }

  async remove(id: number) {
    const submission = await this.submissionsRepo.findOne({ where: { id } });
    if (!submission) throw new NotFoundException(`Submission with id ${id} not found`);
    return this.submissionsRepo.remove(submission);
  }

  async findByStudent(studentId: number) {
    return this.submissionsRepo.find({
      where: { student: { id: studentId.toString() } },
      relations: ['task'],
    });
  }

  async findByTask(taskId: number) {
    return this.submissionsRepo.find({
      where: { task: { id: taskId } },
      relations: ['student'],
    });
  }
}
