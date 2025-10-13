import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/passport.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /* GET Routes */
  @Roles('ADMIN') // RBAC: only ADMIN can access this route
  @UseGuards(JwtAuthGuard) // Protected Route: Need valid JWT token
  @Get()
  async getAll(@Request() request) {
    // return {
    //   requested_by: request.user, // coming from the AuthGuard
    //   users: await this.usersService.getAll(), // cause userService.getAll() returns a promise obj, we must await it.
    // }
    return {
      data_req_by: request.user, // coming from Passport JwtAuthGuard
      users: await this.usersService.getAll(),
    };
  }

  @UseGuards(JwtAuthGuard) // Protected Route: Need valid JWT token
  @Get(':id')
  getOne(@Request() req,  @Param('id') userId: number) {
    const userData = this.usersService.getById(userId);
    if (userData.id === req.user.id) {
      return userData;
    }
    else {
      throw new UnauthorizedException('User can only access their own data');
    }
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
