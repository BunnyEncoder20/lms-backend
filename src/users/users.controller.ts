import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
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
import { ResponseUserDto } from './dto/response-user.dto';
// import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/passport.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { Role } from '@prisma/client';
import { ADMIN_ROLES } from 'src/common/constants/app-roles.constant';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /* GET Routes */
  @Roles('ADMIN', 'SUPER_ADMIN', 'TETRA_ADMIN', 'LMS_ADMIN') // RBAC: only ADMIN can access this route
  @UseGuards(JwtAuthGuard, RolesGuard) // Protected Route: Need valid JWT token
  @Get()
  async getAll(): Promise<ResponseUserDto[]> {
    const data = await this.usersService.getAll();
    if (!data) {
      return [];
    }
    return data.map((user) => new ResponseUserDto(user));
  }

  @UseGuards(JwtAuthGuard)
  @Get('whoami')
  whoami(@User() requser): ResponseUserDto {
    return new ResponseUserDto(requser);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(
    @User('personalNumber') authPersonalNumber: string,
    @User('role') authRole: Role,
    @Param('id') requestedPersonalNumber: string,
    userId: string,
  ): Promise<ResponseUserDto> {
    // 1. Find our user is admin or not
    const isAdmin = ADMIN_ROLES.includes(authRole);

    // 2. Authorization check: Self-Access or Admin-Access
    if (requestedPersonalNumber !== authPersonalNumber && !isAdmin) {
      // User not a admin and trying to access another user info
      throw new ForbiddenException(
        'You do not have permission to view this user profile',
      );
    }

    // 3. Data retrival
    const userData = await this.usersService.getById(requestedPersonalNumber);
    if (!userData) {
      throw new NotFoundException();
    }

    // 4. Serialize and return data
    return new ResponseUserDto(userData);
  }

  /* POST Routes */
  @Roles('ADMIN', 'SUPER_ADMIN', 'TETRA_ADMIN', 'LMS_ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const results = await this.usersService.createUser(createUserDto);
    return new ResponseUserDto(results);
  }

  /* PATCH Routes */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @User('personalNumber') authPersonalNumber: string,
    @User('role') authRole: Role,
    @Param('id') updatePersonalNumber: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    // 1. Determine user role
    const isAdmin = ADMIN_ROLES.includes(authRole);

    // 2. Authorization Check (Self-Update or Admin-Update)
    if (!isAdmin && authPersonalNumber !== updatePersonalNumber) {
      // User is not admin and trying to udpate another user's info
      throw new ForbiddenException(
        'You do not have permission to update this users profile',
      );
    }

    // 3. Data updating
    const results = await this.usersService.updateUser(
      updatePersonalNumber,
      updateUserDto,
    );

    // 4. Serialization and Return
    return new ResponseUserDto(results);
  }

  /* DELETE Routes */
  @Roles('ADMIN', 'SUPER_ADMIN', 'TETRA_ADMIN', 'LMS_ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async delete(
    @Param('id') deletePersonalNumber: string,
  ): Promise<ResponseUserDto> {
    const results = await this.usersService.deleteUser(deletePersonalNumber);
    return new ResponseUserDto(results);
  }
}
