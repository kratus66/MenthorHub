import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
// Update the import to match the actual exported member from class.entity
import { Class as Course } from '../classes/class.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @ManyToOne(() => User, user => user.reviewsGiven, { eager: true })
  author: User;

  @ManyToOne(() => User, user => user.reviewsReceived, { nullable: true, eager: true })
  targetStudent?: User;

  @ManyToOne(() => Course, course => course.reviews, { nullable: true, eager: true })
  course?: Course;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
