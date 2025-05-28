import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Materias } from './materias.entity';
import { Repository } from 'typeorm';
import { CreateMateriaDto } from './dto/CreateMateria.dto';
import { Category } from '../categorias/categorias.entity';


@Injectable()
export class MateriasService {
  constructor(
    @InjectRepository(Materias)
    private materiaRepo: Repository<Materias>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

    
  async create(dto: CreateMateriaDto) {

    const category = await this.categoryRepository.findOne({ where: { id: dto.category } });
    if (!category) throw new NotFoundException('Categoría no encontrada');

    const materia = this.materiaRepo.create({
      descripcion: dto.descripcion,
      imagenUrl: dto.imagenUrl,
    category: category,
    });
    return await this.materiaRepo.save(materia);
  }

  async findAll() {
    return await this.materiaRepo.find();
  }

  async createMany(data: CreateMateriaDto[]) {
    const materias: Materias[] = [];
  
    for (const dto of data) {
      const category = await this.categoryRepository.findOne({ where: { id: dto.category } });
  
      if (!category) {
        console.warn(`⚠️ Categoría con ID ${dto.category} no encontrada. Materia omitida.`);
        continue;
      }
  
      const materia = this.materiaRepo.create({
        descripcion: dto.descripcion,
        imagenUrl: dto.imagenUrl,
        category,
      });
  
      materias.push(materia);
    }
  
    return await this.materiaRepo.save(materias);
  }
}
