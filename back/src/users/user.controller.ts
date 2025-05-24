import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  InternalServerErrorException,
  UseGuards,
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
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/role'; // ✅ Asegúrate que apunta al decorador, no al enum
import { Role } from '../common/constants/roles.enum'; // ✅ Enum con roles

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 👤 Registro abierto (no autenticado)
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

  // 🔐 Solo admin
  /* @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin) */
  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [User] })
  async findAll(): Promise<User[]> {
    try {
      return await this.usersService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los usuarios');
    }
  }

  // 🔐 Solo admin
  /* @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin) */
  @Get('teacher')
  @ApiOperation({ summary: 'Obtener todos los usuarios por el rol de teacher' })
  async getTeachers() {
    const teachers = await this.usersService.getTeachers();
    if (!teachers) {
      throw new InternalServerErrorException('No hay profesores registrados');
    }
    return teachers;
  }

  // 🔐 Solo admin
  /* @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin) */
  @Get('students')
  @ApiOperation({ summary: 'Obtener todos los usuarios por el rol de student' })
  async getStudents() {
    const students = await this.usersService.getStudents();
    if (!students) {
      throw new InternalServerErrorException('No hay estudiantes registrados');
    }
    return students;
  }

  // 🔐 Solo admin
  /* @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin) */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({ name: 'id', description: 'UUID del usuario', type: String })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User | null> {
    try {
      return await this.usersService.findById(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar el usuario');
    }
  }

  // 🔐 Solo admin
  /* @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin) */
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiParam({ name: 'id', description: 'UUID del usuario', type: String })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuario actualizado', type: User })
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

  // 🔐 Solo admin
  @Delete(':id')
  /* @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.Admin) */
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiParam({ name: 'id', description: 'UUID del usuario', type: String })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    try {
      return await this.usersService.remove(id);
    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar el usuario');
    }
  } 
}

