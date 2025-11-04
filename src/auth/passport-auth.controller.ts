import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  UseGuards,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoggingService } from '../logging/logging.service';
import { PassportSignUpDto } from './dto/passport-signup.dto';
import { PassportSignInDto } from './dto/passport-signin.dto';
import { JwtAuthGuard, RefreshJwtAuthGuard } from './guards/passport.guard';
import { User } from './decorators/user.decorator';
import { ActivityType } from '@prisma/client';
import type { Response, Request } from 'express';

@Controller('auth-v2')
export class PassportAuthController {
  constructor(
    private authService: AuthService,
    private loggingService: LoggingService,
  ) { }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(
    @Body() passportSignUpDto: PassportSignUpDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const results = await this.authService.signUp(passportSignUpDto);

    // Set tokens as HttpOnly cookies'
    this.setAuthCookies(response, results.access_token, results.refresh_token);

    // Create audit log
    await this.loggingService.createAuditLog({
      activityType: ActivityType.USER_CREATE,
      personalNumber: results.personalNumber,
      username: `${results.firstName} ${results.lastName}`,
      method: request.method,
      route: request.path,
      details: {
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        rank: results.rank,
        role: results.role,
      },
    });

    // Return user info without the tokens (They'll be in cookies now)
    return {
      id: results.id,
      email: results.email,
      message: 'User registration successful',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Body() passportSignInDto: PassportSignInDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const results = await this.authService.signIn(passportSignInDto);

    this.setAuthCookies(response, results.access_token, results.refresh_token);

    // Create audit log for successful login
    await this.loggingService.createAuditLog({
      activityType: ActivityType.LOGIN,
      personalNumber: results.personalNumber,
      username: `${results.firstName} ${results.lastName}`,
      method: request.method,
      route: request.path,
      details: {
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        rank: results.rank,
        role: results.role,
      },
    });

    return {
      personalNumber: results.personalNumber,
      firstName: results.firstName,
      lastName: results.lastName,
      rank: results.rank,
      role: results.role,
    };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signout')
  async signOut(
    @User('personalNumber') personalNumber: string,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    await this.authService.signOut(personalNumber);

    // Clear cookies
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');

    // Create audit log for logout
    await this.loggingService.createAuditLog({
      activityType: ActivityType.LOGOUT,
      personalNumber: personalNumber,
      method: request.method,
      route: request.path,
      details: {
        ip: request.ip,
        userAgent: request.headers['user-agent'],
      },
    });

    return { message: 'Sign out successful' };
  }

  @UseGuards(RefreshJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshAccessToken(
    @User('personalNumber') personalNumber: string,
    @User('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    // Refresh Token is validated and attached to the req.user which is fetched above
    // Using that to get new tokens from auth service
    const tokens = await this.authService.refreshTokens(
      personalNumber,
      refreshToken,
    );

    // Set the new tokens into cookies
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
      httpOnly: true, // security against XSS
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production: security against MITM, sending cookies over HTTPS only
      sameSite: 'strict', // security against CSRF protection
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
