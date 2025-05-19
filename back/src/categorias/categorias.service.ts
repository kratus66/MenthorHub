import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/categorias.entities';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const category = this.categoryRepo.create(dto);
    return await this.categoryRepo.save(category);
  }

  async findAll() {
    return await this.categoryRepo.find();
  }

  async createMany(data: CreateCategoryDto[]) {
    const categories = this.categoryRepo.create(data);
    return await this.categoryRepo.save(categories);
  }
}

