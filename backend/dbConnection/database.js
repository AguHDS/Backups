import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: 'localhost',
    database: 'database',
    user: 'root',
    password: '',
});

export default connection;
