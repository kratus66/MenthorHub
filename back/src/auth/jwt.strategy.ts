import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'ment0rhUb_2025_superclave',
    });
    console.log('JwtStrategy initialized, secret loaded');
  }

  async validate(payload: any) {
    console.log('JwtStrategy -> payload:', payload);
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
