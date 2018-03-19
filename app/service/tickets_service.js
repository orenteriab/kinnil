const MODEL = require('../model/tickets_model');
let moment = require('moment-timezone');
const DATE_FORMAT = "MM/D/YYYY HH:mm:ss";
const CONVERT_DATE_FORMAT = "YYYY-MM-D HH:mm:ss";

/** 
 * Me dio pereza andar comprobando campo a campo, mejor
 * desde esta función regresamos todo y acabamos antes.
*/
function seekForADate(uDate){
    var momentUDate = moment(uDate, DATE_FORMAT);

    var result = momentUDate.isValid() ?
        momentUDate.format(CONVERT_DATE_FORMAT) : null;

    return result;
}

/**
 * Esto se puede volver más complicado si
 * se llegan a requerir más estados, así
 * que de una vez dejamos la función preparada.
*/
function decideStatus(uStatus){
    return uStatus == "COMPLETED" ? 1 : 0;
}

exports.create = (ticket) => {
    ticket["Accept Date"] = seekForADate(ticket["Accept Date"]);
    ticket["Drop Date"] = seekForADate(ticket["Drop Date"]);
    ticket["Tender Date"] = seekForADate(ticket["Tender Date"]);
    ticket["Close Date"] = seekForADate(ticket["Close Date"]);
    ticket["Pick Date"] = seekForADate(ticket["Pick Date"]);
    ticket["Status"] = decideStatus(ticket["Status"]);
    ticket["Rate"] = parseFloat(ticket["Rate"]);
    ticket["Load Weight (lb)"] = parseFloat(ticket["Load Weight (lb)"]);

    return MODEL.create(ticket);
};