import config from "../config/environmentVars";
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: config.dbHost,
  database: config.dbDatabase,
  user: config.dbUser,
  password: config.dbPassword,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool;

//check the connection to the database and log the errors
async function checkConnection(): Promise<void> {
    try {
        await promisePool.execute('SELECT 1 + 1 AS solution');
        console.log('Connection pool to db successful');
    } catch (error) {
        console.error('Error connecting to the database:');
        console.error('Error code:', error);
        console.error('Error message:', error);
        console.error('Error stack trace:', error);
    }
}

//close connection pool when app is closed
export async function closeDatabasePool(): Promise<void> {
  try {
    await promisePool.end();
    console.log("Connection pool to db closed");
  } catch (error) {
    console.error("Error closing the connection pool:", error);
  }
}

checkConnection();

export default promisePool;
