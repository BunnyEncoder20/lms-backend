import { Controller, Get, Post, Param, Body, Patch, Delete } from '@nestjs/common';

export class CreateUserDTO {
  name: string;
  email: string;
  role: string;
}

// controller base route: /users
@Controller('users')
export class UsersController {
  /*
    # TODO
    GET /users
    GET /users/:id
    POST /users
    PATCH /users/:id
    DELETE /users/:id


    NOTE: Always Remember that the static routes should always comes before the dynamic ones!
  */

  // 1. GET /users
  @Get()
  findall() {
    return [];
  }

  // 2. GET /users/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return { id };
  }

  // 3. POST /users
  @Post()
  createUser(@Body() user: CreateUserDTO) {
    return user;
  }

  // 4. PATCH /users/:id
  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() userUpdate: CreateUserDTO,
  ): { id: string } {
    return { id, ...userUpdate };
  }

  // 5. DELETE /users/:id
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return { deleted: id };
  }
}
