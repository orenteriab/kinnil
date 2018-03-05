let dispatcherModel = require('../model/dispatcher_model');

/*
* Regresa drivers, trucks y trailers disponibles y les da fotmato
*/
exports.getThingsUp = () => {
    let trucksUp = dispatcherModel
        .getAssetsUp("TRUCK")
        .then((rows) => {
            if(rows.length === undefined || 
                rows.length === null ||
                typeof rows.length !== 'number' ||
                rows.length < 1){ // if no rows selected regresamos un 0 (no trucks up)
                    return 0
                }
            else {
                return rows[0].trucks_up // Regresamos solo el numero de trucks up
            }
        })

    let trailersUp = dispatcherModel
        .getAssetsUp("TRAILER")
        .then((rows) => {
            if(rows.length === undefined || 
                rows.length === null ||
                typeof rows.length !== 'number' ||
                rows.length < 1){
                    return 0
                }
            else {
                return rows[0].trucks_up
            }
        })

    let driversUp = dispatcherModel
        .getDriversUp()
        .then((rows) => {
            if(rows.length === undefined || 
                rows.length === null ||
                typeof rows.length !== 'number' ||
                rows.length < 1){
                    return 0
                }
            else {
                return rows[0].drivers_up
            }
        })

    // Esperamos a que todas las promesas se cumplan para enviar la promesa final
    var return_data = {}
    return Promise.all([driversUp,trucksUp,trailersUp]).then((data) => {
        
        return_data.driversUp = data[0]
        return_data.trucksUp = data[1]
        return_data.trailersUp = data[2]

        return return_data
    })
};

/*
* Regresa los tickets sobre los que se va o se esta trabajando (INICIO)
*/
exports.getTicketsInfo = () => {
    return dispatcherModel
        .getTicketsList()
};

/*
* Regresa El detalle de un solo ticket
*/
exports.getTicketDetail = (ticketId) => {
    return dispatcherModel
        .getTicketById(ticketId)
};

/*
* TO BE ASIGN info
*/
exports.getToBeAsignedInfo = () => {
    let tickets = dispatcherModel
        .getTicketsList()

    let drivers = dispatcherModel
        .listDriversUp()

    let products = dispatcherModel
        .listProducts(1) // El cliente es 1 HALLIBURTON (por el momento el sistema solo tendra un cliente)

    var return_data = {}
    return Promise.all([tickets,drivers,products]).then((data) => {
        
        return_data.tickets = data[0]
        return_data.drivers = data[1]
        return_data.products = data[2]

        return return_data
    })
};
