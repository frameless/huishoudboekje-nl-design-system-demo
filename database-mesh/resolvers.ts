import { Resolvers } from './.mesh'
import {Connection} from 'postgresql-client';
import dotenv from 'dotenv';

const dbConfig = {
    
  };

const resolvers: Resolvers = {
  Mutation: {
    async truncateTable(_, { databaseName, tableName }) {
        const connection = new Connection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            database: databaseName,
        });
        let result = false;

        try {
            await connection.connect();
            await connection.query(`DELETE FROM public."${tableName}"`);
            result = true;
        } catch (error) {
            console.error('Error truncating table:', error);
        } finally {
            await connection.close();
            return {result}
        }
    }
  }
}
 
export default resolvers