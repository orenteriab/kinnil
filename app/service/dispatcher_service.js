let dispatcherModel = require('../model/dispatcher_model');

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

exports.assignTicket = (hrId, product, ticketId) => {
    return dispatcherModel
        .assignTicket(hrId, product, ticketId);
};

exports.cancelTicket = (ticketId) => {
    return dispatcherModel
        .cancelTicket(ticketId);
};

// Uno o muchos tickets a la vez en un arreglo []
exports.completeTicket = (ticketId) => {
    return dispatcherModel
        .completeTicket(ticketId);
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
            console.log(json)
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

exports.selectedAsset = (truck, trailer, ticketId) => {
    return dispatcherModel
        .selectedAsset(truck, trailer, ticketId)
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

exports.addEvent = (data) => {

    return dispatcherModel
        .addEvent(data)
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