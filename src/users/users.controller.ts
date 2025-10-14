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
import { ResponseUserDto } from './dto/response-user.dto';
// import { AuthGuard } from 'src/auth/guards/auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/passport.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /* GET Routes */
  @UseGuards(JwtAuthGuard, RolesGuard) // Protected Route: Need valid JWT token
  @Roles('ADMIN', 'SUPER_ADMIN', 'TETRA_ADMIN', 'CO', 'JR_CO', 'LMS_ADMIN') // RBAC: only ADMIN can access this route
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
  whoami(@Request() req): ResponseUserDto {
    return new ResponseUserDto({
      id: req.user.userId,
      email: req.user.email,
      role: req.user.role,
    });
  }

  @UseGuards(JwtAuthGuard) // Protected Route: Need valid JWT token
  @Get(':id')
  async getOne(@Request() req, @Param('id') userId: string): Promise<ResponseUserDto> {
    const userData = await this.usersService.getById(parseInt(userId, 10));

    // Debugging data
    // console.log(`token data id:${typeof req.user.userId}:${req.user.userId}`);
    // console.log(`db data id:${typeof userData.id}:${userData.id}`);

    // User can only access their own data (unless they are an admin)
    if (
      userData &&
      (userData.id === req.user.userId || req.user.role === 'ADMIN')
    ) {
      return new ResponseUserDto(userData);
    } else {
      throw new UnauthorizedException('User can only access their own data');
    }
  }


  /* POST Routes */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'TETRA_ADMIN', 'CO', 'JR_CO', 'LMS_ADMIN')
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const results = await this.usersService.createUser(createUserDto);
    return new ResponseUserDto(results);
  }

  /* PATCH Routes */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'TETRA_ADMIN', 'CO', 'JR_CO', 'LMS_ADMIN')
  @Patch(':id')
  async update(
    @Param('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const results = await this.usersService.updateUser(userId, updateUserDto);
    return new ResponseUserDto(results);
  }

  /* DELETE Routes */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'TETRA_ADMIN', 'CO', 'JR_CO', 'LMS_ADMIN')
  @Delete(':id')
  async delete(@Param('id') userId: number): Promise<ResponseUserDto> {
    const results = await this.usersService.deleteUser(userId);
    return new ResponseUserDto(results);
  }
}
