let connectionPool = require('../config/database_config').connectionPool;

exports.queryToBeInvoiced = () => {
    let query = 'select '
    query += '    `t`.`tms`             `Load` '
    query += '    ,`t`.`assign_date`    `Date` '
    query += '    ,`h`.`name`           `Driver` '
    query += '    ,`p`.`name`           `Product` '
    query += '    ,`t`.`load_rate`      `Company Rate` '
    query += '    ,`t`.`payrolled_date` `Paid Date` '
    query += '    ,`t`.`id`             `id`'
    query += 'from  '
    query += '                  `sandras`.`tickets`     `t` '
    query += '    inner join    `sandras`.`hr`          `h` on `h`.`id` = `t`.`hr_id` '
    query += '    inner join    `sandras`.`products`    `p` on `p`.`id` = `t`.`products_id` '
    query += '    left join     `sandras`.`invoices`     `i` on `i`.`tickets_id` = `t`.`id` '
    query += 'where  '
    query += '    `t`.`status` = 4 '
    query += '    and `i`.`id` is null '
    query += 'order by '
    query += '    `t`.`assign_date`     asc '
    query += '   ,`t`.`payrolled_date`  asc '

    return connectionPool.query(query)
}

exports.queryToBePaid = () => {
    let query = 'select '
    query += '    `i`.`id`              `Invoice Id` '
    query += '    ,`t`.`tms`            `Load` '
    query += '    ,`t`.`assign_date`    `Date` '
    query += '    ,`h`.`name`           `Driver` '
    query += '    ,`p`.`name`           `Product` '
    query += '    ,`t`.`price`          `Price` '
    query += 'from '
    query += '                `sandras`.`invoices`    `i` '
    query += '    inner join  `sandras`.`tickets`     `t` on `t`.`id` = `i`.`tickets_id` '
    query += '    inner join  `sandras`.`hr`          `h` on `h`.`id` = `t`.`hr_id` '
    query += '    inner join  `sandras`.`products`    `p` on `p`.`id` = `t`.`products_id` '
    query += 'where '
    query += '    ( `i`.`payed_confirmation` is null  '
    query += '      or length(trim(`i`.`payed_confirmation`)) = 0 ) '
    query += '    and `i`.`payed_date` is null '
    query += 'order by '
    query += '    `t`.`assign_date` asc '
    query += '    ,`i`.`payed_date` asc '

    return connectionPool.query(query)
}

exports.queryPaid = () => {
    let query = 'select '
    query += '    `i`.`id`                  `Invoice Id` '
    query += '    ,`t`.`tms`                `Load` '
    query += '    ,`t`.`assign_date`        `Date` '
    query += '    ,`h`.`name`               `Driver` '
    query += '    ,`p`.`name`               `Product` '
    query += '    ,`t`.`load_rate`          `Company Rate` '
    query += '    ,`i`.`payed_confirmation` `Paid ID` '
    query += '    ,`i`.`payed_date`         `Paid Date` '
    query += 'from '
    query += '                  `sandras`.`invoices`    `i` '
    query += '    inner join    `sandras`.`tickets`     `t` on `t`.`id` = `i`.`tickets_id` '
    query += '    inner join    `sandras`.`hr`          `h` on `h`.`id` = `t`.`hr_id` '
    query += '    inner join    `sandras`.`products`    `p` on `p`.`id` = `t`.`products_id` '
    query += 'where '
    query += '    ( `i`.`payed_confirmation` is not null  '
    query += '      and length(trim(`i`.`payed_confirmation`)) > 0 ) '
    query += '    or `i`.`payed_date` is not null'
    query += 'order by '
    query += '    `i`.`payed_date` desc '

    return connectionPool.query(query)
}

exports.createInvoice = (ticketId) => {
    let query = 'INSERT INTO `sandras`.`invoices`( '
    query += '    `id` '
    query += '    ,`payed_confirmation` '
    query += '    ,`payed_date` '
    query += '    ,`status` '
    query += '    ,`terms` '
    query += '    ,`notes` '
    query += '    ,`tickets_id` '
    query += ') VALUES ( '
    query += '    DEFAULT '
    query += '    ,? '
    query += '    ,? '
    query += '    ,? '
    query += '    ,? '
    query += '    ,? '
    query += '    ,? '
    query += ') '

    return connectionPool.query(query, ['', null, 1, '', '', ticketId]);
}

exports.updatePayment = (invoiceId, paymentId) => {
    let query = 'UPDATE `sandras`.`invoices` SET payed_confirmation = ? , payed_date = ? where id = ?';

    return connectionPool.query(query, [paymentId, new Date(), invoiceId]);
}