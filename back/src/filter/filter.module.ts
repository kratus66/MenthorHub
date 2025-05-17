// src/classes/classes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from '../classes/class.entity';
import { FilterController } from './filter.controller';
import { FilterService } from './filter.service';

@Module({
  imports: [TypeOrmModule.forFeature([Class])],
  controllers: [FilterController],
  providers: [FilterService],
})
export class FilterModule {}
