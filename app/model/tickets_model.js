let connectionPool = require('../config/database_config').connectionPool;
let moment = require('moment-timezone');

exports.create = (ticket) => {
    let query = "INSERT INTO `sandras`.`tickets`(`tms`,`born_date` ,`status`,`substatus`,`invoice_rate`,`load_rate`,`product`,`driver_rate`,`facility`,`location`,`sand_type`,`pick_date`,`drop_date`, `po`, `products_id`,`clients_id`) VALUES ( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    return connectionPool.query(query, [
        ticket["TMS Load #"],
        ticket["born_date"],
        1, // El primer status siempre es 1 no importa lo que venga en el cvs
        0, //substatus (accepted)
        ticket["Rate Invoice"],
        ticket["Load Rate"],
        ticket["Miles"], //product
        ticket["Driver Rate"],
        ticket["Origin"],
        ticket["Destination"],
        ticket["Sand Type"],
        ticket["Pick Date"],
        ticket["Drop Date"],
        ticket["PO"],
        1, // TODO: Esto va a cambiar en la 2nda o 3ra etapas 
        1 // 1 porque siempre en esta etapa es halliburton
    ]);
};

exports.updateTicketInvoiceDate = (ticket) => {
    var sql = 'UPDATE `sandras`.`tickets` SET `invoice_date` = CURDATE() WHERE id = ?';

    return connectionPool.query(sql, [ticket])
}

exports.getTicketByTms = (ticket) => {
    let query = "SELECT * from tickets WHERE tms = ?"

    return connectionPool.query(query, [ticket["TMS Load #"]])
}