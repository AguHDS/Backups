import config from "../config/environmentVars";
import mysql from 'mysql2';

const pool = mysql.createPool({
    host: config.dbHost,
    database: config.dbDatabase,
    user: config.dbUser,
    password: config.dbPassword,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const promisePool = pool.promise();

//check the connection to the database and log the errors
async function checkConnection() {
    try {
        await promisePool.query('SELECT 1 + 1 AS solution');
        console.log('Connection pool to db successful');
    } catch (error) {
        console.error('Error connecting to the database:');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error stack trace:', error.stack);
    }
}

checkConnection();

export default promisePool;
