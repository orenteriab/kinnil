
let connectionPool = require('../config/database_config').connectionPool;

/*
* Obtiene los drivers disponibles
*/
// La tabla HR no solo contiene drivers, pero son los unicos que tienen que tener UP = [true|false]
exports.getDriversUp = () => {
    let statement = 'select count(*) drivers_up from hr where up = true'

    return connectionPool.query(statement)
};

/*
* Obtiene de la DB los assets que estan disponibles
*/
// Los assets pueden ser TRUCK o TRAILER (mayusculas).
exports.getAssetsUp = (type) => {
    let statement = 'select count(*) trucks_up from `assets` where up = true and type = ?'

    return connectionPool.query(statement, [type])
};

/*
* Obtiene los tickets de la DB
*/
exports.getTicketsList = () => {
    // TODO: Hay que agregar clausula where, esta depende de las reglas del negocio
    let statement = "select id, tms, status, substatus, location, facility, product, clients_id from tickets" 

    return connectionPool.query(statement)
}

exports.getTicketById = (ticketId) => {
    let statement = 'select * from tickets where id = ?'

    return connectionPool.query(statement, [ticketId])
}

/*
* Obtiene el detalle de los drivers que esta UP, de momento solo se necesita el nombre
*/
exports.listDriversUp = () => {
    let statement = 'select id, name from hr where up = true'

    return connectionPool.query(statement)
};

/*
* Obtiene la lista de productos por cliente
*/
exports.listProducts = (clientId) => {
    let statement = 'select id, name from products where clients_id = ?'

    return connectionPool.query(statement, [clientId])
};