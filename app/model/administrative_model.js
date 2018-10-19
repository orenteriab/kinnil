
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
    let statement = 'select l.id,\
l.name, \
l.status, \
l.geolocation, \
l.long_name, \
DATE_FORMAT(l.start_date, "%m-%d-%Y") start_date, \
DATE_FORMAT(l.end_date, "%m-%d-%Y") end_date, \
c.name crewname \
from locations l \
left join crews c on l.crews_id = c.id \
where l.active = 1 and l.clients_id = ?'

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

exports.getCrews = (clientId) => {
    let statement = 'select * from crews where active = 1 and clients_id = ?';

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
    
    return connectionPool.query(statement, [sandId]);
};

exports.addCrew = (name, clientId) => {
    let statement = 'insert into crews (name, clients_id, active) values (?, ?, 1)';

    return connectionPool.query(statement, [name, clientId]);
};

exports.deleteCrew = (crewId) => {
    let statement = 'update crews set active = 0 where id = ?';
    
    return connectionPool.query(statement, [crewId]);
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
    hireDate,
    licenseClass,
    experience,
    paymentMethod,
    BankAccount,
    RoutingNumber,
    clients_id) => {
    let statement = 'insert into hr (name, address, tel, civil_status, email, contact1, contact2, birthdate, labor_status, position, rate, mc_exp, ssn, type, crew, shift, username, password, license, license_exp, state, hire_date, license_class, experience, payment_method, bank_account, routing_number, clients_id, assigned) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, false)';

    return connectionPool.query(statement, [name, address, tel, civilStatus, email, contact1, contact2, birth, laborStatus, position, rate, mcExp, ssn, type, crew, shift, user, password, license, licenseExp, state, hireDate, licenseClass, experience, paymentMethod, BankAccount, RoutingNumber, clients_id]);
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
                        DATE_FORMAT(experience, "%m-%d-%Y") experience, \
                        state, \
                        ssn, \
                        dependants, \
                        up, \
                        clients_id, \
                        assigned, \
                        location, \
                        dll_hr, \
                        license_class, \
                        payment_method, \
                        routing_number, \
                        bank_account \
                        from hr \
                        where id = ?'

    return connectionPool.query(statement, [hrId]);
};

exports.updateHr = (name, value, pk) => {
    let statement = 'update `sandras`.`hr` set `' + name + '` = ? where `id` = ?';

    return connectionPool.query(statement, [value, pk]);
};

exports.updateTicket = (name, value, pk) => {
    let statement = 'update tickets set ' + name + ' = ? where id = ?';

    return connectionPool.query(statement, [value, pk]);
};

exports.getClockin = () => {
    let statement = 'select c.id, h.name, DATE_FORMAT(c.in, "%m-%d-%Y %H:%i:%s") "in", \
                        DATE_FORMAT(c.out, "%m-%d-%Y %H:%i:%s") "out", \
                        ROUND(TIMESTAMPDIFF(MINUTE, c.in, c.out)/60,2) "hours_worked", \
                        h.shift, \
                        c.img_in_name, \
                        c.img_out_name \
                        from clockin c join hr h on c.hr_id = h.id where c.paid = false';

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
    let statement = 'select id, name, shift from hr where position <> "DRIVER" and crew = ?';

    return connectionPool.query(statement, [crewId]);
};

exports.saveClockInEvent = (id_evento, date, lattitud, longitud, name, id_hr) => {
    let statement = 'insert into `sandras`.`clockin` (`id_evento`, `in`, `lat_in`, `long_in`, `img_in_name`, `hr_id`,  `paid`) values (?,?,?,?,?,?,?)';

    console.log("save clockin " + statement, [id_evento, date, lattitud, longitud, name, id_hr, 0])
    return connectionPool.query(statement, [id_evento, date, lattitud, longitud, name, id_hr, 0]);
};

exports.saveClockOutEvent = (id_evento, date, lattitud, longitud, name) => {
    let statement = " update `sandras`.`clockin` set `out` = '"+ date +"', `lat_out` = '"+ lattitud +"', `long_out` = '"+ longitud +"', `img_out_name` = '"+ name +"' where `id_evento` = '"+ id_evento +"' ";

    return connectionPool.query(statement);
};

exports.getClockinById = (id) => {
    let statement = 'select id, \
                            DATE_FORMAT(`in`, "%Y-%m-%d %H:%i:%s") "in" , \
                            DATE_FORMAT(`out`, "%Y-%m-%d %H:%i:%s") "out" \
                            from `sandras`.`clockin` where `id` = ?'

    return connectionPool.query(statement, [id]);
};

exports.updateClockinById = (entrada, salida, id) => {
    let statement = " update `sandras`.`clockin` set `in` = ?, `out` = ? where id = ? ";

    return connectionPool.query(statement, [entrada, salida, id]);
}

exports.findLocations = () => {
    let statement = "select `id`, `name` from `sandras`.`locations` "

    return connectionPool.query(statement)
}

exports.upsertScalesData = (scalesData, timestap) => {
    let statement = "select count(*) `locationCount` from `sandras`.`scales_data` where locations_id = ? "

    return connectionPool
        .query(statement, [scalesData.location])
        .then((row) => {
            let statement = "";

            if(row[0].locationCount == 0){
                statement = "INSERT INTO `sandras`.`scales_data`" +
                "(`id`," +
                "`sand_name1`," +
                "`sand_name2`," +
                "`sand_name3`," +
                "`sand_name4`," +
                "`sand_name5`," +
                "`sand_name6`," +
                "`weight1`," +
                "`weight2`," +
                "`weight3`," +
                "`weight4`," +
                "`weight5`," +
                "`weight6`," +
                "`status1`," +
                "`status2`," +
                "`status3`," +
                "`status4`," +
                "`status5`," +
                "`status6`," +
                "`porcent1`," +
                "`porcent2`," +
                "`porcent3`," +
                "`porcent4`," +
                "`porcent5`," +
                "`porcent6`," +
                "`last_date`," +
                "`locations_id`)" +
                "VALUES (" +
                "default, " +
                "''," +
                "''," +
                "''," +
                "''," +
                "''," +
                "''," +
                "?," +
                "?," +
                "?," +
                "?," +
                "?," +
                "?," +
                "?," +
                "?," +
                "?," +
                "?," +
                "?," +
                "?," +
                "?," +
                "?," +
                "?," +
                "?," +
                "?," +
                "?," +
                "?," +
                "?)";
            }else{
                statement = "UPDATE `sandras`.`scales_data` " +
                "SET " +
                "`weight1` = ?, " +
                "`weight2` = ?, " +
                "`weight3` = ?, " +
                "`weight4` = ?, " +
                "`weight5` = ?, " +
                "`weight6` = ?, " +
                "`status1` = ?, " +
                "`status2` = ?, " +
                "`status3` = ?, " +
                "`status4` = ?, " +
                "`status5` = ?, " +
                "`status6` = ?, " +
                "`porcent1` = ?, " +
                "`porcent2` = ?, " +
                "`porcent3` = ?, " +
                "`porcent4` = ?, " +
                "`porcent5` = ?, " +
                "`porcent6` = ? " +
                "`last_date` = ? " +
                "WHERE `locations_id` = ?; "
            }

            return connectionPool.query(statement, [
                scalesData.weight1,
                scalesData.weight2,
                scalesData.weight3,
                scalesData.weight4,
                scalesData.weight5,
                scalesData.weight6,
                scalesData.status1,
                scalesData.status2,
                scalesData.status3,
                scalesData.status4,
                scalesData.status5,
                scalesData.status6,
                scalesData.porcent1,
                scalesData.porcent2,
                scalesData.porcent3,
                scalesData.porcent4,
                scalesData.porcent5,
                scalesData.porcent6,
                timestap,
                scalesData.location
            ])
        }
        ,(err) => {
            return Promise.reject('Error when updating scales data: ' + err)
        })
}

exports.fetchScalesData = (locationId) => {
    let query = "select `id`, \
    `sand_name1`, \
    `sand_name2`, \
    `sand_name3`, \
    `sand_name4`, \
    `sand_name5`, \
    `sand_name6`, \
    `weight1`, \
    `weight2`, \
    `weight3`, \
    `weight4`, \
    `weight5`, \
    `weight6`, \
    `status1`, \
    `status2`, \
    `status3`, \
    `status4`, \
    `status5`, \
    `status6`, \
    `porcent1`, \
    `porcent2`, \
    `porcent3`, \
    `porcent4`, \
    `porcent5`, \
    `porcent6`, \
    DATE_FORMAT(`last_date`, '%m-%d-%Y %H:%i:%s') start_date, \
    `locations_id` \
    from `sandras`.`scales_data` where locations_id = ?"

    return connectionPool.query(query, [locationId])
}

exports.fetchGoalsData = (locationId) => {
    let query = "select     `s`.`name`          `name`                          \
                            ,`g`.`lbs_goal`     `lbs_goal`                      \
                            ,`g`.`lbs_current`  `lbs_current`                   \
                            ,`g`.`loads_goal`   `loads_goal`                    \
                            ,`g`.`lads_current` `lads_current`                  \
                from        `sandras`.`goals`   `g`                             \
                inner join  `sandras`.`sand`    `s` on `g`.`sand_id` = `s`.`id` \
                where       `g`.`locations_id` = ? \
                order by  `s`.`name`"
    
    return connectionPool.query(query, [locationId])
}

exports.fetchToThisDayData = (locationName) => {
    let query = "select `sand_type`, \
sum(`weight`) current_lbs \
from `tickets` \
where `location` = ? and `status` >= 3 \
group by `sand_type` \
order by `sand_type`"

console.log(query, [locationName])
    
    return connectionPool.query(query, [locationName])
}

exports.getLocationDetail = (locationId) => {
    let query = 'select l.id,\
l.name, \
l.status, \
l.geolocation, \
l.long_name, \
DATE_FORMAT(l.start_date, "%m-%d-%Y") start_date, \
DATE_FORMAT(l.end_date, "%m-%d-%Y") end_date, \
c.name crewname \
from locations l \
left join crews c on l.crews_id = c.id \
where l.id = ?'
    
    return connectionPool.query(query, [locationId])
}

exports.getFacilityDetail = (facilityId) => {
    let query = 'select * from facilities where id = ?'
    
    return connectionPool.query(query, [facilityId])
}

exports.updateLocation = (name, value, pk) => {
    let statement = 'update `sandras`.`locations` set `' + name + '` = ? where `id` = ?';

    return connectionPool.query(statement, [value, pk]);
};

exports.updateFacility = (name, value, pk) => {
    let statement = 'update `sandras`.`facilities` set `' + name + '` = ? where `id` = ?';

    return connectionPool.query(statement, [value, pk]);
};

exports.getLocationsByCrewId = (crewId) => {
    let query = "select * from `sandras`.`locations` where crews_id = ? and status = 'ON GOING'"

    return connectionPool.query(query, [crewId])
}

exports.updateSandName = (name, value, pk) => {
    let statement = 'update `sandras`.`scales_data` set `' + name + '` = ? where `id` = ?';

    return connectionPool.query(statement, [value, pk]);
};
