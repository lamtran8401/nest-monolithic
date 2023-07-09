// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.env' });

import { Message } from '@apis/chat/entities/mesage.entity';
import { Room } from '@apis/chat/entities/room.entity';
import { User } from '@apis/users/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

export const options: DataSourceOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT ? +DB_PORT : 5432,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [User, Room, Message],
  synchronize: false,
};

export const AppDataSource = new DataSource(options);
