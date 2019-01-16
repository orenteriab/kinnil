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
exports.getDiamonbackDriversForReport = (start, end) => {
   let statement  = "SELECT         DISTINCT(`d`.`id`) `id`                             "
       statement += "FROM           `sandras`.`tickets` `t`                             "
       statement += "   LEFT JOIN   `sandras`.`hr`      `d` on `t`.`hr_id` = `d`.`id`   "
       statement += "WHERE  DATE(`t`.`loading_date`) >= ?                               "
       statement += "   AND DATE(`t`.`loading_date`) <= ?                               "
       statement += "   AND `t`.`status` = 4                                            "
       statement += "   AND `d`.`id` IS NOT NULL                                        "
       statement += "   AND `t`.`clients_id` = 2                                        "
    return connectionPool.query(statement, [start, end])
}
exports.getDiamonbackReportRecord = (start, end, driver) => {
   let statement  = "SELECT         COALESCE(`t`.`id`, 'Not yet provided')                         `ticket_number`      "
       statement += "               ,DATE_FORMAT(`t`.`loading_date`, '%m/%d/%Y')                   `date`               "
       statement += "               ,`t`.`tms`                                                     `load_number`        "
       statement += "               ,`t`.`bol`                                                     `bol`                "
       statement += "               ,COALESCE(`l`.`name`, 'Wrong data input')                      `location`           "
       statement += "               ,COALESCE(`f`.`name`, 'Wrong data input')                      `facility`           "
       statement += "               ,`t`.`weight`                                                  `weight`             "
       statement += "               ,`t`.`miles`                                                   `miles`              "
       statement += "               ,CASE                                                                               "
       statement += "                   WHEN `t`.`miles` < 26   THEN 'Sand # of Miles: 0-25'                            "
       statement += "                   WHEN `t`.`miles` < 51   THEN 'Sand # of Miles: 26-50'                           "
       statement += "                   WHEN `t`.`miles` < 76   THEN 'Sand # of Miles: 51-75'                           "
       statement += "                   WHEN `t`.`miles` < 101  THEN 'Sand # of Miles: 76-100'                          "
       statement += "                   WHEN `t`.`miles` < 126  THEN 'Sand # of Miles: 101-125'                         "
       statement += "                   WHEN `t`.`miles` < 151  THEN 'Sand # of Miles: 130-150'                         "
       statement += "                   WHEN `t`.`miles` < 176  THEN 'Sand # of Miles: 151-175'                         "
       statement += "                   WHEN `t`.`miles` < 201  THEN 'Sand # of Miles: 176-200'                         "
       statement += "                   WHEN `t`.`miles` < 226  THEN 'Sand # of Miles: 201-225'                         "
       statement += "                   WHEN `t`.`miles` < 251  THEN 'Sand # of Miles: 226-250'                         "
       statement += "                   WHEN `t`.`miles` < 276  THEN 'Sand # of Miles: 251-275'                         "
       statement += "                   WHEN `t`.`miles` < 300  THEN 'Sand # of Miles: 276-300'                         "
       statement += "                   ELSE 'Sand # of Miles: 276-300'                                                 "
       statement += "               END                                                         `sand_number_of_miles`  "
       statement += "               ,CASE                                                                               "
       statement += "                   WHEN `t`.`miles` < 26   THEN 27.50                                              "
       statement += "                   WHEN `t`.`miles` < 51   THEN 29.50                                              "
       statement += "                   WHEN `t`.`miles` < 76   THEN 31.50                                              "
       statement += "                   WHEN `t`.`miles` < 101  THEN 33.50                                              "
       statement += "                   WHEN `t`.`miles` < 126  THEN 37.50                                              "
       statement += "                   WHEN `t`.`miles` < 151  THEN 39.50                                              "
       statement += "                   WHEN `t`.`miles` < 176  THEN 42.50                                              "
       statement += "                   WHEN `t`.`miles` < 201  THEN 44.50                                              "
       statement += "                   WHEN `t`.`miles` < 226  THEN 49.50                                              "
       statement += "                   WHEN `t`.`miles` < 251  THEN 53.50                                              "
       statement += "                   WHEN `t`.`miles` < 276  THEN 58.50                                              "
       statement += "                   WHEN `t`.`miles` < 300  THEN 61.50                                              "
       statement += "                   ELSE 61.50                                                                      "
       statement += "               END                                                         `cost_per_ton`          "
       statement += "               ,CASE                                                                               "
       statement += "                   WHEN `t`.`miles` < 26   THEN FORMAT(27.50 * (`t`.`weight` / 2000), 2)           "
       statement += "                   WHEN `t`.`miles` < 51   THEN FORMAT(29.50 * (`t`.`weight` / 2000), 2)           "
       statement += "                   WHEN `t`.`miles` < 76   THEN FORMAT(31.50 * (`t`.`weight` / 2000), 2)           "
       statement += "                   WHEN `t`.`miles` < 101  THEN FORMAT(33.50 * (`t`.`weight` / 2000), 2)           "
       statement += "                   WHEN `t`.`miles` < 126  THEN FORMAT(37.50 * (`t`.`weight` / 2000), 2)           "
       statement += "                   WHEN `t`.`miles` < 151  THEN FORMAT(39.50 * (`t`.`weight` / 2000), 2)           "
       statement += "                   WHEN `t`.`miles` < 176  THEN FORMAT(42.50 * (`t`.`weight` / 2000), 2)           "
       statement += "                   WHEN `t`.`miles` < 201  THEN FORMAT(44.50 * (`t`.`weight` / 2000), 2)           "
       statement += "                   WHEN `t`.`miles` < 226  THEN FORMAT(49.50 * (`t`.`weight` / 2000), 2)           "
       statement += "                   WHEN `t`.`miles` < 251  THEN FORMAT(53.50 * (`t`.`weight` / 2000), 2)           "
       statement += "                   WHEN `t`.`miles` < 276  THEN FORMAT(58.50 * (`t`.`weight` / 2000), 2)           "
       statement += "                   WHEN `t`.`miles` < 300  THEN FORMAT(61.50 * (`t`.`weight` / 2000), 2)           "
       statement += "                   ELSE FORMAT(61.50 * (`t`.`weight` / 2000), 2)                                   "
       statement += "               END                                                         `total_cost`            "
       statement += "               ,CONCAT('Sand Type: ', `t`.`product`)                       `sand_type`             "
       statement += "               ,`d`.`name`                                                 `driver_name`           "
       statement += "FROM           `sandras`.`tickets`     `t`                                                         "
       statement += "   LEFT JOIN   `sandras`.`hr`          `d` on `t`.`hr_id`      = `d`.`id`                          "
       statement += "   LEFT JOIN   `sandras`.`locations`   `l` on `t`.`location`   = `l`.`name`                        "
       statement += "   LEFT JOIN   `sandras`.`facilities`  `f` on `t`.`facility`   = `f`.`name`                        "
       statement += "WHERE          DATE(`t`.`loading_date`) >= ?                                                       "
       statement += "   AND         DATE(`t`.`loading_date`) <= ?                                                       "
       statement += "   AND         `t`.`status` = ?                                                                    "
       statement += "   AND         `d`.`id` = ?                                                                        "
       statement += "   AND         `t`.`clients_id` = ?                                                                "
    return connectionPool.query(statement, [start, end, 4, driver.id, 2])
}

exports.getHrForReportWithConnection = (position, connection) => {
    let statement  = "select * from hr where position = ?"
     return connection.query(statement, [position])
 }

 exports.getClockinInfoByHrIdWithConnection = (inicio, fin, hr_id, connection) => {
    let statement = 'select `c`.`id`, \
`hr`.`name`, \
DATE_FORMAT(`c`.`in`, "%m-%d-%Y %H:%i:%s") `in`, \
DATE_FORMAT(`c`.`out`, "%m-%d-%Y %H:%i:%s") `out`, \
TIME_TO_SEC(TIMEDIFF(`c`.`out`, `c`.`in`))/3600 `hours_worked` \
from `sandras`.`clockin` `c` \
join `sandras`.`hr` `hr` on `hr`.`id` = `c`.`hr_id` \
where `hr`.`labor_status` != "NOT WORKING WITH US" \
and `c`.`in` >= ? and `c`.`in` <= ? \
and `c`.`hr_id` = ?'

    return connection.query(statement, [inicio, fin, hr_id]);
}

exports.getHrForReportAsync = async(position, start, end) => {
    let result = []

    try {
        let auxConnection = await connectionPool.getConnection()
        await auxConnection.beginTransaction()

        try {
            let hrs = await getHrForReportWithConnection(position, auxConnection)

            for(let h in hrs){
                let hr = await getClockinInfoByHrIdWithConnection(start, end, hrs[h].id, auxConnection)
                result.push(hr)
            }

            await auxConnection.commit()
        } catch (transactionError) {
            console.error('[reports_model][getHrForReportAsync]: Error when getting report\n', transactionError);
            await connection.rollback()
        }

        await connectionPool.releaseConnection(auxConnection)
    } catch (connectionError) {
        throw "Something happened to the connection!"
        console.error("[reports_model][getHrForReportAsync]: Error when getting connection:", connectionError)
    }

    return result;
}

exports.getHrForReport = (position) => {
    let statement  = "select * from hr where position = ?"
     return connectionPool.query(statement, [position])
 }

 exports.getClockinInfoByHrId = (inicio, fin, hr_id) => {
    let statement = 'select `c`.`id`, \
`hr`.`name`, \
DATE_FORMAT(`c`.`in`, "%m-%d-%Y %H:%i:%s") `in`, \
DATE_FORMAT(`c`.`out`, "%m-%d-%Y %H:%i:%s") `out`, \
TIME_TO_SEC(TIMEDIFF(`c`.`out`, `c`.`in`))/3600 `hours_worked` \
from `sandras`.`clockin` `c` \
join `sandras`.`hr` `hr` on `hr`.`id` = `c`.`hr_id` \
where `hr`.`labor_status` != "NOT WORKING WITH US" \
and `c`.`in` >= ? and `c`.`in` <= ? \
and `c`.`hr_id` = ?'

    return connectionPool.query(statement, [inicio, fin, hr_id]);
}

exports.totalLoads = (currentDate) => {
    let statement = 'select count(*) number_of_loads \
    from tickets \
    where unloading_date is not null \
    and unloading_date between DATE(?) - interval 1 day + interval 6 hour and DATE(?) + interval 6 hour'

    return connectionPool.query(statement, [currentDate, currentDate]);
}

exports.totalVolume = (currentDate) => {
    let statement = 'select sum(weight) volume \
    from tickets \
    where unloading_date is not null  \
    and unloading_date between DATE(?) - interval 1 day + interval 6 hour and DATE(?) + interval 6 hour '

    return connectionPool.query(statement, [currentDate, currentDate]);
}

exports.loadsPerClient = (currentDate) => {
    let statement = 'select clients_id, count(*) number_of_loads \
    from tickets  \
    where unloading_date is not null  \
    and unloading_date between DATE(?) - interval 1 day + interval 6 hour and DATE(?) + interval 6 hour \
    group by clients_id'

    return connectionPool.query(statement, [currentDate, currentDate]);
}

exports.sandsPerClient = (currentDate) => {
    let statement = 'select clients_id, \
    sand_type,  \
    round(sum(weight), 0) current_lbs  \
    from tickets  \
    where unloading_date is not null  \
    and unloading_date between DATE(?) - interval 1 day + interval 6 hour and DATE(?) + interval 6 hour \
    group by sand_type, clients_id \
    order by clients_id, sand_type '

    return connectionPool.query(statement, [currentDate, currentDate]);
}

exports.totalSandPerClient = (currentDate) => {
    let statement = 'select clients_id, \
    round(sum(weight), 0) current_lbs  \
    from tickets  \
    where unloading_date is not null  \
    and unloading_date between DATE(?) - interval 1 day + interval 6 hour and DATE(?) + interval 6 hour \
    group by clients_id \
    order by clients_id '

    return connectionPool.query(statement, [currentDate, currentDate]);
}

exports.clientsList = () => {
    let statement = 'select id, name from clients'

    return connectionPool.query(statement);
}