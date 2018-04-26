
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
    let statement = 'select * from hr where position <> "DRIVER"';

    return connectionPool.query(statement);
};

exports.getGoals = (locationId) => {
    let statement = 'select g.*, s.name from goals g join sand s on g.sand_id = s.id where g.locations_id = ?';

    return connectionPool.query(statement, [locationId]);
};

exports.getLocationById = (locationId) => {
    let statement = 'select * from locations where id = ?';

    return connectionPool.query(statement, [locationId]);
};

exports.getDrivers = () => {
    let statement = 'select * from hr where position = "DRIVER"';

    return connectionPool.query(statement);
};

exports.getOnlineOffline = () => {
    let statement = 'select (select count(*) from hr where up = 1) drivers_online, (select count(*) from hr where up = 0) drivers_offline, (select count(*) from assets where type = \'TRUCK\' and up = 1) trucks_online, (select count(*) from assets where type = \'TRUCK\' and up = 0) trucks_offline, (select count(*) from assets where type = \'TRAILER\' and up = 1) trailers_online, (select count(*) from assets where type = \'TRAILER\' and up = 0) trailers_offline';

    return connectionPool.query(statement);
};


exports.addSand = (name, clientId) => {
    let statement = 'insert into sand (name, clients_id, active) values (?, ?, 1)';

    return connectionPool.query(statement, [name, clientId]);
};

exports.deleteSand = (sandId) => {
    let statement = 'update sand set active = 0 where id = ?';
    console.log(sandId);
    return connectionPool.query(statement, [sandId]);
};

exports.addProduct = (name, clientId) => {
    let statement = 'insert into products (name, clients_id, active) values (?, ?, 1)';

    return connectionPool.query(statement, [name, clientId]);
};

exports.deleteProduct = (productId) => {
    let statement = 'update products set active = 0 where id = ?';

    return connectionPool.query(statement, [productId]);
};

exports.addFacilitie = (name, clientId) => {
    let statement = 'insert into facilities (name, clients_id, active) values (?, ?, 1)';

    return connectionPool.query(statement, [name, clientId]);
};

exports.deleteFacility = (facilityId) => {
    let statement = 'update facilities set active = 0 where id = ?';

    return connectionPool.query(statement, [facilityId]);
};

exports.addLocation = (name, status, geolocation, startDate, endDate, clientId) => {
    let statement = 'insert into locations (name, status, geolocation, start_date, end_date, clients_id, active) values (?, ?, ?, ?, ?, ?, 1)';

    return connectionPool.query(statement, [name, status, geolocation, startDate, endDate, clientId]);
};

exports.deleteLocation = (locationId) => {
    let statement = 'update locations set active = 0 where id = ?';

    return connectionPool.query(statement, [locationId]);
};

exports.addHr = (name,
    address,
    tel,
    civilStatus,
    email,
    contact1,
    contact2,
    birth,
    laborStatus,
    position,
    dllsHr,
    mcExp,
    ssn,
    username,
    password,
    shift,
    crew,
    clients_id) => {
    let statement = 'insert into hr (name, address, tel, civil_status, email, contact1, contact2, birthdate, labor_status, position, dll_hr, mc_exp, ssn, username, password, shift, crew, clients_id) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    return connectionPool.query(statement, [name, address, tel, civilStatus, email, contact1, contact2, birth, laborStatus, position, dllsHr, mcExp, ssn, username, password, shift, crew, clients_id]);
};

exports.addDriver = (name,
    address,
    tel,
    civilStatus,
    email,
    contact1,
    contact2,
    birth,
    laborStatus,
    position,
    rate,
    mcExp,
    ssn,
    type,
    crew,
    shift,
    user,
    password,
    license,
    licenseExp,
    state,
    yearsWorking,
    clients_id) => {
    let statement = 'insert into hr (name, address, tel, civil_status, email, contact1, contact2, birthdate, labor_status, position, rate, mc_exp, ssn, type, crew, shift, username, password, license, license_exp, state, years_working, clients_id, assigned) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, false)';

    return connectionPool.query(statement, [name, address, tel, civilStatus, email, contact1, contact2, birth, laborStatus, position, rate, mcExp, ssn, type, crew, shift, user, password, license, licenseExp, state, yearsWorking, clients_id]);
};

exports.getHrDetail = (hrId) => {
    let statement = 'select id, \
                        name, \
                        address, \
                        civil_status, \
                        tel, \
                        email, \
                        contact1, \
                        contact2, \
                        over25, \
                        labor_status, \
                        position, \
                        type, \
                        shift, \
                        crew, \
                        rate, \
                        username, \
                        password, \
                        medical_card, \
                        drug_test, \
                        training, \
                        license, \
                        DATE_FORMAT(birthdate, "%m-%d-%Y") birthdate, \
                        DATE_FORMAT(mc_exp, "%m-%d-%Y") mc_exp, \
                        DATE_FORMAT(dt_exp, "%m-%d-%Y") dt_exp, \
                        DATE_FORMAT(training_exp, "%m-%d-%Y") training_exp, \
                        DATE_FORMAT(license_exp, "%m-%d-%Y") license_exp, \
                        DATE_FORMAT(years_working, "%m-%d-%Y") years_working, \
                        DATE_FORMAT(hire_date, "%m-%d-%Y") hire_date, \
                        state, \
                        ssn, \
                        dependants, \
                        up, \
                        clients_id, \
                        assigned, \
                        location, \
                        dll_hr \
                        from hr \
                        where id = ?'

    return connectionPool.query(statement, [hrId]);
};

exports.updateHr = (name, value, pk) => {
    let statement = 'update hr set ' + name + ' = ? where id = ?';

    return connectionPool.query(statement, [value, pk]);
};

exports.updateTicket = (name, value, pk) => {
    let statement = 'update tickets set ' + name + ' = ? where id = ?';

    return connectionPool.query(statement, [value, pk]);
};

exports.getClockin = () => {
    let statement = 'select c.id, h.name, DATE_FORMAT(c.in, "%m-%d-%Y %H:%i:%s") "in", DATE_FORMAT(c.out, "%m-%d-%Y %H:%i:%s") "out", TIMESTAMPDIFF(hour, c.in, c.out) "hours_worked", h.shift from clockin c join hr h on c.hr_id = h.id where c.paid = false';

    return connectionPool.query(statement);
}


/*
* Se utilizan para el sockets de clockin
*/
exports.getAccountsClockin = () => {
    let statement = 'select id, name, shift, crew, location, position, username, password from hr where position = "FIELD CREW SUPERVISOR"';

    return connectionPool.query(statement);
};

exports.getSelectedCrew = (crewId) => {
    let statement = 'select id, name, shift from hr where crew = ?';

    return connectionPool.query(statement, [crewId]);
};

exports.saveClockInEvent = (id_evento, date, lattitud, longitud, img, id_hr) => {
    let statement = 'insert into `sandras`.`clockin` (`id_evento`, `in`, `lat_in`, `long_in`, `img_in`, `hr_id`, paid) values (?,?,?,?,?,?,?)';

    return connectionPool.query(statement, [id_evento, date, lattitud, longitud, img, id_hr, 0]);
};

exports.saveClockOutEvent = (id_evento, date, lattitud, longitud, img) => {
    let statement = " update `sandras`.`clockin` set `out` = '"+ date +"', `lat_out` = '"+ lattitud +"', `long_out` = '"+ longitud +"', `img_out` = '"+ img +"' where `id_evento` = '"+ id_evento +"' ";

    return connectionPool.query(statement);
};