import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
 constructor(
  private authService: AuthService,
  private configService: ConfigService,
) {
  super({
    clientID: configService.get('GOOGLE_CLIENT_ID'),
    clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
    callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
    scope: ['email', 'profile'],
  });
}


  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const user = await this.authService.validateOAuthLogin(profile, 'google');
    done(null, user);
  }
}