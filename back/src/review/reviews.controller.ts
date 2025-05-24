import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { Roles } from '../decorator/role';
import { Role } from '../common/constants/roles.enum';
import { RoleGuard } from '../common/guards/role.guard';

@ApiTags('Reviews')
@ApiBearerAuth('JWT-auth')
// @UseGuards(AuthGuard('jwt'), RoleGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  // @Roles(Role.Teacher, Role.Student)
  @ApiOperation({ summary: 'Crear una reseña (review)' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({ status: 201, description: 'Review creada correctamente' })
  create(@Body() dto: CreateReviewDto, @CurrentUser() user: User) {
    console.log('POST /reviews -> dto:', dto, '| user:', user.id);
    return this.reviewsService.create(dto, user);
  }

  @Get()
  // @Roles(Role.Admin, Role.Teacher, Role.Student)
  @ApiOperation({ summary: 'Obtener todas las reseñas' })
  @ApiResponse({ status: 200, description: 'Lista de reviews' })
  findAll() {
    console.log('GET /reviews');
    return this.reviewsService.findAll();
  }

  @Get(':id')
  // @Roles(Role.Admin, Role.Teacher, Role.Student)
  @ApiOperation({ summary: 'Obtener una review por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la review' })
  @ApiResponse({ status: 200, description: 'Review encontrada' })
  findOne(@Param('id') id: string) {
    console.log('GET /reviews/:id ->', id);
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Teacher, Role.Student)
  @ApiOperation({ summary: 'Actualizar una review' })
  @ApiParam({ name: 'id', description: 'UUID de la review' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({ status: 200, description: 'Review actualizada correctamente' })
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreateReviewDto>,
    @CurrentUser() user: User,
  ) {
    console.log('PATCH /reviews/:id ->', id, '| user:', user.id, '| dto:', dto);
    return this.reviewsService.update(id, dto, user);
  }

  @Delete(':id')
  // @Roles(Role.Teacher, Role.Student)
  @ApiOperation({ summary: 'Eliminar una review' })
  @ApiParam({ name: 'id', description: 'UUID de la review' })
  @ApiResponse({ status: 200, description: 'Review eliminada correctamente' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    console.log('DELETE /reviews/:id ->', id, '| user:', user.id);
    return this.reviewsService.remove(id, user);
  }
}
