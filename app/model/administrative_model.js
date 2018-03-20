
let connectionPool = require('../config/database_config').connectionPool;


exports.getClients = () => {
    let statement = 'select * from clients where active = 1';

    return connectionPool.query(statement);
};

exports.getClientsById = (clientId) => {
    let statement = 'select * from clients where id = ?';

    return connectionPool.query(statement, [clientId]);
};

exports.deleteClient = (clientId) => {
    let statement = 'update clients set active = false where id = ?';

    return connectionPool.query(statement, [clientId]);
};

exports.getLocations = (clientId) => {
    let statement = 'select * from locations where active = 1 and clients_id = ?';

    return connectionPool.query(statement, [clientId]);
};

exports.getFacilities = (clientId) => {
    let statement = 'select * from facilities where active = 1 and clients_id = ?';

    return connectionPool.query(statement, [clientId]);
};

exports.getProducts = (clientId) => {
    let statement = 'select * from products where active = 1 and clients_id = ?';

    return connectionPool.query(statement, [clientId]);
};

exports.getSands = (clientId) => {
    let statement = 'select * from sand where active = 1 and clients_id = ?';

    return connectionPool.query(statement, [clientId]);
};

exports.getHr = () => {
    let statement = 'select * from hr';

    return connectionPool.query(statement);
};

exports.getGoals = (locationId) => {
    let statement = "select g.*, s.name from goals g join sand s on g.sand_id = s.id where g.locations_id = ?"

    return connectionPool.query(statement, [locationId]);
}

exports.getLocationById = (locationId) => {
    let statement = "select * from locations where id = ?"

    return connectionPool.query(statement, [locationId]);
}