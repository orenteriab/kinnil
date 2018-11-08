let connectionPool = require('../config/database_config').connectionPool;


exports.getCompletedLoadsReport = (inicio, fin) => {
    let statement = 'select t.id, \
t.status, \
t.tms, \
t.bol, \
t.truck, \
t.trailer, \
CONCAT(t.base, "-", t.silo) container, \
h.name, \
(select e.date from eventos e where e.tickets_id = t.id and e.evento = "LOADING" LIMIT 1) load_date_time, \
(select e.date from eventos e where e.tickets_id = t.id and e.evento = "UNLOADING" LIMIT 1) unload_date_time \
from tickets t join hr h on t.hr_id = h.id \
where born_date >= ? and born_date <= ?'

    return connectionPool.query(statement,[inicio, fin]);
};

exports.getQuickbooksReport = (inicio, fin) => {
    let statement = "select IFNULL(t.ticket_id, 'Not provided yet') ticket_id, \
DATE_FORMAT(`t`.`loading_date`, '%m/%d/%Y') completed_date, \
t.tms, \
t.bol, \
t.weight, \
t.sand_type, \
t.product, \
d.name driver_name, \
IFNULL(l.name, 'Wrong data input') location_name, \
IFNULL(l.long_name, 'Wrong data input') location_long_name, \
IFNULL(f.long_name, 'Wrong data input') facility_long_name, \
ROUND(t.invoice_rate - t.fixed_rate, 2) fuel_surcharge \
from tickets t \
left join hr d on t.hr_id = d.id \
left join locations l on l.name = t.location \
left join facilities f on f.name = t.facility \
where DATE(t.loading_date) >= ? and DATE(t.loading_date) <= ? and t.status = 4 \
order by l.name"

    return connectionPool.query(statement,[inicio, fin]);
};