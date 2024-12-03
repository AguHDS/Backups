import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

const promiseConnection = connection.promise();

export default promiseConnection;
