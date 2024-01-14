import { User } from 'src/entities/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  database: 'digibank_postgres',
  host: 'dpg-cmhj3sud3nmc73cf4gt0-a',
  port: 5432,
  username: 'digibank_postgres_user',
  password: 'uNu5JcROzg1xerKQnEntg1nnZ6eKGdC6',
  entities: [User],
  synchronize: true,
};

export default config;
