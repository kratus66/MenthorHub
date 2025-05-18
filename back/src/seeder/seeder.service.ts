import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/categorias.entities';
import { Class } from '../classes/class.entity';
import { Professor } from '../entities/professor.entities';
import * as fs from 'fs';
import * as path from 'path';
import { CreateClassDto } from '../dto/CreateClassDto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CreateProfessorDto } from '../dto/create-professor.dto';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,

    @InjectRepository(Professor)
    private readonly professorRepo: Repository<Professor>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedCategories();
    await this.seedProfessors();
    await this.seedClasses();
  }

  private loadJsonFile(filename: string): any {
    const filePath = path.join(__dirname, filename);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  private async seedCategories() {
    const data: CreateCategoryDto[] = this.loadJsonFile('categories-with-uuid.json');
    const existing = await this.categoryRepo.count();
    if (existing === 0) {
      await this.categoryRepo.save(data);
      console.log('✅ Categorías precargadas');
    } else {
      console.log('ℹ️ Categorías ya existen');
    }
  }

  private async seedProfessors() {
    const data: (CreateProfessorDto & { id: string })[] = this.loadJsonFile('professors-with-uuid.json');
    const existing = await this.professorRepo.count();

    if (existing === 0) {
      const profesores = data.map((p) => this.professorRepo.create({
        id: p.id,
        name: p.name,
        bio: p.bio,
      }));
      await this.professorRepo.save(profesores);
      console.log('✅ Profesores precargados');
    } else {
      console.log('ℹ️ Profesores ya existen');
    }
  }

  private async seedClasses() {
    const data: CreateClassDto[] = this.loadJsonFile('classes-generated.json');
    const existing = await this.classRepo.count();

    if (existing > 0) {
      console.log('ℹ️ Clases ya existen');
      return;
    }

    const clasesAInsertar: Class[] = [];

    for (const cls of data) {
      const profesor = await this.professorRepo.findOne({
        where: { id: cls.teacherId },
      });

      const categoria = await this.categoryRepo.findOne({
        where: { id: cls.categoryId },
      });

      if (!profesor || !categoria) {
        console.warn(`⚠️ Clase omitida: "${cls.title}"`);
        if (!profesor) console.warn(`   ❌ Profesor no encontrado: ${cls.teacherId}`);
        if (!categoria) console.warn(`   ❌ Categoría no encontrada: ${cls.categoryId}`);
        continue;
      }

      // ✅ Ajuste: aseguro que se usa create correctamente con las relaciones.
      const nuevaClase = this.classRepo.create({
        title: cls.title,
        description: cls.description,
        teacher: profesor, // Profesor ya está precargado como entidad
        category: categoria,
        students: [],        // ⬅️ opcionalmente incluir campos vacíos si la entidad los espera
        tasks: [],
      });

      clasesAInsertar.push(nuevaClase);
    }

    if (clasesAInsertar.length > 0) {
      await this.classRepo.save(clasesAInsertar);
      console.log(`✅ ${clasesAInsertar.length} clases precargadas`);
    } else {
      console.warn('⚠️ No se insertó ninguna clase');
    }
  }
}
