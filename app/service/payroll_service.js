let moment = require('moment-timezone');
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

exports.createPayrollEntry = (clockinList, id, dllsHr, wireTransfer) => {
    // Se obtiene fecha y hora actuales
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
        dd='0'+dd;
    
    if(mm<10) 
        mm='0'+mm;

    today = yyyy+'-'+mm+'-'+dd;

    var d = new Date()
    var h = d.getHours()
    var m = d.getMinutes()
    var s = d.getSeconds()
    var horaActual = h + ":" + m + ":" + s

    timestap = moment(today + " " + horaActual, 'YYYY-MM-DD HH:mm:ss').tz('America/Chihuahua').format('YYYY-MM-DD HH:mm:ss')

    return payrollModel
            // se calcula las horas trabajadas y el monto que se tiene que pagar.
            .getPaymentDetails(clockinList, dllsHr)
            .then((paymentDetails) => { 
                paymentDetails = paymentDetails[0]
                console.log(JSON.stringify(paymentDetails))
                // se crea la entrada en payroll
                return payrollModel
                    .createPayrollEntry(wireTransfer, paymentDetails.amount, paymentDetails.seconds_worked, timestap, id)
                    .then((return_data) => {
                        console.log("lo que recibi" + JSON.stringify(return_data))
                        // se relaciona los eventos de clockin con la entrada de payroll (para mostrarselas despues al cliente)
                        return payrollModel
                                .relateClockinEventWithPaymentEvent(return_data.insertId, clockinList)
                    })
            })
}

exports.createPayrollEntryforDriver = (ticketList, id, rate, type, wireTransfer) => {
    // Se obtiene fecha y hora actuales
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
        dd='0'+dd;
    
    if(mm<10) 
        mm='0'+mm;

    today = yyyy+'-'+mm+'-'+dd;

    var d = new Date()
    var h = d.getHours()
    var m = d.getMinutes()
    var s = d.getSeconds()
    var horaActual = h + ":" + m + ":" + s

    timestap = moment(today + " " + horaActual, 'YYYY-MM-DD HH:mm:ss').tz('America/Chihuahua').format('YYYY-MM-DD HH:mm:ss')

    /* TODO: Hay que hacer algo para que nos tome la tablita de rates cuando el driver es un company driver
    if (type == "DRIVER") {
        let paymentOptions = 
    } else {
        return payrollModel.getPaymentDetailsForDrivers()
    }*/
    return payrollModel
            // se calcula lo que se le tiene que pagar
            .getPaymentDetailsForDrivers(ticketList, rate)
            .then((paymentDetails) => { 
                paymentDetails = paymentDetails[0]
                console.log(JSON.stringify(paymentDetails))
                // se crea la entrada en payroll
                return payrollModel
                    .createPayrollEntryforDrivers(wireTransfer, paymentDetails.amount, timestap, id)
                    .then((return_data) => {
                        console.log("lo que recibi" + JSON.stringify(return_data))
                        // se relaciona los eventos de clockin con la entrada de payroll (para mostrarselas despues al cliente)
                        return payrollModel
                                .relateTicketsWithPaymentEvent(return_data.insertId, timestap, ticketList)
                    })
            })
}

exports.getPayrollHrById = (hr_id) => {
    return payrollModel
                .getPayrollHrById(hr_id)
                .then((data) => {

                    return_data = {}
                    return_data.current = 1
                    return_data.rowCount = 10
                    return_data.rows = []
                    return_data.total = data.length

                    data.forEach((row, index, value) => {
                        
                        return_data.rows.push({"id":+value[index].id, 
                                                "amount": value[index].amount,
                                                "hours-worked": value[index].seconds_worked / 60 / 60,
                                                "date": value[index].date,
                                                "wire-transfer": value[index].wire_transfer})
                    });

                    return return_data
                });	
}

exports.getTicketsById = (hr_id) => {
    return payrollModel
                .getTicketsById(hr_id)
                .then((data) => {
                    console.log(data)

                    // Formato necesarios para jquery-bootgrid
                    return_data = {}
                    return_data.current = 1
                    return_data.rowCount = 10
                    return_data.rows = []
                    return_data.total = data.length

                    data.forEach((row, index, value) => {
                        
                        return_data.rows.push({"id":+value[index].id, 
                                                "tms": value[index].tms,
                                                "location": value[index].location,
                                                "facility": value[index].facility,
                                                "driver-rate": value[index].driver_rate,
                                                "load-rate": value[index].load_rate})
                    });

                    console.log(return_data)

                    return return_data
                });	
}
