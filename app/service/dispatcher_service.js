let dispatcherModel = require('../model/dispatcher_model');

// Se agrega moment porque hay que guardar a la hora a la que ocurrio el evento
// TODO: hay que ver en que sona horaria van a estar para hacer una conversion si es necesario (que no se guarden los eventos con la hora que tiene el server)
let moment = require('moment-timezone');

/*
* Regresa drivers, trucks y trailers disponibles y les da fotmato
*/
exports.getThingsUp = () => {
    let trucksUp = dispatcherModel
        .getAssetsUp('TRUCK')
        .then((rows) => {
            if(rows.length === undefined || 
                rows.length === null ||
                typeof rows.length !== 'number' ||
                rows.length < 1){ // if no rows selected regresamos un 0 (no trucks up)
                return 0;
            } else {
                return rows[0].trucks_up; // Regresamos solo el numero de trucks up
            }
        });

    let trailersUp = dispatcherModel
        .getAssetsUp('TRAILER')
        .then((rows) => {
            if(rows.length === undefined || 
                rows.length === null ||
                typeof rows.length !== 'number' ||
                rows.length < 1){
                return 0;
            } else {
                return rows[0].trucks_up;
            }
        });

    let driversUp = dispatcherModel
        .getDriversUp()
        .then((rows) => {
            if(rows.length === undefined || 
                rows.length === null ||
                typeof rows.length !== 'number' ||
                rows.length < 1){
                return 0;
            } else {
                return rows[0].drivers_up;
            }
        });

    // Esperamos a que todas las promesas se cumplan para enviar la promesa final
    var return_data = {};
    return Promise.all([driversUp,trucksUp,trailersUp]).then((data) => {
        
        return_data.driversUp = data[0];
        return_data.trucksUp = data[1];
        return_data.trailersUp = data[2];

        return return_data;
    });
};


/*
* Todos los tickets (sive a "work in progress" y a "completed")
*/
exports.getTicketsInfo = () => {
    return dispatcherModel
        .getTicketsList();
};

/*
* Un solo ticket por Id
*/
exports.getTicketDetail = (ticketId) => {
    return dispatcherModel
        .getTicketById(ticketId);
};

exports.getEvents = (ticketId) => {
    return dispatcherModel
        .getEvents(ticketId);
};

/*
* Sirve a "to be asign" solamente
*/
exports.getToBeAsignedInfo = () => {
    let tickets = dispatcherModel
        .getTicketsList();

    let drivers = dispatcherModel
        .listDriversUp();

    let products = dispatcherModel
        .listProducts(1); // El cliente es 1 HALLIBURTON (por el momento el sistema solo tendra un cliente y lo quieren harcodedado)

    var return_data = {};
    return Promise.all([tickets,drivers,products]).then((data) => {
        
        return_data.tickets = data[0];
        return_data.drivers = data[1];
        return_data.products = data[2];

        return return_data;
    });
};

exports.assignTicket = (hrId, ticketId) => {

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

    // Asigna el ticket
    let assign = dispatcherModel
        .assignTicket(hrId, ticketId, timestap);

    // Marca el driver como inactive
    let inactivate = dispatcherModel
        .inactive(hrId)

    return Promise.all([assign,inactivate]).then((data) => {

        return true;
    });
};

exports.cancelTicket = (ticketId) => {
    return dispatcherModel
        .cancelTicket(ticketId);
};

// Uno o muchos tickets a la vez en un arreglo []
exports.completeTicket = (ticketId) => {

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

    return dispatcherModel
        .completeTicket(ticketId, timestap);
};


// ==============================
// Servicio de sockets TODO: hay que ver si los dejamos aqui o se crea un service, model para los sockets solamente
// ==============================

exports.getUsersAndPassword = () => {
    return dispatcherModel
        .getUsersAndPassword()
        .then((data) => {
            var json = {users : []}

            for (var x = 0; x < data.length; x++){
                var user = data[x]
                json.users.push({"id": user.id, "name": user.username, "password": user.password, "type": user.type}) 
            }
            //console.log(json)
            return json
        })
        .catch(function (err) {
            console.error('Error when querying: \n', err);
            return 'Error when querying: \n' + err
        });
};

exports.getAvailableAssets = () => {
    return dispatcherModel
        .getAvailableAssets()
        .then((data) => {
            var json = {trucks : [], trailers: []}

            for (var x = 0; x < data.length; x++){
                var asset = data[x]
                if (asset.type == "TRAILER") {
                    json.trailers.push({"id": asset.id, "name": asset.name, "mi": asset.mi}) 
                } else if (asset.type == "TRUCK") {
                    json.trucks.push({"id": asset.id, "name": asset.name, "mi": asset.mi}) 
                }
            }

            return json
        })
        .catch(function (err) {
            console.error('Error when querying: \n', err);
            return 'Error when querying: \n' + err
        });
};

exports.selectedAsset = (truck, trailer, ticketId, new_mil) => {
    return dispatcherModel
        .selectedAsset(truck, trailer, ticketId, new_mil)
        .then((data) => {
            return true
        })
        .catch(function (err) {
            console.error('Error when insert: \n', err);
            return false
        });
};

exports.active = (hrId) => {
    return dispatcherModel
        .active(hrId);
}

exports.inactive = (hrId) => {
    return dispatcherModel
        .inactive(hrId);
}

exports.tms = (hrId) => {
    return dispatcherModel
        .tms(hrId)
        .then((return_data) => {
            return return_data
        })
        .catch(function (err) {
            console.error('Error when querying: \n', err);
            return 'Error when querying: \n' + err
        });
};

/*
* TODO: AddEvent necesita una refactorizacion, se realizo muy rapido para darle cierre a la primera etapa.
*/
exports.addEvent = (substatus, latitude, longitude, ticketId, base, silo, weight, bol, date, final_mil) => {


    // Esta rutina tiene que correr primero porque el substatus es un numero que vamos a insertar en la columna substatus del ticket
    dispatcherModel
        .updateSubstatus(substatus, ticketId)
        .then((return_data) => {
            return return_data
        })
        .catch(function (err) {
            console.error('Error when querying: \n', err);
            return 'Error when querying: \n' + err
        })

        // Se cambia el substatus de un numero a texto para guardarlo en la tabla de eventos con su nombre correspondiente
    if (substatus == "0") {
        substatus = "TMS ACCEPTED"
    } else if (substatus == "1") {
        substatus = "ON MY WAY TO FACILITY"
    } else if (substatus == "2") {
        substatus = "ARRIVED TO FACILITY"
    } else if (substatus == "3") {
        substatus = "LOADING"
        // Aqui es cuando tengo que guardar peso y bol
        //"weight":100000,"bol":"36"
        dispatcherModel
        .updateWeightAndBol(weight, bol, ticketId)
        .then((return_data) => {
            return return_data
        })
        .catch(function (err) {
            console.error('Error when querying: \n', err);
            return 'Error when querying: \n' + err
        })

    } else if (substatus == "4") {
        substatus = "ON MY WAY TO LOCATION"
    } else if (substatus == "5") {
        substatus = "ARRIVED TO LOCATION"
    } else if (substatus == "6") {
        substatus = "UNLOADING"
        // Aqui me mandan base y silo y se guardan
        //"base":"2","silo":"4""base":"2","silo":"4"
        dispatcherModel
        .updateBaseAndSilo(base, silo, ticketId)
        .then((return_data) => {
            return return_data
        })
        .catch(function (err) {
            console.error('Error when querying: \n', err);
            return 'Error when querying: \n' + err
        })

    } else if (substatus == "7") {
        substatus = "FINISHED"
        // Aqui hay que finalizar el ticket (on_curse = FALSE)
        dispatcherModel
        .finishTicket(ticketId, final_mil)
        .then((return_data) => {
            return return_data
        })
        .catch(function (err) {
            console.error('Error when querying: \n', err);
            return 'Error when querying: \n' + err
        })
    }



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

    // TODO: Hacer un modulo helper, donde almacenemos las funciones para obtener la hora actual y otras cosas 

    // TODO: Ver si nos van a mandar la hora desde la app de drivers o si la vamos a generar nosotros
    // De momento no nos mandan nada asi que vamos a generarla aqui
    timestap = moment(today + " " + horaActual, 'YYYY-MM-DD HH:mm:ss').tz('America/Chihuahua').format('YYYY-MM-DD HH:mm:ss')

    // Aqui es donde se guarda el evento en la tabla de eventos
    return dispatcherModel
        .addEvent(substatus, timestap, latitude, longitude, date, ticketId)
        .then((return_data) => {
            return return_data
        })
        .catch(function (err) {
            console.error('Error when querying: \n', err);
            return 'Error when querying: \n' + err
        });
};

// Contador que despliega el numero de TMSs segun su status
exports.tmscounter = () => {
    return dispatcherModel
        .tmscounter()
}