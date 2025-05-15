// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config/typeorm';

import { ChatbotModule } from './chatbot/chatbot.module';
import { ClassesModule } from './classes/classes.module';
import { FilterModule } from './filter/filter.module';
import { CategoriesModule } from './categorias/categoria.module';
import { SeederModule } from './seeder/seeder.module';

@Module({
  imports: [
    SeederModule,
    CategoriesModule,
    ChatbotModule,
    ClassesModule,
    FilterModule,
    TypeOrmModule.forRoot(dataSourceOptions), // ✅ Aquí usamos la misma config
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
