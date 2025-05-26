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
import { CurrentUser } from '../common/decorators/current-user.decorator';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async register(
    @Body() dto: RegisterDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('📨 Body:', dto);
    console.log('📷 Imagen recibida:', file);
    return this.authService.register(dto, file?.path);
  }

  // ⛔ Endpoint de confirmación de email — actualmente deshabilitado
  /*
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
  */


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
    @Res() res: Response
  ) {
    const result = await this.authService.handleOAuthProcess(req.user, 'google');
  
    if (result.shouldCompleteProfile) {
      // Mandas la info OAuth para que el frontend muestre el formulario de registro normal
      const userInfo = encodeURIComponent(JSON.stringify(result.oauthUserInfo || result.user));
      return res.redirect(`http://localhost:3001/register?userInfo=${userInfo}`);
    }
  
    // Usuario ya registrado y perfil completo, rediriges a login con su info
    const userInfo = encodeURIComponent(JSON.stringify(result.user));
    return res.redirect(`http://localhost:3001/login?userInfo=${userInfo}`);
  }


  @Get('github/redirect')
  @UseGuards(AuthGuard('github'))
  async githubRedirect(
    @Req() req: Request & { user: any }, 
    @Res() res: Response
  ) {
    const result = await this.authService.handleOAuthProcess(req.user, 'github');
  
    if (result.shouldCompleteProfile) {
      // Mandas la info OAuth para que el frontend muestre el formulario de registro normal
      const userInfo = encodeURIComponent(JSON.stringify(result.oauthUserInfo || result.user));
      return res.redirect(`http://localhost:3001/register?userInfo=${userInfo}`);
    }
  
    // Usuario ya registrado y perfil completo, rediriges a login con su info
    const userInfo = encodeURIComponent(JSON.stringify(result.user));
    return res.redirect(`http://localhost:3001/login?userInfo=${userInfo}`);
  }
  


}
