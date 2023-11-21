import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { getEnv } from '../../common/helpers/env.helper';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const ENV = getEnv();
        const DB_CONFIG = configService.get('db');

        if (ENV.NODE_ENV === 'development') return DB_CONFIG.development;

        if (ENV.NODE_ENV === 'test') return DB_CONFIG.test;

        return DB_CONFIG.production;
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
