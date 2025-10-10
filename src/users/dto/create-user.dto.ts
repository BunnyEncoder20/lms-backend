import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Rank, Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Rank, { message: 'rank must be one of the defined Rank enum values' })
  rank: Rank;

  @IsEnum(Role, { message: 'role must be one of the defined Role enum values' })
  role: Role;
}
