import { Body, Controller, Post, UseGuards, Req, Get, Param } from "@nestjs/common";
import { RoleGuard } from "../common/guards/role.guard";
import { Roles } from "../decorator/role";
import { CreateSubmissionDto } from "./dto/CreateSubmissions.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { SubmissionsService } from "./submission.service";

@Controller('submissions')
export class submissionsControllers {
    constructor(private submissionsService: SubmissionsService) {}

    @Post()
    @UseGuards(RoleGuard,JwtAuthGuard)
    @Roles('student')
    create(@Body() dto: CreateSubmissionDto, @Req() req: any) {
        const userId = req.user.id;
        return this.submissionsService.create(dto,userId)
    }

    @Get()
    findAll(){
        return this.submissionsService.findAll();
    }

    @Get('my tasks')
    @UseGuards(RoleGuard)
    @Roles('student')
    findMySubmissions(@Req() req:any){
        return this.submissionsService.findByStudent(req.user.id)

    }

    @Get('task/:taskId')
    @UseGuards(JwtAuthGuard)
    findByTask(@Param('taskId') taskId: string) {
      return this.submissionsService.findByTask(taskId);
    }
}