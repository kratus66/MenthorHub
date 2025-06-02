import {
  Body,
  Controller,
  Get,
  Post,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { MateriasService } from './materia.service';
import { CreateMateriaDto } from './dto/CreateMateria.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role';
import { Role } from '../common/constants/roles.enum';

@ApiTags('Materias')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('materias')
export class MateriasController {
  constructor(private readonly materiasService: MateriasService) {}

 
  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Crear Materia' })
  @ApiResponse({ status: 201, description: 'Materia creada' })
  async create(@Body() dto: CreateMateriaDto) {
    try {
      return await this.materiasService.create(dto);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear la materia');
    }
  }

  
  @Get()
  @Roles(Role.Admin, Role.Teacher, Role.Student)
  @ApiOperation({ summary: 'Listar materias' })
  async findAll() {
    try {
      return await this.materiasService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las materias');
    }
  }
}