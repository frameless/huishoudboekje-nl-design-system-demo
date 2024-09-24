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
    },
    async truncateAll(_) {
        const connectionPost = new Connection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            database: "postadressenservice",
        });
        const connectionOrg = new Connection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            database: "organisatieservice",
        });
        const connectionHhb = new Connection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            database: "huishoudboekjeservice",
        });
        const connectionFile = new Connection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            database: "fileservice",
        });
        const connectionBank = new Connection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            database: "banktransactieservice",
        });
        const connectionAlarm = new Connection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            database: "alarmenservice",
        });
        let result = false;

        try {
            //Delete postadressen
            await connectionPost.connect();
            await connectionPost.query(`TRUNCATE TABLE public."Address"`);

            //Delete organisation
            await connectionOrg.connect();
            await connectionOrg.query(`TRUNCATE TABLE public."organisaties", public."afdelingen"`);
            //Delete hhb
            await connectionHhb.connect();
            await connectionHhb.query(`TRUNCATE TABLE public."rubrieken", public."journaalposten", public."afspraken", 
              public."huishoudens", public."burgers", public."afdelingen", public."rekening_afdeling",  
              public."rekening_burger", public."rekeningen", public."configuratie", public."overschrijvingen", public."saldos"`);

            //Delete files
            await connectionFile.connect();
            await connectionFile.query(`TRUNCATE TABLE public."files"`);

            //Delete bank
            await connectionBank.connect();
            await connectionBank.query(`TRUNCATE TABLE public."transactions", 
              public."customerstatementmessages", public."paymentrecords", public."paymentexports"`);

            //Delete alarms
            await connectionAlarm.connect();
            await connectionAlarm.query(`TRUNCATE TABLE public."signals", public."alarms"`);
            result = true;
        } catch (error) {
            console.error('Error truncating table:', error);
        } finally {
            await connectionPost.close();
            await connectionOrg.close();
            await connectionHhb.close();
            await connectionFile.close();
            await connectionBank.close();
            await connectionAlarm.close();
            return {result}
        }
    }
  }
}
 
export default resolvers