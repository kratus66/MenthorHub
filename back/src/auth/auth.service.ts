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
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { OAuthCompleteDto } from './dto/OauthRegister.dto';
import passport from 'passport';
import { Role } from '../common/constants/roles.enum';

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

      // Normaliza el rol para asegurarte que siempre sea del enum con valor inglés
     dto.role = this.normalizeRole(dto.role as unknown as string);


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
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = this.usersRepository.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      phoneNumber: dto.phoneNumber,
      avatarId: dto.avatarId,
      profileImage: profileImagePathOrURL || dto.profileImage,
      estudios: dto.studies,
      role: dto.role,
      country: dto.country,
      provincia: dto.province,
      localidad: dto.location,
      isEmailConfirmed: true,
      isOauth: true,
      oauthProvider: dto.oauthProvider,
    });

    await this.usersRepository.save(newUser);

    const accessToken = this.generateToken(newUser);

    await this.emailService.sendEmail(
      newUser.email,
      '¡Bienvenido a MentorHub!',
      `
        <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f4f9ff; color: #333; padding: 30px; border-radius: 10px; max-width: 600px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
          <div style="text-align: center;">
            <img src="https://cdn-icons-png.flaticon.com/512/4712/4712107.png" alt="Robot Bienvenida" width="100" style="margin-bottom: 20px;" />
          </div>
          <h2 style="color: #2a70c9; text-align: center;">¡Hola ${newUser.name}, te damos la bienvenida a MentorHub!</h2>
          <p style="font-size: 16px; line-height: 1.6;">
            Nos alegra mucho que hayas decidido unirte utilizando tu cuenta de ${newUser.oauthProvider}. Ya estás listo para comenzar a explorar la plataforma y aprovechar todos nuestros recursos.
          </p>

          <p style="font-size: 14px; color: #555;">
            Si tú no iniciaste sesión con esta cuenta, por favor ignora este mensaje o contáctanos para ayudarte.
          </p>
          <p style="font-size: 14px; color: #555; margin-top: 30px;">
            Saludos,<br>
            <strong>El equipo de MentorHub</strong>
          </p>
        </div>
      `
    );
    console.log('EMAIL ENVIADO')
    console.log(newUser)

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
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4173';
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);


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
    const confirmUrl = `${process.env.FRONTEND_URL || FRONTEND_URL || "http://localhost:4173"}/confirm-email?token=${emailToken}`;

      await this.emailService.sendEmail(
        newUser.email,
        'Confirma tu correo',
        `
          <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f4f9ff; color: #333; padding: 30px; border-radius: 10px; max-width: 600px; margin: auto; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
            <div style="text-align: center;">
              <img src="https://cdn-icons-png.flaticon.com/512/4712/4712107.png" alt="Robot Bienvenida" width="100" style="margin-bottom: 20px;" />
            </div>
            <h2 style="color: #2a70c9; text-align: center;">¡Bienvenido a MentorHub, ${newUser.name}!</h2>
            <p style="font-size: 16px; line-height: 1.6;">
              Nos alegra mucho tenerte con nosotros. Para comenzar a explorar la plataforma y acceder a todos nuestros recursos, por favor confirma tu correo electrónico haciendo clic en el siguiente botón:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmUrl}" style="background-color: #2a70c9; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                Confirmar correo
              </a>
            </div>
            <p style="font-size: 14px; color: #555;">
              Si tú no creaste esta cuenta, simplemente ignora este mensaje.
            </p>
            <p style="font-size: 14px; color: #555; margin-top: 30px;">
              Saludos,<br>
              <strong>El equipo de MentorHub</strong>
            </p>
          </div>
        `
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

  async confirmEmail(token: string): Promise<{ success: boolean }> {
    try {
      // Verificamos el token usando el secreto específico para confirmación de email
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_EMAIL_SECRET, // <-- Especificamos el secreto aquí
      });

      const userId = payload.sub; // asegurate de usar 'sub' al crear el token
      const user = await this.usersRepository.findOne({ where: { id: userId } });

      if (!user) {
        // Si el usuario no existe, aún devolvemos success: false
        // El endpoint lo manejará lanzando BadRequestException
        return { success: false };
      }

      // Si ya está confirmado, no hacemos nada
      if (user.isEmailConfirmed) {
        return { success: true }; // Retorna true si ya estaba confirmado
      }

      // Confirmamos el correo
      user.isEmailConfirmed = true;
      await this.usersRepository.save(user);

      return { success: true }; // Retorna true si se confirmó exitosamente
    } catch (error) {
      console.error('❌ Error al confirmar email:', error);
      // Si hay un error en la verificación (ej: invalid signature, expired),
      // la excepción se propagará y será capturada por el endpoint,
      // que lanzará BadRequestException.
      // Si el error no es de verificación pero queremos que falle,
      // podríamos lanzar una excepción aquí, pero para este caso,
      // dejar que la excepción de verify se propague es lo correcto.
      // Si quieres manejar otros tipos de errores aquí y devolver { success: false },
      // puedes añadir lógica adicional, pero para el error de token,
      // es mejor dejar que verify lance la excepción.
      // Para ser explícitos con errores no relacionados con el token:
       if (!(error instanceof Error && 'name' in error && error.name === 'JsonWebTokenError')) {
           console.error('Otro tipo de error en confirmEmail:', error);
           // Podrías lanzar un error diferente o devolver { success: false }
           // throw new InternalServerErrorException('Error interno al confirmar email');
       }
       // Para errores de token, simplemente dejamos que se propaguen o relanzamos si es necesario
       throw error; // Relanzamos el error para que el controlador lo capture
    }
  }


  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || !(await compare(password, user.password))) {
      throw new BadRequestException('Credenciales incorrectas');
    }

    //  if (!user.isEmailConfirmed) {
    //   throw new UnauthorizedException(
    //     'Debes confirmar tu correo antes de iniciar sesión',
    //   );
    // }

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
        isOauth: user.isOauth,
        OauthProvider: user.oauthProvider,


      },
    };
  }
// auth.service.ts

async handleOAuthProcess(profile: any, provider: 'google' | 'github') {


  // Buscar usuario con este email Y este proveedor
  const user = await this.usersRepository.findOne({
    where: {
      email: profile.email,
    },
  });

  if (user) {
    const shouldCompleteProfile =
      !user.role || !user.phoneNumber;
    if (shouldCompleteProfile) {
      return {
        shouldCompleteProfile: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          isOauth: true,
          oauthProvider: user.oauthProvider,
          isEmailConfirmed: true,
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
            isOauth: true,
            oauthProvider: user.oauthProvider,
            isEmailConfirmed: true,
            isPaid: user.isPaid,
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

// 1. Generar token de restablecimiento
async generatePasswordResetToken(user: User): Promise<string> {
  const payload = { sub: user.id };
  return this.jwtService.sign(payload, {
    secret: process.env.JWT_RESET_SECRET,
    expiresIn: '15m', // duración corta por seguridad
  });
}

// 2. Verificar el token
async verifyPasswordResetToken(token: string): Promise<User> {
  try {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_RESET_SECRET,
    });

    const user = await this.usersRepository.findOne({ where: { id: payload.sub } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  } catch (error) {
    throw new BadRequestException('Token inválido o expirado');
  }
}

// 3. Actualizar contraseña
async updatePassword(userId: string, newPassword: string): Promise<void> {
  const user = await this.usersRepository.findOne({ where: { id: userId } });

  if (!user) {
    throw new NotFoundException('Usuario no encontrado');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  await this.usersRepository.save(user);
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
      { email: user.email, sub: user.id }, // Añadido 'sub' al payload para confirmEmail
      {
        secret: process.env.JWT_EMAIL_SECRET,
        expiresIn: '1d',
      },
    );
  }

  normalizeRole(role?: string): Role {
    if (!role) {
      throw new BadRequestException('El rol es requerido');
    }

    const normalized = role.toLowerCase();

    switch (normalized) {
      case 'alumno':
      case 'student':
        return Role.Student;
      case 'profesor':
      case 'teacher':
        return Role.Teacher;
      case 'admin':
        return Role.Admin;
      default:
        throw new BadRequestException(`Rol inválido: ${role}`);
    }
  }


}
