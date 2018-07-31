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

