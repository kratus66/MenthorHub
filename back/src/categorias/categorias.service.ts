import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './categorias.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoriesService {
   constructor(
      @InjectRepository(Category)
      private categoryRepo: Repository<Category>
   ) {}

   async create(dto: CreateCategoryDto) {
      const category = this.categoryRepo.create({
         name: dto.name,
         imageUrl: dto.imageUrl,
         description: dto.description,
      });
      return await this.categoryRepo.save(category);
   }

   async findAll(page = 1, limit = 10) {
      const [data, total] = await this.categoryRepo.findAndCount({
         skip: (page - 1) * limit,
         take: limit,
         relations: ['materias'],
      });

      return {
         data,
         total,
         page,
         limit,
      };
   }

   async createMany(data: CreateCategoryDto[]) {
      const categories = this.categoryRepo.create(data);
      return await this.categoryRepo.save(categories);
   }
}
