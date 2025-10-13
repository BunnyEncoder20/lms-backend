import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User, Rank, Role } from '@prisma/client';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(
    email: string,
    password: string,
    name: string,
    rank: Rank,
    role: Role,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser({
      name,
      email,
      rank,
      role,
      password: hashedPassword,
    });

    return {
      id: user.id,
      email: user.email,
      access_token: this.generateToken(user).access_token,
    };
  }

  async signIn(email: string, password: string) {
    const user: User | null = await this.usersService.getByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      email: user.email, // TODO: might need to send role back instead of email
      access_token: this.generateToken(user).access_token,
    };
  }

  private generateToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
