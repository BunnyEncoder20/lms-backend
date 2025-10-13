import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Rank, Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEnum(Rank, { message: 'rank must be one of the defined Rank enum values' })
  rank: Rank;

  @IsNotEmpty()
  @IsEnum(Role, { message: 'role must be one of the defined Role enum values' })
  role: Role;
}
