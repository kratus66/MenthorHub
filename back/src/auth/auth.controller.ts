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
    console.log('📨 Body:', dto);
    console.log('📷 Imagen recibida como archivo:', file);
    console.log('🌐 Imagen recibida como URL:', dto.profileImage);
  
    const imageUrl = file?.path || dto.profileImage || dto.profileImageUrl || null;
  
    const isOauth = dto.isOauth?.toString().trim().toLowerCase() === 'true';
  
    const registrationDto = {
      ...dto,
      isOauth,
      oauthProvider: isOauth ? dto.oauthProvider : undefined,
    };
  
    try {
      return await this.authService.register(registrationDto, imageUrl);
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
    // Eliminamos @Res() res: Response ya que no haremos redirección manual
    
  ) {
    
    if (!token || typeof token !== 'string') {
      throw new BadRequestException('Falta o es inválido el token de confirmación');
    }
  
    try {
      const result = await this.authService.confirmEmail(token);
  
      if (result.success) {
        // Si es exitoso, devolvemos una respuesta JSON con status 200
        return { message: 'Correo confirmado correctamente' };
      } else {
        // Si no es exitoso (pero no lanzó una excepción), lanzamos una BadRequestException
        // Esto asegura que se devuelva un status 400 con el mensaje de error
        throw new BadRequestException('Token inválido o expirado');
      }
    } catch (error) {
      console.error('Error al confirmar email:', error);
      // Si authService.confirmEmail lanzó una excepción, la capturamos y lanzamos BadRequestException
      // Esto también asegura un status 400
      throw new BadRequestException('Token inválido o expirado');
    }
  }
  
@Post('forgot-password')
@ApiOperation({ summary: 'Solicitar restablecimiento de contraseña' })
@ApiResponse({ status: 200, description: 'Email enviado con instrucciones para restablecer contraseña' })
async forgotPassword(@Body('email') email: string) {
  const user = await this.userRepository.findOne({ where: { email } });

  if (!user) {
    throw new NotFoundException('No existe un usuario con ese email');
  }

  const token = await this.authService.generatePasswordResetToken(user);

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  

  return { message: 'Se ha enviado un correo con instrucciones para restablecer tu contraseña' };
}


@Post('reset-password')
@ApiOperation({ summary: 'Restablecer contraseña' })
@ApiResponse({ status: 200, description: 'Contraseña actualizada correctamente' })
@ApiResponse({ status: 400, description: 'Token inválido o expirado' })
async resetPassword(
  @Body('token') token: string,
  @Body('newPassword') newPassword: string
) {
  const user = await this.authService.verifyPasswordResetToken(token);

  if (!user) {
    throw new BadRequestException('Token inválido o expirado');
  }

  await this.authService.updatePassword(user.id, newPassword);

  return { message: 'Contraseña actualizada correctamente' };
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
  githubLogin() {
    console.log('📢 githubLogin activado');  }
  

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
    } 
      const token = result.RegisteredUser?.token || '';
      const encodedToken = encodeURIComponent(token);
      console.log('usuario ya registrado, procediendo a logear', userInfo);
      return res.redirect(`${FRONTEND_URL}/oauthlogin?token=${encodedToken}&userinfo=${userInfo}`);
    
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
    } 
      const token = result.RegisteredUser?.token || '';
      const encodedToken = encodeURIComponent(token);
      console.log('usuario ya registrado, procediendo a logear', userInfo);
      return res.redirect(`${FRONTEND_URL}/oauthlogin?token=${encodedToken}&userinfo=${userInfo}`);
    }

  
  }