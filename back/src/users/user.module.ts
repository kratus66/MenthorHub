import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './user.service';
import { UsersController } from './user.controller'; // ⬅️ agregar esto

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController], // ⬅️ agregar esto
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
