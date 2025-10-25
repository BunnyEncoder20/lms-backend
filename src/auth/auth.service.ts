import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, Rank, Role } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { PassportSignUpDto } from './dto/passport-signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(passportSignUpDto: PassportSignUpDto) {
    // hash the password
    const { personalNumber, email, password, firstName, lastName, rank, role } = passportSignUpDto;
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

    const tokens = this.generateTokens(user);

    // Optionally: store refresh token in DB for revocation and rotation
    await this.updateRefreshToken(user.personalNumber, tokens.access_token);

    return {
      id: user.personalNumber,
      email: user.email,
      ...tokens,
    };
  }

  async signIn(email: string, password: string) {
    const user: User | null = await this.usersService.getByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return {
      id: user.id,
      email: user.email, // TODO: might need to send role back instead of email
      ...tokens,
    };
  }

  private generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload),
    };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.getById(userId);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access Denied: refresh token not found');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Access Denied: Invalid refreshToken');
    }

    const tokens = this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateUser(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async signOut(userId: string) {
    // Clear refresh token from database
    await this.usersService.updateUser(userId, { refreshToken: null });
  }
}
