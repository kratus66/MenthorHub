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
} from '@nestjs/common';
import { SubmissionsService } from './submission.service';
import { CreateSubmissionDto } from './dto/CreateSubmissions.dto';
import { UpdateSubmissionDto } from './dto/updatesubmission.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('submissions')
export class SubmissionsController {
  constructor(private submissionsService: SubmissionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('student')
  create(@Body() dto: CreateSubmissionDto, @Req() req: any) {
    return this.submissionsService.create(dto, req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('teacher', 'admin')
  findAll() {
    return this.submissionsService.findAll();
  }

  @Get('my-submissions')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('student')
  findMy(@Req() req: any) {
    return this.submissionsService.findByStudent(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.submissionsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('teacher', 'admin')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSubmissionDto,
  ) {
    return this.submissionsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('student', 'admin')
  remove(@Param('id') id: string) {
    return this.submissionsService.remove(id);
  }
}
