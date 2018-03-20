let administrativeModel = require('../model/administrative_model');

/*
* Otiene y regresa los clientes
*/
exports.getClients = () => {
    return administrativeModel
        .getClients();
};

exports.deleteClients = (clientId) => {
    return administrativeModel
        .deleteClients(clientId);
};

exports.getClientDetail = (clientId) => {

    let client = administrativeModel
        .getClientsById(clientId);

    let locations = administrativeModel
        .getLocations(clientId);

    let facilities = administrativeModel
        .getFacilities(clientId);

    let products = administrativeModel
        .getProducts(clientId);

    let sands = administrativeModel
        .getSands(clientId);

    // Esperamos a que todas las promesas se cumplan para enviar la promesa final
    var return_data = {};
    return Promise.all([client,locations,facilities,products,sands]).then((data) => {
        
        return_data.client = data[0];
        return_data.locations = data[1];
        return_data.facilities = data[2];
        return_data.products = data[3];
        return_data.sands = data[4];

        return return_data;
    });
};

exports.getLocationGoals = (locationId) => {
    
    let location = administrativeModel
        .getLocationById(locationId)

    let goals = administrativeModel
        .getGoals(locationId)

    var return_data = {};
    return Promise.all([location, goals]).then((data) => {
        
        return_data.location = data[0];
        return_data.goals = data[1];

        return return_data;
    });

}

exports.getHr = () => {
    return administrativeModel
        .getHr();
};

