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
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /* GET Routes */
  @UseGuards(JwtAuthGuard, RolesGuard) // Protected Route: Need valid JWT token
  @Roles('ADMIN') // RBAC: only ADMIN can access this route
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

  @UseGuards(JwtAuthGuard)
  @Get('whoami')
  whoami(@Request() req) {
    return {
      id: req.user.userId,
      email: req.user.email,
      role: req.user.role,
    };
  }

  @UseGuards(JwtAuthGuard) // Protected Route: Need valid JWT token
  @Get(':id')
  async getOne(@Request() req, @Param('id') userId: string) {
    const userData = await this.usersService.getById(parseInt(userId, 10));

    // Debugging data
    // console.log(`token data id:${typeof req.user.userId}:${req.user.userId}`);
    // console.log(`db data id:${typeof userData.id}:${userData.id}`);

    // User can only access their own data (unless they are an admin)
    if (
      userData &&
      (userData.id === req.user.userId || req.user.role === 'ADMIN')
    ) {
      return userData;
    } else {
      throw new UnauthorizedException('User can only access their own data');
    }
  }


  /* POST Routes */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'TETRA_ADMIN', 'CO', 'JR_CO', 'LMS_ADMIN')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  /* PATCH Routes */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'TETRA_ADMIN', 'CO', 'JR_CO', 'LMS_ADMIN')
  @Patch(':id')
  update(@Param('id') userId: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  /* DELETE Routes */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'TETRA_ADMIN', 'CO', 'JR_CO', 'LMS_ADMIN')
  @Delete(':id')
  delete(@Param('id') userId: number) {
    return this.usersService.delete(userId);
  }
}
