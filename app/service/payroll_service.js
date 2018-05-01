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

exports.getClockinById = (hr_id) => {

    return payrollModel
                .getClockinById(hr_id)
                .then((data) => {

                    return_data = {}
                    return_data.current = 1
                    return_data.rowCount = 10
                    return_data.rows = []
                    return_data.total = data.length

                    data.forEach((row, index, value) => {
                        
                        return_data.rows.push({"id":+value[index].id, 
                                                "evento": value[index].id_evento,
                                                "in": value[index].in,
                                                "out": value[index].out,
                                                "hours-worked": value[index].hours_worked,
                                                "dll-hr": value[index].dll_hr})
                    });

                    return return_data
                });	
}