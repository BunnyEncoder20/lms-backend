
// FIXME: Renmae this file, doesn't follow naming Convention (camelcase only)
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) { }
