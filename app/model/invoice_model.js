let connectionPool = require('../config/database_config').connectionPool;

exports.queryToBeInvoiced = () => {
    let query = 'select '
    query += '    `t`.`tms`             `Load` '
    query += '    ,DATE_FORMAT(`t`.`assign_date`, "%m-%d-%Y") `Date` '
    query += '    ,`h`.`name`           `Driver` '
    query += '    ,`p`.`name`           `Product` '
    query += '    ,`t`.`invoice_rate`      `Invoice Rate` '
    query += '    ,DATE_FORMAT(`t`.`payrolled_date`, "%m-%d-%Y")  `Paid Date` '
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
    query += '    ,DATE_FORMAT(`t`.`assign_date`, "%m-%d-%Y")    `Date` '
    query += '    ,`h`.`name`           `Driver` '
    query += '    ,`p`.`name`           `Product` '
    query += '    ,`t`.`invoice_rate`          `Invoice Rate` '
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
    query += '    ,DATE_FORMAT(`t`.`assign_date`, "%m-%d-%Y")        `Date` '
    query += '    ,`h`.`name`               `Driver` '
    query += '    ,`p`.`name`               `Product` '
    query += '    ,`t`.`load_rate`          `Company Rate` '
    query += '    ,`i`.`payed_confirmation` `Paid ID` '
    query += '    ,DATE_FORMAT(`i`.`payed_date`, "%m-%d-%Y")         `Paid Date` '
    query += '    ,`t`.`invoice_rate`              `Invoice Rate` '
    query += 'from '
    query += '                  `sandras`.`invoices`    `i` '
    query += '    inner join    `sandras`.`tickets`     `t` on `t`.`id` = `i`.`tickets_id` '
    query += '    inner join    `sandras`.`hr`          `h` on `h`.`id` = `t`.`hr_id` '
    query += '    inner join    `sandras`.`products`    `p` on `p`.`id` = `t`.`products_id` '
    query += 'where '
    query += '    ( `i`.`payed_confirmation` is not null '
    query += '      and length(trim(`i`.`payed_confirmation`)) > 0 ) '
    query += '    or `i`.`payed_date` is not null '
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

exports.viewInvoice = (invoiceId) => {
    let query = 'SELECT '
    query += '    `c`.`name` `customer_name` '
    query += '    ,`c`.`address` `customer_address` '
    query += '    ,`i`.`id`  `invoice_number` '
    query += '    ,`t`.`invoice_date` `invoice_date` '
    query += '    ,`t`.`drop_date` `completed_date` '
    query += '    ,`i`.`terms` `invoice_terms` '
    query += '    ,`t`.`drop_date` `to_be_invoiced_date` '
    query += '    ,`t`.`invoice_date` `invoiced_date` '
    query += '    ,`i`.`payed_date` `paid_date` '
    query += '    ,`t`.`tms` `load` '
    query += '    ,`t`.`po` `po` '
    query += '    ,`t`.`bol` `bol` '
    query += '    ,`h`.`name` `driver` '
    query += '    ,`t`.`pick_date` `ship_date` '
    query += '    ,`t`.`location` `origin` '
    query += '    ,`t`.`facility` `destination` '
    query += '    ,`t`.`weight` `weight` '
    query += '    ,`t`.`invoice_rate` `price` '
    query += '    ,`p`.`payrolled` `payrolled` '
    query += '    ,`t`.`trailer` `trailer` '
    query += '    ,`p`.`date` `payrolled_date` '
    query += '    ,`t`.`invoice_rate` `total` '
    query += 'FROM '
    query += '              `sandras`.`clients`  `c` '
    query += '    LEFT JOIN `sandras`.`tickets`  `t` ON `t`.`clients_id` = `c`.`id` '
    query += '    LEFT JOIN `sandras`.`invoices` `i` ON `i`.`tickets_id` = `t`.`id` '
    query += '    LEFT JOIN `sandras`.`hr`       `h` ON `h`.`id` = `t`.`hr_id` '
    query += '    LEFT JOIN `sandras`.`payroll`  `p` ON `p`.`tickets_id` = `t`.`id` '
    query += 'WHERE '
    query += '    `i`.`id` = ? '

    return connectionPool.query(query, [invoiceId])
}
