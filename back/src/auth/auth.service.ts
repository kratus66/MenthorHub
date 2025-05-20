import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { compare, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto, profileImagePath: string): Promise<{ token: string }> {
    const existingUser = await this.usersRepository.findOne({ where: { email: dto.email } });
    if (existingUser) {
      throw new UnauthorizedException('El correo ya está registrado');
    }

    if (dto.password !== dto.confirmPassword) {
      throw new UnauthorizedException('Las contraseñas no coinciden');
    }

    const hashedPassword = await hash(dto.password, 10);

    const newUser = this.usersRepository.create({
      nombre: dto.nombre,
      email: dto.email,
      password: hashedPassword,
      celular: dto.celular,
      avatarId: dto.avatarId,
      profileImage: profileImagePath,
      estudios: dto.estudios,
      rol: dto.rol as 'student' | 'teacher' | 'admin',
      pais: dto.pais,
      provincia: dto.provincia,
      localidad: dto.localidad,
    });

    await this.usersRepository.save(newUser);

    const token = this.generateToken(newUser);
    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || !(await compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const token = this.generateToken(user);
    return { token };
  }

  generateToken(user: User): string {
    const payload = { email: user.email, sub: user.id, rol: user.rol };
    return this.jwtService.sign(payload);
  }
}
