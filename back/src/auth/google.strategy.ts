import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: '294636354298-k94hi88nd6jv0soap91ch9qf7urdgtna.apps.googleusercontent.com',
      clientSecret: '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gtna',
      callbackURL: 'http://localhost:3001/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const user = await this.authService.validateOAuthLogin(profile, 'google');
    done(null, user);
  }
}