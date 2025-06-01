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
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { EmailService } from '../email/email.service';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}


  @Post('register')
  @UseInterceptors(CloudinaryFileInterceptor('profileImage'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: RegisterDto })
  async register(
    @Body() dto: RegisterDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    
    console.log('📨 Body:', dto);
    console.log('📷 Imagen recibida:', file);
  
    // Convierte isOauth a boolean (true si viene como 'true' o true)
    const isOauth = dto.isOauth === true;
  
    // Pasa dto con isOauth convertido a booleano
    const registrationDto = {
      ...dto,
      isOauth,
    };
  
    return this.authService.register(registrationDto, file?.path);
    
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
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {}

  @Get('google/redirect')
@UseGuards(AuthGuard('google'))
async googleRedirect(
  @Req() req: Request & { user: any }, 
  @Res() res: Response
) {
  const result = await this.authService.handleOAuthProcess(req.user, 'google');
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4173';

  const user = result.oauthUserInfo || result.user || result.RegisteredUser?.user || {};
  const userInfo = encodeURIComponent(JSON.stringify(user));

  if (result.shouldCompleteProfile) {
    return res.redirect(`${FRONTEND_URL}/register?userInfo=${userInfo}`);
  } else {
    const token = result.RegisteredUser?.token || '';
    const encodedToken = encodeURIComponent(token);
    console.log('usuario ya registrado, procediendo a logear',userInfo)
    return res.redirect(`${FRONTEND_URL}/oauthlogin?token=${encodedToken}&userinfo=${userInfo}`);
  }
}



  @Get('github/redirect')
@UseGuards(AuthGuard('github'))
async githubRedirect(
  @Req() req: Request & { user: any }, 
  @Res() res: Response
) {
  const result = await this.authService.handleOAuthProcess(req.user, 'github');
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4173';

  const user = result.oauthUserInfo || result.user || result.RegisteredUser?.user || {};
  const userInfo = encodeURIComponent(JSON.stringify(user));

  if (result.shouldCompleteProfile) {
    return res.redirect(`${FRONTEND_URL}/register?userInfo=${userInfo}`);
  } else {
    const token = result.RegisteredUser?.token || '';
    const encodedToken = encodeURIComponent(token);
    
    return res.redirect(`${FRONTEND_URL}/oauthlogin?token=${encodedToken}&userinfo=${userInfo}`);
  }
}
  

    
  }

