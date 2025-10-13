import { Controller, Post, HttpCode, NotImplementedException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth-v2')
export class PassportAuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp() {
    throw new NotImplementedException();
  }

  @Post('signin')
  signIn() {
    throw new NotImplementedException();
  }
}
