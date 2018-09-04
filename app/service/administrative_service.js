fs = require('fs'); // para guardar las imagenes en el servidor
let administrativeModel = require('../model/administrative_model');

/*
* Otiene y regresa los clientes
*/
exports.getClients = () => {
    return administrativeModel
        .getClients();
};

/*
* Elimina clientes (Se utiliza desde -> /web/administrative/clients para borrar los clientes con el boton de delete)
*/
exports.deleteClient = (clientId) => {
    return administrativeModel
        .deleteClient(clientId);
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

    let crews = administrativeModel
        .getCrews(clientId);

    // Esperamos a que todas las promesas se cumplan para enviar la promesa final
    var return_data = {};
    return Promise.all([client,locations,facilities,products,sands,crews]).then((data) => {
        
        return_data.client = data[0];
        return_data.locations = data[1];
        return_data.facilities = data[2];
        return_data.products = data[3];
        return_data.sands = data[4];
        return_data.crews = data[5];

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

exports.getDrivers = () => {
    let drivers = administrativeModel
        .getDrivers();

    let onlineOffline = administrativeModel
        .getOnlineOffline();

    var return_data = {};
    return Promise.all([drivers, onlineOffline]).then((data) => {

        return_data.drivers = data[0];
        return_data.onlineOffline = data[1];

        return return_data;
    });
};


exports.addSand = (name, clientId) => {
    return administrativeModel
        .addSand(name, clientId);
};

exports.deleteSand = (sandId) => {
    return administrativeModel
        .deleteSand(sandId);
};

exports.addCrew = (name, clientId) => {
    return administrativeModel
        .addCrew(name, clientId);
};

exports.deleteCrew = (crewId) => {
    return administrativeModel
        .deleteCrew(crewId);
};

exports.addProduct = (name, clientId) => {
    return administrativeModel
        .addProduct(name, clientId);
};

exports.deleteProduct = (productId) => {
    return administrativeModel
        .deleteProduct(productId);
};

exports.addFacilitie = (name, clientId) => {
    return administrativeModel
        .addFacilitie(name, clientId);
};

exports.deleteFacility = (facilityId) => {
    return administrativeModel
        .deleteFacility(facilityId);
};

exports.addLocation = (name, status, geolocation, startDate, endDate, clientId) => {
    return administrativeModel
        .addLocation(name, status, geolocation, startDate, endDate, clientId);
};

exports.deleteLocation = (locationId) => {
    return administrativeModel
        .deleteLocation(locationId);
};

exports.addHr = (name, address, tel, civilStatus, email, contact1, contact2, birth, laborStatus, position, dllsHr, mcExp, ssn, username, password, shift, crew, clients_id) => {
    return administrativeModel
        .addHr(name, address, tel, civilStatus, email, contact1, contact2, birth, laborStatus, position, dllsHr, mcExp, ssn, username, password, shift, crew, clients_id);
}

exports.addDriver = (name, address, tel, civilStatus, email, contact1, contact2, birth, laborStatus, position, rate, mcExp, ssn, type, crew, shift, user, password, license, licenseExp, state, hireDate, licenseClass, experience, paymentMethod, BankAccount, RoutingNumber, clients_id) => {
    return administrativeModel
        .addDriver(name, address, tel, civilStatus, email, contact1, contact2, birth, laborStatus, position, rate, mcExp, ssn, type, crew, shift, user, password, license, licenseExp, state, hireDate, licenseClass, experience, paymentMethod, BankAccount, RoutingNumber, clients_id);
}

exports.getHrDetail = (hrId) => {
    return administrativeModel
        .getHrDetail(hrId);
};

exports.updateHr = (name, value, pk) => {
    return administrativeModel
    .updateHr(name, value, pk);
};

exports.updateTicket = (name, value, pk) => {
    return administrativeModel
    .updateTicket(name, value, pk);
};

exports.getClockin = () => {
    return administrativeModel
        .getClockin();
};


/*
* Se utilizan para el sockets de clockin
*/
exports.getAccountsClockin = () => {
    return administrativeModel
        .getAccountsClockin()
        .then((data) => {
            var json = {accounts : []}

            // id, name, shift, crew, location, position, username, password
            for (var x = 0; x < data.length; x++){
                var user = data[x]
                json.accounts.push({"id": user.id, "name": user.name, "username": user.username, "password": user.password, "crew": user.crew, "location": user.location, "position": user.position, "shift": user.shift}) 
            }
            //console.log(json)
            return json
        })
        .catch(function (err) {
            console.log(err)
        })
}

exports.getSelectedCrew = (crewId) => {
    return administrativeModel
        .getSelectedCrew(crewId)
        .then((data) => {
            var json = {hr : []}

            // id, name, shift
            for (var x = 0; x < data.length; x++){
                var user = data[x]
                json.hr.push({"id": user.id, "name": user.name, "shift": user.shift}) 
            }
            //console.log(json)
            return json
        })
        .catch(function (err) {
            console.log(err)
        })
}

// {"id_evento":"123","supervisor_id":1,"worker_id":3,"in":true,"out":false,"date":"2018-04-25 15:52:11","latitude":0,"longitude":0,"img":""}
exports.saveClockinEvent = (id_evento, entrada, salida, date, lattitud, longitud, img, worker_id) => {

    console.log("entrada: " + entrada)
    console.log("salida: " + salida)
    if (entrada) {
        
        // TODO: ver si se puede hacer este path dinamico
        fs.writeFile('/home/nodejs/sandras/app/assets/clockin/' + id_evento + '_in.jpg', img, 'base64', function (err) {
            if (err) {
                console.log("error when saving clockin image") // TODO: ver si podemos regresar al usuario algun error
            } 
        })

        let name = id_evento + "_in.jpg"

        return administrativeModel.saveClockInEvent(id_evento, date, lattitud, longitud, name, worker_id)
        
    } else if (salida) {

        fs.writeFile('/home/nodejs/sandras/app/assets/clockin/' + id_evento + '_out.jpg', img, 'base64', function (err) {
            if (err) {
                console.log("error when saving clockout image") // TODO: ver si podemos regresar al usuario algun error
            } 
        })

        let name = id_evento + "_out.jpg"

        return administrativeModel.saveClockOutEvent(id_evento, date, lattitud, longitud, name)
    }
}

exports.getClockinById = (id) => {
    return administrativeModel
            .getClockinById(id)
}

exports.updateClockinById = (entrada, salida, id) => {
    return administrativeModel
            .updateClockinById(entrada, salida, id)
}

exports.findLocations = () => {
    return administrativeModel.findLocations();
}

exports.updateScalesData = (scalesData) => {
    return administrativeModel.upsertScalesData(scalesData)
}

exports.fetchScalesData = (locationId) => {
    return administrativeModel.fetchScalesData(locationId)
}

exports.fetchGoalsData = (locationId) => {
    return administrativeModel.fetchGoalsData(locationId)
}

exports.getLocationDetail = (locationId) => {
    return administrativeModel.getLocationDetail(locationId)
}

exports.updateLocation = (name, value, pk) => {
    return administrativeModel
    .updateLocation(name, value, pk);
};

exports.getLocationsByCrewId = (crewId) => {
    return administrativeModel.getLocationsByCrewId(crewId)
}

exports.updateSandName = (name, value, pk) => {
    return administrativeModel
    .updateSandName(name, value, pk);
};

