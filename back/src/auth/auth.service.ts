import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { compare, hash } from 'bcrypt';

@Injectable()
export class AuthService {
    validateOAuthLogin: any;
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private  jwtService: JwtService,
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

    const token = this.generateToken(newUser);
    return {
      message: `Inicio de sesión exitoso. Bienvenido, ${newUser.name}`,
      
      user: {
        id: newUser.id,
        nombre: newUser.name,
        email: newUser.email,
        rol: newUser.role,
        Image: profileImagePath,
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

  const token = this.generateToken(user);

  return {
    message: `Inicio de sesión exitoso. Bienvenido, ${user.name}`,
    token,

    user: {
      id: user.id,
      nombre: user.name,
      email: user.email,
      rol: user.role,
      Image: user.profileImage,
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
      rol: user.role,
      profileImage: user.profileImage,
    },
  };
}


  generateToken(user: User): string {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }
}
