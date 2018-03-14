let administrativeModel = require('../model/administrative_model');

/*
* Otiene y regresa los clientes
*/
exports.getClients = () => {
    return administrativeModel
        .getClients();
};

