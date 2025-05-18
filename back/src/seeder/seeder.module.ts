import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { CategoriesModule } from '../categorias/categoria.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../entities/categorias.entities';
import { Professor } from '../entities/professor.entities';
import { Class } from '../classes/class.entity';
import { User } from '../users/user.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Professor, Class, User]),
    CategoriesModule,
    
  ],
  providers: [SeederService],
})
export class SeederModule {}
