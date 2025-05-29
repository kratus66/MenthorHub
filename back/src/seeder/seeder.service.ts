import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categorias/categorias.entity'; 
import { Class } from '../classes/class.entity';
import { User } from '../users/user.entity';
import * as fs from 'fs';
import * as path from 'path';
import { CreateClassDto } from '../classes/dto/create-class.dto';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Materias } from '../materias/materias.entity';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(Class)
    private readonly classRepo: Repository<Class>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Materias)
    private readonly materiaRepo: Repository<Materias>,
  ) {}

  async onApplicationBootstrap() {
    console.log('🚀 Ejecutando SeederService...');
    await this.seedCategories();

    await this.seedTeachers();
  
    await this.seedMaterias();    // <--- Agregado aquí
    
    await this.seedClasses();
  }

  private loadJsonFile(filename: string): any {
    const filePath = path.join(__dirname, filename);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Archivo no encontrado: ${filePath}`);
      return [];
    }
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

  private async seedTeachers() {
    const data: { id: string; nombre: string; email: string; password: string; role: string }[] =
      this.loadJsonFile('professors-with-uuid.json');

    const existing = await this.userRepo.count({ where: { role: 'teacher' } });

    if (existing === 0) {
      const teachers = data
        .map((t, i) => {
          const name = t.nombre;

          if (!name) {
            console.warn(`⚠️ Profesor en posición ${i} sin nombre válido:`, t);
            return null;
          }

          return this.userRepo.create({
            id: t.id,
            name,
            email: t.email ?? `${name.toLowerCase().replace(/ /g, '')}@mail.com`,
            password: t.password ?? 'hashed-password-placeholder',
            role: 'teacher',
            phoneNumber: '+18095550000',
            country: 'RD',
          });
        })
        .filter((t): t is User => t !== null);

      await this.userRepo.save(teachers);
      console.log('✅ Usuarios con rol "teacher" precargados');
    } else {
      console.log('ℹ️ Usuarios "teacher" ya existen');
    }
  }

  private async seedMaterias() {
    const data: { id: string; name: string; imagenUrl?: string; categoryId: string }[] =
      this.loadJsonFile('materias-with-uuid.json');

    const existing = await this.materiaRepo.count();
    if (existing > 0) {
      console.log('ℹ️ Materias ya existen');
      return;
    }

    const materiasAInsertar = [];

    for (const m of data) {
      const category = await this.categoryRepo.findOne({ where: { id: m.categoryId } });
      if (!category) {
        console.warn(`⚠️ Categoría no encontrada para materia: ${m.name}`);
        continue;
      }

      const nuevaMateria = this.materiaRepo.create({
        id: m.id,
        name: m.name,
        imagenUrl: m.imagenUrl,
        category,
      });

      materiasAInsertar.push(nuevaMateria);
    }

    if (existing === 0) {
      await this.materiaRepo.save(materiasAInsertar);
      console.log('✅ Materias precargadas');
    } else {
      console.log('ℹ️ Materias ya existen');
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
      const profesor = await this.userRepo.findOne({
        where: { id: cls.teacherId, role: 'teacher' },
      });

      const categoria = await this.categoryRepo.findOne({
        where: { id: cls.categoryId },
      });

      const materia = await this.materiaRepo.findOne({
        where: { id: cls.materiaId },
      });

      if (!profesor || !categoria || !materia) {
        console.warn(`⚠️ Clase omitida: "${cls.title}"`);
        if (!profesor) console.warn(`   ❌ Profesor no encontrado: ${cls.teacherId}`);
        if (!categoria) console.warn(`   ❌ Categoría no encontrada: ${cls.categoryId}`);
        if (!materia) console.warn(`   ❌ Materia no encontrada: ${cls.materiaId}`);
        continue;
      }

      const nuevaClase = this.classRepo.create({
        title: cls.title,
        description: cls.description,
        materia: materia,
        sector: cls.sector ?? 'General',
        multimedia: cls.multimedia ?? [],
        teacher: profesor,
        category: categoria,
        students: [],
        tasks: [],
        estado: true,
      });

      clasesAInsertar.push(nuevaClase);
    }

    if (existing === 0) {
      await this.classRepo.save(clasesAInsertar);
      console.log('✅ Clases precargadas');
    } else {
      console.log('ℹ️ Clases ya existen');
    }
  }
}
