import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.token,                 // Extrae token de cookie si existe
        ExtractJwt.fromAuthHeaderAsBearerToken(),    // Si no hay cookie, intenta extraer token del header
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
    console.log('JwtStrategy initialized, secret loaded');
    console.log('JwtStrategy initialized, secret loaded');
  }

  async validate(payload: any) {
    console.log('JwtStrategy -> payload:', payload);
    console.log('JwtStrategy -> payload:', payload);
    return {
      email: payload.email,
      sub: payload.sub,
      sub: payload.sub,
      role: payload.role,
      name: payload.name,
      profileImage: payload.profileImage,
    };
  }
}
