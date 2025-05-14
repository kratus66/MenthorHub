// src/classes/classes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from './entities/filterClass';
import { ClassesController } from './classes.controller';
import { ClassesService } from './filter.service';

@Module({
  imports: [TypeOrmModule.forFeature([Class])],
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class FilterModule {}
