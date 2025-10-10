import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /* GET Routes */
  @Get()
  getAll() {
    return this.usersService.getAll();
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
