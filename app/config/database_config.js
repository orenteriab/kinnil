let  createPool = require('promise-mysql').createPool;

const mysqlPool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'FundableD0ubles',
    database: 'kinnil',
    connectionLimit: 5000
});

module.exports = {
    connectionPool: mysqlPool
};