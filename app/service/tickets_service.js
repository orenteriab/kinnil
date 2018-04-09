const MODEL = require('../model/tickets_model');
let moment = require('moment-timezone');
const DATE_FORMAT = 'MM/D/YYYY HH:mm:ss';
const CONVERT_DATE_FORMAT = 'YYYY-MM-D HH:mm:ss';

/** 
 * Me dio pereza andar comprobando campo a campo, mejor
 * desde esta función regresamos todo y acabamos antes.
*/
function seekForADate(uDate){
    var momentUDate = moment(uDate, DATE_FORMAT);
    var otherMomentUDate = moment(uDate, CONVERT_DATE_FORMAT);

    var result = null;

    if(momentUDate.isValid()){
        result = momentUDate.format(CONVERT_DATE_FORMAT);
    }else if(otherMomentUDate.isValid()){
        result = otherMomentUDate.format(CONVERT_DATE_FORMAT)
    }

    return result;
}

/**
 * Esto se puede volver más complicado si
 * se llegan a requerir más estados, así
 * que de una vez dejamos la función preparada.
*/
function decideStatus(uStatus) {
    return uStatus == 'COMPLETED' ? 1 : 0;
}


/*
 * En base a las millas se calcula el producto que esta seleccionado
 * 0-49 
 * 50-59
 * 60-69
 * 70-79
 * 80-89
 * 90-100
 * 100-109
 * 110-120
*/
// TODO: en las siguientes etapas hay que sacar el ID del producto de la tabla products para mandarselo al products_id del ticket
function decideProduct(uStatus){
    uStatus = parseInt(uStatus)
   
    if (uStatus > 1 && uStatus <= 49){
        return "0-49"
    }
    if (uStatus >= 50 && uStatus <= 59){
        return "50-59"
    }
    if (uStatus >= 60 && uStatus <= 69){
        return "60-69"
    }
    if (uStatus >= 70 && uStatus <= 79){
        return "70-79"
    }
    if (uStatus >= 80 && uStatus <= 89){
        return "80-89"
    }
    if (uStatus >= 90 && uStatus <= 100){
        return "90-100"
    }
    if (uStatus >= 100 && uStatus <= 109){
        return "100-109"
    }
    if (uStatus >= 110 && uStatus <= 120){
        return "110-120"
    }
}

function decideDate() {
    // Se obtiene fecha y hora
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

    // TODO: Ver si nos van a mandar la hora desde la app de drivers o si la vamos a generar nosotros
    // De momento no nos mandan nada asi que vamos a generarla aqui
    timestap = moment(today + " " + horaActual, 'YYYY-MM-DD HH:mm:ss').tz('America/Chihuahua').format('YYYY-MM-DD HH:mm:ss')
    
    return timestap
}

exports.create = (ticket) => {
    ticket["Pick Date"] = seekForADate(ticket["Pick Date"]);
    ticket["Drop Date"] = seekForADate(ticket["Drop Date"]);
    ticket["Status"] = decideStatus(ticket["Status"]);
    ticket["Rate Invoice"] = parseFloat(ticket["Rate Invoice"]);
    ticket["Load Rate"] = parseFloat(ticket["Load Rate"]);
    ticket["Miles"] = decideProduct(ticket["Miles"]);
    ticket['born_date'] = decideDate();

    return MODEL.create(ticket);
};