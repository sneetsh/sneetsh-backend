import * as path from 'path';

import { DataSource } from 'typeorm';

import { config } from 'dotenv';
import { Logger } from '@nestjs/common';

config();

export const connectionSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL_DEV,
  synchronize: false,
  subscribers: ['/subscriber/**/*{.ts,.js}'],
  entities: [path.join(__dirname, '**/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, 'migrations', '**/*.{ts,js}')],
  logging: true,
});

connectionSource
  .initialize()
  .then(() => {
    Logger.debug('Data Source has been initialized!');
  })
  .catch((err) => {
    Logger.debug('Error during Data Source initialization' + err.toString());
  });
