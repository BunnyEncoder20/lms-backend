import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

type AuthInput = { username: string; password: string };
type SignInData = { userId: number; username: string };

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.userService.getByEmail(input.username);
    if (!user) {
      throw new UnauthorizedException();
      return null;
    }
    return { userId: user.id, username: user.email };
  }
}
