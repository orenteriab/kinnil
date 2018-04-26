let dispatcherService = require('../service/dispatcher_service');
const SocketEvent = require('./socket_event').SocketEvent;

let administrativeService = require('../service/administrative_service');
const utf8 = require('utf-8');


const onMessage = (socket) => {
    return new SocketEvent('message', (message) => {
        socket.emit('message', 'alive');
        console.log(`A client is speaking to me! They’re saying: ${message}`);
    });
};

const onAccounts = (socket) => {
    return new SocketEvent('accounts', () => {
        dispatcherService
            .getUsersAndPassword()
            .then((returnData) => {
                socket.emit('accounts', JSON.stringify(returnData));
            })
            .catch(function (err) {
                console.error('[/app/socket/Events.js][/accounts/]Error when querying: ', err);
                socket.emit('accounts', 'Error when querying: \n' + err);
            });
    });
};

const onAssets = (socket) => {
    return new SocketEvent('assets', () => {
        dispatcherService
            .getAvailableAssets()
            .then((returnData) => {
                socket.emit('assets', JSON.stringify(returnData));
            })
            .catch(function (err) {
                console.error('[/app/socket/Events.js][/assets/]Error when querying: ', err);
                socket.emit('assets', 'Error when querying: \n' + err);
            });
    });
};

const onSelectedAsset = (socket) => {
    return new SocketEvent('selected-asset', (message) => {
        let jsonPayload = JSON.parse(message);
        console.log(jsonPayload)

        dispatcherService
            .selectedAsset(jsonPayload.truck_id, jsonPayload.trailer_id, jsonPayload.id)
            .then(() => {
                socket.emit('selected-asset', JSON.stringify({ resivido: true }));
            })
            .catch(function (err) {
                console.error('[/app/socket/Events.js][/selected-asset/]Error when querying: ', err);
                socket.emit('selected-asset', JSON.stringify({ resivido: false }));
            });
    });
};

const onActive = (socket) => {
    return new SocketEvent('active', (message) => {
        let jsonPayload = JSON.parse(message);

        dispatcherService
            .active(jsonPayload.id)
            .then(() => {
                // TODO: hay que hacer algo para cuando no se pueda guardar en la DB no mande resivido: true, note que esto pasaba cuando estaba debugeando
                // Ellos esperan que cuando no se guardo el dato en la DB se les mande un resivido: false, la logica de la app de android lo requiere
                socket.emit('active', JSON.stringify({ resivido: true }));
            })
            .catch(function (err) {
                console.error('[/app/socket/Events.js][/active/]Error when querying: ', err);
                socket.emit('active', JSON.stringify({ resivido: false }));
            });
    });
};

const onInactive = (socket) => {
    return new SocketEvent('inactive', (message) => {
        let jsonPayload = JSON.parse(message);

        dispatcherService
            .inactive(jsonPayload.id)
            .then(() => {
                socket.emit('inactive', JSON.stringify({ resivido: true }));
            })
            .catch(function (err) {
                console.error('[/app/socket/Events.js][/inactive/]Error when querying: ', err);
                socket.emit('inactive', JSON.stringify({ resivido: false }));
            });
    });
};

const onTms = (socket) => {
    return new SocketEvent('tms', (hrId) => {
        dispatcherService
            .tms(hrId)
            .then((returnData) => {
                // Validamos si vamos a mandar null esto se hace porque el desarrollador de android no puede hacer la comparación si es null o no y le crashea su app :v
                if (JSON.stringify(returnData[0]) == null){
                    socket.emit('tms', '{}');
                } else {
                    socket.emit('tms', JSON.stringify(returnData[0]));
                }
            })
            .catch(function (err) {
                console.error('[/app/socket/Events.js][/tms/]Error when querying: ', err);
                socket.emit('tms', 'Error when querying: ' + err);
            });
    });
};

const onStatus = (socket) => {
    return new SocketEvent('status', (message) => {
        let jsonPayload = JSON.parse(message);
        dispatcherService //(substatus, latitude, longitude, ticketId, base, silo, weight, bol)
            .addEvent(jsonPayload.substatus, 
                        jsonPayload.latitude, 
                        jsonPayload.longitude, 
                        jsonPayload.id, 
                        jsonPayload.base, 
                        jsonPayload.silo,
                        jsonPayload.weight,
                        jsonPayload.bol)
            .then(() => {
                socket.emit('status', JSON.stringify({ resivido: true }));
            })
            .catch(function (err) {
                console.error('[/app/socket/Events.js][/status/]Error when querying: ', err);
                socket.emit('status', JSON.stringify({ resivido: false }));
            });
    });
};


/*
* CLOCK IN
* Estos ya pertenecen a administravie y se utilizan para el clockin, no los pude hacer funcionar en un modulo de sockets aparte solo me funcionaron aqui :C
*/

const onAccountsClockin = (socket) => {
    return new SocketEvent('accountsclockin', (message) => {
        administrativeService
            .getAccountsClockin()
            .then((returnData) => {
                returnData = utf8.encode(JSON.stringify(returnData));
                socket.emit('accountsclockin', returnData);
            })
            .catch(function (err) {
                console.error('[/app/socket/Events.js][/accounts-clockin/]Error when querying: ', err);
                socket.emit('accounts-clockin', 'Error when querying: \n' + err);
            });
    });
};

const onSelectedCrew = (socket) => {
    return new SocketEvent('selectedcrew', (message) => {
        let jsonPayload = JSON.parse(message);
        administrativeService
            .getSelectedCrew(jsonPayload)
            .then((returnData) => {
                returnData = utf8.encode(JSON.stringify(returnData));
                socket.emit('selectedcrew', returnData);
            })
            .catch(function (err) {
                console.error('[/app/socket/Events.js][/selected-crew/]Error when querying: ', err);
                socket.emit('selected-crew', 'Error when querying: \n' + err);
            });
    });
};

// {"id_evento":"123","supervisor_id":1,"worker_id":3,"in":true,"out":false,"date":"2018-04-25 15:52:11","latitude":0,"longitude":0,"img":""}
const onClockinEvent = (socket) => {
    return new SocketEvent('clockinevent', (message) => {
        let jsonPayload = JSON.parse(message);
        console.log(jsonPayload)
        administrativeService
            .saveClockinEvent(jsonPayload.id_evento, jsonPayload.in, jsonPayload.out, jsonPayload.date, jsonPayload.latitude, jsonPayload.longitude, jsonPayload.img, jsonPayload.worker_id)
            .then((returnData) => {
                console.log(returnData)
                socket.emit('clockinevent', '{"resivido": true}');
            })
            .catch(function (err) {
                console.error('[/app/socket/Events.js][/clockin-event/]Error when querying: ', err);
                socket.emit('clockin-event', 'Error when querying: \n' + err);
            });
    });
};

exports.onConnection = new SocketEvent('connection', (socket) => {

    const socketEvents = [
        onMessage(socket),
        onAccounts(socket),
        onAssets(socket),
        onSelectedAsset(socket),
        onActive(socket),
        onInactive(socket),
        onTms(socket),
        onStatus(socket),
        onAccountsClockin(socket),
        onSelectedCrew(socket),
        onClockinEvent(socket)
    ];

    socketEvents.forEach((evt) => {
        socket.on(evt.name, evt.handler);
    });

});