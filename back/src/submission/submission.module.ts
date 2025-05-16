import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './submission.entity';
import { SubmissionsService } from './submission.service';
import { SubmissionsController } from './submission.controller'; // Asegúrate que el nombre sea correcto y exportado

@Module({
  imports: [TypeOrmModule.forFeature([Submission])],
  providers: [SubmissionsService],
  controllers: [SubmissionsController],
})
export class SubmissionModule {}
