
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

exports.getDrivers = () => {
    let statement = 'select * from hr where position = "DRIVER"';

    return connectionPool.query(statement);
}

exports.getOnlineOffline = () => {
    let statement = "select (select count(*) from hr where up = 1) drivers_online, (select count(*) from hr where up = 0) drivers_offline, (select count(*) from assets where type = 'TRUCK' and up = 1) trucks_online, (select count(*) from assets where type = 'TRUCK' and up = 0) trucks_offline, (select count(*) from assets where type = 'TRAILER' and up = 1) trailers_online, (select count(*) from assets where type = 'TRAILER' and up = 0) trailers_offline"

    return connectionPool.query(statement);
}