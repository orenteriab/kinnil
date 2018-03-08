let  createPool = require('promise-mysql').createPool;

const mysqlPool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'Fundabled0ubles',
    database: 'sandras',
    connectionLimit: 5000
});

module.exports = {
    connectionPool: mysqlPool
};
