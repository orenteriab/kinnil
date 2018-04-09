
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
    dependent,
    email,
    contact1,
    contact2,
    birth,
    over25,
    laborStatus,
    position,
    dllsHr,
    medicalCard,
    mcExp,
    drugTest,
    dtExp,
    ssn,
    clients_id) => {
    let statement = 'insert into hr (name, address, tel, civil_status, dependants, email, contact1, contact2, birthdate, over25, labor_status, position, rate, medical_card, mc_exp, drug_test, dt_exp, ssn, clients_id) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    return connectionPool.query(statement, [name, address, tel, civilStatus, dependent, email, contact1, contact2, birth, over25, laborStatus, position, dllsHr, medicalCard, mcExp, drugTest, dtExp, ssn, clients_id]);
};

exports.addDriver = (name,
    address,
    tel,
    civilStatus,
    dependent,
    email,
    contact1,
    contact2,
    birth,
    over25,
    laborStatus,
    position,
    rate,
    medicalCard,
    mcExp,
    drugTest,
    dtExp,
    ssn,
    type,
    crew,
    user,
    password,
    training,
    trainingExp,
    license,
    licenseExp,
    state,
    yearsWorking,
    clients_id) => {
    let statement = 'insert into hr (name, address, tel, civil_status, dependants, email, contact1, contact2, birthdate, over25, labor_status, position, rate, medical_card, mc_exp, drug_test, dt_exp, ssn, type, crew, username, password, training, training_exp, license, license_exp, state, years_working, clients_id, assigned) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, false)';

    return connectionPool.query(statement, [name, address, tel, civilStatus, dependent, email, contact1, contact2, birth, over25, laborStatus, position, rate, medicalCard, mcExp, drugTest, dtExp, ssn, type, crew, user, password, training, trainingExp, license, licenseExp, state, yearsWorking, clients_id]);
};

exports.getHrDetail = (hrId) => {
    let statement = 'select id, name, address, civil_status, tel, email, contact1, contact2, DATE_FORMAT(birthdate, "%m-%d-%Y") birthdate, over25, labor_status, position, type, shift, crew, rate, username, password, medical_card, DATE_FORMAT(mc_exp, "%m-%d-%Y") mc_exp, drug_test, DATE_FORMAT(dt_exp, "%m-%d-%Y") dt_exp, training, DATE_FORMAT(training_exp, "%m-%d-%Y") training_exp, license, DATE_FORMAT(license_exp, "%m-%d-%Y") license_exp, state, DATE_FORMAT(hire_date, "%m-%d-%Y") hire_date, ssn, dependants, up, clients_id, assigned from hr where id = ?';

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