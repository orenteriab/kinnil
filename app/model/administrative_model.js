
let connectionPool = require('../config/database_config').connectionPool;

// ============
// Regresa el listado de clientes
// ============ 
exports.getClients = () => {
    let statement = 'select * from clients';

    return connectionPool.query(statement);
};
