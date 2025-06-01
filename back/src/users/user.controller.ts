import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  InternalServerErrorException,
  UseGuards,
  Header,
  Res,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role';
import { Role } from '../common/constants/roles.enum';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { Response } from 'express';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente', type: User })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el usuario');
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Obtener todos los usuarios con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [User] })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    try {
      const result = await this.usersService.findAll(Number(page), Number(limit));
      if (result.data.length === 0) return { message: 'No se encontraron usuarios', ...result };
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los usuarios');
    }
  }

  @Get('teacher')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Obtener usuarios con rol de teacher' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getTeachers(@Query('page') page = 1, @Query('limit') limit = 10) {
    try {
      const result = await this.usersService.getTeachers(Number(page), Number(limit));
      if (result.data.length === 0) return { message: 'No se encontraron profesores', ...result };
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener profesores');
    }
  }

  @Get('students')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Obtener usuarios con rol de student' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getStudents(@Query('page') page = 1, @Query('limit') limit = 10) {
    try {
      const result = await this.usersService.getStudents(Number(page), Number(limit));
      if (result.data.length === 0) return { message: 'No se encontraron estudiantes', ...result };
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener estudiantes');
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de usuarios (texto)' })
  @ApiResponse({ status: 200, description: 'Estadísticas de usuarios' })
  async getStats() {
    try {
      const stats = await this.usersService.getStats();
      return stats;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener estadísticas');
    }
  }

  @Get('stats/image')
  @ApiOperation({ summary: 'Gráfico con estadísticas de usuarios' })
  @ApiResponse({ status: 200, description: 'Devuelve una imagen PNG' })
  @Header('Content-Type', 'image/png')
  async getStatsImage(@Res() res: Response) {
    const stats = await this.usersService.getStats();

    const canvas = new ChartJSNodeCanvas({ width: 600, height: 400 });
    const image = await canvas.renderToBuffer({
      type: 'bar',
      data: {
        labels: ['Activos', 'Eliminados'],
        datasets: [{
          label: 'Usuarios',
          data: [stats.activos, stats.eliminados],
          backgroundColor: ['#36A2EB', '#FF6384'],
        }],
      },
      options: {
        responsive: false,
        plugins: {
          title: {
            display: true,
            text: 'Estadísticas de Usuarios',
          },
        },
      },
    });

    res.end(image);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: User })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User | null> {
    try {
      return await this.usersService.findById(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar el usuario');
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'U suario actualizado', type: User })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      return await this.usersService.update(id, updateUserDto);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'id', description: 'UUID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    try {
      return await this.usersService.remove(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar el usuario');
    }
  }

  
}


