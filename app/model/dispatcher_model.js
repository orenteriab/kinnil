
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
    let statement = 'select id, concat_ws( " - ",name, last_location, DATE_FORMAT(last_location_datetime, "%m-%d-%Y %H:%i:%s")) name, name `simple_name` from hr where up = TRUE order by up_datetime';

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
    console.log('Loading date formatted');
    let statement = 'select         t.*                                                                     \
                                    ,DATE_FORMAT(t.loading_date, "%m-%d-%Y %H:%i") loading_date_formatted   \
                                    ,p.name `product_name`                                                  \
                                    ,h.name `driver_name`                                                   \
                                    ,concat(c.id, \': \', c.name) `customer`                                 \
                    from            tickets     t                                                           \
                        left join   products    p on t.product  = p.id                                      \
                        left join   hr          h on t.hr_id    = h.id                                      \
                        left join   clients     c on c.id = t.clients_id';

    return connectionPool.query(statement);
};

/*
* Obtiene tickets por Id
*/
exports.getTicketById = (ticketId) => {
    let statement = 'select         t.id, \
                                    t.tms, \
                                    DATE_FORMAT(t.loading_date, "%m-%d-%Y %H:%i") loading_date,\
                                    t.ticket_id, \
                                    t.status, \
                                    t.substatus, \
                                    t.invoice_rate, \
                                    t.product, \
                                    t.base, \
                                    t.silo, \
                                    t.po, \
                                    t.facility, \
                                    t.location, \
                                    t.bol, \
                                    t.sand_type, \
                                    t.weight, \
                                    DATE_FORMAT(t.assign_date, "%m-%d-%Y") assign_date, \
                                    DATE_FORMAT(t.completed_date, "%m-%d-%Y") completed_date, \
                                    DATE_FORMAT(t.invoice_date, "%m-%d-%Y") invoice_date, \
                                    DATE_FORMAT(t.payrolled_date, "%m-%d-%Y") payrolled_date, \
                                    DATE_FORMAT(t.born_date, "%m-%d-%Y") born_date, \
                                    t.starting_mi, \
                                    t.end_mi, \
                                    t.pick_date, \
                                    t.drop_date, \
                                    t.notes, \
                                    t.hr_id, \
                                    t.products_id, \
                                    t.clients_id, \
                                    t.on_curse, \
                                    a1.name truck, \
                                    a2.name trailer, \
                                    t.load_rate, \
                                    t.load_rate_currency, \
                                    c.name client_name, \
                                    c.address client_address, \
                                    h.name driver_name, \
                                    h.shift shift, \
                                    h.crew crew, \
                                    concat(c.id, \':\', c.name) `customer`\
                    from            tickets t \
                        left join   clients c   on t.clients_id = c.id \
                        left join   hr      h   on t.hr_id      = h.id \
                        left join   assets  a1  on t.truck      = a1.id\
                        left join   assets  a2  on t.trailer    = a2.id\
                    where           t.id = ?';

    return connectionPool.query(statement, [ticketId]);
};


exports.assignTicket = (hrId, ticketId, timestap) => {
    let statement = 'update tickets set hr_id = ?, status = 2, on_curse = TRUE, assign_date = ? where id = ?';

    return connectionPool.query(statement, [hrId, timestap, ticketId]);
};


exports.saveLastlocation = (lastLocation, hrId) => {
    let statement = 'update hr set last_location = ? where id = ?'

    return connectionPool.query(statement, [lastLocation, hrId]);
}

exports.updateLastLocationDate = (timestap, hr_id) => {
    let statement = 'update hr set last_location_datetime = ? where id = ?'

    return connectionPool.query(statement, [timestap, hr_id]);
}

exports.cancelTicket = (ticketId) => {
    let statement = 'update tickets set status = 1, on_curse = FALSE where id = ?';

    return connectionPool.query(statement, [ticketId]);
};

exports.completeTicket = (ticketId, timestap) => {
    let statement =  'update tickets set status = 4, completed_date = ? where id in ('+ ticketId +')'; // es un in () porque se pueden completar varios a la vez

    return connectionPool.query(statement, [timestap]);
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
    let statement = 'select evento, DATE_FORMAT(date, "%m-%d-%Y %H:%i:%s") date, DATE_FORMAT(date2, "%m-%d-%Y %H:%i:%s") date2, longitude, latitude, notes from eventos where tickets_id = ?';

    return connectionPool.query(statement, [ticketId]);
};


/*
* Crea un evento
*/
exports.createEvento = (ticketId, evento, notes, longitud, latitud) => {
    let statement = 'insert into eventos(evento, notes, longitud, latitud, tickets_id) values (?, ?, ?, ?)';

    return connectionPool.query(statement, [evento, notes, longitud, latitud, ticketId]);
};



// ==============================
// Peticiones de los sockets TODO: hay que ver si los dejamos aqui o se crea un model para los sockets
// ==============================

exports.getUsersAndPassword = () => {
    let statement = 'select id, username, password, type from hr where position = "DRIVER"';

    return connectionPool.query(statement);
}

exports.getAvailableAssets = () => {
    let statement = 'select * from assets where type in ("TRAILER","TRUCK") and up = TRUE order by name'; // TODO: hay que ver si les vamos a mandar todos o solo los activos, se queda activos por mientras

    return connectionPool.query(statement);
}

exports.selectedAsset = (truck, trailer, ticketId, new_mil) => {

    let statement = 'update tickets set truck = ?, trailer = ?, starting_mi = ? where id = ? '; // TODO: hay que ver si les vamos a mandar todos o solo los activos, se queda activos por mientras

    return connectionPool.query(statement , [truck, trailer, new_mil, ticketId]);
}

exports.active = (timestap, hrId) => {
    let statement = "update hr set up = TRUE, up_datetime = ? where id = ?"

    return connectionPool.query(statement, [timestap, hrId])
}

exports.inactive = (hrId) => {
    let statement = "update hr set up = false where id = ?"

    return connectionPool.query(statement, [hrId])
}

exports.tms = (hrId) => {
    let statement = "select t.*, c.name 'client' from tickets t join clients c on t.clients_id = c.id where t.on_curse = TRUE and t.hr_id = ?"
    // TODO: Cuando un driver termine un TMS hay que poder el TMS como on_curse = false para que no aparesca en este select

    return connectionPool.query(statement, [hrId])
}

exports.addEvent = (substatus, timestamp, latitude, longitude, date, id) => {
    let statement = "insert into eventos (evento, date, latitude, longitude, date2, tickets_id) values (?,?,?,?,?,?)"

    return connectionPool.query(statement, [substatus, timestamp, latitude, longitude, date, id])
}

exports.tmscounter = () => {
    let statement = "select (select count(*) from tickets where status = 1) one, \
(select count(*) from tickets where status = 2) two, \
(select count(*) from tickets where status = 3) three, \
(select count(*) from tickets where status = 4 and invoice_date is NULL) four, \
(select count(*) from tickets where status = 4 and payrolled_date is NULL) five, \
(select count(*) from tickets where status = 6) six"

    return connectionPool.query(statement)
}

/*
* Para actualizar el ticket con la informacion que me manda la app de android
*/

// substatus aqui es un numero (0,1,2,3,4,5,6 o 7)
exports.updateSubstatus = (sustatus , ticketId, date) => {
    let statement = "update tickets set substatus = ? where id = ?"
    let params = [sustatus, ticketId]

    // Alimentando el campo de loading_date
    if(sustatus == 3){
        statement = "update `tickets` \
                    set     `substatus` = ? \
                            ,`loading_date` = ?  \
                    where   id = ?"
        params = [sustatus, date, ticketId]
    }

    //Alimentando el campo de unloading_date
    if(sustatus == 6){
        statement = "update `tickets` \
                    set     `substatus` = ? \
                            ,`unloading_date` = ?  \
                    where   id = ?"
        params = [sustatus, date, ticketId]
    }

    return connectionPool.query(statement, params)
}

exports.updateBaseAndSilo = (base, silo, ticketId) => {
    let statement = "update tickets set base = ?, silo = ? where id = ?"

    return connectionPool.query(statement, [base, silo, ticketId])
}

exports.updateWeightAndBol = (weight, bol, fevid, ticketId) => {
    let statement = "update tickets set weight = ?, bol = ?, ticket_id = ? where id = ?"

    return connectionPool.query(statement, [weight, bol, fevid, ticketId])
}

exports.finishTicket = (ticketId, final_mil) => {
    let statement = "update tickets set on_curse = FALSE, status = 3, end_mi = ? where id = ?"

    return connectionPool.query(statement, [final_mil, ticketId])
}

exports.getDivert = () => {
    let statement = "select d.id, \
DATE_FORMAT(d.date, '%m-%d-%Y %H:%i:%s') divert_date, \
t1.id divert_id, \
t1.tms divert_tms, \
t1.ticket_id divert_ticket_id, \
t2.id new_id, \
t2.tms new_tms, \
t2.ticket_id new_ticket_id, \
h.id driver_id, \
h.name driver \
from divert d \
left join tickets t1 on d.divert_tickets_id = t1.id \
left join tickets t2 on d.new_tickets_id = t2.id \
left join hr h on t1.hr_id = h.id \
where d.status < 3"

    return connectionPool.query(statement)
}

exports.addDivert = (currentDate, ticketId) => {
    let statement = "insert into divert (date, status, divert_tickets_id) values (?, 1, ?)"

    return connectionPool.query(statement, [currentDate, ticketId])
}

exports.assignDivert = (new_ticket, id) => {
    let statement = "update divert set new_tickets_id = ?, status = 2 where id = ?"

    return connectionPool.query(statement, [new_ticket, id])
}