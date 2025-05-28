import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-github';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
      passReqToCallback: false,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const emails = profile.emails;
  
    if (!emails || !Array.isArray(emails)) {
      throw new UnauthorizedException('No se pudo obtener el correo desde GitHub');
    }
  
    const primaryEmail = emails.find((e: any) => e.primary && e.verified) || emails[0];
  
    if (!primaryEmail || !primaryEmail.value) {
      throw new UnauthorizedException('No se encontró un correo válido en GitHub');
    }
  
    return {
      email: primaryEmail.value,
      displayName: profile.username || profile.displayName,
      photo: profile.photos?.[0]?.value,
    };
  }
}
