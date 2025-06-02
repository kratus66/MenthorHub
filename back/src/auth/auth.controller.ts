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
  InternalServerErrorException,
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
import { Request, Response } from 'express';
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
    try {
      console.log('📨 Body:', dto);
      console.log('📷 Imagen recibida:', file);
      console.log('📷 imagen recibida por URL:', dto.profileImageUrl);
  
      // Decide qué imagen usar: la URL recibida o la del archivo subido
      const profileImagePathOrURL = file?.path || dto.profileImageUrl;
  
      // Normalizar isOauth a boolean, trimming spaces
      const isOauth = dto.isOauth?.toString().trim().toLowerCase() === 'true';
  
      const registrationDto = {
        ...dto,
        isOauth,
        oauthProvider: isOauth ? dto.oauthProvider : undefined,
      };
  
      return await this.authService.register(registrationDto, profileImagePathOrURL || '');
    } catch (error) {
      console.error('❌ Error al registrar:', error);
      throw new InternalServerErrorException('Error interno al registrar el usuario');
    }
  }
  
    
  @Get('confirm-email')
@ApiOperation({ summary: 'Confirmar correo electrónico con token' })
@ApiResponse({ status: 200, description: 'Correo confirmado correctamente' })
@ApiResponse({ status: 400, description: 'Token inválido o expirado' })
async confirmEmail(
  @Query('token') token: string,
  @Res() res: Response,
) {
  if (!token || typeof token !== 'string') {
    throw new BadRequestException('Falta o es inválido el token de confirmación');
  }

  try {
    const result = await this.authService.confirmEmail(token);

    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4173';

    if (result.success) {
      return res.redirect(`${FRONTEND_URL}/email-confirmed`);
    } else {
      return res.redirect(`${FRONTEND_URL}/email-confirmation-error`);
    }
  } catch (error) {
    console.error('Error al confirmar email:', error);
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
  async githubLogin() {
    // redirige automáticamente a GitHub
  }
  

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(
    @Req() req: Request & { user: any },
    @Res() res: Response
  ) {
    const result = await this.authService.handleOAuthProcess(req.user, 'google');
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4173';
  
    // 🚫 Redirección si intentó usar Google pero ya tenía cuenta con otro proveedor
    // if ('redirectToProvider' in result) {
    //   const redirectProvider = result.redirectToProvider;
    //   return res.redirect(
    //     `${FRONTEND_URL}/wrong-provider?expected=${redirectProvider}`
    //   );
    // }
  
    const user = result.oauthUserInfo || result.user || result.RegisteredUser?.user || {};
    const userInfo = encodeURIComponent(JSON.stringify(user));
  
    if (result.shouldCompleteProfile) {
      return res.redirect(`${FRONTEND_URL}/register?userInfo=${userInfo}`);
    } else {
      const token = result.RegisteredUser?.token || '';
      const encodedToken = encodeURIComponent(token);
      console.log('usuario ya registrado, procediendo a logear', userInfo);
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
  
    // 🚫 Usuario intentó entrar con GitHub pero ya estaba registrado con otro proveedor
    // if ('redirectToProvider' in result) {
    //   const redirectProvider = result.redirectToProvider;
    //   return res.redirect(
    //     `${FRONTEND_URL}/wrong-provider?expected=${redirectProvider}`
    //   );
    // }
  
    const user = result.oauthUserInfo || result.user || result.RegisteredUser?.user || {};
    const userInfo = encodeURIComponent(JSON.stringify(user));
  
    if (result.shouldCompleteProfile) {
      return res.redirect(`${FRONTEND_URL}/register?userInfo=${userInfo}`);
    } else {
      const token = result.RegisteredUser?.token || '';
      const encodedToken = encodeURIComponent(token);
      console.log('usuario ya registrado, procediendo a logear', userInfo);
      return res.redirect(`${FRONTEND_URL}/oauthlogin?token=${encodedToken}&userinfo=${userInfo}`);
    }
  }
  

    
  }