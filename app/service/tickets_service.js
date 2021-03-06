const MODEL = require('../model/tickets_model');
let moment = require('moment-timezone');
const DATE_FORMAT = 'MM/D/YYYY HH:mm:ss';
const CONVERT_DATE_FORMAT = 'YYYY-MM-D HH:mm:ss';
let Bluebird = require('bluebird');

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
    if (uStatus >= 221 && uStatus <= 230){
        return "221-230"
    }
    if (uStatus >= 231 && uStatus <= 240){
        return "231-240"
    }
    if (uStatus >= 241 && uStatus <= 250){
        return "241-250"
    }
    if (uStatus >= 251 && uStatus <= 260){
        return "251-260"
    }
    if (uStatus >= 261 && uStatus <= 270){
        return "261-270"
    }
    if (uStatus >= 271 && uStatus <= 280){
        return "271-280"
    }
    if (uStatus >= 281 && uStatus <= 290){
        return "281-290"
    }
    if (uStatus >= 291 && uStatus <= 300){
        return "291-300"
    }
}

function decideDriverRate(product){
    if (product == "0-50") {
        return 0.25
    }
    if (product == "51-60") {
        return 0.25
    }
    if (product == "61-70") {
        return 0.25
    }
    if (product == "71-80") {
        return 0.27
    }
    if (product == "81-90") {
        return 0.27
    }
    if (product == "91-100") {
        return 0.27
    }
    if (product == "101-110") {
        return 0.27
    }
    if (product == "111-120") {
        return 0.27
    }
    if (product == "121-130") {
        return 0.27
    }
    if (product == "131-140") {
        return 0.27
    }
    if (product == "141-150") {
        return 0.27
    }
    if (product == "151-160") {
        return 0.285
    }
    if (product == "161-170") {
        return 0.285
    }
    if (product == "171-180") {
        return 0.285
    }
    if (product == "181-190") {
        return 0.285
    }
    if (product == "191-200") {
        return 0.285
    }
    if (product == "201-210") {
        return 0.285
    }
    if (product == "211-220") {
        return 0.285
    }
    if (product == "221-230") {
        return 0.285
    }
    if (product == "231-240") {
        return 0.285
    }
    if (product == "241-250") {
        return 0.285
    }
    if (product == "251-260") {
        return 0.285
    }
    if (product == "261-270") {
        return 0.285
    }
    if (product == "271-280") {
        return 0.285
    }
    if (product == "281-290") {
        return 0.285
    }
    if (product == "291-300") {
        return 0.285
    }
}

function decideLoadRate(product){
    if (product == "0-50") {
        return 446.01
    }
    if (product == "51-60") {
        return 453.57
    }
    if (product == "61-70") {
        return 468.70
    }
    if (product == "71-80") {
        return 483.83
    }
    if (product == "81-90") {
        return 502.75
    }
    if (product == "91-100") {
        return 514.09
    }
    if (product == "101-110") {
        return 525.45
    }
    if (product == "111-120") {
        return 559.49
    }
    if (product == "121-130") {
        return 578.40
    }
    if (product == "131-140") {
        return 597.31
    }
    if (product == "141-150") {
        return 623.80
    }
    if (product == "151-160") {
        return 642.71
    }
    if (product == "161-170") {
        return 661.62
    }
    if (product == "171-180") {
        return 680.53
    }
    if (product == "181-190") {
        return 699.45
    }
    if (product == "191-200") {
        return 710.79
    }
    if (product == "201-210") {
        return 741.06
    }
    if (product == "211-220") {
        return 771.32
    }
    if (product == "221-230") {
        return 801.58
    }
    if (product == "231-240") {
        return 831.84
    }
    if (product == "241-250") {
        return 862.10
    }
    if (product == "251-260") {
        return 892.36
    }
    if (product == "261-270") {
        return 922.63
    }
    if (product == "271-280") {
        return 952.89
    }
    if (product == "281-290") {
        return 983.15
    }
    if (product == "291-300") {
        return 1013.41
    }
}

function decideFixedRate(product){
    if (product == "0-50") {
        return 633.75
    }
    if (product == "51-60") {
        return 644.50
    }
    if (product == "61-70") {
        return 666.00
    }
    if (product == "71-80") {
        return 687.50
    }
    if (product == "81-90") {
        return 714.38
    }
    if (product == "91-100") {
        return 730.50
    }
    if (product == "101-110") {
        return 746.63
    }
    if (product == "111-120") {
        return 795.00
    }
    if (product == "121-130") {
        return 821.88
    }
    if (product == "131-140") {
        return 848.75
    }
    if (product == "141-150") {
        return 886.38
    }
    if (product == "151-160") {
        return 913.25
    }
    if (product == "161-170") {
        return 940.13
    }
    if (product == "171-180") {
        return 967.00
    }
    if (product == "181-190") {
        return 993.88
    }
    if (product == "191-200") {
        return 1010.00
    }
    if (product == "201-210") {
        return 1053.00
    }
    if (product == "211-220") {
        return 1096.00
    }
    if (product == "221-230") {
        return 1139.00
    }
    if (product == "231-240") {
        return 1182.00
    }
    if (product == "241-250") {
        return 1225.00
    }
    if (product == "251-260") {
        return 1268.00
    }
    if (product == "261-270") {
        return 1311.00
    }
    if (product == "271-280") {
        return 1354.00
    }
    if (product == "281-290") {
        return 1397.00
    }
    if (product == "291-300") {
        return 1440.00
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

    return MODEL
        .getTicketByTms(ticket)
        .then((returnData) => {

            ticket["Pick Date"] = seekForADate(ticket["Pick Date"]);
            ticket["Drop Date"] = seekForADate(ticket["Drop Date"]);
            //ticket["Status"] = decideStatus(ticket["Status"]);
            ticket["Rate Invoice"] = parseFloat(ticket["Rate Invoice"]); // HB lo proporciona
            ticket["Actual Miles"] = parseInt(ticket["Miles"]) // Guarda las millas como un entero en vez de como un producto, se necesito para un KPI de Goals
            ticket["Miles"] = decideProduct(ticket["Miles"]);
            //ticket["Load Rate"] = parseFloat(ticket["Load Rate"]);
            ticket["Load Rate"] = decideLoadRate(ticket["Miles"]);
            ticket["Driver Rate"] = decideDriverRate(ticket["Miles"]);
            ticket["Fixed Rate"] = decideFixedRate(ticket["Miles"]);
            ticket['born_date'] = decideDate();


            let facility = MODEL
                .getFacility(ticket["Origin"])

            let location = MODEL
                .getLocation(ticket["Destination"])

            return Promise.all([facility, location]).then((data) => {

                if (data[0] == 0){
                    return Bluebird.reject('Facility does not exists') 
                }
                if (data[1] == 0){
                    return Bluebird.reject('Location does not exists') 
                }

                if (returnData.length >= 1) { // El tms esta repetido en la DB
                    return MODEL.update(ticket, returnData[0].id); // Si el ticket existe hay que actualizarlo con lo que venga del CSV
                } else { // Verifica si el facility y la locacion existen en la DB, de no ser asi rechaza la promesa
                    return MODEL.create(ticket);
                }
                
            });
        })  
};

exports.updateTicketInvoiceDate = (ticket) => {
    return MODEL.updateTicketInvoiceDate(ticket)
}

