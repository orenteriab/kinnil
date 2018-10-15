let connectionPool = require('../config/database_config').connectionPool;


exports.getPayrollByPosition = (position) => {
    let statement = 'select id, name, substring_index(name, " ", -1) last_name from hr where position = ? order by last_name';

    return connectionPool.query(statement, [position]);
}

exports.getPayrollByType = (type) => {
    let statement = 'select id, name, substring_index(name, " ", -1) last_name from hr where type = ? order by last_name';

    return connectionPool.query(statement, [type]);
}

exports.getHrInformation = (id) => {
    let statement = 'select id, \
                        name, \
                        address, \
                        civil_status, \
                        tel, \
                        email, \
                        contact1, \
                        contact2, \
                        birthdate, \
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
                        DATE_FORMAT(mc_exp, "%m-%d-%Y") mc_exp, \
                        DATE_FORMAT(dt_exp, "%m-%d-%Y") dt_exp, \
                        DATE_FORMAT(training_exp, "%m-%d-%Y") training_exp, \
                        DATE_FORMAT(license_exp, "%m-%d-%Y") license_exp, \
                        DATE_FORMAT(years_working, "%m-%d-%Y") years_working, \
                        DATE_FORMAT(hire_date, "%m-%d-%Y") hire_date, \
                        state, \
                        ssn, \
                        dependants, \
                        up, \
                        clients_id, \
                        assigned, \
                        location, \
                        dll_hr \
                        from hr \
                        where id = ?'

    return connectionPool.query(statement, [id]);
}

exports.getClockinById = (hr_id) => {
    let statement = 'select `c`.`id`, `c`.`id_evento`, \
DATE_FORMAT(`c`.`in`, "%m-%d-%Y %H:%i:%s") "in" , \
DATE_FORMAT(`c`.`out`, "%m-%d-%Y %H:%i:%s") "out", \
ROUND(TIMESTAMPDIFF(minute, `c`.`in`, `c`.`out`)/60,2) "hours_worked", \
`h`.`dll_hr` \
from `sandras`.`clockin` `c` join `sandras`.`hr` h on `c`.`hr_id` = `h`.`id` where `c`.`paid` != true and `c`.`hr_id` = ?'

    return connectionPool.query(statement, [hr_id]);
}

exports.getPaymentDetails = (clockinList, dllsHr) => {

    let statement = 'select SUM(TIMESTAMPDIFF(SECOND, `in`, `out`)) "seconds_worked", ((SUM(TIMESTAMPDIFF(SECOND, `in`, `out`)))/60/60)*'+ dllsHr +' "amount" from `sandras`.`clockin` where `id` in ('+ clockinList +')'

    return connectionPool.query(statement);
}

exports.createPayrollEntry = (wireTransfer, amount, seconds_worked, timestap, id, demergeAmount) => {
    let statement = 'insert into `sandras`.`payroll_hr` (`wire_transfer`, `amount`, `seconds_worked`, `date`, `hr_id`, `demerge`) values (?,?,?,?,?,?)'

    return connectionPool.query(statement, [wireTransfer, amount, seconds_worked, timestap, id, demergeAmount]);
}

exports.relateClockinEventWithPaymentEvent = (newPaymentId,clockinList) => {
    let statement = 'update `sandras`.`clockin` set payroll_hr_id = ?, paid = true where id in ('+ clockinList +')'

    return connectionPool.query(statement, [newPaymentId]);
}

exports.getPayrollHrById = (hr_id) => {
    let statement = 'select `id`, \
`amount`, \
`seconds_worked`, \
DATE_FORMAT(`date`, "%m-%d-%Y %H:%i:%s") date, \
`wire_transfer` \
from `sandras`.`payroll_hr` \
where hr_id = ? order by `date` desc'

    return connectionPool.query(statement, [hr_id]);
}

exports.getTicketsById = (hr_id) => {
    let statement = 'select id, tms, location, facility, load_rate, driver_rate from tickets where status = 4 and payrolled_date is null and hr_id = ?'

    return connectionPool.query(statement, [hr_id]);
}

exports.getEventDataByTicketId = (ticketsId) => {
    if(ticketsId == undefined || ticketsId == null || !ticketsId.length || ticketsId.length == 0){
        return Promise.resolve('[]');
    }

    let statement = "select     `p`.`tickets_id`                                                                            \
                                ,date_format(max(`p`.`load_date`), '%m/%d/%Y %H:%i')    `load_date`                         \
                                ,max(`p`.`arrived`)                                     `arrived`                           \
                                ,max(`p`.`unloading`)                                   `unloading`                         \
                                ,timestampdiff( second                                                                      \
                                                ,max(`p`.`arrived`)                                                         \
                                                ,max(`p`.`unloading`)                                                       \
                                ) / 3600                                                `standby_hours`                     \
                    from        (   select      `e`.`tickets_id`                                                            \
                                                ,`e`.`evento`                                                   `evento`    \
                                                ,max(if(`e`.`evento` = 'LOADING'            , `date`, null))    `load_date` \
                                                ,max(if(`e`.`evento` = 'ARRIVED TO LOCATION', `date`, null))    `arrived`   \
                                                ,max(if(`e`.`evento` = 'UNLOADING'          , `date`, null))    `unloading` \
                                    from        `eventos` `e`                                                               \
                                    where       `e`.`tickets_id`    =   ?                                                   \
                                        and     `e`.`evento`        in  (   'LOADING'                                       \
                                                                            ,'ARRIVED TO LOCATION'                          \
                                                                            ,'UNLOADING'                                    \
                                                                        )                                                   \
                                    group by    `e`.`evento`                                                                \
                                ) `p`                                                                                       \
                    group by    `p`.`tickets_id`                                                                            "

    return Promise.all(ticketsId.map(async (ticketId) => {
        let result = await connectionPool.query(statement, [ticketId])
        result = result && result[0] ? result[0] : {}
        return result
    }))

}


exports.getPaymentDetailsForCompanyDrivers = (ticketList) => {
    let statement = 'select SUM(`load_rate` * `driver_rate`) amount from `sandras`.`tickets` where `id` in ('+ ticketList +')'

    return connectionPool.query(statement);
}

exports.getPaymentDetailsForDrivers = (ticketList, rate) => {
    let statement = 'select SUM(`load_rate` * '+ rate +') amount from `sandras`.`tickets` where `id` in ('+ ticketList +')'

    return connectionPool.query(statement);
}

exports.createPayrollEntryforDrivers = (wireTransfer, amount, timestap, id) => {
    let statement = 'insert into `sandras`.`payroll_hr` (`wire_transfer`, `amount`, `date`, `hr_id`) values (?,?,?,?)'

    return connectionPool.query(statement, [wireTransfer, amount, timestap, id]);
}

exports.relateTicketsWithPaymentEvent = (newPaymentId, timestap, ticketList) => {
    let statement = 'update `sandras`.`tickets` set payroll_hr_id = ?, payrolled_date = ? where id in ('+ ticketList +')'

    return connectionPool.query(statement, [newPaymentId, timestap]);
}

exports.getClockinInfoByPayrollId = (payrollId) => {
    let statement = 'select `id`, DATE_FORMAT(`in`, "%m-%d-%Y %H:%i:%s") `in`, DATE_FORMAT(`out`, "%m-%d-%Y %H:%i:%s") `out`, TIMEDIFF(`out`, `in`) `hours_worked`  from `sandras`.`clockin` where `payroll_hr_id` in ('+ payrollId +')'

    return connectionPool.query(statement);
}

exports.getPayrollInfoById = (payrollId) => {
    let statement = 'select `id`, `wire_transfer`, `amount`, `seconds_worked`, DATE_FORMAT(`date`, "%m-%d-%Y %H:%i:%s") `date`, `hr_id`, `demerge` from `sandras`.`payroll_hr` where id = ?'

    return connectionPool.query(statement, [payrollId]);
}

exports.getTicketsInfoByPayrollId = (payrollId) => {
    let statement = 'select `id`, \
`tms`, \
`status`, \
`substatus`, \
`invoice_rate`, \
`load_rate`, \
`driver_rate`, \
`product`, \
`base`, \
`silo`, \
`po`, \
`facility`, \
`location`, \
`bol`, \
`sand_type`, \
`weight`, \
DATE_FORMAT(`assign_date`, "%m-%d-%Y") `assign_date`, \
DATE_FORMAT(`completed_date`, "%m-%d-%Y") `completed_date`, \
DATE_FORMAT(`invoice_date`, "%m-%d-%Y") `invoice_date`, \
DATE_FORMAT(`payrolled_date`, "%m-%d-%Y") `payrolled_date`, \
DATE_FORMAT(`born_date`, "%m-%d-%Y") `born_date`, \
`starting_mi`, \
`end_mi`, \
`pick_date`, \
`drop_date`, \
`notes`, \
`products_id`, \
`truck`, \
`trailer` \
from tickets  \
where `payroll_hr_id` in ('+ payrollId +')';
    return connectionPool.query(statement);
}

