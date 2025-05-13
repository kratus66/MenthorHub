import { Controller, Post, Get, Param, Body, Put, Delete, ParseIntPipe } from '@nestjs/common';
import { ClassesService } from '../classes/class.service';
import { CreateClassDto } from '../classes/dto/create-class.dto'
import { UpdateClassDto } from '../classes/dto/update-class.dto';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  create(@Body() createDto: CreateClassDto) {
    return this.classesService.create(createDto);
  }

  @Get()
  findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateClassDto) {
    return this.classesService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.classesService.remove(id);
  }
}
