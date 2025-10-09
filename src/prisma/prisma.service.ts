import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
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
      log:
        process.env.NODE_ENV === 'production' // disables query logging in production
          ? ['error', 'warn']
          : [
              { emit: 'event', level: 'query' },
              { emit: 'event', level: 'info' },
              { emit: 'event', level: 'warn' },
              { emit: 'event', level: 'error' },
            ],
    });
  }

  async onModuleInit() {
    // Quaery events have: query, params, durations, target
    this.$on('query' as never, (event: any) => {
      this.logger.debug(
        `Query: ${event.query} | Params: ${event.params} | Duration: ${event.duration}ms`
      );
    });

    // Info/warn/error events have: timestamp, message, target
    this.$on('info' as never, (event: any) => {
      this.logger.log(event.message);
    });

    this.$on('warn' as never, (event: any) => {
      this.logger.warn(event.message);
    });

    this.$on('error' as never, (event: any) => {
      this.logger.error(event.message);
    });


    // Connecting Prisma to PostgreSQL
    await this.$connect();
    this.logger.log('Connected to Prisma Database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('Disconnected from PostgreSQL');
  }
}
