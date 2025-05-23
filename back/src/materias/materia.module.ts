import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MateriasService } from './materia.service';
import { MateriasController } from './materia.controller';
import { Materias } from './materias.entity';   
import { Category } from '../categorias/categorias.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Materias, Category])],
  controllers: [MateriasController],
  providers: [MateriasService],
  exports: [MateriasService],
})
export class MateriasModule {}