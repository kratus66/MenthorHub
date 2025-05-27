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
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
    console.log('JwtStrategy initialized, secret loaded');
  }

  async validate(payload: any) {
    console.log('JwtStrategy -> payload:', payload);
    return {
      email: payload.email,
      sub: payload.sub,
      role: payload.role,
      name: payload.name,
      profileImage: payload.profileImage
    };
  }
}
