// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './google.strategy';
import { GithubStrategy } from './github.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';
// Log de carga del módulo
console.log('AuthModule cargado');

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EmailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule,
                EmailModule
        
      ],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET') || 'ment0rhUb_2025_superclave';
        console.log('JwtModule secret cargado:', secret);
        return {
          secret,
          signOptions: { expiresIn: '1h' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    JwtStrategy,
    GoogleStrategy,
    GithubStrategy,

  ],
  exports: [AuthService],
})
export class AuthModule {
  constructor() {
    console.log('AuthModule initialization complete');
  }
}
