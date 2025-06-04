import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  InternalServerErrorException,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { SubmissionsService } from './submission.service';
import { CreateSubmissionDto } from './dto/CreateSubmissions.dto';
import { UpdateSubmissionDto } from './dto/updatesubmission.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Role } from '../common/constants/roles.enum';
import { Express } from 'express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { CloudinaryFileInterceptor, CloudinaryMultipleFilesInterceptor, CloudinarySubmissionsInterceptor,  } from '../common/interceptors/cloudinary.interceptor';
import { Roles } from '../common/decorators/role';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
@ApiTags('Submissions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('submissions')
export class SubmissionsController {
  constructor(private submissionsService: SubmissionsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(CloudinarySubmissionsInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateSubmissionDto,
    @Req() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('Archivo es obligatorio');
    }
    console.log(file)
    // Subir archivo y obtener URL
    const uploadResult = await this.cloudinaryService.uploadFile(file.buffer, {
      folder: `mentorhub/entregas`,
    });
  
    // Pasar sólo la URL al servicio
    return this.submissionsService.createSubmission(dto, uploadResult.secure_url, req.user.sub);
  }
  

  @Get()
  @Roles(Role.Teacher, Role.Admin)
  @ApiOperation({ summary: 'Obtener todas las entregas con paginación' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.submissionsService.findAll(Number(page), Number(limit));
  }

  @Get('eliminadas')
  @Roles(Role.Teacher, Role.Admin)
  @ApiOperation({ summary: 'Obtener entregas eliminadas (profesor/admin)' })
  @ApiResponse({ status: 200, description: 'Listado de entregas eliminadas' })
  async findEliminadas() {
    return this.submissionsService.findEliminadas();
  }

  @Get('my-submissions')
  @Roles(Role.Student)
  @ApiOperation({ summary: 'Obtener entregas propias del estudiante autenticado' })
  async findMy(@Req() req: any) {
    return this.submissionsService.findByStudent(req.user.sub);
  }

  @Get(':id')
  @Roles(Role.Student, Role.Teacher, Role.Admin)
  @ApiOperation({ summary: 'Obtener una entrega por ID' })
  async findOne(@Param('id') id: string) {
    return this.submissionsService.findOne(id);
  }

  @Put(':id/restore')
  @Roles(Role.Teacher, Role.Admin)
  @ApiOperation({ summary: 'Restaurar una entrega eliminada' })
  async restore(@Param('id') id: string) {
    return this.submissionsService.restore(id);
  }

  @Put(':id')
  @Roles(Role.Student)
  @ApiOperation({ summary: 'Actualizar una entrega (solo estudiante)' })
  async update(@Param('id') id: string, @Body() dto: UpdateSubmissionDto) {
    return this.submissionsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.Student, Role.Admin)
  @ApiOperation({ summary: 'Eliminar una entrega (estudiante o admin)' })
  @ApiParam({ name: 'id', description: 'UUID de la entrega' })
  @ApiResponse({ status: 200, description: 'Entrega eliminada' })
  async remove(@Param('id') id: string) {
    return this.submissionsService.remove(id);
  }
}