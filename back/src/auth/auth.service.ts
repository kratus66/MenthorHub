import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { compare, hash } from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
    validateOAuthLogin: any;
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private  jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async register(dto: RegisterDto, profileImagePath: string): Promise<any> {
    const existingUser = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new BadRequestException('El correo ya está registrado');
    }

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
      profileImage: profileImagePath,
      estudios: dto.studies,
      role: dto.role as 'student' | 'teacher' | 'admin',
      country: dto.country,
      provincia: dto.province,
      localidad: dto.location,
    });

    await this.usersRepository.save(newUser);

    const token = this.generateEmailVerificationToken(newUser);
    const confirmUrl = `http://localhost:3001/api/auth/confirm-email?token=${token}`;
    
    await this.mailerService.sendMail({
      to: newUser.email,
      subject: 'Confirma tu correo',
      html: `<p>Hola ${newUser.name}, haz clic aquí para confirmar tu correo:</p><a href="${confirmUrl}">Confirmar correo</a>`,
    }); 
    return {
      message: `Querido ${newUser.name}, te has registrado correctamente, por favor confirma tu correo para poder iniciar sesión`,
      
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profileImage: profileImagePath,
        // agrega aquí otros campos que quieras exponer, sin incluir datos sensibles
      },
  }
}

async login(loginDto: LoginDto): Promise<any> {
  const { email, password } = loginDto;
  const user = await this.usersRepository.findOne({ where: { email } });

  if (!user || !(await compare(password, user.password))) {
    throw new BadRequestException('Credenciales incorrectas');
  }

  if (!user.isEmailConfirmed) {
    throw new UnauthorizedException('Debes confirmar tu correo antes de iniciar sesión');
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
      // agrega aquí otros campos que quieras exponer, sin incluir datos sensibles
    },
  };
}

async handleOAuthLogin(
  profile: { email: string; displayName: string; photo?: string },
  provider: 'google' | 'github',
): Promise<any> {
  let user = await this.usersRepository.findOne({ where: { email: profile.email } });

  if (!user) {
    user = this.usersRepository.create({
      name: profile.displayName,
      email: profile.email,
      password: '',
      role: 'student',
      profileImage: profile.photo || undefined,
    });
    await this.usersRepository.save(user);
  }

  const token = this.generateToken(user);

  return {
    message: `Login exitoso con ${provider}`,
    token,
    user: {
      id: user.id,
      nombre: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    },
  };
}


  generateToken(user: User): string {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }
  generateEmailVerificationToken(user: User): string {
    return this.jwtService.sign(
      { email: user.email },
    { secret: process.env.JWT_EMAIL_SECRET, expiresIn: '1d' },
  );
}
}

