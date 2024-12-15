import config from "../config/environmentVars.js";
import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: config.dbHost,
    database: config.dbDatabase,
    user: config.dbUser,
});

const promiseConnection = connection.promise();

//check the connection to the database and log the errors
async function checkConnection() {
    try {
        await promiseConnection.query('SELECT 1 + 1 AS solution');
        console.log('Connection to db successful');
    } catch (error) {
        console.error('Error connecting to the database:');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error stack trace:', error.stack);
    }
}

checkConnection();

export default promiseConnection;
