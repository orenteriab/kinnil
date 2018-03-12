
let connectionPool = require('../config/database_config').connectionPool;

// ============
//  Contadores Up
// ============ 

/*
* Obtiene los drivers disponibles (No.)
*/
// La tabla HR no solo contiene drivers, pero son los unicos que tienen que tener UP = [true|false]
exports.getDriversUp = () => {
    let statement = 'select count(*) drivers_up from hr where up = true';

    return connectionPool.query(statement);
};

/*
* Obtiene de la DB los assets que estan disponibles (No.)
*/
// Los assets pueden ser TRUCK o TRAILER (mayusculas).
exports.getAssetsUp = (type) => {
    let statement = 'select count(*) trucks_up from `assets` where up = true and type = ?';

    return connectionPool.query(statement, [type]);
};

/*
* Obtiene el detalle de los drivers que esta UP, de momento solo se necesita el nombre
*/
exports.listDriversUp = () => {
    let statement = 'select id, name from hr where up = true';

    return connectionPool.query(statement);
};


// ============
//  Tickets
// ============ 
// TODO: Ver si se puede eliminar, porque ya no se usa
exports.getBasicTicketsList = () => {
    let statement = 'select id, tms, status, substatus, location, facility, product, clients_id from tickets';

    return connectionPool.query(statement);
};

/*
* Get tickets where status
*/
exports.getTicketsList = () => {
    let statement = 'select t.*, p.name `product_name`, h.name `driver_name` from tickets t left join products p on t.product = p.id left join hr h on t.hr_id = h.id where t.status';

    return connectionPool.query(statement);
};

/*
* Obtiene tickets por Id
*/
exports.getTicketById = (ticketId) => {
    let statement = 'select t.*, c.name client_name, c.address client_address, h.name driver_name, h.shift shift, h.crew crew from tickets t left join clients c on t.clients_id = c.id left join hr h on t.hr_id = h.id where t.id = ?';

    return connectionPool.query(statement, [ticketId]);
};


exports.assignTicket = (hrId, product, ticketId) => {
    let statement = 'update tickets set hr_id = ?, products_id = ?, status = 2 where id = ?';

    return connectionPool.query(statement, [hrId, product, ticketId]);
};


exports.cancelTicket = (ticketId) => {
    let statement = 'update tickets set status = 1 where id = ?';

    return connectionPool.query(statement, [ticketId]);
};

exports.completeTicket = (ticketId) => {
    let statement =  'update tickets set status = 4 where id in ('+ ticketId +')'; // Status 4 es To be Invoiced

    return connectionPool.query(statement);
};


// ============
//  List products
// ============ 

/*
* Obtiene la lista de productos por cliente
*/
exports.listProducts = (clientId) => {
    let statement = 'select id, name from products where clients_id = ?';

    return connectionPool.query(statement, [clientId]);
};


// ============
//  Eventos
// ============ 

/*
* Obtiene los eventos por ticket
*/
exports.getEvents = (ticketId) => {
    let statement = 'select * from eventos where tickets_id = ?';

    return connectionPool.query(statement, [ticketId]);
};


/*
* Crea un evento
*/
exports.createEvento = (ticketId, evento, notes, longitud, latitud) => {
    let statement = 'insert into eventos(evento, notes, longitud, latitud, tickets_id) values (?, ?, ?, ?)';

    return connectionPool.query(statement, [evento, notes, longitud, latitud, ticketId]);
};