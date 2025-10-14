import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Rank, Role } from '@prisma/client';

export class PassportSignUpDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  // @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsNotEmpty()
  @IsEnum(Rank)
  rank: Rank;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
