import * as path from 'path';

import { registerAs } from "@nestjs/config";

import { getEnv } from 'src/common/helpers/env.helper';
const ENV = getEnv();

export default registerAs("db", () => ({
  test: {
    type: "postgres",
    url: ENV.DATABASE_URL_TEST,
    logging: true,
    ssl: false,
    entities: [path.join(__dirname, "../", "**/*.entity.{ts,js}")],
    synchronize: false,
    autoLoadEntities: true,
    keepConnectionAlive: true,
  },
  development: {
    type: "postgres",
    url: ENV.DATABASE_URL_DEV,
    logging: true,
    console: true,
    ssl: false,
    entities: [path.join(__dirname, "../", "**/*.entity.{ts,js}")],
    synchronize: false,
    autoLoadEntities: true,
    keepConnectionAlive: true,
  },
  production: {
    type: "postgres",
    url: ENV.DATABASE_URL_PROD,
    ssl: {
      rejectUnauthorized: false,
    },
    logging: true,
    entities: [__dirname + "/../**/*.entity.{js,ts}"],
    synchronize: false,
    autoLoadEntities: true,
    keepConnectionAlive: true,
  }
}));
