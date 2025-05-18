// src/notifications/notification.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Notification {
@PrimaryGeneratedColumn('uuid')
id: string;


  @Column()
  message: string;

  @ManyToOne(() => User, (user) => user.notifications, { eager: true })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
