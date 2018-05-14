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
 * 0-50, 51-60, etc
*/
// TODO: en las siguientes etapas hay que sacar el ID del producto de la tabla products para mandarselo al products_id del ticket
function decideProduct(uStatus){
    uStatus = parseInt(uStatus)
   
    if (uStatus > 1 && uStatus <= 50){
        return "0-50"
    }
    if (uStatus >= 51 && uStatus <= 60){
        return "51-60"
    }
    if (uStatus >= 61 && uStatus <= 70){
        return "61-70"
    }
    if (uStatus >= 71 && uStatus <= 80){
        return "71-80"
    }
    if (uStatus >= 81 && uStatus <= 90){
        return "81-90"
    }
    if (uStatus >= 91 && uStatus <= 100){
        return "91-100"
    }
    if (uStatus >= 101 && uStatus <= 110){
        return "101-110"
    }
    if (uStatus >= 111 && uStatus <= 120){
        return "111-120"
    }
    if (uStatus >= 121 && uStatus <= 130){
        return "121-130"
    }
    if (uStatus >= 130 && uStatus <= 140){
        return "131-140"
    }
    if (uStatus >= 141 && uStatus <= 150){
        return "141-150"
    }
    if (uStatus >= 151 && uStatus <= 160){
        return "151-160"
    }
    if (uStatus >= 161 && uStatus <= 170){
        return "161-170"
    }
    if (uStatus >= 171 && uStatus <= 180){
        return "171-180"
    }
    if (uStatus >= 181 && uStatus <= 190){
        return "181-190"
    }
    if (uStatus >= 191 && uStatus <= 200){
        return "191-200"
    }
    if (uStatus >= 201 && uStatus <= 210){
        return "201-210"
    }
    if (uStatus >= 211 && uStatus <= 220){
        return "211-220"
    }
    if (uStatus >= 110 && uStatus <= 230){
        return "221-230"
    }
    if (uStatus >= 110 && uStatus <= 240){
        return "231-240"
    }
    if (uStatus >= 110 && uStatus <= 250){
        return "241-250"
    }
    if (uStatus >= 110 && uStatus <= 260){
        return "251-260"
    }
    if (uStatus >= 110 && uStatus <= 270){
        return "261-270"
    }
    if (uStatus >= 110 && uStatus <= 280){
        return "271-280"
    }
    if (uStatus >= 110 && uStatus <= 290){
        return "281-290"
    }
    if (uStatus >= 110 && uStatus <= 300){
        return "291-300"
    }
}

function decideDriverRate(uStatus){
    uStatus = parseInt(uStatus)


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
    //ticket["Status"] = decideStatus(ticket["Status"]);
    ticket["Rate Invoice"] = parseFloat(ticket["Rate Invoice"]);
    ticket["Load Rate"] = parseFloat(ticket["Load Rate"]);
    ticket["Miles"] = decideProduct(ticket["Miles"]);
    ticket['born_date'] = decideDate();

    return MODEL.create(ticket);
};

exports.updateTicketInvoiceDate = (ticket) => {
    return MODEL.updateTicketInvoiceDate(ticket)
}