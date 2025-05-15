// src/submission/submissions.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionsService } from './submission.service';
import { submissionsControllers } from './submission.controller';
import { Submission } from './submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Submission])],
  controllers: [submissionsControllers],
  providers: [SubmissionsService],
})
export class SubmissionsModule {}
