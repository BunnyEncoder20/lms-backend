import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

// Mapped to Passport/AuthGuard('refresh-jwt')
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not provided in env variables');
    }

    super({
      // 1. Extract from refresh_token cookie
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refresh_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  // 2. Validate the payload and attach the Raw token
  validate(req: Request, payload: any) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      // Should not happen if extracted worked, but just a safe guard
      throw new UnauthorizedException('Refresh token is required');
    }

    // Attach both the decoded payload and the raw refresh token
    return {
      ...payload,
      refreshToken: refreshToken, // Raw token attached here (req.user)
    };
  }
}
