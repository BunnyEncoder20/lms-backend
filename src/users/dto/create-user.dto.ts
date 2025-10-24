import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { Rank, Role } from '@prisma/client';

// TODO: Ensure this dto follows the new prisma schema for User
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Personal Number is 6 characters long' })
  @MaxLength(6, { message: 'Personal Number is 6 characters long' })
  personalNumber: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  passwordHash: string;

  @IsNotEmpty()
  @IsEnum(Rank, { message: 'rank must be one of the defined Rank enum values' })
  rank: Rank;

  @IsNotEmpty()
  @IsEnum(Role, { message: 'role must be one of the defined Role enum values' })
  role: Role;
}
