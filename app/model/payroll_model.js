let connectionPool = require('../config/database_config').connectionPool;
let moment = require('moment-timezone')


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
ROUND(`amount`, 2) amount, \
ROUND(`demerge`, 2) demerge, \
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

exports.createPayrollEntryforDrivers = (wireTransfer, amount, timestap, id, demergeAmount) => {
    var demerge = parseFloat(demergeAmount)

    if(isNaN(demerge)){
        demerge = 0.0
    }

    let statement = 'insert into `sandras`.`payroll_hr` (`wire_transfer`, `amount`, `date`, `hr_id`, `demerge`) values (?,?,?,?,?)'

    return connectionPool.query(statement, [wireTransfer, amount, timestap, id, demerge]);
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

const prepareConcepts = (concepts, type, payrollId) => {
    let promises = []
    let sql = 'insert into `sandras`.`other_concepts`(`type`,`amount`,`description`,`date`,`truck`,`payroll_hr_id`)VALUES(?,?,?,?,?,?)'

    for(let c in concepts){
        let params = [
            type,
            parseFloat(concepts[c].amount).toFixed(2),
            concepts[c].description || '',
            concepts[c].date,
            concepts[c].truck || '',
            payrollId
        ]
        promises.push(connectionPool.query(sql, params))
    }

    return promises;
}

exports.createConcepts = (concepts, payrollId) => {  
    let promises = []

    if(concepts.deductions){
        promises = promises.concat(prepareConcepts(concepts.deductions, 'deduction', payrollId))
    }

    if(concepts.others){
        promises = promises.concat(prepareConcepts(concepts.others, 'others', payrollId))
    }

    if(concepts.reinbursment){
        promises = promises.concat(prepareConcepts(concepts.reinbursment, 'reinbursment', payrollId))
    }

    return Promise.all(promises)
}

const unformatNumber = (amount) => {
    if(amount && amount.length && amount.length > 0){
        return amount.replace(/,/g, '')
    }

    return 0
}

const fecthLoads = (payrollId) => {
    let sql =   "   select          row_number() over (order by `t`.`assign_date`)  `#`                 \
                                    ,DATE_FORMAT(`t`.`assign_date`, '%m/%d/%Y')     `Date`              \
                                    ,`t`.`truck`                                    `Truck #`           \
                                    ,`t`.`bol`                                      `BOL#`              \
                                    ,`t`.`ticket_id`                                `FEVID #`           \
                                    ,`t`.`tms`                                      `TMS ID`            \
                                    ,`t`.`facility`                                 `Facility`          \
                                    ,`t`.`location`                                 `Location`          \
                                    ,format(`t`.`load_rate`, 2)                     `Load Rate`         \
                                    ,format(`t`.`driver_rate`, 2)                   `Driver Rate`       \
                                    ,format(coalesce(`p`.`demerge`, 0), 2)          `Demerge Payment`   \
                     from           `sandras`.`tickets`     `t`                                         \
                        inner join  `sandras`.`payroll_hr`  `p` on `t`.`payroll_hr_id` = `p`.`id`       \
                     where          `p`.`id` = ?                                                        \
                     order by       `t`.`assign_date`                                                   "

    return connectionPool.query(sql, [payrollId])
                        .then((rows) => {
                            const totalLoadRate = rows.reduce((previous, row) => parseFloat(previous) + parseFloat(unformatNumber(row["Load Rate"]) || 0), 0.0)
                            const totalDriversRate = rows.reduce((previous, row) => parseFloat(previous) + parseFloat(unformatNumber(row["Driver Rate"]) || 0), 0.0)
                            const totalDemerge = rows.reduce((previous, row) => parseFloat(previous) + parseFloat(unformatNumber(row["Demerge Payment"]) || 0), 0.0)

                            return Promise.resolve({
                                result: rows,
                                totals: {
                                    loadRate: parseFloat(totalLoadRate).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                                    driversRate: parseFloat(totalDriversRate).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
                                    demerge: parseFloat(totalDemerge).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                                }
                            })
                        })
}


const fecthConcept = (concept, payrollId) => {
    let sql = "";

    if(concept === 'others'){
        sql = "select  row_number() over(order by `o`.`date`)   `#`             \
                        ,DATE_FORMAT(`o`.`date`, '%m/%d/%Y')    `Date`          \
                        ,`o`.`truck`                            `Truck #`       \
                        ,`o`.`description`                      `Description`   \
                        ,format(`o`.`amount`,2)                 `Amount`        \
                from    `sandras`.`other_concepts` `o`                          \
                where   `o`.`payroll_hr_id` = ?                                 \
                    and `o`.`type` = ?                                          "
    }else{
        sql = "select  row_number() over(order by `o`.`date`)   `#`             \
                        ,DATE_FORMAT(`o`.`date`, '%m/%d/%Y')    `Date`          \
                        ,`o`.`description`                      `Description`   \
                        ,format(`o`.`amount`,2)                 `Amount`        \
                from    `sandras`.`other_concepts` `o`                          \
                where   `o`.`payroll_hr_id` = ?                                 \
                    and `o`.`type` = ?                                          "
    }

    return connectionPool.query(sql, [payrollId, concept])
                        .then((rows) => {
                            const total = rows.reduce((previous, row) => parseFloat(previous) + parseFloat(unformatNumber(row["Amount"]) || 0), 0)
                            
                            return Promise.resolve({
                                result: rows,
                                total: parseFloat(total).toFixed(2)
                            })
                        })
}

const fecthDriverNameAndPayrollPeriod = (payrollId) => {
    let sql = " select          `h`.`name`  `driverName`                                \
                                ,`p`.`date` `date`                                      \
                from            `sandras`.`payroll_hr`  `p`                             \
                    inner join  `sandras`.`hr`          `h` on `p`.`hr_id` = `h`.`id`   \
                where           `p`.`id` = ?                                            "
    
    return connectionPool.query(sql, [payrollId]);
}

exports.fetchXLSData = (payrollId) => {
    let promises = [
        fecthLoads(payrollId), 
        fecthConcept('others', payrollId), 
        fecthConcept('reinbursment', payrollId), 
        fecthConcept('deduction', payrollId),
        fecthDriverNameAndPayrollPeriod(payrollId)
    ]

    return Promise.all(promises)
                .then((data) => {
                    const driverRate = data[0].totals.driversRate && data[0].totals.driversRate.length > 0 ? data[0].totals.driversRate : 0

                    const demerge = data[0].totals.demerge && data[0].totals.demerge.length > 0 ? data[0].totals.demerge : 0

                    const others = data[1].total && data[1].total.length > 0 ? data[1].total : 0
                    const reinbursment = data[2].total && data[2].total.length > 0 ? data[2].total : 0
                    const deduction = data[3].total && data[3].total.length > 0 ? data[3].total : 0

                    const grandTotal = parseFloat(
                        (parseFloat(unformatNumber(driverRate))) + 
                        (parseFloat(unformatNumber(demerge))) +
                        (parseFloat(unformatNumber(others))) +
                        (parseFloat(unformatNumber(reinbursment))) -
                        (parseFloat(unformatNumber(deduction)))
                    ).toFixed(2)
                    .replace(/\d(?=(\d{3})+\.)/g, '$&,')

                    const driverName = String(data[4][0].driverName || "").replace(/\s+/g, ' ').trim()
                    const sunday = moment(data[4][0].date, "YYYY-MM-DD HH:mm:ss").isoWeekday(0).format('MM/DD/YYYY')
                    const saturday = moment(data[4][0].date, "YYYY-MM-DD HH:mm:ss").isoWeekday(6).format('MM/DD/YYYY')
                    const payrollPeriod = `${sunday}-${saturday}`;
                    const payDate = moment(data[4][0].date, "YYYY-MM-DD HH:mm:ss").format('MM/DD/YYYY')

                    return Promise.resolve({
                        loads: data[0],
                        others: data[1],
                        reinbursment: data[2],
                        deductions: data[3],
                        driverName: driverName,
                        total: grandTotal,
                        payrollPeriod: payrollPeriod,
                        payDate: payDate
                    })
                })
}