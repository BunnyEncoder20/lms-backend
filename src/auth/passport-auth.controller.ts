import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportSignUpDto } from './dto/passport-signup.dto';
import { PassportSignInDto } from './dto/passport-signin.dto';

@Controller('auth-v2')
export class PassportAuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp(@Body() signUpDto: PassportSignUpDto) {
    const { email, password, name, rank, role } = signUpDto;
    return this.authService.signUp(email, password, name, rank, role);
  }

  @Post('signin')
  signIn(@Body() signInDto: PassportSignInDto) {
    const { email, password } = signInDto;
    return this.authService.signIn(email, password);
  }
}
