let connectionPool = require('../config/database_config').connectionPool;
let moment = require('moment-timezone');

exports.create = (ticket) => {
    let query = "INSERT INTO `sandras`.`tickets`(`tms`,`status`,`substatus`,`price`,`currency`,`product`,`base`,`silo`,`po`,`facility`,`location`,`bol`,`sand_type`,`weight`,`assign_date`,`completed_date`,`invoice_date`,`payrolled_date`,`starting_mi`,`end_mi`,`pick_date`,`drop_date`,`pro`,`equipment`,`notes`,`sr`,`hr_id`,`products_id`,`clients_id`) VALUES ( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,? )";

    return connectionPool.query(query, [
        ticket["TMS Load #"],
        ticket["Status"],
        0, //substatus
        ticket["Rate"],
        ticket["Currency"],
        '', //product
        ticket["Origin"],
        '',//silo
        ticket["Order #"],
        ticket["Destination"],
        ticket["Origin"],
        ticket["BOL #"],
        '', //sand_type
        ticket["Load Weight (lb)"],
        ticket["Accept Date"],
        ticket["Drop Date"],
        ticket["Tender Date"],
        ticket["Close Date"],
        0,//starting_mi,
        0,//end_mi
        ticket["Pick Date"],
        ticket["Drop Date"],
        ticket["Pro#"],
        ticket["Equipment"],
        ticket["Load Notes"],
        ticket["Service Requests"],
        1,//hr_id,
        1,//products_id,
        1//ticket["Primary Reference #"]
    ]);
};