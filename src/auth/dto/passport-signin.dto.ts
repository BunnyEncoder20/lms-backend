import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// TODO: Ensure this DTO follows the new prisma schema for User 
export class PassportSignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
