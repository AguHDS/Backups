import config from "../config/environmentVars.js";
import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: config.dbHost,
    database: config.dbDatabase,
    user: config.dbUser,
});

const promiseConnection = connection.promise();

export default promiseConnection;
