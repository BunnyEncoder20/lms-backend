import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not provided in env variables');
    }

    // * The token is extracted from the cookies here
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // * List of methods  to try and extract the auth tokens

        // first method
        (request: Request) => {
          return request?.cookies?.access_token;
        },

        // second method
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: secret, // cyptographically verify signature of incoming JWT
    });
  }

  validate(payload: any) {
    // * the req.user is atteched to the req body by passport
    // * this return value gets attached to req.user
    return {
      personalNumber: payload.sub,
      role: payload.role,
      rank: payload.rank,
    };
  }
}
