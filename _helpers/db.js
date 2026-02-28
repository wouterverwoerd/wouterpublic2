const fs = require('fs');
const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

require('dotenv').config();

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    // Load the CA certificate file
    const caCert = fs.readFileSync('./ca.pem', 'utf-8');

    const apiUrl = process.env.REACT_APP_API_HOST;
    console.log('x');
    console.log(apiUrl);

    const connectionConfig = {
        host: process.env.REACT_APP_API_HOST,
        port: process.env.REACT_APP_API_PORT,
        user: process.env.REACT_APP_API_USER,
        password: process.env.REACT_APP_API_PASSWORD,
        database: process.env.REACT_APP_API_DATABASE,
        ssl: true,
        ssl: {
            rejectUnauthorized: false,
            ca: caCert,
        },
    };

    const { user, password, database } = config.database;
    // const connection = await mysql.createConnection({ host, port, user, password });
    const connection = await mysql.createConnection(connectionConfig);
    console.log('Connected to MySQL database successfully!');
   // await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    // const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });
    console.log(database);
    console.log(user);
    console.log(password);
    /*
    var sequelize = new Sequelize(database, user, password, {
        host: "xxx",
        dialect: "mysql",
        ssl: true,
        ssl: {
            require: true,
            rejectUnauthorized: false,
            ca: fs.readFileSync('./ca.pem', 'utf-8')
        },
        logging: function () {},
        pool: {
            max: 10,
            min: 1,
            acquire: 120000,
            idle: 120000,
            evict: 2000,
            connectTimeout: 60000
        }
    });
    */

    const sequelize = new Sequelize(process.env.REACT_APP_API_SEQUALIZE,
        {
            dialect: 'mysql',
            dialectOptions: {
                ssl: {
                    require: true,
                    ca: require('fs').readFileSync('./ca.pem', 'utf-8').toString()
                }
            }
        });

    // init models and add them to the exported db object
    db.User = require('../users/user.model')(sequelize);

    // sync all models with database
    await sequelize.sync({ alter: true });
}