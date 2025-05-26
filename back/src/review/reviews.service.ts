import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../review/review.entity';
import { CreateReviewDto } from '../review/dto/create-review.dto';
import { User } from '../users/user.entity';
import { Class } from '../classes/class.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepo: Repository<Review>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Class) private classRepo: Repository<Class>,
  ) {}

  async create(dto: CreateReviewDto, user: User): Promise<Review> {
    console.log('Creando review:', dto);
    console.log('Autor (user):', user.id);

    if (dto.type === 'grade' && user.role !== 'teacher') {
      throw new BadRequestException('Solo los profesores pueden asignar calificaciones.');
    }

    if (dto.type === 'review' && user.role !== 'student') {
  throw new BadRequestException('Solo los estudiantes pueden dejar reseñas.');
}


    const review = new Review();
    review.rating = dto.rating;
    review.comment = dto.comment;
    review.author = user;
    review.type = dto.type ?? 'review';

    const course = await this.classRepo.findOneBy({ id: dto.courseId });
    if (!course) throw new BadRequestException('Curso no encontrado');

    review.course = course;
    console.log('Review asignada a curso:', course.id);

    const saved = await this.reviewRepo.save(review);
    console.log('Review guardada con ID:', saved.id);
    return saved;
  }

  findAll(): Promise<Review[]> {
    console.log('Buscando todas las reviews...');
    return this.reviewRepo.find();
  }

  async findOne(id: string): Promise<Review> {
    console.log('Buscando review por ID:', id);
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) {
      console.log('Review no encontrada');
      throw new BadRequestException('Review no encontrada');
    }
    return review;
  }

  async update(id: string, dto: Partial<CreateReviewDto>, user: User): Promise<Review> {
    console.log('🔧 PATCH recibido:', { id, dto, user });
    console.log('Actualizando review:', id, 'con DTO:', dto);
    const review = await this.reviewRepo.findOne({ where: { id }, relations: ['author'] });
    if (!review) throw new BadRequestException('Review no encontrada');

    if (review.author.id !== user.id) {
      console.log('Usuario no autorizado para editar esta review');
      throw new BadRequestException('No puedes editar una review que no escribiste');
    }

    review.rating = dto.rating ?? review.rating;
    review.comment = dto.comment ?? review.comment;

    const updated = await this.reviewRepo.save(review);
    console.log('Review actualizada:', updated.id);
    return updated;
  }

  async remove(id: string, user: User): Promise<void> {
    console.log('✅ Review eliminada con éxito');
    console.log('Eliminando review:', id);
    const review = await this.reviewRepo.findOne({ where: { id }, relations: ['author'] });
    if (!review) throw new BadRequestException('Review no encontrada');

    if (review.author.id !== user.id) {
      console.log('Usuario no autorizado para eliminar esta review');
      throw new BadRequestException('No puedes eliminar una review que no escribiste');
    }

    await this.reviewRepo.delete(id);
    console.log('Review eliminada con éxito');
  }

  // ✅ Nuevo método agregado
  async findByUser(user: User): Promise<Review[]> {
    console.log(`Buscando calificaciones según rol: ${user.role}`);

    if (user.role === 'student') {
      return this.reviewRepo.find({
        where: { targetStudent: user, type: 'grade' },
      });
    }

    if (user.role === 'teacher') {
      return this.reviewRepo.find({
        where: { author: user, type: 'grade' },
      });
    }

    return this.reviewRepo.find({ where: { type: 'grade' } }); // admin u otros
  }
}
