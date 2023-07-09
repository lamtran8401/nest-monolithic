import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

config();

const configService = new ConfigService();

const options: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT') || 5432,
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  migrations: ['src/migrations/*.ts', 'dist/migrations/*{.ts,.js}'],
  entities: ['dist/**/*.entity{.ts,.js}', 'src/**/*.entity{.ts,.js}'],
  synchronize: configService.get('NODE_ENV') !== 'production',
};

export default new DataSource(options);
