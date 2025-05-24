// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Get,
  Req,
  UseGuards,
  BadRequestException,
  NotFoundException,
  Query,
  UnauthorizedException,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { OAuthCompleteDto } from './dto/OauthRegister.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport'; 
import { CloudinaryFileInterceptor } from '../common/interceptors/cloudinary.interceptor';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { GetUser } from '../common/decorators/get-user.decorator';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  @Post('register')
  @UseInterceptors(CloudinaryFileInterceptor('profileImage'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Registrar un nuevo usuario con foto' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        phoneNumber: { type: 'string' },
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
        confirmPassword: { type: 'string' },
        avatarId: { type: 'integer' },
        studies: { type: 'string' },
        role: { type: 'string', enum: ['student', 'teacher', 'admin'] },
        country: { type: 'string' },
        province: { type: 'string' },
        location: { type: 'string' },
        profileImage: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  async register(
    @Body() dto: RegisterDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.register(dto, file?.path);
  }

  @Get('confirm-email')
  async confirmEmail(@Query('token') token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_EMAIL_SECRET,
      });

      const user = await this.userRepository.findOneBy({ email: payload.email });
      if (!user) throw new NotFoundException('Usuario no encontrado');

      user.isEmailConfirmed = true;
      await this.userRepository.save(user);

      return { message: 'Correo confirmado correctamente' };
    } catch (err) {
      throw new BadRequestException('Token inválido o expirado');
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso, retorna el token' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // 🔹 Inicio de OAuth
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {}

  // 🔹 Callback OAuth
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(
    @Req() req: Request & { user: any }, 
    @Res() res: Response) {
    const { shouldCompleteProfile, token } = await this.authService.handleOAuthLogin(req.user, 'google');
  
    if (shouldCompleteProfile) {
      return res.redirect(`http://localhost:3001/oauth-complete?token=${token}`);

    }
  
    return res.redirect(`http://localhost:3001/home?token=${token}`);
  }

  @Get('github/redirect')
  @UseGuards(AuthGuard('github'))
  githubRedirect(@Req() req: any) {
    return this.authService.handleOAuthLogin(req.user, 'github');
  }
  @Post('oauth-complete')
  @UseGuards(JwtAuthGuard) // Solo usuarios con token válido
  @UseInterceptors(CloudinaryFileInterceptor('profileImage'))
  async handleOAuthRegister(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: OAuthCompleteDto,
    @GetUser() user: { id: string; email: string; role: string },
  ) {
    console.log('Usuario extraído del token:', user);
    const imageUrl = file?.path || undefined;
    return this.authService.handleOAuthRegister(user.id, dto, imageUrl);
  }



@Get('test-oauth-token')
async testOAuthToken() {
  // Usuario simulado como si viniera de Google/GitHub
  const fakeProfile = {
    email: 'mentorhub.info@gmail.com',
    displayName: 'MentorHub',
    photo: 'https://example.com/photo.jpg',
  };
  const result = await this.authService.handleOAuthLogin(fakeProfile, 'google');
  return result; // { token, shouldCompleteProfile }
}

}
