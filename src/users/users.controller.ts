import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /* GET Routes */
  @UseGuards(AuthGuard)
  @Get()
  async getAll(@Request() request) {
    return {
      requested_by: request.user, // coming from the AuthGuard
      users: await this.usersService.getAll(), // cause userService.getAll() returns a promise obj, we must await it.
    }
  }

  @Get(':id')
  getOne(@Param('id') userId: number) {
    return this.usersService.getById(userId);
  }

  /* POST Routes */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  /* PATCH Routes */
  @Patch(':id')
  update(@Param('id') userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  /* DELETE Routes */
  @Delete(':id')
  delete(@Param('id') userId: number) {
    return this.usersService.delete(userId);
  }
}
