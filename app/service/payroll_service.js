let moment = require('moment-timezone');
let payrollModel = require('../model/payroll_model');


exports.getPayrollByPosition = (position) => {
    return payrollModel.getPayrollByPosition(position);
};

exports.getPayrollByType = (position) => {
    return payrollModel.getPayrollByType(position);
};

exports.getHrInformation = (id) => {
    return payrollModel.getHrInformation(id);
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

exports.createPayrollEntry = (clockinList, id, dllsHr, wireTransfer, demergeAmount) => {
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
                    .createPayrollEntry(wireTransfer, paymentDetails.amount, paymentDetails.seconds_worked, timestap, id, demergeAmount)
                    .then((return_data) => {
                        console.log("lo que recibi" + JSON.stringify(return_data))
                        // se relaciona los eventos de clockin con la entrada de payroll (para mostrarselas despues al cliente)
                        return payrollModel
                                .relateClockinEventWithPaymentEvent(return_data.insertId, clockinList)
                    })
            })
}

exports.createPayrollEntryforDriver = (ticketList, id, rate, type, wireTransfer, demergeAmount) => {
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

    // Si el HR es de tipo DRIVER se tienen que hacer los calculos en base a la tabla que nos pasaron
    // TODO: Ocultar el rate para los COMPANY DRIVERS
    if (type == "DRIVER") {
        
        return payrollModel
            .getPaymentDetailsForCompanyDrivers(ticketList)
            .then((paymentDetails) => { 
                paymentDetails = paymentDetails[0]
                // se crea la entrada en payroll
                return payrollModel
                    .createPayrollEntryforDrivers(wireTransfer, paymentDetails.amount, timestap, id, demergeAmount)
                    .then((return_data) => {
                        // se relaciona los eventos de clockin con la entrada de payroll (para mostrarselas despues al cliente)
                        return payrollModel
                                .relateTicketsWithPaymentEvent(return_data.insertId, timestap, ticketList)
                    })
            })

    } else {
        return payrollModel
            // se calcula lo que se le tiene que pagar
            .getPaymentDetailsForDrivers(ticketList, rate)
            .then((paymentDetails) => { 
                paymentDetails = paymentDetails[0]
                // se crea la entrada en payroll
                return payrollModel
                    .createPayrollEntryforDrivers(wireTransfer, paymentDetails.amount, timestap, id, demergeAmount)
                    .then((return_data) => {
                        // se relaciona los eventos de clockin con la entrada de payroll (para mostrarselas despues al cliente)
                        return payrollModel
                                .relateTicketsWithPaymentEvent(return_data.insertId, timestap, ticketList)
                    })
            })
    }
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
        .then((ticketData) => {

            console.log(ticketData)

            let ticketsId = []
            for (var i = 0; i < ticketData.length; i++) { 
                ticketsId.push(ticketData[i].id)
            }

            console.log(ticketsId)

            return payrollModel
                .getEventDataByTicketId(ticketsId)
                .then((eventData) => {
                    console.log("----")
                    console.log(eventData)
                    console.log("----")
                    console.log(ticketData)
                    console.log("----")
                    // Formatos necesarios para jquery-bootgrid
                    var return_data = {}
                    return_data.current = 1
                    return_data.rowCount = 10
                    return_data.rows = []
                    return_data.total = ticketData.length

                    for (var i = 0; i < ticketData.length; i++) {

                        let ticketEventData = eventData
                                                .filter(event => event.tickets_id == ticketData[i].id);

                        let loadDate = ticketEventData 
                                        && ticketEventData[0] 
                                        && ticketEventData[0].load_date ? 
                                            ticketEventData[0].load_date : 'N/A'

                        let standbyHours = ticketEventData 
                                            && ticketEventData[0] 
                                            && ticketEventData[0].standby_hours ? 
                                                ticketEventData[0].standby_hours : 'N/A'

                        return_data.rows.push({"id": ticketData[i].id, // data del ticket
                            "tms": ticketData[i].tms,
                            "location": ticketData[i].location,
                            "facility": ticketData[i].facility,
                            "driver-rate": ticketData[i].driver_rate,
                            "load-rate": ticketData[i].load_rate,
                            "load-date": loadDate, // data de los evntos
                            "standby-hours": standbyHours, // data de los eventos
                        })
                    }

                    console.log(return_data)
                    return return_data
                })

        })

    /*let ticketInfo = payrollModel.getTicketsById(hr_id)
    let eventInfo = payrollModel.getEventDataByTicketId(hr_id)

    
    return Promise.all([ticketInfo,eventInfo]).then((data) => {

        
        
        return return_data;
    });*/
}


exports.getPdfIinformationHr = (payrollId) => {

    return payroll = payrollModel
            .getPayrollInfoById(payrollId)
            .then((returnData) => {

                let hr = payrollModel
                    .getHrInformation(returnData[0].hr_id);

                let clockins = payrollModel
                    .getClockinInfoByPayrollId(returnData[0].id);

                let return_data = {}
                return_data.payroll = returnData
                return Promise.all([hr,clockins]).then((data) => {
    
                    return_data.hr = data[0];
                    return_data.clockins = data[1];
            
                    console.log(JSON.stringify(return_data))
                    return return_data;
                })
            })
}

exports.getPdfIinformationDrivers = (payrollId) => {

    return payroll = payrollModel
            .getPayrollInfoById(payrollId)
            .then((returnData) => {

                let hr = payrollModel
                    .getHrInformation(returnData[0].hr_id);

                let tickets = payrollModel
                    .getTicketsInfoByPayrollId(returnData[0].id);

                let return_data = {}
                return_data.payroll = returnData
                return Promise.all([hr,tickets]).then((data) => {
    
                    return_data.hr = data[0];
                    return_data.tickets = data[1];
            
                    console.log(JSON.stringify(return_data))
                    return return_data;
                })
            })
}