import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
// import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  // imports: [PrismaModule],  // cause prismaService is declare with @Global deco, it can be directly injected in all modules
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
