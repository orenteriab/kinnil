let connectionPool = require('../config/database_config').connectionPool;
let moment = require('moment-timezone');
let Bluebird = require('bluebird');

exports.create = (ticket) => {
    let shipper = ticket["Shipper"]

    return connectionPool
        .query('select  `id`                        \
                from    `sandras`.`clients`         \
                where   lower(`name`) = lower(?)    \
                limit   1', [shipper])
        .then(customerData => {
            let customerId = customerData 
                && customerData[0] 
                && customerData[0].id ? customerData[0].id : -1;

            if(customerId === -1){
                return Bluebird.reject(`The shipper ${shipper} wasn't found.`);
            }

            let query = "INSERT INTO `sandras`.`tickets`(`tms`,`born_date` ,`status`,`substatus`,`invoice_rate`,`load_rate`, `fixed_rate`, `miles`,`product`,`driver_rate`,`facility`,`location`,`sand_type`,`pick_date`,`drop_date`, `po`, `products_id`,`clients_id`) VALUES ( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            return connectionPool.query(query, [
                ticket["TMS Load #"],
                ticket["born_date"],
                1, // El primer status siempre es 1 no importa lo que venga en el cvs
                0, //substatus (accepted)
                ticket["Rate Invoice"],
                ticket["Load Rate"],
                ticket["Fixed Rate"],
                ticket["Actual Miles"],
                ticket["Miles"], //product
                ticket["Driver Rate"],
                ticket["Origin"],
                ticket["Destination"],
                ticket["Sand Type"],
                ticket["Pick Date"],
                ticket["Drop Date"],
                ticket["PO"],
                1, // TODO: Esto va a cambiar en la 2nda o 3ra etapas 
                customerId // 1 porque siempre en esta etapa es halliburton
            ]);
        })
        .catch(err => {
            return Bluebird.reject(`No shipper specified for ${ticket["TMS Load #"]}`)
        })
};

exports.update = (ticket, id) => {
    let query = "UPDATE `sandras`.`tickets` \
set `tms` = ?, \
`born_date` = ?, \
`invoice_rate` = ?, \
`load_rate` = ?, \
`miles` = ?, \
`product` = ?, \
`driver_rate` = ?, \
`facility` = ?, \
`location` = ?, \
`sand_type` = ?, \
`pick_date` = ?, \
`drop_date` = ?, \
`po` = ?, \
`products_id` = ?, \
`clients_id` = ? \
WHERE id = ?";

    return connectionPool.query(query, [
        ticket["TMS Load #"],
        ticket["born_date"],
        ticket["Rate Invoice"],
        ticket["Load Rate"],
        ticket["Actual Miles"],
        ticket["Miles"], //product
        ticket["Driver Rate"],
        ticket["Origin"],
        ticket["Destination"],
        ticket["Sand Type"],
        ticket["Pick Date"],
        ticket["Drop Date"],
        ticket["PO"],
        1, 
        1, // 1 porque siempre en esta etapa es halliburton
        id
    ]);
};

exports.updateTicketInvoiceDate = (ticket) => {
    var sql = 'UPDATE `sandras`.`tickets` SET `invoice_date` = CURDATE() WHERE id = ?';

    return connectionPool.query(sql, [ticket])
}

exports.getTicketByTms = (ticket) => {
    let query = 'SELECT id, \
DATE_FORMAT(pick_date, "%Y-%m-%d %H:%i:%s") pick_date \
from tickets WHERE tms = ?'

    return connectionPool.query(query, [ticket["TMS Load #"]])
}

exports.getFacility = (facility) => {
    let query = 'select * from facilities where name = ?'

    return connectionPool.query(query, [facility])
}

exports.getLocation = (location) => {
    let query = 'select * from locations where name = ?'

    return connectionPool.query(query, [location])
}