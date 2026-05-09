import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
import { getDatabaseEnvironment } from '../config/database.environment';
import { typeOrmEntities } from './typeorm.entities';

export function getTypeOrmBaseOptions(): DataSourceOptions {
  const database = getDatabaseEnvironment();

  return {
    type: 'postgres',
    host: database.host,
    port: database.port,
    username: database.username,
    password: database.password,
    database: database.database,
    schema: database.schema,
    logging: database.logging,
    synchronize: false,
    entities: typeOrmEntities,
    migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
    migrationsTableName: 'typeorm_migrations',
    ssl: database.ssl
      ? { rejectUnauthorized: database.sslRejectUnauthorized }
      : false,
  };
}

export function getTypeOrmModuleOptions(): TypeOrmModuleOptions {
  return {
    ...getTypeOrmBaseOptions(),
    autoLoadEntities: false,
  };
}
