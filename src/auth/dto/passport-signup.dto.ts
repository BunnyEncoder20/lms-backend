import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Rank, Role } from '@prisma/client';

export class PassportSignUpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Personal Number is 6 characters long' })
  @MaxLength(6, { message: 'Personal Number is 6 characters long' })
  personalNumber: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string; // password is not hashed yet

  @IsNotEmpty()
  @IsEnum(Rank)
  rank: Rank;

  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
