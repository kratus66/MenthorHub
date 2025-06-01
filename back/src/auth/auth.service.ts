import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { InjectRepository } from '@nestjs/typeorm';
import { And, Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';

import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { OAuthCompleteDto } from './dto/OauthRegister.dto';
import passport from 'passport';

 import { EmailService } from '../email/email.service';  

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,

  ) {}


  async register(dto: RegisterDto, profileImagePathOrURL?: string): Promise<any> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
  
    if (existingUser) {
      throw new BadRequestException(
        `Ya existe una cuenta registrada con el correo ${dto.email}.`
      );
    }
  
    if (dto.isOauth) {
      if (!dto.oauthProvider) {
        throw new BadRequestException('El proveedor OAuth es requerido');
      }
      return this.registerOAuth(dto, profileImagePathOrURL);
    } else {
      return this.registerTraditional(dto, profileImagePathOrURL);
    }
  }
  
  private async registerOAuth(dto: RegisterDto, profileImagePathOrURL?: string): Promise<any> {
    const newUser = this.usersRepository.create({
      name: dto.name,
      email: dto.email,
      password: dto.password || '',
      phoneNumber: dto.phoneNumber,
      avatarId: dto.avatarId,
      profileImage: profileImagePathOrURL || dto.profileImage,
      estudios: dto.studies,
      role: dto.role as 'student' | 'teacher' | 'admin',
      country: dto.country,
      provincia: dto.province,
      localidad: dto.location,
      isEmailConfirmed: true,
      isOauth: true,
      oauthProvider: dto.oauthProvider,
    });
  
    await this.usersRepository.save(newUser);
  
    const accessToken = this.generateToken(newUser);
  
    return {
      message: `Bienvenido ${newUser.name}, tu cuenta OAuth fue creada correctamente.`,
      token: accessToken,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        provider: newUser.oauthProvider,
        profileImage: newUser.profileImage,
      },
    };
  }
  
  private async registerTraditional(dto: RegisterDto, profileImagePathOrURL?: string): Promise<any> {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }
  
    const hashedPassword = await hash(dto.password, 10);
  
    const newUser = this.usersRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      phoneNumber: dto.phoneNumber,
      avatarId: dto.avatarId,
      profileImage: profileImagePathOrURL || dto.profileImage,
      estudios: dto.studies,
      role: dto.role as 'student' | 'teacher' | 'admin',
      country: dto.country,
      provincia: dto.province,
      localidad: dto.location,
      isEmailConfirmed: false,
      isOauth: false,
      oauthProvider: 'no-provider',
    });
  
    await this.usersRepository.save(newUser);
  
    const emailToken = this.generateEmailVerificationToken(newUser);
    const confirmUrl = `http://localhost:3001/api/auth/confirm-email?token=${emailToken}`;
  
    await this.emailService.sendWelcomeEmail(
      newUser.email,
      'Confirma tu correo',
      `<p>Hola ${newUser.name}, haz clic aquí para confirmar tu correo:</p><a href="${confirmUrl}">Confirmar correo</a>`
    );
  
    const accessToken = this.generateToken(newUser);
  
    return {
      message: `Querido ${newUser.name}, te has registrado correctamente.`,
      token: accessToken,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profileImage: newUser.profileImage,
      },
    };
  }
  
  
  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || !(await compare(password, user.password))) {
      throw new BadRequestException('Credenciales incorrectas');
    }

     if (!user.isEmailConfirmed) {
      throw new UnauthorizedException(
        'Debes confirmar tu correo antes de iniciar sesión',
      );
    }

    const token = this.generateToken(user);

    return {
      message: `Inicio de sesión exitoso. Bienvenido, ${user.name}`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    };
  }
// auth.service.ts

async handleOAuthProcess(profile: any, provider: 'google' | 'github') {
  // Buscar usuario por email sin importar el proveedor
  const userByEmail = await this.usersRepository.findOne({
    where: { email: profile.email },
  });

  // Si ya existe con otro proveedor
  if (
    userByEmail &&
    userByEmail.isOauth &&
    userByEmail.oauthProvider !== provider
  ) {
    return {
      redirectToProvider: userByEmail.oauthProvider, // 'google' o 'github'
      originalEmail: userByEmail.email,
    };
  }

  // Buscar usuario con este email Y este proveedor
  const user = await this.usersRepository.findOne({
    where: {
      email: profile.email,
      oauthProvider: provider,
    },
  });

  if (user) {
    const shouldCompleteProfile =
      !user.role || !user.phoneNumber || !user.country || !user.estudios;
    if (shouldCompleteProfile) {
      return {
        shouldCompleteProfile,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
        },
      };
    } else {
      const token = this.generateToken(user);
      return {
        shouldCompleteProfile: false,
        RegisteredUser: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage,
          },
        },
      };
    }
  }

  // No existe, preparar info para completar el registro
  const oauthUserInfo = {
    name: profile.displayName || '',
    email: profile.email || '',
    profileImage: profile.photo || '',
    isOauth: true,
    oauthProvider: provider,
    isConfirmed: true,
  };

  return {
    shouldCompleteProfile: true,
    oauthUserInfo,
  };
}



  generateToken(user: User): string {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      name: user.name,
      profileImage: user.profileImage,
    };
    return this.jwtService.sign(payload);
  }
  
  
 generateEmailVerificationToken(user: User): string {
    return this.jwtService.sign(
      { email: user.email },
      {
        secret: process.env.JWT_EMAIL_SECRET,
        expiresIn: '1d',
      },
    );
  }
    
}