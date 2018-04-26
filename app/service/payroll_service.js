let payrollModel = require('../model/payroll_model');


exports.getPayrollByPosition = (position) => {
    return payrollModel.getPayrollByPosition(position);
};

exports.getPayrollByType = (position) => {
    return payrollModel.getPayrollByType(position);
};

exports.getPayrollById = (id) => {
    return payrollModel.getPayrollById(id);
};
