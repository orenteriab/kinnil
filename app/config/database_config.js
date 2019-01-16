let  createPool = require('promise-mysql').createPool;

const mysqlPool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sandras',
    connectionLimit: 5000
});

module.exports = {
    connectionPool: mysqlPool
};
