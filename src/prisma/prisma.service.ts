import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
        {
          emit: 'event',
          level: 'error',
        },
      ],
    });
  }

  async onModuleInit() {
    this.$on('query', (event) => {
      this.logger.debug(`Query: ${event.query} Params: ${event.params} Duration: ${event.duration}ms`);
    });

    this.$on('info', (event) => {
      this.logger.log(event.message);
    });

    this.$on('warn', (event) => {
      this.logger.warn(event.message);
    });

    this.$on('error', (event) => {
      this.logger.error(event.message);
    });

    await this.$connect();
    this.logger.log('Connected to Prisma Database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('[Prisma] Disconnected from PostgreSQL');
  }
}
