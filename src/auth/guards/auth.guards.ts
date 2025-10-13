import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization; // Bearer <token>
    console.log('Authorization:', authorization);
    const token: string = authorization?.split(' ')[1];
    console.log('token to be verified:', token);

    if (!token) {
      throw new UnauthorizedException('No auth header provided');
    }

    try {
      const tokenPayload = await this.jwtService.verifyAsync(token);
      // adding a user object itself to the req body
      request.user = {
        userId: tokenPayload.sub,
        email: tokenPayload.email,
        role: tokenPayload.role,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Invlaid token');
    }
  }
}
