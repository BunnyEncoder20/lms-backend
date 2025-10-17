import { Controller, Post, HttpCode, HttpStatus, Body, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportSignUpDto } from './dto/passport-signup.dto';
import { PassportSignInDto } from './dto/passport-signin.dto';
import { JwtAuthGuard } from './guards/passport.guard';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth-v2')
export class PassportAuthController {
  constructor(private authService: AuthService, private jwtService: JwtService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(@Body() signUpDto: PassportSignUpDto, @Res({ passthrough: true }) response: Response ) {
    const { email, password, name, rank, role } = signUpDto;
    const results = await this.authService.signUp(email, password, name, rank, role);

    // Set tokens as HttpOnly cookies'
    this.setAuthCookies(response, results.access_token, results.refresh_token);

    // Return user info without the tokens (They'll be in cookies now)
    return {
      id: results.id,
      email: results.email,
      message: 'User registration successful',
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() signInDto: PassportSignInDto, @Res({ passthrough: true }) response: Response) {
    const { email, password } = signInDto;
    const results = await this.authService.signIn(email, password);

    this.setAuthCookies(response, results.access_token, results.refresh_token);

    return {
      id: results.id,
      email: results.email,
      message: 'User login successful',
    };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signout')
  async signOut(
    @User('userId') userId: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.signOut(userId);

    // Clear cookies
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');

    return { message: 'Sign out successful' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshAccessToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // Access the refresh token from HttpOnly cookie
    const refreshToken = request.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found in cookies');
    }

    // Decode to get userId (you might want to add error handling)
    const decoded = this.jwtService.decode(refreshToken) as any;
    const tokens = await this.authService.refreshTokens(decoded.sub, refreshToken);

    this.setAuthCookies(response, tokens.access_token, tokens.refresh_token);

    return { message: 'Tokens refreshed successfully' };
  }

  private setAuthCookies(
    response: Response,
    access_token: string,
    refreshToken: string,
  ) {
    // Access token cookie
    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Uss secure cookies in production
      sameSite: 'strict', // CSRF protection
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    // Refresh token cookie
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
  }
}
