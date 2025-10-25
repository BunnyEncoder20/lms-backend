import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<User[] | null> {
    return await this.prisma.user.findMany();
  }

  async getById(personalNumber: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { personalNumber },
    });
  }

  // ! Might be redundent now
  async getByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: createUserDto,
    });
  }

  async updateUser(personalNumber: string, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.prisma.user.update({
      where: { personalNumber },
      data: updateUserDto,
    });
  }

  async deleteUser(personalNumber: string): Promise<User> {
    return await this.prisma.user.delete({
      where: { personalNumber },
    });
  }
}
