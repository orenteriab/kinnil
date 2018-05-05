let connectionPool = require('../config/database_config').connectionPool;


exports.getPayrollByPosition = (position) => {
    let statement = 'select id, name from hr where position = ?';

    return connectionPool.query(statement, [position]);
}

exports.getPayrollByType = (type) => {
    let statement = 'select id, name from hr where type = ?';

    return connectionPool.query(statement, [type]);
}

exports.getPayrollById = (id) => {
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
                    TIMESTAMPDIFF(hour, `c`.`in`, `c`.`out`) "hours_worked", \
                    `h`.`dll_hr` \
                    from `sandras`.`clockin` `c` join `sandras`.`hr` h on `c`.`hr_id` = `h`.`id` where `c`.`paid` != true and `c`.`hr_id` = ?'

    return connectionPool.query(statement, [hr_id]);
}

exports.getPaymentDetails = (clockinList, dllsHr) => {

    console.log(clockinList, dllsHr)
    let statement = 'select SUM(TIMESTAMPDIFF(SECOND, `in`, `out`)) "seconds_worked", ((SUM(TIMESTAMPDIFF(SECOND, `in`, `out`)))/60/60)*'+ dllsHr +' "amount" from `sandras`.`clockin` where `id` in ('+ clockinList +')'

    return connectionPool.query(statement);
}

exports.createPayrollEntry = (wireTransfer, amount, seconds_worked, timestap, id) => {
    let statement = 'insert into `sandras`.`payroll_hr` (`wire_transfer`, `amount`, `seconds_worked`, `date`, `hr_id`) values (?,?,?,?,?)'


    console.log(statement, [wireTransfer, amount, seconds_worked, timestap, id])
    return connectionPool.query(statement, [wireTransfer, amount, seconds_worked, timestap, id]);
}

exports.relateClockinEventWithPaymentEvent = (newPaymentId,clockinList) => {
    let statement = 'update `sandras`.`clockin` set payroll_hr_id = ?, paid = true where id in ('+ clockinList +')'

    console.log(statement, [newPaymentId])
    return connectionPool.query(statement, [newPaymentId]);
}

exports.getPayrollHrById = (hr_id) => {
    let statement = 'select `id`, `amount`, `seconds_worked`, DATE_FORMAT(`date`, "%m-%d-%Y %H:%i:%s") date, `wire_transfer` from `sandras`.`payroll_hr` where hr_id = ? order by `date` desc'

    return connectionPool.query(statement, [hr_id]);
}
