import { Sequelize } from 'sequelize-typescript';
import * as fs from 'fs/promises';

const connection_url : string = process.env.DATABASE_URL as string
const seed_testdata = process.env.SEED_TESTDATA
const sequelize = new Sequelize(connection_url);

async function seedDb() {
  if(seed_testdata !== undefined){
    try {
      await sequelize.sync(); // Sync the models with the database
      const sqlScript = await fs.readFile('./test_data/postadressen.sql', 'utf8');;
      await sequelize.query(sqlScript);
      console.log('SQL script executed successfully');
    } catch (error) {
      console.error('Error executing SQL script:', error);
    } finally {
      await sequelize.close();
    }
  }else {
    console.error("SEED_TESTDATA is not set, not seeding database with test data");
  }
}

seedDb();