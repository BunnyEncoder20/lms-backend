import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class PassportSignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
