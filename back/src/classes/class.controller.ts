import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  ParseUUIDPipe,
  InternalServerErrorException,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ClassesService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from '../dto/update-class.dto';
import { Class } from './class.entity';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../decorator/role';
import { Role } from '../common/constants/roles.enum';

@ApiTags('Clases')
@ApiBearerAuth('JWT-auth')
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Teacher, Role.Admin)
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Crear una nueva clase con multimedia' })
  @ApiBody({
    description: 'Datos para crear una clase con archivos multimedia',
    type: CreateClassDto,
  })
  @ApiResponse({ status: 201, description: 'Clase creada exitosamente', type: Class })
  async create(
    @Body() createDto: CreateClassDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      return await this.classesService.create(createDto, files);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al crear la clase');
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard) // Solo autenticados pueden ver clases
  @ApiOperation({ summary: 'Obtener todas las clases' })
  @ApiResponse({ status: 200, description: 'Lista de clases', type: [Class] })
  async findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener una clase por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la clase', type: String })
  @ApiResponse({ status: 200, description: 'Clase encontrada', type: Class })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.classesService.findOne(id);
  }
}