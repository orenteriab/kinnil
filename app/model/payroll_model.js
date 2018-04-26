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