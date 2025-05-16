// src/submission/submissions.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './submission.entity';
import { CreateSubmissionDto } from './dto/CreateSubmissions.dto';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private submissionsRepo: Repository<Submission>,
  ) {}

  async create(dto: CreateSubmissionDto, userId: string) {
    const submission = this.submissionsRepo.create({
      content: dto.content,
      task: { id: dto.taskId },    // dto.taskId es number, correcto
      student: { id: userId },     // userId ahora es string, correcto
    });
    return this.submissionsRepo.save(submission);
  }

  async findAll() {
    return this.submissionsRepo.find();
  }

  async findByStudent(studentId: string) { // <-- CAMBIA number por string
    return this.submissionsRepo.find({ where: { student: { id: studentId } } });
  }

  async findByTask(taskId: number) {
    return this.submissionsRepo.find({ where: { task: { id: taskId } } });
  }
}
