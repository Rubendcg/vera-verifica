import 'dotenv/config';
import { DataSource } from 'typeorm';
import { getTypeOrmBaseOptions } from './typeorm.config';

const appDataSource = new DataSource(getTypeOrmBaseOptions());

export default appDataSource;
