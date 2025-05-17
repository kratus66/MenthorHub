// src/filter/filter.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from '../classes/class.entity';
import { FilterClassesDto } from './dto/filterClass.dto';
import { PaginationDto } from './dto/PaginationDto';

@Injectable()
export class FilterService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async findAll(filters: FilterClassesDto, pagination: PaginationDto) {
    const {
      search,
      category,
      teacherId,
      sortBy,
      sortOrder = 'asc',
    } = filters;

    const page = pagination.page || 1;
    const limit = pagination.limit || 10;

    const query = this.classRepository.createQueryBuilder('class')
      .leftJoinAndSelect('class.category', 'category')
      .leftJoinAndSelect('class.teacher', 'teacher');

    if (search) {
      query.andWhere('LOWER(class.title) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    if (category) {
      query.andWhere('category.id = :category', { category });
    }

    if (teacherId) {
      query.andWhere('teacher.id = :teacherId', { teacherId });
    }

    if (sortBy && ['title', 'createdAt'].includes(sortBy)) {
      query.orderBy(`class.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');
    } else {
      query.orderBy('class.createdAt', 'DESC');
    }

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



