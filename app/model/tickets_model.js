let connectionPool = require('../config/database_config').connectionPool;
let moment = require('moment-timezone');

exports.create = (ticket) => {
    let query = "INSERT INTO `sandras`.`tickets`(`tms`,`born_date` ,`status`,`substatus`,`invoice_rate`,`load_rate`,`product`,`facility`,`location`,`sand_type`,`pick_date`,`drop_date`,`products_id`,`clients_id`) VALUES ( ?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    return connectionPool.query(query, [
        ticket["TMS Load #"],
        ticket["born_date"],
        1, // El primer status siempre es 1 no importa lo que venga en el cvs
        0, //substatus (accepted)
        ticket["Rate Invoice"],
        ticket["Load Rate"],
        ticket["Miles"], //product
        ticket["Origin"],
        ticket["Destination"],
        ticket["Sand Type"],
        ticket["Pick Date"],
        ticket["Drop Date"],
        1, // TODO: Esto va a cambiar en la 2nda o 3ra etapas 
        1 // 1 porque siempre en esta etapa es halliburton
    ]);
};