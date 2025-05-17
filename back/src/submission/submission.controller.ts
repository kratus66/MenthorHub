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
    ParseIntPipe,
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
    create(@Body() dto: CreateSubmissionDto, @Req() req:any) {
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
    findMy(@Req() req:any) {
      return this.submissionsService.findByStudent(req.user.userId);
    }
  
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findByTask(@Param('taskId') taskId: string) {
      return this.submissionsService.findByTask(taskId);
    }
  }
   
