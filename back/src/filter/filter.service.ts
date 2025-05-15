// src/classes/classes.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from './entities/filterClass';
import { Repository } from 'typeorm';
import { FilterClassesDto } from './dto/filterClass.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async findAll(filter: FilterClassesDto) {
    const {
      search,
      category,
      professorId,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      limit = 10,
    } = filter;

    const query = this.classRepository.createQueryBuilder('class')
      .leftJoinAndSelect('class.category', 'category')
      .leftJoinAndSelect('class.professor', 'professor');

    if (search) {
      query.andWhere('LOWER(class.name) LIKE LOWER(:search)', { search: `%${search}%` });
    }

    if (category) {
      query.andWhere('category.id = :category', { category });
    }

    if (professorId) {
      query.andWhere('professor.id = :professorId', { professorId });
    }

    query.orderBy(`class.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');

    const [results, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: results,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
}
