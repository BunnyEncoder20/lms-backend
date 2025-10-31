import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { PassportSignUpDto } from './dto/passport-signup.dto';
import { PassportSignInDto } from './dto/passport-signin.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(passportSignUpDto: PassportSignUpDto) {
    // hash the password
    const { personalNumber, email, password, firstName, lastName, rank, role } =
      passportSignUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser({
      personalNumber,
      firstName,
      lastName,
      email,
      rank,
      role,
      passwordHash: hashedPassword,
    });

    // TODO: check that when to send the auth tokens. Most likely this is not to send when creating the user, only during signIn flow
    // BUG: Help
    // FIXME: This func is broken
    // HACK: Yooo
    // NOTE: these are the ways to write better comments
    // WARN: sabpri I'm warning you sabpri. Behen shot
    // PERF:  or Performance / Omptimize this
    // XXX: Area needs significant attention
    // TEST: Test this shit
    // generate the auth tokens
    const tokens = this.generateTokens(user);

    // Optionally: store refresh token in DB for revocation and rotation
    await this.updateRefreshToken(user.personalNumber, tokens.refresh_token);

    return {
      id: user.personalNumber,
      email: user.email,
      ...tokens, // these tokens are converted to cookies in controller
    };
  }

  async signIn(passportSignInDto: PassportSignInDto) {
    const { personalNumber, password } = passportSignInDto;
    const user: User | null = await this.usersService.getById(personalNumber);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // generating the auth tokens
    const tokens = this.generateTokens(user);

    // store the refresh tokens in the DB
    await this.updateRefreshToken(user.personalNumber, tokens.refresh_token);

    return {
      personalNumber: user.personalNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      rank: user.rank,
      role: user.role,
      ...tokens,
    };
  }

  private generateTokens(user: User) {
    const payload = {
      sub: user.personalNumber,
      role: user.role,
      rank: user.rank,
    };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async rerefreshTokensfreshTokens(
    personalNumber: string,
    refreshToken: string,
  ) {
    const user = await this.usersService.getById(personalNumber);

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Access Denied: refresh token not found');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshTokenHash,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied: Invalid refreshToken');
    }

    // If the refresh token are valid, regen the access token
    const tokens = this.generateTokens(user);
    await this.updateRefreshToken(user.personalNumber, tokens.refresh_token);

    return tokens;
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    // Hash the refresh token before storing it
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.usersService.updateUser(userId, {
      refreshTokenHash: hashedRefreshToken,
    });
  }

  async signOut(userId: string) {
    // Clear refresh token from database
    await this.usersService.updateUser(userId, { refreshToken: null });
  }
}
